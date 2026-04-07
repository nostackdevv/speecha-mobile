import { ApiRequestError } from '@/lib/api';

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

const RETRYABLE_MESSAGE_PARTS = [
  'network request failed',
  'failed to fetch',
  'timed out',
  'timeout',
  'offline',
];

export const isRetryableSyncError = (error: unknown): boolean => {
  if (error instanceof ApiRequestError) {
    return RETRYABLE_STATUS_CODES.has(error.status) || error.status >= 500;
  }

  if (error instanceof Error) {
    const normalized = error.message.toLowerCase();
    return RETRYABLE_MESSAGE_PARTS.some((part) => normalized.includes(part));
  }

  return false;
};
