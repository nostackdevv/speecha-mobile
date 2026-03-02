import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

import { WeekProgressDots } from './WeekProgressDots';

interface StreakCardProps {
  completedDays: boolean[];
  streak: number;
}

export const StreakCard = ({ completedDays, streak }: StreakCardProps) => {
  const isActive = streak > 0;
  const accentColor = isActive ? COLORS.clarityBlue.DEFAULT : COLORS.grey[400];

  return (
    <Card className="items-center gap-8 rounded-24">
      <View
        accessibilityLabel={`${streak} day streak${isActive ? '' : ', lost'}`}
        accessibilityRole="text"
        className="items-center gap-2"
      >
        <View className="flex-row items-center gap-2">
          <Icon color={accentColor} name="fire" size={44} />
          <Text
            className={cn(
              'font-sf-rounded-heavy text-[50px]',
              isActive ? 'text-clarity-blue' : 'text-grey-400'
            )}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {streak}
          </Text>
        </View>
        <Text className="font-sf-rounded-medium text-h4 text-black">
          day streak
        </Text>
      </View>

      <View className="w-full items-center gap-4">
        <WeekProgressDots completedDays={completedDays} />
        <Text className="font-sf-rounded-medium text-body-sm text-grey-500">
          {isActive
            ? 'Keep it up, you are on the right track!'
            : 'You lost your streak. Ready to build it again?'}
        </Text>
      </View>
    </Card>
  );
};
