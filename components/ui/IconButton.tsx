import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';

import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

import type { IconName } from '@/constants/icons';

import { Icon } from './Icon';

type IconButtonVariant = 'dark' | 'filled' | 'ghost' | 'light' | 'primary';

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  dark: 'bg-grey-800',
  filled: 'bg-grey-100',
  ghost: '',
  light: 'bg-white',
  primary: 'bg-clarity-blue',
};

const ICON_COLORS: Record<IconButtonVariant, string> = {
  dark: COLORS.white,
  filled: COLORS.black,
  ghost: COLORS.black,
  light: COLORS.black,
  primary: COLORS.white,
};

interface IconButtonProps {
  accessibilityLabel: string;
  className?: string;
  disabled?: boolean;
  hapticStyle?: 'Heavy' | 'Light' | 'Medium';
  icon: IconName;
  iconSize?: number;
  onPress?: () => void;
  testID?: string;
  variant?: IconButtonVariant;
}

export const IconButton = ({
  accessibilityLabel,
  className,
  disabled,
  hapticStyle = 'Light',
  icon,
  iconSize,
  onPress,
  testID,
  variant = 'filled',
}: IconButtonProps) => {
  const handlePress = () => {
    if (hapticStyle) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle[hapticStyle]);
    }
    onPress?.();
  };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      testID={testID}
      className={cn(
        'items-center justify-center',
        VARIANT_CLASSES[variant],
        className
      )}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => ({
        borderCurve: 'continuous',
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
    >
      <Icon color={ICON_COLORS[variant]} name={icon} size={iconSize ?? 24} />
    </Pressable>
  );
};
