export interface RequestBody {
  audio: string;
  mimeType: string;
}

export interface Word {
  word: string;
  start: number;
  end: number;
}

export interface Filler {
  displayText: string;
  startIndex: number;
  confidence: number;
}

export interface TranscriptionResult {
  transcript: string;
  words: Word[];
  duration: number;
}

export interface AnalysisResponse {
  transcript: string;
  words: Word[];
  duration: number;
  fillers: Filler[];
  error?: string;
}
