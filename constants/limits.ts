export const TIERS = ['free', 'pro'] as const;

export type Tier = (typeof TIERS)[number];

export const MIN_RECORDING_DURATION_SECONDS = 10;

export const LIMITS = {
  DAILY_RECORDINGS: {
    free: 3,
    pro: Infinity,
  },
  MAX_FRIENDS: {
    free: 3,
    pro: Infinity,
  },
  MAX_RECORDING_DURATION_SECONDS: {
    free: 60,
    pro: 120,
  },
} as const;
