import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          device_id: string
          user_name: string | null
          profile_image: string | null
          created_by: string | null
          created_at: string
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          device_id: string
          user_name?: string | null
          profile_image?: string | null
          created_by?: string | null
          created_at?: string
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          device_id?: string
          user_name?: string | null
          profile_image?: string | null
          created_by?: string | null
          created_at?: string
          updated_by?: string | null
          updated_at?: string
        }
      }
      season_keywords: {
        Row: {
          id: string
          keyword_name: string
          season_type: string
          month: number
          display_order: number
          created_by: string | null
          created_at: string
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          keyword_name: string
          season_type: string
          month: number
          display_order?: number
          created_by?: string | null
          created_at?: string
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          keyword_name?: string
          season_type?: string
          month?: number
          display_order?: number
          created_by?: string | null
          created_at?: string
          updated_by?: string | null
          updated_at?: string
        }
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
  }
}