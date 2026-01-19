export const LIMITS = {
  DAILY_RECORDINGS: {
    anonymous: 3,
    free: 3,
    pro: Infinity,
  },
  MAX_FRIENDS: {
    anonymous: 0,
    free: 3,
    pro: Infinity,
  },
  MAX_RECORDING_DURATION_SECONDS: 120,
} as const;
