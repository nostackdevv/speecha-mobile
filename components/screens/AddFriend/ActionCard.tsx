import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { COLORS } from '@/constants/colors';

import type { IconName } from '@/constants/icons';

interface ActionCardProps {
  className?: string;
  icon: IconName;
  label: string;
  onPress: () => void;
  testID: string;
}

export const ActionCard = ({
  className,
  icon,
  label,
  onPress,
  testID,
}: ActionCardProps) => (
  <Pressable
    accessibilityLabel={label}
    accessibilityRole="button"
    className={cn(
      'flex-1 items-center justify-center gap-3 rounded-20 bg-grey-100 px-6 py-4',
      className
    )}
    onPress={onPress}
    style={({ pressed }) => ({
      borderCurve: 'continuous',
      opacity: pressed ? 0.7 : 1,
    })}
    testID={testID}
  >
    {/* TODO: We have a lot of icons with wrappers for the rounded background, we should probably 
    just add a prop to the Icon component to render it with a rounded background 
    instead of having to wrap it in a View every time */}
    <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-grey-200">
      <Icon color={COLORS.grey[500]} name={icon} size={24} />
    </View>
    <Text className="text-center font-sf-rounded-medium text-body-lg text-black">
      {label}
    </Text>
  </Pressable>
);
