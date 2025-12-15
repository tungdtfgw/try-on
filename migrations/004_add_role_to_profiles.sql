-- Migration: Add role column to profiles table
-- Description: Thêm cột role để phân quyền admin/user (Sprint 2 - Task 2)

-- Step 1: Add role column with default 'user'
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Step 2: Add check constraint for valid roles
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- Step 3: Create index on role for filtering (optional, useful if filtering by role frequently)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
