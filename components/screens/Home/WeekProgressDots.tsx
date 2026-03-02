import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

interface WeekProgressDotsProps {
  completedDays: boolean[];
}

export const WeekProgressDots = ({ completedDays }: WeekProgressDotsProps) => (
  <View accessibilityRole="list" className="w-full flex-row justify-between">
    {DAYS.map((day, index) => {
      const completed = completedDays[index] ?? false;
      return (
        <View
          accessibilityLabel={`${day} ${completed ? 'completed' : 'not completed'}`}
          className="items-center gap-2"
          key={day}
        >
          <Text
            className={cn(
              'font-sf-rounded-medium text-body-sm',
              completed ? 'text-black' : 'text-grey-600'
            )}
          >
            {day}
          </Text>
          <View
            className={cn(
              'h-9 w-9 items-center justify-center rounded-full',
              completed ? 'bg-clarity-blue' : 'bg-grey-300'
            )}
          >
            {completed ? (
              <Icon color={COLORS.white} name="check" size={16} />
            ) : null}
          </View>
        </View>
      );
    })}
  </View>
);
