import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { File } from 'expo-file-system';

import {
  analyzeTranscript,
  toTranscriptWords,
  transcribeAudio,
} from '@/lib/api';
import { audioRecordingStorage } from '@/lib/audioRecordingStorage';
import { pendingRecordingQueue } from '@/lib/pendingRecordingQueue';
import { isRetryableSyncError } from '@/lib/retryableErrors';
import type { RecordingAnalysis } from '@/types/api';

import { useAuth } from './useAuth';
import { useCreateSpeechAnalysis } from './useSpeechAnalyses';

const EMPTY_RESULT: RecordingAnalysis = {
  transcript: '',
  words: [],
  duration: 0,
  fillers: [],
  fillerStats: {
    totalFillers: 0,
    totalWords: 0,
    fillerPercentage: 0,
    fillersPerMinute: 0,
    topFillers: [],
  },
  clarityScore: null,
};

export const usePendingRecordingSync = () => {
  const { user } = useAuth();
  const createAnalysis = useCreateSpeechAnalysis();

  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const isSyncingRef = useRef(false);

  const refreshPendingCount = useCallback(async () => {
    const count = await pendingRecordingQueue.count();
    setPendingCount(count);
    return count;
  }, []);

  const syncPending = useCallback(async () => {
    if (!user?.id || isSyncingRef.current) {
      return { remaining: pendingCount, synced: 0 };
    }

    isSyncingRef.current = true;
    setIsSyncing(true);

    let synced = 0;

    try {
      const prunedCount = await pendingRecordingQueue.pruneMissingFiles();
      if (prunedCount > 0) {
        await refreshPendingCount();
      }

      const queue = await pendingRecordingQueue.list();

      for (const item of queue) {
        const localAudioFile = new File(item.audioUri);

        if (!localAudioFile.exists) {
          await pendingRecordingQueue.remove(item.id);
          continue;
        }

        try {
          const transcription = await transcribeAudio(item.audioUri);

          let result: RecordingAnalysis;

          if (!transcription.transcript) {
            result = { ...EMPTY_RESULT, duration: transcription.duration };
          } else {
            const analysis = await analyzeTranscript({
              transcript: transcription.transcript,
              words: toTranscriptWords(transcription.words),
              duration: transcription.duration,
            });

            result = {
              transcript: transcription.transcript,
              words: transcription.words,
              duration: transcription.duration,
              fillers: analysis.fillers,
              fillerStats: analysis.fillerStats,
              clarityScore: analysis.clarityScore,
            };
          }

          const saved = await createAnalysis.mutateAsync({
            clarity_score: Math.round(result.clarityScore?.score ?? 0),
            duration_seconds: Math.max(1, Math.round(result.duration)),
            filler_count: result.fillerStats.totalFillers,
            fillers_per_minute: Math.max(
              0,
              result.fillerStats.fillersPerMinute
            ),
            prompt_id: item.promptId,
            transcript_data: {
              fillers: result.fillers,
              words: result.words,
            },
          });

          try {
            audioRecordingStorage.save(saved.id, item.audioUri);
          } catch {
            // silent fail for local audio promotion
          }

          await pendingRecordingQueue.remove(item.id);
          synced += 1;
        } catch (error) {
          if (isRetryableSyncError(error)) {
            break;
          }
        }
      }

      const remaining = await refreshPendingCount();
      return { remaining, synced };
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [createAnalysis, pendingCount, refreshPendingCount, user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setPendingCount(0);
      return;
    }
    void refreshPendingCount();
    void syncPending();
  }, [refreshPendingCount, syncPending, user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextState) => {
        if (nextState === 'active') {
          void syncPending();
        }
      }
    );

    const timer = setInterval(() => {
      void syncPending();
    }, 60000);

    return () => {
      appStateSubscription.remove();
      clearInterval(timer);
    };
  }, [syncPending, user?.id]);

  return {
    isSyncing,
    pendingCount,
    refreshPendingCount,
    syncPending,
  };
};
