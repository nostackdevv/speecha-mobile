import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

import { Icon } from './Icon';

const RANK_COLORS = {
  bronze: '#CD7F32',
  gold: '#FFD700',
  silver: '#C0C0C0',
} as const;

interface BadgeProps {
  className?: string;
  label: string;
  rank: 'bronze' | 'gold' | 'silver';
}

export const Badge = ({ className, label, rank }: BadgeProps) => (
  <View className={cn('items-center gap-2', className)}>
    <View className="h-14 w-14 items-center justify-center">
      <Icon color={RANK_COLORS[rank]} name="medal" size={56} />
    </View>
    <Text className="text-center font-sf-rounded-medium text-body-xs text-grey-500">
      {label}
    </Text>
  </View>
);
