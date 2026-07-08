// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// .env.local から値を読み込みます（存在しない場合は空文字にしてエラーを防ぐ）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 万が一環境変数が読み込めていない場合に、開発中に気づけるようチェックを入れます
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabaseの環境変数が設定されていません。.env.local を確認してください。')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)