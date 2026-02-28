import { ApiRequestError, toTranscriptWords } from '@/lib/api';
import type { NormalizedWord } from '@/types/api';

describe('toTranscriptWords', () => {
  it('maps NormalizedWord[] to TranscriptWord[]', () => {
    const input: NormalizedWord[] = [
      {
        index: 0,
        displayText: 'hello',
        startChar: 0,
        endChar: 5,
        confidence: 0.99,
      },
      {
        index: 1,
        displayText: 'world',
        startChar: 6,
        endChar: 11,
        confidence: 0.95,
      },
    ];

    const result = toTranscriptWords(input);

    expect(result).toEqual([
      { index: 0, text: 'hello' },
      { index: 1, text: 'world' },
    ]);
  });

  it('returns an empty array for empty input', () => {
    expect(toTranscriptWords([])).toEqual([]);
  });
});

describe('ApiRequestError', () => {
  it('uses message when available', () => {
    const error = new ApiRequestError(400, {
      error: 'bad_request',
      message: 'Invalid input',
    });

    expect(error.message).toBe('Invalid input');
    expect(error.status).toBe(400);
    expect(error.name).toBe('ApiRequestError');
  });

  it('falls back to error field when message is absent', () => {
    const error = new ApiRequestError(500, { error: 'Internal server error' });

    expect(error.message).toBe('Internal server error');
    expect(error.status).toBe(500);
  });

  it('stores retryAfter when provided', () => {
    const error = new ApiRequestError(429, {
      error: 'rate_limited',
      retryAfter: 30,
    });

    expect(error.retryAfter).toBe(30);
  });

  it('is an instance of Error', () => {
    const error = new ApiRequestError(404, { error: 'Not found' });
    expect(error).toBeInstanceOf(Error);
  });
});
