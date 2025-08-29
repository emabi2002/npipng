// Supabase client configuration for NPIPNG ERP
import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('departments').select('count').limit(1)
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist - this is expected for new setup
      return { connected: true, tablesExist: false }
    }
    if (error) throw error
    return { connected: true, tablesExist: true }
  } catch (error) {
    console.error('Supabase connection error:', error)
    return { connected: false, tablesExist: false }
  }
}
