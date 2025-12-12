import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY are required');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid SUPABASE_URL format: ${supabaseUrl}`);
}

// Supabase client chỉ dùng cho database queries, không dùng Supabase Auth
// Authentication được xử lý bằng JWT và bảng profiles tự quản lý
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Không dùng Supabase Auth
    autoRefreshToken: false,
  },
});
