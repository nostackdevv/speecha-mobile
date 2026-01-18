-- ============================================
-- TABLES
-- ============================================

CREATE TABLE users (
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
  CONSTRAINT users_valid_pricing_plan CHECK (pricing_plan IN ('free', 'pro'))
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_id TEXT,
  transcript_data JSONB,
  clarity_score INT NOT NULL,
  filler_count INT NOT NULL,
  fillers_per_minute FLOAT NOT NULL,
  duration_seconds INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT sessions_clarity_score_range CHECK (clarity_score BETWEEN 0 AND 100),
  CONSTRAINT sessions_filler_count_nonneg CHECK (filler_count >= 0),
  CONSTRAINT sessions_fpm_nonneg CHECK (fillers_per_minute >= 0),
  CONSTRAINT sessions_duration_reasonable CHECK (duration_seconds BETWEEN 1 AND 300)
);

CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

CREATE INDEX idx_sessions_user_created ON sessions(user_id, created_at DESC);
CREATE INDEX idx_friendships_sender_accepted ON friendships(sender_id) WHERE status = 'accepted';
CREATE INDEX idx_friendships_receiver_accepted ON friendships(receiver_id) WHERE status = 'accepted';

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create user on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, avatar_url)
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

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
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
  longest_streak INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.username, u.full_name, u.avatar_url, u.current_streak, u.longest_streak
  FROM users u
  WHERE EXISTS (
    SELECT 1 FROM friendships f
    WHERE f.status = 'accepted'
      AND (
        (f.sender_id = auth.uid() AND f.receiver_id = u.id)
        OR (f.receiver_id = auth.uid() AND f.sender_id = u.id)
      )
  );
END;
$$;

-- Get friend stats (no transcript exposure)
CREATE OR REPLACE FUNCTION get_friend_stats(target_user_id UUID)
RETURNS TABLE (
  total_sessions INT,
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
        (f.sender_id = auth.uid() AND f.receiver_id = target_user_id)
        OR (f.receiver_id = auth.uid() AND f.sender_id = target_user_id)
      )
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::INT,
    ROUND(AVG(s.clarity_score))::INT,
    ROUND(AVG(s.fillers_per_minute)::numeric, 2)::FLOAT,
    (SELECT u.current_streak FROM users u WHERE u.id = target_user_id),
    MAX(s.created_at)
  FROM sessions s
  WHERE s.user_id = target_user_id;
END;
$$;

-- Search user by email (exact match only)
CREATE OR REPLACE FUNCTION search_user_by_email(search_email TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.username, u.full_name, u.avatar_url
  FROM users u
  WHERE u.email = search_email
  LIMIT 1;
END;
$$;

-- Search user by username (partial match)
CREATE OR REPLACE FUNCTION search_user_by_username(search_username TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.username, u.full_name, u.avatar_url
  FROM users u
  WHERE u.username ILIKE '%' || search_username || '%'
  LIMIT 20;
END;
$$;

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE friendships FORCE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================

CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- SESSIONS POLICIES
-- ============================================

CREATE POLICY "Users can view their own sessions"
ON sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
ON sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
ON sessions FOR DELETE
USING (auth.uid() = user_id);

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

REVOKE ALL ON users FROM authenticated;
GRANT SELECT ON users TO authenticated;
GRANT UPDATE (username, full_name, avatar_url, notifications_enabled, push_token) ON users TO authenticated;

REVOKE ALL ON sessions FROM authenticated;
GRANT SELECT, INSERT, DELETE ON sessions TO authenticated;

REVOKE ALL ON friendships FROM authenticated;
GRANT SELECT, INSERT, DELETE ON friendships TO authenticated;
GRANT UPDATE (status) ON friendships TO authenticated;

-- ============================================
-- FUNCTION PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION get_friend_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION get_friend_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_user_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_user_by_username(TEXT) TO authenticated;