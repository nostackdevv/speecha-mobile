import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

import type { IconName } from '@/constants/icons';

import { Icon } from './Icon';

interface ButtonProps {
  accessibilityLabel?: string;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  haptic?: boolean;
  icon?: IconName;
  onPress: () => void;
  testID?: string;
  title: string;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export const Button = ({
  accessibilityLabel,
  className,
  disabled,
  fullWidth,
  haptic = true,
  icon,
  onPress,
  testID,
  title,
  variant = 'primary',
}: ButtonProps) => {
  const isDestructive = variant === 'destructive';
  const isSecondary = variant === 'secondary';

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(
        isDestructive
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light
      );
    }
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      testID={testID}
      className={cn(
        'h-14 flex-row items-center justify-center rounded-32 px-7',
        isSecondary && 'bg-grey-100',
        isDestructive && 'bg-error-500',
        !isSecondary && !isDestructive && 'bg-clarity-blue',
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
            color={isSecondary ? COLORS.grey[700] : COLORS.white}
            name={icon}
            size={20}
          />
        )}
        <Text
          className={cn(
            'font-sf-rounded-semibold text-body-xl',
            isSecondary ? 'text-grey-700' : 'text-white'
          )}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};
