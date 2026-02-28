import { LIMITS, Tier } from '@/constants/limits';

import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export const useTier = () => {
  const { isAuthenticated } = useAuth();
  const { data: profile } = useProfile();

  const tier: Tier = !isAuthenticated
    ? 'anonymous'
    : (profile?.pricing_plan ?? 'free');

  return {
    tier,
    limits: {
      dailyRecordings: LIMITS.DAILY_RECORDINGS[tier],
      maxFriends: LIMITS.MAX_FRIENDS[tier],
      maxRecordingDuration: LIMITS.MAX_RECORDING_DURATION_SECONDS[tier],
    },
  };
};
