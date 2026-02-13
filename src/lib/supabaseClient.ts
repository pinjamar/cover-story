import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
)

// Type-safe database helpers
export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          user_id: string
          job_title: string
          company_name: string
          job_description: string
          country_code: string | null
          language_code: string | null
          status: 'draft' | 'submitted' | 'in-review' | 'rejected' | 'accepted'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['applications']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['applications']['Insert']>
      }
      document_versions: {
        Row: {
          id: string
          application_id: string
          type: 'resume' | 'cover_story'
          content: any
          version_number: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['document_versions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['document_versions']['Insert']>
      }
    }
  }
}
