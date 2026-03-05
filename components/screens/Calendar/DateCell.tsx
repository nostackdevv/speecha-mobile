import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

interface DateCellProps {
  day: number | null;
  practiced: boolean;
}

export const DateCell = ({ day, practiced }: DateCellProps) => {
  if (day === null) {
    return <View className="flex-1 items-center" />;
  }

  return (
    <View className={cn('flex-1 items-center gap-1')}>
      <View
        className={cn(
          'size-9 items-center justify-center rounded-full',
          practiced ? 'bg-clarity-blue' : 'bg-grey-100'
        )}
      >
        {practiced ? (
          <Icon color={COLORS.white} name="check" size={16} />
        ) : null}
      </View>
      <Text
        className={cn(
          'text-center font-sf-rounded-medium text-body-sm',
          practiced ? 'text-black' : 'text-grey-600'
        )}
      >
        {day}
      </Text>
    </View>
  );
};
