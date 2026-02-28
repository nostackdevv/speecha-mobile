import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/cn';

interface ProgressBarProps {
  className?: string;
  color?: string;
  progress: number;
}

export const ProgressBar = ({
  className,
  color = COLORS.clarityBlue.DEFAULT,
  progress,
}: ProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, { duration: 400 });
  }, [clampedProgress, animatedProgress]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: animatedProgress.value }],
  }));

  return (
    <View
      className={cn('h-2 overflow-hidden rounded-24 bg-grey-200', className)}
    >
      <Animated.View
        className="h-full w-full rounded-lg"
        style={[barStyle, { backgroundColor: color, transformOrigin: 'left' }]}
      />
    </View>
  );
};
