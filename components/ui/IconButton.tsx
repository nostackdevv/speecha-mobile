import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';

import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

import type { IconName } from '@/constants/icons';

import { Icon } from './Icon';

const VARIANT_CLASSES = {
  dark: 'bg-grey-800',
  filled: 'bg-grey-100',
  ghost: '',
} as const;

const ICON_SIZE_RATIO = 0.42;

const ICON_COLORS = {
  dark: COLORS.white,
  filled: COLORS.black,
  ghost: COLORS.black,
} as const;

interface IconButtonProps {
  className?: string;
  disabled?: boolean;
  haptic?: boolean;
  icon: IconName;
  onPress?: () => void;
  size?: number;
  variant?: 'dark' | 'filled' | 'ghost';
}

export const IconButton = ({
  className,
  disabled,
  haptic = true,
  icon,
  onPress,
  size = 48,
  variant = 'filled',
}: IconButtonProps) => {
  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <Pressable
      className={cn(
        'items-center justify-center rounded-full',
        VARIANT_CLASSES[variant],
        className
      )}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => ({
        height: size,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        width: size,
      })}
    >
      <Icon
        color={ICON_COLORS[variant]}
        name={icon}
        size={Math.round(size * ICON_SIZE_RATIO)}
      />
    </Pressable>
  );
};
