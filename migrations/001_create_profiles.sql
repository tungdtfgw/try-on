-- Migration: Create profiles table
-- Description: Tạo bảng profiles cho Sprint 1 (US-01, US-02)

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    height_cm NUMERIC CHECK (height_cm >= 100 AND height_cm <= 250),
    weight_kg NUMERIC CHECK (weight_kg >= 30 AND weight_kg <= 250),
    body_photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;

-- Policy: Users can view their own profile
CREATE POLICY profiles_select_own ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY profiles_insert_own ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY profiles_update_own ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;

-- Trigger to auto-update updated_at
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
