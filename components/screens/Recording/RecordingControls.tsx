import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import { IconButton } from '@/components/ui/IconButton';

import type { RecordingState } from './index';
import type { IconName } from '@/constants/icons';

type ControlState = Exclude<RecordingState, 'analyzing' | 'error'>;
type ActiveState = Exclude<ControlState, 'stopped'>;

const STATE_CONFIG: Record<ActiveState, { icon: IconName; label: string }> = {
  idle: { icon: 'mic', label: 'Start recording' },
  paused: { icon: 'play', label: 'Resume' },
  recording: { icon: 'pause', label: 'Pause recording' },
};

interface RecordingControlsProps {
  onPause: () => void;
  onResume: () => void;
  onStart: () => void;
  onSubmit: () => void;
  state: ControlState;
  testID?: string;
}

export const RecordingControls = ({
  onPause,
  onResume,
  onStart,
  onSubmit,
  state,
  testID,
}: RecordingControlsProps) => {
  const isIdle = state === 'idle';
  const isStopped = state === 'stopped';

  const getAction = (): (() => void) | undefined => {
    if (isStopped) return undefined;
    const actions: Record<ActiveState, () => void> = {
      idle: onStart,
      paused: onResume,
      recording: onPause,
    };
    return actions[state];
  };

  const getConfig = () => {
    if (isStopped) return null;
    return STATE_CONFIG[state];
  };

  const config = getConfig();
  const action = getAction();

  return (
    <Animated.View
      className="self-center overflow-hidden rounded-40"
      layout={LinearTransition.springify().damping(20).stiffness(200)}
    >
      <BlurView
        intensity={12}
        style={{ borderRadius: 40, overflow: 'hidden' }}
        tint="light"
      >
        <View
          className="flex-row gap-2 border border-white/50 bg-white/20 p-2"
          style={{
            borderCurve: 'continuous',
            borderRadius: 40,
          }}
        >
          {!isStopped && config && action && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
            >
              <IconButton
                accessibilityLabel={config.label}
                className="h-16 w-32 rounded-32"
                hapticStyle="Medium"
                icon={config.icon}
                iconSize={isIdle ? 40 : 22.5}
                onPress={action}
                testID={testID ? `${testID}.${state}-btn` : undefined}
                variant="primary"
              />
            </Animated.View>
          )}
          {!isIdle && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
            >
              <IconButton
                accessibilityLabel="Submit recording"
                className="h-16 w-32 rounded-32"
                hapticStyle="Medium"
                icon="checkmark"
                iconSize={22.5}
                onPress={onSubmit}
                testID={testID ? `${testID}.submit-btn` : undefined}
                variant="light"
              />
            </Animated.View>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
};
