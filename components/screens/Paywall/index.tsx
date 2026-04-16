import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { type PurchasesPackage } from 'react-native-purchases';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { COLORS } from '@/constants/colors';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  fetchOfferings,
  hasProEntitlement,
  purchasePackage,
} from '@/lib/revenueCat';
import { cn } from '@/lib/cn';

type PlanId = 'annual' | 'monthly';

const FEATURES = [
  'Unlimited recordings per day',
  '3 min max per recording',
  'Unlimited friends',
  'Cloud sync',
] as const;

const FALLBACK_PRICES: Record<PlanId, string> = {
  annual: '$59.99 / year',
  monthly: '$7.99 / month',
};

const FeatureItem = ({ text }: { text: string }) => (
  <View className="flex-row items-end gap-2">
    <Icon color={COLORS.black} name="check" size={24} />
    <Text className="font-sf-rounded text-body-lg text-black">{text}</Text>
  </View>
);

const PlanCard = ({
  name,
  price,
  selected,
  showBestValue,
  onPress,
  testID,
}: {
  name: string;
  onPress: () => void;
  price: string;
  selected: boolean;
  showBestValue?: boolean;
  testID: string;
}) => (
  <Pressable
    accessibilityLabel={`Select ${name}`}
    accessibilityRole="button"
    className={cn(
      'relative justify-center rounded-20 border-2 p-4',
      selected
        ? 'border-momentum-orange bg-momentum-orange-0'
        : 'border-grey-200 bg-white'
    )}
    onPress={onPress}
    style={({ pressed }) => ({
      borderCurve: 'continuous',
      height: 96,
      opacity: pressed ? 0.8 : 1,
    })}
    testID={testID}
  >
    {showBestValue ? (
      <View
        className="absolute right-4 top-[-12px] h-6 flex-row items-center rounded-full border border-momentum-orange bg-error-0 px-4"
        style={{ borderCurve: 'continuous' }}
      >
        <Text className="font-sf-rounded-medium text-body-md text-momentum-orange">
          Best value
        </Text>
      </View>
    ) : null}

    <View className="flex-row items-center justify-between">
      <View className="flex-1 gap-0.5">
        <Text className="font-sf-rounded text-body-xs text-grey-500">
          {name}
        </Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="font-sf-rounded-semibold text-h4 text-black">
            {price.split(' / ')[0]}
          </Text>
          <Text className="font-sf-rounded text-body-xs text-grey-500">
            / {price.split(' / ')[1]}
          </Text>
        </View>
      </View>

      <View
        className={cn(
          'size-6 items-center justify-center rounded-full border',
          selected
            ? 'border-momentum-orange bg-momentum-orange'
            : 'border-grey-100 bg-white'
        )}
        style={{ borderCurve: 'continuous' }}
      >
        {selected ? <View className="size-3 rounded-full bg-white" /> : null}
      </View>
    </View>
  </Pressable>
);

export const Paywall = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isPro } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('annual');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [packages, setPackages] = useState<{
    annual: PurchasesPackage | null;
    monthly: PurchasesPackage | null;
  }>({ annual: null, monthly: null });

  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await fetchOfferings();
        const current = offerings.current;
        if (!current) return;

        setPackages({
          annual: current.annual ?? null,
          monthly: current.monthly ?? null,
        });
      } catch {
        // Use fallback prices if offerings fail to load
      }
    };
    void loadOfferings();
  }, []);

  const getPrice = (planId: PlanId): string => {
    const pkg = packages[planId];
    if (pkg) {
      return planId === 'annual'
        ? `${pkg.product.priceString} / year`
        : `${pkg.product.priceString} / month`;
    }
    return FALLBACK_PRICES[planId];
  };

  const PLAN_OPTIONS: {
    id: PlanId;
    name: string;
    showBestValue?: boolean;
  }[] = [
    {
      id: 'annual',
      name: 'ANNUAL PLAN',
      showBestValue: true,
    },
    {
      id: 'monthly',
      name: 'MONTHLY PLAN',
    },
  ];

  const handleUpgrade = async () => {
    const pkg = packages[selectedPlan];
    if (!pkg) {
      Alert.alert(
        'Unavailable',
        'Subscription packages are not available right now. Please try again later.'
      );
      return;
    }

    setIsPurchasing(true);
    try {
      const customerInfo = await purchasePackage(pkg);
      if (hasProEntitlement(customerInfo)) {
        router.push('/pro-welcome');
      }
    } catch (error: unknown) {
      const purchaseError = error as { userCancelled?: boolean };
      if (!purchaseError.userCancelled) {
        Alert.alert(
          'Purchase Failed',
          'Something went wrong with your purchase. Please try again.'
        );
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isPro) {
    return (
      <View className="flex-1 bg-clarity-blue" testID="paywall.screen">
        <View
          className="mt-[62px] flex-1 items-center justify-center overflow-hidden rounded-40 bg-white"
          style={{ borderCurve: 'continuous' }}
        >
          <View className="items-center gap-4 px-6">
            <Icon color={COLORS.clarityBlue.DEFAULT} name="crown" size={48} />
            <Text className="text-center font-sf-rounded-semibold text-h3 text-black">
              You&apos;re on Speecha Pro
            </Text>
            <Text className="text-center font-sf-rounded text-body-lg text-grey-500">
              You already have access to all Pro features.
            </Text>
            <Button
              fullWidth
              onPress={() =>
                Linking.openURL('https://apps.apple.com/account/subscriptions')
              }
              testID="paywall.manage-btn"
              title="Manage Subscription"
            />
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              testID="paywall.back-btn"
            >
              <Text className="font-sf-rounded-medium text-body-lg text-grey-500">
                Go back
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-clarity-blue" testID="paywall.screen">
      <View
        className="mt-[62px] flex-1 overflow-hidden rounded-40 bg-white"
        style={{ borderCurve: 'continuous' }}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-[51px]"
          contentContainerStyle={{ paddingBottom: 132 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-5">
            <IconButton
              accessibilityLabel="Close paywall"
              className="size-10 rounded-32"
              icon="close"
              onPress={() => router.back()}
              testID="paywall.close-btn"
              variant="filled"
            />

            <View className="gap-2">
              <Text className="w-[350px] font-sf-rounded-semibold text-h3 text-black">
                Unlock your Full Potential with Speecha Pro
              </Text>
              <Text className="w-[326px] font-sf-rounded text-body-lg text-grey-500">
                Join 100+ speakers mastering their voice with speecha pro
              </Text>
            </View>

            <View className="mt-8 gap-4">
              {FEATURES.map((feature) => (
                <FeatureItem key={feature} text={feature} />
              ))}
            </View>

            <View className="mt-2 gap-4">
              {PLAN_OPTIONS.map((plan) => (
                <PlanCard
                  key={plan.id}
                  name={plan.name}
                  onPress={() => setSelectedPlan(plan.id)}
                  price={getPrice(plan.id)}
                  selected={selectedPlan === plan.id}
                  showBestValue={plan.showBestValue}
                  testID={`paywall.plan-${plan.id}`}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          className="px-6"
          style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}
        >
          <Button
            disabled={isPurchasing}
            fullWidth
            onPress={() => void handleUpgrade()}
            testID="paywall.upgrade-btn"
            title={isPurchasing ? 'Processing...' : 'Upgrade to Pro'}
          />
        </View>
      </View>
    </View>
  );
};
