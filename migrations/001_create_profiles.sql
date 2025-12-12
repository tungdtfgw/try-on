-- Migration: Create profiles table
-- Description: Tạo bảng profiles cho Sprint 1 (US-01, US-02)
-- WARNING: Script này sẽ XÓA HẾT dữ liệu cũ và tạo lại từ đầu
-- NOTE: Không dùng Supabase Auth, tự quản lý user trong bảng profiles

-- Step 1: Drop bảng profiles cũ (xóa hết dữ liệu, triggers và constraints)
-- CASCADE sẽ tự động xóa tất cả triggers, indexes, và constraints liên quan
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 2: Drop functions (nếu còn tồn tại sau khi drop table)
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Step 3: Tạo lại bảng profiles với schema đúng (không reference auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    height_cm NUMERIC CHECK (height_cm >= 100 AND height_cm <= 250),
    weight_kg NUMERIC CHECK (weight_kg >= 30 AND weight_kg <= 250),
    body_photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 4: Tạo index
CREATE INDEX profiles_email_idx ON public.profiles(email);

-- Step 5: Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Tạo RLS policies
-- Lưu ý: RLS sẽ được xử lý ở application level thông qua JWT middleware
-- Cho phép anon để API có thể query (authentication được kiểm tra ở middleware)
CREATE POLICY profiles_select_own ON public.profiles
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY profiles_insert_own ON public.profiles
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY profiles_update_own ON public.profiles
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Step 7: Tạo function handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Tạo trigger updated_at
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Step 9: Không cần trigger handle_new_user vì không dùng Supabase Auth
-- User sẽ được tạo trực tiếp trong bảng profiles qua API

-- Step 11: Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Step 10: Không cần grant cho handle_new_user vì không dùng trigger
