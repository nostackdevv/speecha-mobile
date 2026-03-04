import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import {
  analyzeTranscript,
  toTranscriptWords,
  transcribeAudio,
} from '@/lib/api';
import type { RecordingAnalysis } from '@/types/api';

// import { useAuth } from './useAuth';
// import { useCreateSpeechAnalysis } from './useSpeechAnalyses';

export type AnalysisStatus = 'idle' | 'transcribing' | 'analyzing' | 'saving';

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
  // const { user } = useAuth();
  // const createAnalysis = useCreateSpeechAnalysis();
  const [status, setStatus] = useState<AnalysisStatus>('idle');

  const mutation = useMutation({
    mutationFn: async (uri: string): Promise<RecordingAnalysis> => {
      setStatus('transcribing');
      const transcription = await transcribeAudio(uri);

      if (!transcription.transcript) {
        return { ...EMPTY_RESULT, duration: transcription.duration };
      }

      setStatus('analyzing');
      const analysis = await analyzeTranscript({
        transcript: transcription.transcript,
        words: toTranscriptWords(transcription.words),
        duration: transcription.duration,
      });

      const result: RecordingAnalysis = {
        transcript: transcription.transcript,
        words: transcription.words,
        duration: transcription.duration,
        fillers: analysis.fillers,
        fillerStats: analysis.fillerStats,
        clarityScore: analysis.clarityScore,
      };

      // if (user?.id) {
      //   setStatus('saving');
      //   await createAnalysis.mutateAsync({
      //     clarity_score: result.clarityScore?.score ?? 0,
      //     duration_seconds: result.duration,
      //     filler_count: result.fillerStats.totalFillers,
      //     fillers_per_minute: result.fillerStats.fillersPerMinute,
      //     transcript_data: {
      //       fillers: result.fillers,
      //       words: toTranscriptWords(result.words),
      //     },
      //   });
      // }

      return result;
    },
    onSettled: () => {
      setStatus('idle');
    },
  });

  // Fire-and-forget: read results reactively via data/error/isPending
  const analyze = useCallback(
    (uri: string) => mutation.mutate(uri),
    [mutation]
  );

  // Awaitable: use when you need the result before proceeding (e.g. navigating to results screen)
  const analyzeAsync = useCallback(
    (uri: string) => mutation.mutateAsync(uri),
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
