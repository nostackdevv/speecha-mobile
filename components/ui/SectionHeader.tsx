import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  className?: string;
  onTrailingPress?: () => void;
  title: string;
  trailing?: string;
  trailingIsAction?: boolean;
}

export const SectionHeader = ({
  className,
  onTrailingPress,
  title,
  trailing,
  trailingIsAction,
}: SectionHeaderProps) => (
  <View className={cn('flex-row items-center justify-between', className)}>
    <Text className="font-sf-rounded-semibold text-body-xl text-black">
      {title}
    </Text>
    {trailing ? (
      trailingIsAction && onTrailingPress ? (
        <Pressable
          onPress={onTrailingPress}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text className="font-sf-rounded-medium text-body-sm text-clarity-blue">
            {trailing}
          </Text>
        </Pressable>
      ) : (
        <Text className="font-sf-rounded-medium text-body-sm text-grey-400">
          {trailing}
        </Text>
      )
    ) : null}
  </View>
);
