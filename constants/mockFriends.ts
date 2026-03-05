import type {
  FriendProfile,
  FriendStats,
  Friendship,
  SearchedProfile,
} from '@/types/database';

type MockFriend = FriendProfile & { sessions: number };

type MockFriendRequest = {
  friendship: Friendship;
  profile: FriendProfile;
};

type SuggestedFriend = SearchedProfile & { subtitle: string };

export const MOCK_FRIENDS: MockFriend[] = [
  {
    avatar_url: '',
    current_streak: 18,
    full_name: 'Jeriel Joel',
    id: 'f1',
    longest_streak: 24,
    sessions: 42,
    username: 'jeriel_joel',
  },
  {
    avatar_url: '',
    current_streak: 12,
    full_name: 'Hyeing',
    id: 'f2',
    longest_streak: 20,
    sessions: 31,
    username: 'hyeing',
  },
  {
    avatar_url: '',
    current_streak: 7,
    full_name: 'Sam Chi',
    id: 'f3',
    longest_streak: 15,
    sessions: 19,
    username: 'sam_chi',
  },
  {
    avatar_url: '',
    current_streak: 22,
    full_name: 'Victor Ali',
    id: 'f4',
    longest_streak: 30,
    sessions: 56,
    username: 'victor_ali',
  },
  {
    avatar_url: '',
    current_streak: 3,
    full_name: 'Maria Gomez',
    id: 'f5',
    longest_streak: 11,
    sessions: 14,
    username: 'maria_gomez',
  },
  {
    avatar_url: '',
    current_streak: 9,
    full_name: 'James Smith',
    id: 'f6',
    longest_streak: 16,
    sessions: 27,
    username: 'james_smith',
  },
];

export const MOCK_FRIEND_REQUESTS: MockFriendRequest[] = [
  {
    friendship: {
      created_at: '2026-02-28T10:00:00Z',
      id: 'fr1',
      receiver_id: 'current-user',
      sender_id: 'r1',
      status: 'pending',
    },
    profile: {
      avatar_url: '',
      current_streak: 5,
      full_name: 'Alex Rivera',
      id: 'r1',
      longest_streak: 12,
      username: 'alex_rivera',
    },
  },
  {
    friendship: {
      created_at: '2026-03-01T14:30:00Z',
      id: 'fr2',
      receiver_id: 'current-user',
      sender_id: 'r2',
      status: 'pending',
    },
    profile: {
      avatar_url: '',
      current_streak: 14,
      full_name: 'Priya Sharma',
      id: 'r2',
      longest_streak: 21,
      username: 'priya_sharma',
    },
  },
  {
    friendship: {
      created_at: '2026-03-02T09:15:00Z',
      id: 'fr3',
      receiver_id: 'current-user',
      sender_id: 'r3',
      status: 'pending',
    },
    profile: {
      avatar_url: '',
      current_streak: 2,
      full_name: 'David Park',
      id: 'r3',
      longest_streak: 8,
      username: 'david_park',
    },
  },
];

export const MOCK_FRIEND_STATS: Record<string, FriendStats> = {
  f1: {
    avg_clarity: 92,
    avg_fillers_per_minute: 1.2,
    current_streak: 18,
    last_practiced: '2026-03-03T18:00:00Z',
    top_filler_word: 'um',
    total_analyses: 42,
    total_words: 8420,
  },
  f2: {
    avg_clarity: 85,
    avg_fillers_per_minute: 2.1,
    current_streak: 12,
    last_practiced: '2026-03-03T15:30:00Z',
    top_filler_word: 'like',
    total_analyses: 31,
    total_words: 5890,
  },
  f3: {
    avg_clarity: 78,
    avg_fillers_per_minute: 3.0,
    current_streak: 7,
    last_practiced: '2026-03-02T20:00:00Z',
    top_filler_word: 'uh',
    total_analyses: 19,
    total_words: 3210,
  },
  f4: {
    avg_clarity: 95,
    avg_fillers_per_minute: 0.8,
    current_streak: 22,
    last_practiced: '2026-03-04T09:00:00Z',
    top_filler_word: 'you know',
    total_analyses: 56,
    total_words: 12450,
  },
  f5: {
    avg_clarity: 72,
    avg_fillers_per_minute: 3.5,
    current_streak: 3,
    last_practiced: '2026-03-01T12:00:00Z',
    top_filler_word: 'um',
    total_analyses: 14,
    total_words: 2180,
  },
  f6: {
    avg_clarity: 88,
    avg_fillers_per_minute: 1.8,
    current_streak: 9,
    last_practiced: '2026-03-03T21:00:00Z',
    top_filler_word: 'so',
    total_analyses: 27,
    total_words: 5640,
  },
};

export const MOCK_SUGGESTED_FRIENDS: SuggestedFriend[] = [
  {
    avatar_url: '',
    full_name: 'Emma Wilson',
    id: 's1',
    subtitle: 'From your contacts',
    username: 'emma_wilson',
  },
  {
    avatar_url: '',
    full_name: 'Liam Chen',
    id: 's2',
    subtitle: '3 mutual friends',
    username: 'liam_chen',
  },
  {
    avatar_url: '',
    full_name: 'Sofia Martinez',
    id: 's3',
    subtitle: 'From your contacts',
    username: 'sofia_martinez',
  },
];

export const MOCK_INVITE_LINK = 'Speecha.app/invite/voice_hero_22';
