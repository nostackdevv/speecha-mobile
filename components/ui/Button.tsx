import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

import type { IconName } from '@/constants/icons';

import { Icon } from './Icon';

interface ButtonProps {
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  haptic?: boolean;
  icon?: IconName;
  loading?: boolean;
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  className,
  disabled,
  fullWidth,
  haptic = true,
  icon,
  onPress,
  title,
  variant = 'primary',
}: ButtonProps) => {
  const isPrimary = variant === 'primary';

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      className={cn(
        'h-14 flex-row items-center justify-center rounded-32 px-7',
        isPrimary ? 'bg-clarity-blue' : 'bg-grey-100',
        fullWidth ? 'w-full' : 'self-start',
        className
      )}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => ({
        borderCurve: 'continuous',
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      <View className="flex-row items-center gap-2">
        {icon && (
          <Icon
            color={isPrimary ? COLORS.white : COLORS.grey[700]}
            name={icon}
            size={20}
          />
        )}
        <Text
          className={cn(
            'font-sf-rounded-semibold text-body-xl',
            isPrimary ? 'text-white' : 'text-grey-700'
          )}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};
