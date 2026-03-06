import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import {
  analyzeTranscript,
  toTranscriptWords,
  transcribeAudio,
} from '@/lib/api';
import { audioRecordingStorage } from '@/lib/audioRecordingStorage';
import type { RecordingAnalysis } from '@/types/api';

import { useAuth } from './useAuth';
import { useCreateSpeechAnalysis } from './useSpeechAnalyses';

export type AnalysisStatus = 'idle' | 'transcribing' | 'analyzing' | 'saving';

type AnalyzeInput = {
  promptId?: string;
  uri: string;
};

type AnalyzeResult = {
  analysis: RecordingAnalysis;
  analysisId: string;
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
  const { user } = useAuth();
  const createAnalysis = useCreateSpeechAnalysis();
  const [status, setStatus] = useState<AnalysisStatus>('idle');

  const mutation = useMutation({
    mutationFn: async ({
      uri,
      promptId,
    }: AnalyzeInput): Promise<AnalyzeResult> => {
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

      let analysisId = '';

      if (user?.id) {
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
        analysisId = saved.id;

        try {
          audioRecordingStorage.save(analysisId, uri);
        } catch {
          // console.error('Failed to persist audio file:', error);
        }
      }

      return { analysis: result, analysisId };
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
