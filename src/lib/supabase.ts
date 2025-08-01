import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface FeedbackRow {
  id: string
  name: string
  rating: number
  comment: string | null
  created_at: string
}