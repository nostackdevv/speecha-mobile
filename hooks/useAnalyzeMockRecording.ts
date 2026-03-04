import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { MOCK_ANALYSIS_RESULT } from '@/constants/mockData';
import type { RecordingAnalysis } from '@/types/api';

import type { AnalysisStatus } from './useAnalyzeRecording';

export type MockErrorStage = 'transcribing' | 'analyzing' | 'saving';

export type MockAnalysisOptions = {
  delayMs?: number;
  errorMessage?: string;
  shouldError?: boolean | MockErrorStage;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAnalyzeMockRecording = (options: MockAnalysisOptions = {}) => {
  const { delayMs = 1500, errorMessage = 'Mock error', shouldError } = options;
  const [status, setStatus] = useState<AnalysisStatus>('idle');

  const mutation = useMutation({
    mutationFn: async (_uri: string): Promise<RecordingAnalysis> => {
      const errorAtStage =
        shouldError === true ? 'transcribing' : shouldError || null;

      setStatus('transcribing');
      await delay(delayMs);
      if (errorAtStage === 'transcribing') {
        throw new Error(errorMessage);
      }

      setStatus('analyzing');
      await delay(delayMs);
      if (errorAtStage === 'analyzing') {
        throw new Error(errorMessage);
      }

      setStatus('saving');
      await delay(delayMs * 0.67);
      if (errorAtStage === 'saving') {
        throw new Error(errorMessage);
      }

      return MOCK_ANALYSIS_RESULT;
    },
    onSettled: () => {
      setStatus('idle');
    },
  });

  const analyze = useCallback(
    (uri: string) => mutation.mutate(uri),
    [mutation]
  );

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
