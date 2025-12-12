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

// Supabase client với service role key cho storage operations
// Vì project không dùng Supabase Auth, storage RLS policies (dùng auth.uid()) không hoạt động
// Nên cần dùng service role key để bypass RLS, nhưng vẫn kiểm soát access ở application level
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseStorage = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : supabase; // Fallback to regular client if service key not provided
