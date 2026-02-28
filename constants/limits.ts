export const TIERS = ['anonymous', 'free', 'pro'] as const;

export type Tier = (typeof TIERS)[number];

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
  MAX_RECORDING_DURATION_SECONDS: {
    anonymous: 60,
    free: 60,
    pro: 120,
  },
} as const;
