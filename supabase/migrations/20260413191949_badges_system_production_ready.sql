-- ============================================
-- BADGE SYSTEM (PRODUCTION READY)
-- ============================================

CREATE TABLE IF NOT EXISTS badge_definitions (
  key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  sort_order INT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT badge_definitions_key_check CHECK (
    key IN (
      'kickstarter',
      'seven_day_streak',
      'clean_speaker',
      'prompt_explorer',
      'first_friend',
      'squad_goals',
      'thirty_day_streak',
      'sixty_day_streak',
      'ninety_day_streak',
      'social_proof'
    )
  )
);

CREATE TABLE IF NOT EXISTS profile_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL REFERENCES badge_definitions(key) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(profile_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_profile_badges_profile_id
  ON profile_badges(profile_id, unlocked_at DESC);

CREATE TABLE IF NOT EXISTS profile_badge_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT profile_badge_events_event_key_check CHECK (
    event_key IN ('social_share')
  ),
  UNIQUE(profile_id, event_key)
);

CREATE INDEX IF NOT EXISTS idx_profile_badge_events_profile_id
  ON profile_badge_events(profile_id, created_at DESC);

INSERT INTO badge_definitions (key, title, caption, sort_order)
VALUES
  ('kickstarter', 'Kickstarter', '1st recording', 1),
  ('seven_day_streak', '7-Day Streak', 'Record for 7 days straight', 2),
  ('clean_speaker', 'Clean Speaker', 'Record a session with 0 filler words', 3),
  ('prompt_explorer', 'Prompt Explorer', 'Try 4 prompt categories', 4),
  ('first_friend', 'First Friend', 'Add one friend', 5),
  ('squad_goals', 'Squad Goals', 'Add 3 friends', 6),
  ('thirty_day_streak', '30-Day Streak', 'Record for 30 days straight', 7),
  ('sixty_day_streak', '60-Day Streak', 'Record for 60 days straight', 8),
  ('ninety_day_streak', '90-Day Streak', 'Record for 90 days straight', 9),
  ('social_proof', 'Social Proof', 'Share to social media', 10)
ON CONFLICT (key) DO UPDATE
SET
  title = EXCLUDED.title,
  caption = EXCLUDED.caption,
  sort_order = EXCLUDED.sort_order;

