/// <reference path="./edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const jsonResponse = (payload: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...(init?.headers ?? {}),
    },
  });

// RevenueCat Webhook V2 Payload
type RevenueCatWebhookV2Payload = {
  api_version: string;
  event: {
    id: string;
    type: string;
    project_id: string;
    customer_id: string;
    idempotency_key?: string;
    environment?: 'production' | 'sandbox';
    event_timestamp_ms: number;
    // ... event-specific data is ignored in favor of canonical fetch
  };
};

// RevenueCat REST API V2 Customer Response
type RevenueCatCustomerV2Response = {
  customer: {
    id: string;
    project_id: string;
    entitlements: Array<{
      id: string;
      lookup_key: string;
      display_name: string;
      is_active: boolean;
      expires_at: string | null;
      starts_at: string | null;
      purchase_at: string | null;
      product_identifier: string;
      environment: 'production' | 'sandbox';
    }>;
  };
};

const PROJECT_ID = 'proj610eafd8';
const PRO_ENTITLEMENT_KEY = 'pro';

const isProActive = (
  customer: RevenueCatCustomerV2Response['customer']
): boolean => {
  return customer.entitlements.some(
    (e) => e.lookup_key === PRO_ENTITLEMENT_KEY && e.is_active
  );
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
  }

  const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
  if (!webhookSecret) {
    console.error('Missing REVENUECAT_WEBHOOK_SECRET');
    return jsonResponse(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const authorization = req.headers.get('Authorization');
  if (!authorization || authorization !== `Bearer ${webhookSecret}`) {
    return jsonResponse({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: any; // Use any to detect v1 vs v2
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Handle both V1 and V2 webhook formats during migration
  const isV2 = payload.api_version?.startsWith('2');
  const appUserId = isV2 ? payload.event?.customer_id : payload.event?.app_user_id;
  const eventType = payload.event?.type;

  if (!appUserId) {
    return jsonResponse(
      { error: 'Missing customer_id/app_user_id in event' },
      { status: 400 }
    );
  }

  // Skip anonymous IDs
  if (appUserId.startsWith('$RCAnonymousID:')) {
    return jsonResponse({ processed: false, reason: 'anonymous_user' });
  }

  console.log(
    `[revenuecat-webhook] ${isV2 ? 'V2' : 'V1'} Event: ${eventType} for user: ${appUserId}`
  );

  // Source-of-truth pattern: fetch current customer state from RevenueCat V2 API
  const rcApiKey = Deno.env.get('REVENUECAT_API_KEY');
  if (!rcApiKey) {
    console.error('Missing REVENUECAT_API_KEY');
    return jsonResponse(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  let isPro = false;
  try {
    // V2 endpoint requires the Project ID
    const rcResponse = await fetch(
      `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${encodeURIComponent(appUserId)}`,
      {
        headers: {
          Authorization: `Bearer ${rcApiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!rcResponse.ok) {
      console.error(
        `[revenuecat-webhook] RC V2 API error: ${rcResponse.status} ${rcResponse.statusText}`
      );
      
      // Fallback: If V2 endpoint fails (e.g. migration sync issues), try the event data
      // For V2 events, entitlements are in event.data.customer_info... but to keep it simple,
      // we'll assume the webhook trigger was enough to try a canonical fetch.
      // If the fetch fails, we'll return more info or exit.
      throw new Error(`RC API V2 fetch failed with status ${rcResponse.status}`);
    } else {
      const responseData: RevenueCatCustomerV2Response = await rcResponse.json();
      isPro = isProActive(responseData.customer);
    }
  } catch (error) {
    console.error(
      '[revenuecat-webhook] Error fetching from RC V2 API:',
      error
    );
    // Silent fail if we can't confirm state — don't update DB to avoid incorrect downgrades
    return jsonResponse(
      { error: 'Failed to synchronize reality from RevenueCat' },
      { status: 500 }
    );
  }

  const pricingPlan = isPro ? 'pro' : 'free';

  // Update profile in Supabase using admin client
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase environment variables');
    return jsonResponse(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { error: updateError } = await adminClient
    .from('profiles')
    .update({ pricing_plan: pricingPlan })
    .eq('id', appUserId);

  if (updateError) {
    console.error(
      `[revenuecat-webhook] Failed to update profile for ${appUserId}:`,
      updateError
    );
    return jsonResponse(
      { error: 'Failed to update profile', details: updateError.message },
      { status: 500 }
    );
  }

  console.log(
    `[revenuecat-webhook] Updated user ${appUserId} to pricing_plan=${pricingPlan}`
  );

  return jsonResponse({
    processed: true,
    userId: appUserId,
    pricingPlan,
    eventType,
    rcApi: 'v2',
  });
});
