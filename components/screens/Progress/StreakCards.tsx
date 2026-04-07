import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';
import { useProfile } from '@/hooks/useProfile';

export const StreakCards = () => {
  const { data: profile } = useProfile();
  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;

  return (
    <View className="flex-row gap-3">
      <View
        className="h-[128px] flex-1 justify-between overflow-hidden rounded-2xl bg-clarity-blue p-4"
        style={{ borderCurve: 'continuous' }}
      >
        <View className="flex-row items-center gap-2">
          <Icon color={COLORS.grey[100]} name="fire" size={20} />
          <Text className="font-sf-rounded-medium text-base text-grey-100">
            Current streak
          </Text>
        </View>
        <View className="flex-row items-end">
          <Text
            className="font-sf-rounded-bold text-grey-100"
            style={{ fontSize: 40, lineHeight: 48 }}
          >
            {currentStreak}
          </Text>
          <Text className="mb-1 ml-1 font-sf-rounded-medium text-base text-grey-100">
            days
          </Text>
        </View>
        <View
          className="absolute inset-0 rounded-2xl"
          pointerEvents="none"
          style={{
            borderColor: 'rgba(255,255,255,0.44)',
            borderCurve: 'continuous',
            borderRadius: 16,
            borderWidth: 1,
          }}
        />
      </View>

      <View
        className="h-[128px] flex-1 justify-between overflow-hidden rounded-2xl bg-grey-50 p-4"
        style={{ borderCurve: 'continuous' }}
      >
        <View className="flex-row items-center gap-2">
          <Icon color={COLORS.momentumOrange.DEFAULT} name="fire" size={20} />
          <Text className="font-sf-rounded-medium text-base text-momentum-orange">
            Longest streak
          </Text>
        </View>
        <View className="flex-row items-end">
          <Text
            className="font-sf-rounded-bold text-black"
            style={{ fontSize: 40, lineHeight: 48 }}
          >
            {longestStreak}
          </Text>
          <Text className="mb-1 ml-1 font-sf-rounded-medium text-base text-black">
            days
          </Text>
        </View>
      </View>
    </View>
  );
};
