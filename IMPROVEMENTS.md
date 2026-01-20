# Future Improvements

Tracking potential improvements and technical debt for future consideration.

---

## Streak System

### Timezone Cheating Prevention
**Current:** Uses device local timezone. Users could theoretically cheat by changing device time.

**Potential improvement:** For signed-in users, derive streak from `speech_analyses.created_at` (server timestamp) instead of trusting client-reported dates. This would make streaks tamper-proof for authenticated users.

**Why not now:** This is a self-improvement app - cheating only hurts the user. The streak is personal motivation, not a competitive feature. Low priority unless streaks become part of social/competitive features.
