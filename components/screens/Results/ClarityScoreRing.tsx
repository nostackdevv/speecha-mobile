import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { COLORS } from '@/constants/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 180;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getScoreColor = (score: number): string => {
  if (score >= 60) return COLORS.clarityBlue.DEFAULT;
  if (score >= 30) return COLORS.error[500];
  return COLORS.grey[300];
};

interface ClarityScoreRingProps {
  score: number;
}

export const ClarityScoreRing = ({ score }: ClarityScoreRingProps) => {
  const progress = useSharedValue(0);
  const color = getScoreColor(score);

  useEffect(() => {
    progress.value = withTiming(score / 100, { duration: 800 });
  }, [score, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <View className="items-center">
      <View
        className="items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
      >
        <Svg height={SIZE} width={SIZE} style={{ position: 'absolute' }}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            fill="none"
            r={RADIUS}
            stroke={COLORS.grey[200]}
            strokeWidth={STROKE_WIDTH}
          />
          <AnimatedCircle
            animatedProps={animatedProps}
            cx={SIZE / 2}
            cy={SIZE / 2}
            fill="none"
            r={RADIUS}
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
            stroke={color}
            strokeDasharray={CIRCUMFERENCE}
            strokeLinecap="round"
            strokeWidth={STROKE_WIDTH}
          />
        </Svg>
        <View className="items-center">
          <Text className="font-sf-rounded-bold text-h2 text-black">
            {score}%
          </Text>
          <Text className="font-sf-rounded-medium text-body-xs uppercase text-grey-500">
            Clarity Score
          </Text>
        </View>
      </View>
    </View>
  );
};
