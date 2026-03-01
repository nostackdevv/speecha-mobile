import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

import type { IconName } from '@/constants/icons';

import { Icon } from '../ui/Icon';

const VARIANTS = {
  blue: {
    bg: 'bg-clarity-blue',
    circleBg: COLORS.clarityBlue[300],
    iconColor: COLORS.white,
  },
  orange: {
    bg: 'bg-momentum-orange',
    circleBg: COLORS.momentumOrange[300],
    iconColor: COLORS.white,
  },
} as const;

interface RecordingModeCardProps {
  color: 'blue' | 'orange';
  icon: IconName;
  onPress: () => void;
  title: string;
}

export const RecordingModeCard = ({
  color,
  icon,
  onPress,
  title,
}: RecordingModeCardProps) => {
  const variant = VARIANTS[color];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      className={cn('flex-1 rounded-2xl px-5 py-5', variant.bg)}
      onPress={handlePress}
      style={({ pressed }) => ({
        borderCurve: 'continuous',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View className="items-center gap-4">
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: variant.circleBg }}
        >
          <Icon color={variant.iconColor} name={icon} size={24} />
        </View>
        <Text className="text-center font-sf-rounded-semibold text-body-lg text-white">
          {title}
        </Text>
      </View>
    </Pressable>
  );
};
