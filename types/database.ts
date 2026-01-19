import type { Database } from "./supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type SpeechAnalysis =
  Database["public"]["Tables"]["speech_analyses"]["Row"];
export type SpeechAnalysisInsert =
  Database["public"]["Tables"]["speech_analyses"]["Insert"];
export type SpeechAnalysisUpdate =
  Database["public"]["Tables"]["speech_analyses"]["Update"];

export type Friendship = Database["public"]["Tables"]["friendships"]["Row"];
export type FriendshipInsert =
  Database["public"]["Tables"]["friendships"]["Insert"];
export type FriendshipUpdate =
  Database["public"]["Tables"]["friendships"]["Update"];

export type TranscriptWord = {
  index: number;
  text: string;
};
export type TranscriptFiller = {
  confidence: number;
  displayText: string;
  startIndex: number;
};

export type TranscriptData = {
  fillers: TranscriptFiller[];
  words: TranscriptWord[];
};

// Function return types
export type FriendProfile =
  Database["public"]["Functions"]["get_friend_profiles"]["Returns"][number];
export type FriendStats =
  Database["public"]["Functions"]["get_friend_stats"]["Returns"][number];
export type SearchedProfile =
  Database["public"]["Functions"]["search_profile_by_email"]["Returns"][number];
