import type {
  AnalysisResult,
  AnalyzeRequest,
  ApiError,
  NormalizedWord,
  TranscriptionResult,
} from '@/types/api';
import type { TranscriptWord } from '@/types/database';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('Missing EXPO_PUBLIC_API_URL environment variable');
}

export class ApiRequestError extends Error {
  status: number;
  retryAfter?: number;

  constructor(status: number, apiError: ApiError) {
    super(apiError.message ?? apiError.error);
    this.name = 'ApiRequestError';
    this.status = status;
    this.retryAfter = apiError.retryAfter;
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const body: ApiError = await response.json().catch(() => ({
      error: `Request failed with status ${response.status}`,
    }));
    throw new ApiRequestError(response.status, body);
  }
  return response.json();
};

export const transcribeAudio = async (
  uri: string
): Promise<TranscriptionResult> => {
  const formData = new FormData();

  // React Native FormData accepts { uri, type, name } objects for file uploads
  formData.append('file', {
    uri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as unknown as Blob);

  const response = await fetch(`${API_URL}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<TranscriptionResult>(response);
};

export const analyzeTranscript = async (
  request: AnalyzeRequest
): Promise<AnalysisResult> => {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  return handleResponse<AnalysisResult>(response);
};

export const toTranscriptWords = (words: NormalizedWord[]): TranscriptWord[] =>
  words.map(({ displayText, index }) => ({ index, text: displayText }));
