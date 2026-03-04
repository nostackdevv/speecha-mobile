import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

interface StatCardProps {
  className?: string;
  label: string;
  testID?: string;
  value: string;
}

export const StatCard = ({
  className,
  label,
  testID,
  value,
}: StatCardProps) => (
  <View
    testID={testID}
    className={cn(
      'h-[120px] items-center justify-center rounded-20 bg-grey-100',
      className
    )}
    style={{ borderCurve: 'continuous' }}
  >
    <Text
      className="font-sf-rounded-bold text-h4 text-black"
      style={{ fontVariant: ['tabular-nums'] }}
    >
      {value}
    </Text>
    <Text className="mt-1 font-sf-rounded-medium text-body-xs uppercase text-grey-500">
      {label}
    </Text>
  </View>
);
