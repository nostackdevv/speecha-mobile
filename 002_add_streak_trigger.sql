-- ============================================
-- ADD TIMEZONE TO SPEECH_ANALYSES
-- ============================================

ALTER TABLE speech_analyses
ADD COLUMN timezone TEXT NOT NULL DEFAULT 'UTC';

-- ============================================
-- STREAK TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_streak_on_analysis()
RETURNS TRIGGER AS $$
DECLARE
  user_today DATE;
  user_last_date DATE;
BEGIN
  -- Get today's date in user's timezone
  user_today := (NOW() AT TIME ZONE NEW.timezone)::DATE;

  -- Get user's last session date
  SELECT last_session_date INTO user_last_date
  FROM profiles
  WHERE id = NEW.profile_id;

  IF user_last_date IS NULL OR user_last_date < user_today - 1 THEN
    -- First session ever OR streak broken
    UPDATE profiles
    SET
      current_streak = 1,
      last_session_date = user_today,
      longest_streak = GREATEST(longest_streak, 1)
    WHERE id = NEW.profile_id;

  ELSIF user_last_date = user_today - 1 THEN
    -- Consecutive day — increment streak
    UPDATE profiles
    SET
      current_streak = current_streak + 1,
      last_session_date = user_today,
      longest_streak = GREATEST(longest_streak, current_streak + 1)
    WHERE id = NEW.profile_id;

  END IF;
  -- If user_last_date = user_today, do nothing (already recorded today)

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- ATTACH TRIGGER
-- ============================================

DROP TRIGGER IF EXISTS on_speech_analysis_created ON speech_analyses;
CREATE TRIGGER on_speech_analysis_created
  AFTER INSERT ON speech_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_streak_on_analysis();
