import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { COLORS } from '@/constants/colors';

import type { AnalysisStatus } from '@/hooks/useAnalyzeRecording';

const PHASE_MESSAGES: Record<AnalysisStatus, string> = {
  analyzing: 'Analyzing filler words...',
  idle: 'Speecha is analyzing your recording...',
  saving: 'Saving your results...',
  transcribing: 'Transcribing your speech...',
};

interface AnalyzingViewProps {
  status?: AnalysisStatus;
}

export const AnalyzingView = ({ status = 'idle' }: AnalyzingViewProps) => {
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="items-center gap-4">
        <Animated.View
          className="size-[120px] items-center justify-center"
          style={spinStyle}
        >
          <Icon color={COLORS.clarityBlue.DEFAULT} name="loader" size={90} />
        </Animated.View>

        <Text className="w-[214px] text-center font-sf-rounded-medium text-body-xl text-grey-700">
          {PHASE_MESSAGES[status]}
        </Text>
      </View>
    </View>
  );
};