-- ============================================
-- BADGE EVALUATION FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION evaluate_badges_for_profile(target_profile_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sessions_count INT := 0;
  has_clean_speaker BOOLEAN := false;
  prompt_category_count INT := 0;
  accepted_friends_count INT := 0;
  current_streak_value INT := 0;
  has_social_share BOOLEAN := false;
BEGIN
  IF target_profile_id IS NULL THEN
    RETURN;
  END IF;

  SELECT p.current_streak
  INTO current_streak_value
  FROM profiles p
  WHERE p.id = target_profile_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  SELECT COUNT(*)::INT
  INTO sessions_count
  FROM speech_analyses sa
  WHERE sa.profile_id = target_profile_id;

  SELECT EXISTS (
    SELECT 1
    FROM speech_analyses sa
    WHERE sa.profile_id = target_profile_id
      AND sa.filler_count = 0
  )
  INTO has_clean_speaker;

  SELECT COUNT(DISTINCT split_part(sa.prompt_id, '-', 1))::INT
  INTO prompt_category_count
  FROM speech_analyses sa
  WHERE sa.profile_id = target_profile_id
    AND sa.prompt_id IS NOT NULL
    AND sa.prompt_id <> '';

  SELECT COUNT(*)::INT
  INTO accepted_friends_count
  FROM friendships f
  WHERE f.status = 'accepted'
    AND (
      f.sender_id = target_profile_id
      OR f.receiver_id = target_profile_id
    );

  SELECT EXISTS (
    SELECT 1
    FROM profile_badge_events pbe
    WHERE pbe.profile_id = target_profile_id
      AND pbe.event_key = 'social_share'
  )
  INTO has_social_share;

  IF sessions_count >= 1 THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'kickstarter')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF current_streak_value >= 7 THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'seven_day_streak')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF has_clean_speaker THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'clean_speaker')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF prompt_category_count >= 4 THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'prompt_explorer')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF accepted_friends_count >= 1 THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'first_friend')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF accepted_friends_count >= 3 THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'squad_goals')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF current_streak_value >= 30 THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'thirty_day_streak')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF current_streak_value >= 60 THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'sixty_day_streak')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF current_streak_value >= 90 THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'ninety_day_streak')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;

  IF has_social_share THEN
    INSERT INTO profile_badges (profile_id, badge_key)
    VALUES (target_profile_id, 'social_proof')
    ON CONFLICT (profile_id, badge_key) DO NOTHING;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION record_badge_event(p_event_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_profile_id UUID;
BEGIN
  current_profile_id := auth.uid();

  IF current_profile_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_event_key <> 'social_share' THEN
    RAISE EXCEPTION 'Unsupported badge event: %', p_event_key;
  END IF;

  INSERT INTO profile_badge_events (profile_id, event_key)
  VALUES (current_profile_id, p_event_key)
  ON CONFLICT (profile_id, event_key) DO NOTHING;

  PERFORM evaluate_badges_for_profile(current_profile_id);
END;
$$;

CREATE OR REPLACE FUNCTION get_my_badges()
RETURNS TABLE (
  badge_key TEXT,
  title TEXT,
  caption TEXT,
  sort_order INT,
  is_unlocked BOOLEAN,
  unlocked_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    bd.key,
    bd.title,
    bd.caption,
    bd.sort_order,
    pb.unlocked_at IS NOT NULL AS is_unlocked,
    pb.unlocked_at
  FROM badge_definitions bd
  LEFT JOIN profile_badges pb
    ON pb.badge_key = bd.key
   AND pb.profile_id = auth.uid()
  ORDER BY bd.sort_order ASC;
END;
$$;

-- Ensure streak updates and badge evaluation happen in one place.
CREATE OR REPLACE FUNCTION update_streak_on_analysis()
RETURNS TRIGGER AS $$
DECLARE
  user_today DATE;
  user_last_date DATE;
BEGIN
  user_today := (NOW() AT TIME ZONE NEW.timezone)::DATE;

  SELECT last_session_date INTO user_last_date
  FROM profiles
  WHERE id = NEW.profile_id;

  IF user_last_date IS NULL OR user_last_date < user_today - 1 THEN
    UPDATE profiles
    SET
      current_streak = 1,
      last_session_date = user_today,
      longest_streak = GREATEST(longest_streak, 1)
    WHERE id = NEW.profile_id;

  ELSIF user_last_date = user_today - 1 THEN
    UPDATE profiles
    SET
      current_streak = current_streak + 1,
      last_session_date = user_today,
      longest_streak = GREATEST(longest_streak, current_streak + 1)
    WHERE id = NEW.profile_id;

  ELSIF user_last_date = user_today THEN
    -- Same-day recordings keep streak unchanged.
    NULL;
  END IF;

  PERFORM evaluate_badges_for_profile(NEW.profile_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION evaluate_badges_on_friendship_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND (
    TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'accepted'
  ) THEN
    PERFORM evaluate_badges_for_profile(NEW.sender_id);
    PERFORM evaluate_badges_for_profile(NEW.receiver_id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION evaluate_badges_on_event_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM evaluate_badges_for_profile(NEW.profile_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_friendship_changed_for_badges ON friendships;
CREATE TRIGGER on_friendship_changed_for_badges
  AFTER INSERT OR UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION evaluate_badges_on_friendship_change();

DROP TRIGGER IF EXISTS on_profile_badge_event_created ON profile_badge_events;
CREATE TRIGGER on_profile_badge_event_created
  AFTER INSERT ON profile_badge_events
  FOR EACH ROW
  EXECUTE FUNCTION evaluate_badges_on_event_insert();

-- ============================================
-- RLS + GRANTS
-- ============================================

ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_badge_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE badge_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE profile_badges FORCE ROW LEVEL SECURITY;
ALTER TABLE profile_badge_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view badge definitions" ON badge_definitions;
CREATE POLICY "Authenticated users can view badge definitions"
ON badge_definitions FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can view their own badge unlocks" ON profile_badges;
CREATE POLICY "Users can view their own badge unlocks"
ON profile_badges FOR SELECT
USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Internal badge unlock writes are allowed" ON profile_badges;
CREATE POLICY "Internal badge unlock writes are allowed"
ON profile_badges FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own badge events" ON profile_badge_events;
CREATE POLICY "Users can view their own badge events"
ON profile_badge_events FOR SELECT
USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Internal badge event writes are allowed" ON profile_badge_events;
CREATE POLICY "Internal badge event writes are allowed"
ON profile_badge_events FOR INSERT
WITH CHECK (true);

REVOKE ALL ON badge_definitions FROM authenticated;
GRANT SELECT ON badge_definitions TO authenticated;

REVOKE ALL ON profile_badges FROM authenticated;
GRANT SELECT ON profile_badges TO authenticated;

REVOKE ALL ON profile_badge_events FROM authenticated;

GRANT EXECUTE ON FUNCTION get_my_badges() TO authenticated;
GRANT EXECUTE ON FUNCTION record_badge_event(TEXT) TO authenticated;

-- ============================================
-- BACKFILL EXISTING USERS
-- ============================================

DO $$
DECLARE
  profile_row RECORD;
BEGIN
  FOR profile_row IN SELECT id FROM profiles LOOP
    PERFORM evaluate_badges_for_profile(profile_row.id);
  END LOOP;
END;
$$;
