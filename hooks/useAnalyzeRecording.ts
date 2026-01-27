import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { analyzeTranscript, transcribeAudio } from "@/lib/api";
import type { RecordingAnalysis } from "@/types/api";

export type AnalysisStatus = "idle" | "transcribing" | "analyzing";

const EMPTY_RESULT: RecordingAnalysis = {
  transcript: "",
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
  const [status, setStatus] = useState<AnalysisStatus>("idle");

  const mutation = useMutation({
    mutationFn: async (uri: string): Promise<RecordingAnalysis> => {
      setStatus("transcribing");
      const transcription = await transcribeAudio(uri);

      if (!transcription.transcript) {
        return { ...EMPTY_RESULT, duration: transcription.duration };
      }

      setStatus("analyzing");
      const analysis = await analyzeTranscript({
        transcript: transcription.transcript,
        words: transcription.words.map(({ displayText, index }) => ({
          index,
          text: displayText,
        })),
        duration: transcription.duration,
      });

      return {
        transcript: transcription.transcript,
        words: transcription.words,
        duration: transcription.duration,
        fillers: analysis.fillers,
        fillerStats: analysis.fillerStats,
        clarityScore: analysis.clarityScore,
      };
    },
    onSettled: () => {
      setStatus("idle");
    },
  });

  // Fire-and-forget: read results reactively via data/error/isPending
  const analyze = useCallback(
    (uri: string) => mutation.mutate(uri),
    [mutation],
  );

  // Awaitable: use when you need the result before proceeding (e.g. navigating to results screen)
  const analyzeAsync = useCallback(
    (uri: string) => mutation.mutateAsync(uri),
    [mutation],
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
