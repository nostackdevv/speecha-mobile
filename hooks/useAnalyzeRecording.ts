import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import {
  analyzeTranscript,
  toTranscriptWords,
  transcribeAudio,
} from '@/lib/api';
import { audioRecordingStorage } from '@/lib/audioRecordingStorage';
import {
  pendingRecordingQueue,
  QueuedForSyncError,
} from '@/lib/pendingRecordingQueue';
import { isRetryableSyncError } from '@/lib/retryableErrors';
import type { RecordingAnalysis } from '@/types/api';

import { useCreateSpeechAnalysis } from './useSpeechAnalyses';

export type AnalysisStatus = 'idle' | 'transcribing' | 'analyzing' | 'saving';

type AnalyzeInput = {
  promptId?: string;
  uri: string;
};

type AnalyzeResult = {
  analysis: RecordingAnalysis;
  analysisId: string;
  localAudioUri: string;
};

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

export const useAnalyzeRecording = () => {
  const createAnalysis = useCreateSpeechAnalysis();
  const [status, setStatus] = useState<AnalysisStatus>('idle');

  const mutation = useMutation({
    mutationFn: async ({
      uri,
      promptId,
    }: AnalyzeInput): Promise<AnalyzeResult> => {
      try {
        setStatus('transcribing');
        const transcription = await transcribeAudio(uri);

        let result: RecordingAnalysis;

        if (!transcription.transcript) {
          result = { ...EMPTY_RESULT, duration: transcription.duration };
        } else {
          setStatus('analyzing');
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

        setStatus('saving');
        const saved = await createAnalysis.mutateAsync({
          clarity_score: Math.round(result.clarityScore?.score ?? 0),
          duration_seconds: Math.max(1, Math.round(result.duration)),
          filler_count: result.fillerStats.totalFillers,
          fillers_per_minute: Math.max(0, result.fillerStats.fillersPerMinute),
          prompt_id: promptId ?? null,
          transcript_data: {
            fillers: result.fillers,
            words: result.words,
          },
        });

        let localAudioUri = uri;

        try {
          localAudioUri = audioRecordingStorage.save(saved.id, uri);
        } catch {
          // Keep original URI as fallback for immediate replay.
          localAudioUri = uri;
        }

        return { analysis: result, analysisId: saved.id, localAudioUri };
      } catch (error) {
        if (!isRetryableSyncError(error)) {
          throw error;
        }

        const queued = await pendingRecordingQueue.enqueue({
          promptId,
          tempUri: uri,
        });
        throw new QueuedForSyncError(queued.id);
      }
    },
    onSettled: () => {
      setStatus('idle');
    },
  });

  const analyze = useCallback(
    (input: AnalyzeInput) => mutation.mutate(input),
    [mutation]
  );

  const analyzeAsync = useCallback(
    (input: AnalyzeInput) => mutation.mutateAsync(input),
    [mutation]
  );

  return {
    analyze,
    analyzeAsync,
    data: mutation.data,
    error: mutation.error,
    isPending: mutation.isPending,
    reset: mutation.reset,
    status,
  };
};
