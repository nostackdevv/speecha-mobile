export type NormalizedWord = {
  index: number;
  displayText: string;
  startChar: number;
  endChar: number;
  confidence: number;
};

export type Filler = {
  startIndex: number;
  displayText: string;
  confidence: number;
};

export type FillerStats = {
  totalFillers: number;
  totalWords: number;
  fillerPercentage: number;
  fillersPerMinute: number;
  topFillers: { text: string; count: number }[];
};

export type ClarityResult = {
  score: number;
  version: string;
  rawScore: number;
};

// POST /api/transcribe response
export type TranscriptionResult = {
  transcript: string;
  words: NormalizedWord[];
  duration: number;
  createdAt: string;
};

// POST /api/analyze request body
export type AnalyzeRequest = {
  transcript: string;
  words: { index: number; text: string }[];
  duration: number;
};

// POST /api/analyze response
export type AnalysisResult = {
  fillers: Filler[];
  fillerStats: FillerStats;
  clarityScore: ClarityResult | null;
  createdAt: string;
};

// Combined result from useAnalyzeRecording hook
export type RecordingAnalysis = {
  transcript: string;
  words: NormalizedWord[];
  duration: number;
  fillers: Filler[];
  fillerStats: FillerStats;
  clarityScore: ClarityResult | null;
};

export type ApiError = {
  error: string;
  message?: string;
  retryAfter?: number;
};
