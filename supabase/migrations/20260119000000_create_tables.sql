-- ============================================
-- TABLES
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  current_streak INT DEFAULT 0 NOT NULL,
  longest_streak INT DEFAULT 0 NOT NULL,
  last_session_date DATE,
  push_token TEXT,
  notifications_enabled BOOLEAN DEFAULT true NOT NULL,
  pricing_plan TEXT DEFAULT 'free' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT profiles_valid_pricing_plan CHECK (pricing_plan IN ('free', 'pro'))
);

CREATE TABLE speech_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id TEXT,
  transcript_data JSONB,
  clarity_score INT NOT NULL,
  filler_count INT NOT NULL,
  fillers_per_minute FLOAT NOT NULL,
  duration_seconds INT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT speech_analyses_clarity_score_range CHECK (clarity_score BETWEEN 0 AND 100),
  CONSTRAINT speech_analyses_filler_count_nonneg CHECK (filler_count >= 0),
  CONSTRAINT speech_analyses_fpm_nonneg CHECK (fillers_per_minute >= 0),
  CONSTRAINT speech_analyses_duration_reasonable CHECK (duration_seconds BETWEEN 1 AND 300)
);

CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT friendships_no_self_friend CHECK (sender_id != receiver_id),
  CONSTRAINT friendships_valid_status CHECK (status IN ('pending', 'accepted', 'rejected'))
);

CREATE UNIQUE INDEX friendships_unique_undirected
ON friendships (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id));

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_speech_analyses_profile_created ON speech_analyses(profile_id, created_at DESC);
CREATE INDEX idx_friendships_sender_accepted ON friendships(sender_id) WHERE status = 'accepted';
CREATE INDEX idx_friendships_receiver_accepted ON friendships(receiver_id) WHERE status = 'accepted';

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'username', 
      split_part(NEW.email, '@', 1) || '_' || floor(random() * 10000)::text
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Get friend profiles (safe columns only)
CREATE OR REPLACE FUNCTION get_friend_profiles()
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  current_streak INT,
  longest_streak INT,
  sessions_count INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.full_name, p.avatar_url, p.current_streak, p.longest_streak,
         (SELECT COUNT(*) FROM speech_analyses sa WHERE sa.profile_id = p.id)::INT AS sessions_count
  FROM profiles p
  WHERE EXISTS (
    SELECT 1 FROM friendships f
    WHERE f.status = 'accepted'
      AND (
        (f.sender_id = auth.uid() AND f.receiver_id = p.id)
        OR (f.receiver_id = auth.uid() AND f.sender_id = p.id)
      )
  );
END;
$$;

-- Get friend stats (no transcript exposure)
CREATE OR REPLACE FUNCTION get_friend_stats(target_profile_id UUID)
RETURNS TABLE (
  total_analyses INT,
  avg_clarity INT,
  avg_fillers_per_minute FLOAT,
  current_streak INT,
  last_practiced TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM friendships f
    WHERE f.status = 'accepted'
      AND (
        (f.sender_id = auth.uid() AND f.receiver_id = target_profile_id)
        OR (f.receiver_id = auth.uid() AND f.sender_id = target_profile_id)
      )
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::INT,
    ROUND(AVG(sa.clarity_score))::INT,
    ROUND(AVG(sa.fillers_per_minute)::numeric, 2)::FLOAT,
    (SELECT p.current_streak FROM profiles p WHERE p.id = target_profile_id),
    MAX(sa.created_at)
  FROM speech_analyses sa
  WHERE sa.profile_id = target_profile_id;
END;
$$;

-- Update streak on new speech analysis
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

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_speech_analysis_created ON speech_analyses;
CREATE TRIGGER on_speech_analysis_created
  AFTER INSERT ON speech_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_streak_on_analysis();

-- Search profile by email (exact match only)
CREATE OR REPLACE FUNCTION search_profile_by_email(search_email TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  friendship_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.full_name, p.avatar_url,
         CASE
           WHEN f.id IS NULL THEN 'none'
           WHEN f.status = 'accepted' THEN 'accepted'
           WHEN f.status = 'pending' AND f.sender_id = auth.uid() THEN 'pending_sent'
           WHEN f.status = 'pending' AND f.receiver_id = auth.uid() THEN 'pending_received'
           ELSE 'none'
         END AS friendship_status
  FROM profiles p
  LEFT JOIN friendships f ON (
    (f.sender_id = auth.uid() AND f.receiver_id = p.id)
    OR (f.receiver_id = auth.uid() AND f.sender_id = p.id)
  )
  WHERE p.email = search_email
    AND p.id != auth.uid()
  LIMIT 1;
END;
$$;

-- Search profile by username (partial match)
CREATE OR REPLACE FUNCTION search_profile_by_username(search_username TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  friendship_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.full_name, p.avatar_url,
         CASE
           WHEN f.id IS NULL THEN 'none'
           WHEN f.status = 'accepted' THEN 'accepted'
           WHEN f.status = 'pending' AND f.sender_id = auth.uid() THEN 'pending_sent'
           WHEN f.status = 'pending' AND f.receiver_id = auth.uid() THEN 'pending_received'
           ELSE 'none'
         END AS friendship_status
  FROM profiles p
  LEFT JOIN friendships f ON (
    (f.sender_id = auth.uid() AND f.receiver_id = p.id)
    OR (f.receiver_id = auth.uid() AND f.sender_id = p.id)
  )
  WHERE p.username ILIKE '%' || search_username || '%'
    AND p.id != auth.uid()
  LIMIT 20;
END;
$$;

-- Get pending friend requests with sender profile
CREATE OR REPLACE FUNCTION get_friend_requests()
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  created_at TIMESTAMPTZ,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  current_streak INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.sender_id, f.created_at,
         p.username, p.full_name, p.avatar_url, p.current_streak
  FROM friendships f
  JOIN profiles p ON p.id = f.sender_id
  WHERE f.receiver_id = auth.uid()
    AND f.status = 'pending'
  ORDER BY f.created_at DESC;
END;
$$;

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

ALTER TABLE profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE speech_analyses FORCE ROW LEVEL SECURITY;
ALTER TABLE friendships FORCE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- SPEECH_ANALYSES POLICIES
-- ============================================

CREATE POLICY "Users can view their own speech analyses"
ON speech_analyses FOR SELECT
USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own speech analyses"
ON speech_analyses FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own speech analyses"
ON speech_analyses FOR DELETE
USING (auth.uid() = profile_id);

-- ============================================
-- FRIENDSHIPS POLICIES
-- ============================================

CREATE POLICY "Users can view their own friendships"
ON friendships FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send friend requests"
ON friendships FOR INSERT
WITH CHECK (auth.uid() = sender_id AND status = 'pending');

CREATE POLICY "Users can update friendships they received"
ON friendships FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id AND status IN ('accepted', 'rejected'));

CREATE POLICY "Users can delete their own friendships"
ON friendships FOR DELETE
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================
-- COLUMN-LEVEL GRANTS
-- ============================================

REVOKE ALL ON profiles FROM authenticated;
GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE (username, full_name, avatar_url, notifications_enabled, push_token) ON profiles TO authenticated;

REVOKE ALL ON speech_analyses FROM authenticated;
GRANT SELECT, INSERT, DELETE ON speech_analyses TO authenticated;

REVOKE ALL ON friendships FROM authenticated;
GRANT SELECT, INSERT, DELETE ON friendships TO authenticated;
GRANT UPDATE (status) ON friendships TO authenticated;

-- ============================================
-- FUNCTION PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION get_friend_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION get_friend_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_profile_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_profile_by_username(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_friend_requests() TO authenticated;