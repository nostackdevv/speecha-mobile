import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LIMITS, Tier } from '@/constants/limits';

type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped';

type PermissionStatus = 'undetermined' | 'granted' | 'denied';

type UseRecordingParams = {
  tier?: Tier;
};

export const useRecording = ({
  tier = 'anonymous',
}: UseRecordingParams = {}) => {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('undetermined');
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder, 100);
  const autoStopTriggeredRef = useRef(false);

  const durationSeconds = Math.floor(
    (recorderState.durationMillis ?? 0) / 1000
  );

  const checkPermission = useCallback(async () => {
    try {
      const result = await AudioModule.getRecordingPermissionsAsync();
      setPermissionStatus(
        result.granted
          ? 'granted'
          : result.canAskAgain
            ? 'undetermined'
            : 'denied'
      );
      return result.granted;
    } catch {
      setError('Failed to check microphone permission');
      return false;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const result = await AudioModule.requestRecordingPermissionsAsync();
      const granted = result.granted;
      setPermissionStatus(granted ? 'granted' : 'denied');
      return granted;
    } catch {
      setError('Failed to request microphone permission');
      setPermissionStatus('denied');
      return false;
    }
  }, []);

  const start = useCallback(async () => {
    if (status === 'recording' || status === 'paused') return false;

    setError(null);
    autoStopTriggeredRef.current = false;

    if (permissionStatus !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        setError('Microphone permission is required to record');
        return false;
      }
    }

    try {
      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setStatus('recording');
      return true;
    } catch {
      setError('Failed to start recording');
      return false;
    }
  }, [audioRecorder, permissionStatus, requestPermission, status]);

  const pause = useCallback(() => {
    if (status !== 'recording') return;
    try {
      audioRecorder.pause();
      setStatus('paused');
    } catch {
      setError('Failed to pause recording');
    }
  }, [audioRecorder, status]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    try {
      audioRecorder.record();
      setStatus('recording');
    } catch {
      setError('Failed to resume recording');
    }
  }, [audioRecorder, status]);

  const stop = useCallback(async () => {
    if (status !== 'recording' && status !== 'paused') return null;
    try {
      await audioRecorder.stop();
      setStatus('stopped');
      return audioRecorder.uri;
    } catch {
      setError('Failed to stop recording');
      return null;
    }
  }, [audioRecorder, status]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    autoStopTriggeredRef.current = false;
  }, []);

  // Auto-stop at max duration
  useEffect(() => {
    if (
      status === 'recording' &&
      durationSeconds >= LIMITS.MAX_RECORDING_DURATION_SECONDS[tier] &&
      !autoStopTriggeredRef.current
    ) {
      autoStopTriggeredRef.current = true;
      queueMicrotask(() => {
        stop();
      });
    }
  }, [durationSeconds, status, stop, tier]);

  // Check permission on mount (queueMicrotask defers setState to avoid cascading renders)
  useEffect(() => {
    queueMicrotask(checkPermission);
  }, [checkPermission]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRecorder.isRecording) {
        audioRecorder.stop();
      }
    };
  }, [audioRecorder]);

  return {
    durationSeconds,
    error,
    isRecording: status === 'recording',
    maxDuration: LIMITS.MAX_RECORDING_DURATION_SECONDS[tier],
    pause,
    permissionStatus,
    requestPermission,
    reset,
    resume,
    start,
    status,
    stop,
    uri: audioRecorder.uri,
  };
};
