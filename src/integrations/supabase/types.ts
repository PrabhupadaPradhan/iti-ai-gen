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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string | null
          day_itinerary_id: string | null
          description: string | null
          duration: number | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
        }
        Insert: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          day_itinerary_id?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
        }
        Update: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          day_itinerary_id?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_day_itinerary_id_fkey"
            columns: ["day_itinerary_id"]
            isOneToOne: false
            referencedRelation: "day_itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      day_itineraries: {
        Row: {
          accommodation: string | null
          created_at: string | null
          date: string
          day_number: number
          id: string
          trip_id: string | null
        }
        Insert: {
          accommodation?: string | null
          created_at?: string | null
          date: string
          day_number: number
          id?: string
          trip_id?: string | null
        }
        Update: {
          accommodation?: string | null
          created_at?: string | null
          date?: string
          day_number?: number
          id?: string
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "day_itineraries_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          cost: number | null
          created_at: string | null
          cuisine: string | null
          day_itinerary_id: string | null
          id: string
          location: string | null
          meal_type: string | null
          restaurant: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          cuisine?: string | null
          day_itinerary_id?: string | null
          id?: string
          location?: string | null
          meal_type?: string | null
          restaurant?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          cuisine?: string | null
          day_itinerary_id?: string | null
          id?: string
          location?: string | null
          meal_type?: string | null
          restaurant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_day_itinerary_id_fkey"
            columns: ["day_itinerary_id"]
            isOneToOne: false
            referencedRelation: "day_itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          profile_picture: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          profile_picture?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          profile_picture?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          created_at: string | null
          destination: string
          duration: number
          end_date: string
          id: string
          start_date: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          duration: number
          end_date: string
          id?: string
          start_date: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          duration?: number
          end_date?: string
          id?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          accessibility_requirements: string[] | null
          accommodation_type: string[] | null
          activities: string[] | null
          adventure_level: string | null
          budget_range: string | null
          created_at: string | null
          dietary_restrictions: string[] | null
          food_preferences: string[] | null
          group_size: string | null
          id: string
          languages_spoken: string[] | null
          place_types: string[] | null
          transportation_preference: string[] | null
          travel_pace: string | null
          updated_at: string | null
          user_id: string | null
          weather_comfort: string | null
        }
        Insert: {
          accessibility_requirements?: string[] | null
          accommodation_type?: string[] | null
          activities?: string[] | null
          adventure_level?: string | null
          budget_range?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          food_preferences?: string[] | null
          group_size?: string | null
          id?: string
          languages_spoken?: string[] | null
          place_types?: string[] | null
          transportation_preference?: string[] | null
          travel_pace?: string | null
          updated_at?: string | null
          user_id?: string | null
          weather_comfort?: string | null
        }
        Update: {
          accessibility_requirements?: string[] | null
          accommodation_type?: string[] | null
          activities?: string[] | null
          adventure_level?: string | null
          budget_range?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          food_preferences?: string[] | null
          group_size?: string | null
          id?: string
          languages_spoken?: string[] | null
          place_types?: string[] | null
          transportation_preference?: string[] | null
          travel_pace?: string | null
          updated_at?: string | null
          user_id?: string | null
          weather_comfort?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
