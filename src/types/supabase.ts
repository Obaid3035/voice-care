export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      adaptive_profiles: {
        Row: {
          delay_before_playback_sec: number | null
          device_id: string | null
          escalation_steps: string | null
          fallback_mode: string | null
          id: string
          last_updated: string | null
          preferred_voice_id: string | null
        }
        Insert: {
          delay_before_playback_sec?: number | null
          device_id?: string | null
          escalation_steps?: string | null
          fallback_mode?: string | null
          id?: string
          last_updated?: string | null
          preferred_voice_id?: string | null
        }
        Update: {
          delay_before_playback_sec?: number | null
          device_id?: string | null
          escalation_steps?: string | null
          fallback_mode?: string | null
          id?: string
          last_updated?: string | null
          preferred_voice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adaptive_profiles_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adaptive_profiles_preferred_voice_id_fkey"
            columns: ["preferred_voice_id"]
            isOneToOne: false
            referencedRelation: "voices"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_content: {
        Row: {
          audio_url: string | null
          created_at: string | null
          duration: number | null
          id: string
          language: string | null
          prompt: string | null
          title: string | null
          user_id: string | null
          voice_id: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          language?: string | null
          prompt?: string | null
          title?: string | null
          user_id?: string | null
          voice_id?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          language?: string | null
          prompt?: string | null
          title?: string | null
          user_id?: string | null
          voice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_content_voice_id_fkey"
            columns: ["voice_id"]
            isOneToOne: false
            referencedRelation: "voices"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ratings: {
        Row: {
          comment: string | null
          content_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_ratings_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "audio_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      device_tokens: {
        Row: {
          created_at: string | null
          device_id: string | null
          expiry_time: string | null
          id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          expiry_time?: string | null
          id?: string
          token: string
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          expiry_time?: string | null
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_tokens_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          camera_enabled: boolean | null
          created_at: string | null
          firmware_version: string | null
          id: string
          is_active: boolean | null
          name: string | null
          serial_number: string | null
          user_id: string | null
          wifi_status: string | null
        }
        Insert: {
          camera_enabled?: boolean | null
          created_at?: string | null
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          serial_number?: string | null
          user_id?: string | null
          wifi_status?: string | null
        }
        Update: {
          camera_enabled?: boolean | null
          created_at?: string | null
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          serial_number?: string | null
          user_id?: string | null
          wifi_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          content_id: string | null
          device_id: string | null
          event_type: string | null
          id: string
          intensity: string | null
          result: string | null
          timestamp: string | null
        }
        Insert: {
          content_id?: string | null
          device_id?: string | null
          event_type?: string | null
          id?: string
          intensity?: string | null
          result?: string | null
          timestamp?: string | null
        }
        Update: {
          content_id?: string | null
          device_id?: string | null
          event_type?: string | null
          id?: string
          intensity?: string | null
          result?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "audio_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      play_queue: {
        Row: {
          added_at: string | null
          content_id: string
          device_id: string
          id: string
          is_playing: boolean | null
          position: number
        }
        Insert: {
          added_at?: string | null
          content_id: string
          device_id: string
          id?: string
          is_playing?: boolean | null
          position: number
        }
        Update: {
          added_at?: string | null
          content_id?: string
          device_id?: string
          id?: string
          is_playing?: boolean | null
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "play_queue_content_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "audio_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_queue_device_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      voices: {
        Row: {
          created_at: string | null
          duration: number | null
          elevenlabs_voice_id: string | null
          id: string
          is_default: boolean | null
          language: string | null
          name: string | null
          size: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          elevenlabs_voice_id?: string | null
          id?: string
          is_default?: boolean | null
          language?: string | null
          name?: string | null
          size?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          elevenlabs_voice_id?: string | null
          id?: string
          is_default?: boolean | null
          language?: string | null
          name?: string | null
          size?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
