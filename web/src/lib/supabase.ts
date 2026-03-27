import { createClient } from '@supabase/supabase-js'

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || url === 'placeholder' || url.includes('placeholder')) {
    return 'http://localhost:54321' // 有效的 URL 但不會真正連接
  }
  return url
}

const getSupabaseAnonKey = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
}

const getSupabaseServiceKey = () => {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
}

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey())

export const supabaseAdmin = createClient(
  getSupabaseUrl(),
  getSupabaseServiceKey(),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
