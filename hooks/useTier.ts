import { LIMITS, Tier } from '@/constants/limits';
import { useSubscription } from '@/contexts/SubscriptionContext';

import { useProfile } from './useProfile';

export const useTier = () => {
  const { data: profile } = useProfile();
  const { isPro } = useSubscription();

  const tier: Tier = isPro ? 'pro' : (profile?.pricing_plan ?? 'free');

  return {
    tier,
    isPro,
    limits: {
      dailyRecordings: LIMITS.DAILY_RECORDINGS[tier],
      maxFriends: LIMITS.MAX_FRIENDS[tier],
      maxRecordingDuration: LIMITS.MAX_RECORDING_DURATION_SECONDS[tier],
    },
  };
};
