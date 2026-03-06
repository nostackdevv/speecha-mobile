import type { Filler, NormalizedWord, RecordingAnalysis } from '@/types/api';
import type { SpeechAnalysis } from '@/types/database';

type StoredTranscriptData = {
  fillers: Filler[];
  words: NormalizedWord[];
} | null;

export const transformAnalysis = (row: SpeechAnalysis): RecordingAnalysis => {
  const data = row.transcript_data as StoredTranscriptData;
  const words = data?.words ?? [];
  const fillers = data?.fillers ?? [];

  const fillerCounts = new Map<string, number>();
  fillers.forEach((f) => {
    const text = f.displayText.toLowerCase();
    fillerCounts.set(text, (fillerCounts.get(text) ?? 0) + 1);
  });

  const topFillers = Array.from(fillerCounts.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count);

  const totalWords = words.length;
  const totalFillers = row.filler_count;
  const fillerPercentage =
    totalWords > 0 ? (totalFillers / totalWords) * 100 : 0;

  return {
    transcript: words.map((w) => w.displayText).join(' '),
    words,
    duration: row.duration_seconds,
    fillers,
    fillerStats: {
      totalFillers,
      totalWords,
      fillerPercentage,
      fillersPerMinute: row.fillers_per_minute,
      topFillers,
    },
    clarityScore: {
      score: row.clarity_score,
      version: '1',
      rawScore: row.clarity_score,
    },
  };
};
