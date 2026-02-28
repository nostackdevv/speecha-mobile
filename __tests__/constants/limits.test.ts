import { LIMITS, TIERS } from '@/constants/limits';

describe('LIMITS', () => {
  it('defines all tiers', () => {
    expect(TIERS).toEqual(['anonymous', 'free', 'pro']);
  });

  it('gives anonymous and free the same daily recording limit', () => {
    expect(LIMITS.DAILY_RECORDINGS.anonymous).toBe(3);
    expect(LIMITS.DAILY_RECORDINGS.free).toBe(3);
  });

  it('gives pro unlimited daily recordings', () => {
    expect(LIMITS.DAILY_RECORDINGS.pro).toBe(Infinity);
  });

  it('does not allow friends for anonymous users', () => {
    expect(LIMITS.MAX_FRIENDS.anonymous).toBe(0);
  });

  it('limits free users to 3 friends', () => {
    expect(LIMITS.MAX_FRIENDS.free).toBe(3);
  });

  it('gives pro unlimited friends', () => {
    expect(LIMITS.MAX_FRIENDS.pro).toBe(Infinity);
  });

  it('sets recording duration for each tier', () => {
    for (const tier of TIERS) {
      expect(LIMITS.MAX_RECORDING_DURATION_SECONDS[tier]).toBeGreaterThan(0);
    }
  });

  it('gives pro a longer max recording duration than free', () => {
    expect(LIMITS.MAX_RECORDING_DURATION_SECONDS.pro).toBeGreaterThan(
      LIMITS.MAX_RECORDING_DURATION_SECONDS.free
    );
  });
});
