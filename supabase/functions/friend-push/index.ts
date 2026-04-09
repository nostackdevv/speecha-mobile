/// <reference path="./edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

type FriendResponseStatus = 'accepted' | 'rejected';

type FriendPushRequest =
  | { event: 'friend_request_sent'; friendshipId: string }
  | {
      event: 'friend_request_responded';
      friendshipId: string;
      status: FriendResponseStatus;
    };

type FriendshipRow = {
  id: string;
  receiver_id: string;
  sender_id: string;
  status: string;
};

type ProfileSummary = {
  full_name: string | null;
  notifications_enabled: boolean;
  push_token: string | null;
  username: string;
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

const parseRequestBody = (value: unknown): FriendPushRequest | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const request = value as {
    event?: unknown;
    friendshipId?: unknown;
    status?: unknown;
  };

  if (typeof request.friendshipId !== 'string') {
    return null;
  }

  if (request.event === 'friend_request_sent') {
    return {
      event: 'friend_request_sent',
      friendshipId: request.friendshipId,
    };
  }

  if (
    request.event === 'friend_request_responded' &&
    (request.status === 'accepted' || request.status === 'rejected')
  ) {
    return {
      event: 'friend_request_responded',
      friendshipId: request.friendshipId,
      status: request.status,
    };
  }

  return null;
};

const isExpoPushToken = (value: string) =>
  value.startsWith('ExponentPushToken[') || value.startsWith('ExpoPushToken[');

const buildNotificationMessage = (
  actorName: string,
  body: FriendPushRequest
) => {
  if (body.event === 'friend_request_sent') {
    return {
      title: 'New friend request',
      body: `${actorName} sent you a friend request.`,
    };
  }

  if (body.status === 'accepted') {
    return {
      title: 'Friend request accepted',
      body: `${actorName} accepted your friend request.`,
    };
  }

  return {
    title: 'Friend request declined',
    body: `${actorName} declined your friend request.`,
  };
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
  }

  const authorization = req.headers.get('Authorization');
  if (!authorization) {
    return jsonResponse(
      { error: 'Missing authorization header' },
      { status: 401 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const body = parseRequestBody(rawBody);
  if (!body) {
    return jsonResponse(
      { error: 'Invalid notification payload' },
      { status: 400 }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return jsonResponse(
      { error: 'Missing Supabase environment variables' },
      { status: 500 }
    );
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: friendship, error: friendshipError } = await adminClient
    .from('friendships')
    .select('id, sender_id, receiver_id, status')
    .eq('id', body.friendshipId)
    .single<FriendshipRow>();

  if (friendshipError || !friendship) {
    return jsonResponse({ error: 'Friendship not found' }, { status: 404 });
  }

  let targetProfileId: string;

  if (body.event === 'friend_request_sent') {
    if (friendship.sender_id !== user.id || friendship.status !== 'pending') {
      return jsonResponse(
        { error: 'Forbidden notification context' },
        { status: 403 }
      );
    }

    targetProfileId = friendship.receiver_id;
  } else {
    if (
      friendship.receiver_id !== user.id ||
      friendship.status !== body.status
    ) {
      return jsonResponse(
        { error: 'Forbidden notification context' },
        { status: 403 }
      );
    }

    targetProfileId = friendship.sender_id;
  }

  const [
    { data: actorProfile, error: actorProfileError },
    { data: targetProfile, error: targetProfileError },
  ] = await Promise.all([
    adminClient
      .from('profiles')
      .select('username, full_name')
      .eq('id', user.id)
      .single<{ full_name: string | null; username: string }>(),
    adminClient
      .from('profiles')
      .select('push_token, notifications_enabled, username, full_name')
      .eq('id', targetProfileId)
      .single<ProfileSummary>(),
  ]);

  if (actorProfileError || !actorProfile) {
    return jsonResponse({ error: 'Actor profile not found' }, { status: 404 });
  }

  if (targetProfileError || !targetProfile) {
    return jsonResponse({ error: 'Target profile not found' }, { status: 404 });
  }

  if (!targetProfile.notifications_enabled || !targetProfile.push_token) {
    return jsonResponse({
      sent: false,
      reason: 'notifications_disabled_or_missing_token',
    });
  }

  if (!isExpoPushToken(targetProfile.push_token)) {
    return jsonResponse({ sent: false, reason: 'invalid_push_token' });
  }

  const actorName = actorProfile.full_name ?? actorProfile.username;
  const message = buildNotificationMessage(actorName, body);

  const expoResponse = await fetch(EXPO_PUSH_API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: targetProfile.push_token,
      title: message.title,
      body: message.body,
      sound: 'default',
      data: {
        event: body.event,
        friendshipId: body.friendshipId,
      },
    }),
  });

  const expoResult = await expoResponse.json().catch(() => null);

  if (!expoResponse.ok) {
    return jsonResponse(
      { error: 'Push delivery request failed', details: expoResult },
      { status: 502 }
    );
  }

  const expoStatus =
    expoResult &&
    typeof expoResult === 'object' &&
    'data' in expoResult &&
    expoResult.data &&
    typeof expoResult.data === 'object' &&
    !Array.isArray(expoResult.data) &&
    'status' in expoResult.data
      ? (expoResult.data as { status?: string }).status
      : undefined;

  if (expoStatus === 'error') {
    return jsonResponse(
      { error: 'Expo push rejected the message', details: expoResult },
      { status: 502 }
    );
  }

  return jsonResponse({ sent: true });
});
