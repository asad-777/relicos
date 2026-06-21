import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'mock-key'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

export const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
