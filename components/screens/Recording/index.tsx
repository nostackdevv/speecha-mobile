import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui/IconButton';
import { MIN_RECORDING_DURATION_SECONDS } from '@/constants/limits';
import { useRecording } from '@/hooks/useRecording';
import { useTier } from '@/hooks/useTier';

import { AnalyzingView } from './AnalyzingView';
import { ErrorView } from './ErrorView';
import { PermissionDeniedSheet } from './PermissionDeniedSheet';
import { PromptDisplay } from './PromptDisplay';
import { RecordingControls } from './RecordingControls';
import { Timer } from './Timer';
import { TooShortSheet } from './TooShortSheet';
import { useAnalyzeMockRecording } from '@/hooks/useAnalyzeMockRecording';

export type RecordingState =
  | 'analyzing'
  | 'error'
  | 'idle'
  | 'paused'
  | 'recording'
  | 'stopped';

export const Recording = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { prompt = 'Say something random' } = useLocalSearchParams<{
    prompt?: string;
  }>();

  const { tier } = useTier();
  const recording = useRecording({ tier });
  const analysis = useAnalyzeMockRecording({
    // shouldError: 'analyzing',
    // errorMessage: 'Failed to analyze speech',
  });

  const [showTooShortSheet, setShowTooShortSheet] = useState(false);
  const [showPermissionSheet, setShowPermissionSheet] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleStartRecording = async () => {
    if (recording.permissionStatus === 'denied') {
      setShowPermissionSheet(true);
      return;
    }
    const started = await recording.start();
    if (!started) {
      setShowPermissionSheet(true);
    }
  };

  const isTooShort = recording.durationSeconds < MIN_RECORDING_DURATION_SECONDS;
  const isActive =
    recording.status === 'recording' || recording.status === 'paused';

  const submitRecording = async (uri: string) => {
    await analysis.analyzeAsync(uri);
    router.replace('/results');
  };

  const handleSubmitRecording = async () => {
    if (isActive && isTooShort) {
      if (recording.status === 'recording') recording.pause();
      setShowTooShortSheet(true);
      return;
    }

    try {
      // Edge case: recording may already be stopped (auto-stop at max duration)
      const uri = isActive ? await recording.stop() : recording.uri;
      if (uri) await submitRecording(uri);
    } catch {
      // Error handled reactively via analysis.error
    }
  };

  const handleResume = () => {
    setShowTooShortSheet(false);
    recording.resume();
  };

  const handleTryAgain = () => {
    analysis.reset();
    recording.reset();
  };

  const handleDismissPermission = () => {
    setShowPermissionSheet(false);
  };

  if (analysis.isPending) {
    return (
      <AnalyzingView status={analysis.status} testID="recording.analyzing" />
    );
  }

  if (analysis.error) {
    return <ErrorView onTryAgain={handleTryAgain} testID="recording.error" />;
  }

  return (
    <View
      className="flex-1 bg-clarity-blue-0 px-6"
      style={{ paddingTop: insets.top }}
      testID="recording.screen"
    >
      <View className="flex-row justify-end py-4">
        <IconButton
          accessibilityLabel="Close"
          className="size-12 rounded-32 border border-white/50 bg-white/20"
          icon="close"
          onPress={handleClose}
          testID="recording.close"
          variant="ghost"
        />
      </View>

      <View
        className="flex-1 justify-between"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="pt-4">
          <PromptDisplay testID="recording.prompt" text={prompt} />
        </View>

        <View className="items-center">
          <Timer seconds={recording.durationSeconds} testID="recording.timer" />
        </View>

        <RecordingControls
          onPause={recording.pause}
          onResume={recording.resume}
          onStart={handleStartRecording}
          onSubmit={handleSubmitRecording}
          state={recording.status}
          testID="recording.controls"
        />
      </View>

      <TooShortSheet
        onResume={handleResume}
        testID="recording.too-short-sheet"
        visible={showTooShortSheet}
      />
      <PermissionDeniedSheet
        onDismiss={handleDismissPermission}
        testID="recording.permission-sheet"
        visible={showPermissionSheet}
      />
    </View>
  );
};
