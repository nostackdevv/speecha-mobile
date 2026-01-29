/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 *
 * This file was generated from the Supabase database schema.
 * To regenerate, run: npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      feedback: {
        Row: {
          created_at: string | null;
          id: string;
          message: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string;
        };
        Relationships: [];
      };
      friendships: {
        Row: {
          created_at: string;
          id: string;
          receiver_id: string;
          sender_id: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          receiver_id: string;
          sender_id: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          receiver_id?: string;
          sender_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friendships_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friendships_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          current_streak: number;
          email: string;
          full_name: string | null;
          id: string;
          last_session_date: string | null;
          longest_streak: number;
          notifications_enabled: boolean;
          pricing_plan: Database["public"]["Enums"]["pricing_plan"];
          push_token: string | null;
          updated_at: string;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          current_streak?: number;
          email: string;
          full_name?: string | null;
          id: string;
          last_session_date?: string | null;
          longest_streak?: number;
          notifications_enabled?: boolean;
          pricing_plan?: Database["public"]["Enums"]["pricing_plan"];
          push_token?: string | null;
          updated_at?: string;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          current_streak?: number;
          email?: string;
          full_name?: string | null;
          id?: string;
          last_session_date?: string | null;
          longest_streak?: number;
          notifications_enabled?: boolean;
          pricing_plan?: Database["public"]["Enums"]["pricing_plan"];
          push_token?: string | null;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      speech_analyses: {
        Row: {
          clarity_score: number;
          created_at: string;
          duration_seconds: number;
          filler_count: number;
          fillers_per_minute: number;
          id: string;
          profile_id: string;
          prompt_id: string | null;
          timezone: string;
          transcript_data: Json | null;
        };
        Insert: {
          clarity_score: number;
          created_at?: string;
          duration_seconds: number;
          filler_count: number;
          fillers_per_minute: number;
          id?: string;
          profile_id: string;
          prompt_id?: string | null;
          timezone?: string;
          transcript_data?: Json | null;
        };
        Update: {
          clarity_score?: number;
          created_at?: string;
          duration_seconds?: number;
          filler_count?: number;
          fillers_per_minute?: number;
          id?: string;
          profile_id?: string;
          prompt_id?: string | null;
          timezone?: string;
          transcript_data?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "speech_analyses_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      waitlist: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          source: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          source?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          source?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_friend_profiles: {
        Args: never;
        Returns: {
          avatar_url: string;
          current_streak: number;
          full_name: string;
          id: string;
          longest_streak: number;
          username: string;
        }[];
      };
      get_friend_stats: {
        Args: { target_profile_id: string };
        Returns: {
          avg_clarity: number;
          avg_fillers_per_minute: number;
          current_streak: number;
          last_practiced: string;
          total_analyses: number;
        }[];
      };
      search_profile_by_email: {
        Args: { search_email: string };
        Returns: {
          avatar_url: string;
          full_name: string;
          id: string;
          username: string;
        }[];
      };
      search_profile_by_username: {
        Args: { search_username: string };
        Returns: {
          avatar_url: string;
          full_name: string;
          id: string;
          username: string;
        }[];
      };
    };
    Enums: {
      pricing_plan: "free" | "pro";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      pricing_plan: ["free", "pro"],
    },
  },
} as const;
