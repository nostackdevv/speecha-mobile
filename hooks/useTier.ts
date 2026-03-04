import { LIMITS, Tier } from '@/constants/limits';

// import { useProfile } from './useProfile';

export const useTier = () => {
  // const { data: profile } = useProfile();

  // const tier: Tier = profile?.pricing_plan ?? 'free';
  const tier: Tier = 'free'; // use dummy tier for now

  return {
    tier,
    limits: {
      dailyRecordings: LIMITS.DAILY_RECORDINGS[tier],
      maxFriends: LIMITS.MAX_FRIENDS[tier],
      maxRecordingDuration: LIMITS.MAX_RECORDING_DURATION_SECONDS[tier],
    },
  };
};
