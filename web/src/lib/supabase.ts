import { createClient } from '@supabase/supabase-js'

// 使用佔位符 URL 用於靜態導出
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key'

// 檢查是否是有效的 URL
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl !== 'https://example.com'

export const supabase = isValidUrl ? createClient(supabaseUrl, supabaseAnonKey) : null

export const supabaseAdmin = isValidUrl ? createClient(supabaseUrl, 'admin-key', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null
