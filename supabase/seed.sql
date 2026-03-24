-- ============================================
-- SEED: Mock friends for testing all friendship states
-- Run: via Supabase MCP execute_sql or Dashboard SQL Editor
-- Idempotent: safe to re-run (cleans up previous seed data first)
-- ============================================

DO $$
DECLARE
  real_user_id UUID;
  -- Fixed UUIDs for seed users (deterministic for cleanup)
  seed_id_1 UUID := 'a0000000-0000-0000-0000-000000000001';
  seed_id_2 UUID := 'a0000000-0000-0000-0000-000000000002';
  seed_id_3 UUID := 'a0000000-0000-0000-0000-000000000003';
  seed_id_4 UUID := 'a0000000-0000-0000-0000-000000000004';
  seed_id_5 UUID := 'a0000000-0000-0000-0000-000000000005';
  seed_id_6 UUID := 'a0000000-0000-0000-0000-000000000006';
  seed_id_7 UUID := 'a0000000-0000-0000-0000-000000000007';
  seed_id_8 UUID := 'a0000000-0000-0000-0000-000000000008';
  seed_id_9 UUID := 'a0000000-0000-0000-0000-000000000009';
  seed_id_10 UUID := 'a0000000-0000-0000-0000-000000000010';
  seed_ids UUID[] := ARRAY[
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000007',
    'a0000000-0000-0000-0000-000000000008',
    'a0000000-0000-0000-0000-000000000009',
    'a0000000-0000-0000-0000-000000000010'
  ]::UUID[];
