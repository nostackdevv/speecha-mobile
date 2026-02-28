import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

const VARIANTS = {
  accent: { bg: 'bg-clarity-blue-0', text: 'text-clarity-blue' },
  default: { bg: 'bg-grey-200', text: 'text-grey-600' },
  success: { bg: 'bg-success-50', text: 'text-success-600' },
} as const;

interface ChipProps {
  className?: string;
  label: string;
  variant?: 'accent' | 'default' | 'success';
}

export const Chip = ({ className, label, variant = 'default' }: ChipProps) => {
  const { bg, text } = VARIANTS[variant];

  return (
    <View className={cn('self-start rounded-32 px-3 py-1', bg, className)}>
      <Text className={cn('font-sf-rounded-medium text-body-xs', text)}>
        {label}
      </Text>
    </View>
  );
};
