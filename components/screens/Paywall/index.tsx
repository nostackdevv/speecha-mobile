import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

type PlanId = 'annual' | 'monthly';

const FEATURES = [
  'Unlimited recordings per day',
  '3 min max per recording',
  'Unlimited friends',
  'Cloud sync',
] as const;

const PLAN_OPTIONS: {
  id: PlanId;
  name: string;
  price: string;
  showBestValue?: boolean;
}[] = [
  {
    id: 'annual',
    name: 'ANNUAL PLAN',
    price: '$28.99 / year',
    showBestValue: true,
  },
  {
    id: 'monthly',
    name: 'MONTHLY PLAN',
    price: '$12.65 / month',
  },
];

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
      <View className="w-40 gap-0.5">
        <Text className="font-sf-rounded text-body-xs text-grey-500">
          {name}
        </Text>
        <Text className="font-sf-rounded-semibold text-h4 text-black">
          {price}
        </Text>
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

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('annual');

  const handleUpgrade = () => {
    router.push('/pro-welcome');
  };

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
                  price={plan.price}
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
            fullWidth
            onPress={handleUpgrade}
            testID="paywall.upgrade-btn"
            title="Upgrade to Pro"
          />
        </View>
      </View>
    </View>
  );
};