BEGIN
  -- 1. Look up real user
  SELECT id INTO real_user_id FROM public.profiles WHERE email = 'segungodwin6@gmail.com';
  IF real_user_id IS NULL THEN
    RAISE EXCEPTION 'User segungodwin6@gmail.com not found in profiles table';
  END IF;

  -- 2. Clean up previous seed data (order matters for FK constraints)
  DELETE FROM public.speech_analyses WHERE profile_id = ANY(seed_ids);
  DELETE FROM public.friendships
    WHERE sender_id = ANY(seed_ids) OR receiver_id = ANY(seed_ids);
  DELETE FROM public.profiles WHERE id = ANY(seed_ids);
  DELETE FROM auth.users WHERE id = ANY(seed_ids);

  -- 3. Insert auth.users (trigger auto-creates profiles with defaults)
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, role, aud, raw_user_meta_data, created_at, updated_at)
  VALUES
    (seed_id_1,  '00000000-0000-0000-0000-000000000000', 'amara@test.com',  crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Amara Johnson", "username": "amara_j"}', now(), now()),
    (seed_id_2,  '00000000-0000-0000-0000-000000000000', 'marcus@test.com', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Marcus Chen", "username": "marcus_c"}', now(), now()),
    (seed_id_3,  '00000000-0000-0000-0000-000000000000', 'lina@test.com',   crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Lina Park", "username": "lina_p"}', now(), now()),
    (seed_id_4,  '00000000-0000-0000-0000-000000000000', 'devon@test.com',  crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Devon Brooks", "username": "devon_b"}', now(), now()),
    (seed_id_5,  '00000000-0000-0000-0000-000000000000', 'sofia@test.com',  crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Sofia Rivera", "username": "sofia_r"}', now(), now()),
    (seed_id_6,  '00000000-0000-0000-0000-000000000000', 'kai@test.com',    crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Kai Okafor", "username": "kai_o"}', now(), now()),
    (seed_id_7,  '00000000-0000-0000-0000-000000000000', 'nia@test.com',    crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Nia Thompson", "username": "nia_t"}', now(), now()),
    (seed_id_8,  '00000000-0000-0000-0000-000000000000', 'ravi@test.com',   crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Ravi Patel", "username": "ravi_p"}', now(), now()),
    (seed_id_9,  '00000000-0000-0000-0000-000000000000', 'zara@test.com',   crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Zara Williams", "username": "zara_w"}', now(), now()),
    (seed_id_10, '00000000-0000-0000-0000-000000000000', 'jude@test.com',   crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"full_name": "Jude Kim", "username": "jude_k"}', now(), now());

  -- 4. Update auto-created profiles with custom streaks and dates
  UPDATE public.profiles SET current_streak = 12, longest_streak = 24, last_session_date = CURRENT_DATE - 1 WHERE id = seed_id_1;
  UPDATE public.profiles SET current_streak = 7,  longest_streak = 14, last_session_date = CURRENT_DATE - 1 WHERE id = seed_id_2;
  UPDATE public.profiles SET current_streak = 15, longest_streak = 30, last_session_date = CURRENT_DATE     WHERE id = seed_id_3;
  UPDATE public.profiles SET current_streak = 4,  longest_streak = 8,  last_session_date = CURRENT_DATE - 2 WHERE id = seed_id_4;
  UPDATE public.profiles SET current_streak = 3,  longest_streak = 5,  last_session_date = CURRENT_DATE - 3 WHERE id = seed_id_5;
  UPDATE public.profiles SET current_streak = 21, longest_streak = 21, last_session_date = CURRENT_DATE     WHERE id = seed_id_6;
  UPDATE public.profiles SET current_streak = 9,  longest_streak = 12, last_session_date = CURRENT_DATE - 1 WHERE id = seed_id_7;
  UPDATE public.profiles SET current_streak = 6,  longest_streak = 10, last_session_date = CURRENT_DATE - 2 WHERE id = seed_id_8;
  UPDATE public.profiles SET current_streak = 0,  longest_streak = 3,  last_session_date = NULL             WHERE id = seed_id_9;
  UPDATE public.profiles SET current_streak = 2,  longest_streak = 6,  last_session_date = CURRENT_DATE - 4 WHERE id = seed_id_10;

  -- 5. Insert friendships
  -- Accepted: user sent to Amara & Lina
  INSERT INTO public.friendships (sender_id, receiver_id, status) VALUES
    (real_user_id, seed_id_1, 'accepted'),
    (real_user_id, seed_id_3, 'accepted');
  -- Accepted: Marcus & Devon sent to user
  INSERT INTO public.friendships (sender_id, receiver_id, status) VALUES
    (seed_id_2, real_user_id, 'accepted'),
    (seed_id_4, real_user_id, 'accepted');
  -- Pending sent: user sent to Sofia & Ravi
  INSERT INTO public.friendships (sender_id, receiver_id, status) VALUES
    (real_user_id, seed_id_5, 'pending'),
    (real_user_id, seed_id_8, 'pending');
  -- Pending received: Kai & Nia sent to user
  INSERT INTO public.friendships (sender_id, receiver_id, status) VALUES
    (seed_id_6, real_user_id, 'pending'),
    (seed_id_7, real_user_id, 'pending');
  -- Zara (seed_id_9) and Jude (seed_id_10): no friendship row

  -- 6. Insert speech_analyses for accepted friends (stats data)
  -- Amara: 4 sessions
  INSERT INTO public.speech_analyses (profile_id, clarity_score, filler_count, fillers_per_minute, duration_seconds, timezone, created_at) VALUES
    (seed_id_1, 87, 3, 1.2, 150, 'America/New_York', now() - interval '1 day'),
    (seed_id_1, 92, 1, 0.5, 120, 'America/New_York', now() - interval '2 days'),
    (seed_id_1, 78, 5, 2.0, 180, 'America/New_York', now() - interval '4 days'),
    (seed_id_1, 85, 2, 1.0, 130, 'America/New_York', now() - interval '7 days');

  -- Marcus: 3 sessions
  INSERT INTO public.speech_analyses (profile_id, clarity_score, filler_count, fillers_per_minute, duration_seconds, timezone, created_at) VALUES
    (seed_id_2, 74, 6, 2.8, 130, 'America/Los_Angeles', now() - interval '1 day'),
    (seed_id_2, 80, 4, 2.0, 160, 'America/Los_Angeles', now() - interval '3 days'),
    (seed_id_2, 71, 8, 3.5, 140, 'America/Los_Angeles', now() - interval '5 days');

  -- Lina: 5 sessions
  INSERT INTO public.speech_analyses (profile_id, clarity_score, filler_count, fillers_per_minute, duration_seconds, timezone, created_at) VALUES
    (seed_id_3, 95, 1, 0.4, 160, 'Asia/Seoul', now() - interval '0 days'),
    (seed_id_3, 91, 2, 0.8, 140, 'Asia/Seoul', now() - interval '1 day'),
    (seed_id_3, 88, 3, 1.2, 150, 'Asia/Seoul', now() - interval '2 days'),
    (seed_id_3, 93, 1, 0.5, 120, 'Asia/Seoul', now() - interval '4 days'),
    (seed_id_3, 86, 4, 1.8, 170, 'Asia/Seoul', now() - interval '6 days');

  -- Devon: 3 sessions
  INSERT INTO public.speech_analyses (profile_id, clarity_score, filler_count, fillers_per_minute, duration_seconds, timezone, created_at) VALUES
    (seed_id_4, 65, 9, 4.0, 135, 'America/Chicago', now() - interval '2 days'),
    (seed_id_4, 70, 7, 3.2, 145, 'America/Chicago', now() - interval '4 days'),
    (seed_id_4, 62, 11, 4.8, 140, 'America/Chicago', now() - interval '6 days');

  RAISE NOTICE 'Seed complete: 10 users, 8 friendships, 15 speech analyses';
END;
$$;
