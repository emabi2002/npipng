import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client for client-side operations
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Simple client for all operations - using browser client only
export default createClient()

// Types for our database schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'faculty' | 'student' | 'staff' | 'librarian'
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'faculty' | 'student' | 'staff' | 'librarian'
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'faculty' | 'student' | 'staff' | 'librarian'
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          student_id: string
          program: string
          year_level: number
          section: string | null
          gpa: number | null
          total_credits: number
          enrollment_status: 'enrolled' | 'graduated' | 'dropped' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          student_id: string
          program: string
          year_level?: number
          section?: string | null
          gpa?: number | null
          total_credits?: number
          enrollment_status?: 'enrolled' | 'graduated' | 'dropped' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          student_id?: string
          program?: string
          year_level?: number
          section?: string | null
          gpa?: number | null
          total_credits?: number
          enrollment_status?: 'enrolled' | 'graduated' | 'dropped' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      // Add more table types as needed
    }
  }
}
