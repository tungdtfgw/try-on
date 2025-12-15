-- Migration: Create categories table
-- Description: Tạo bảng categories cho quản lý danh mục sản phẩm (Sprint 2 - US-03)

-- Step 1: Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Constraints
    CONSTRAINT categories_name_length CHECK (LENGTH(TRIM(name)) BETWEEN 1 AND 100),
    CONSTRAINT categories_description_length CHECK (description IS NULL OR LENGTH(description) <= 500)
);

-- Step 2: Create index on slug for URL lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Step 3: Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- Allow everyone to read categories (public endpoint)
CREATE POLICY categories_select_all ON public.categories
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow insert/update/delete for authenticated users (admin check done at backend)
CREATE POLICY categories_insert_authenticated ON public.categories
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY categories_update_authenticated ON public.categories
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY categories_delete_authenticated ON public.categories
    FOR DELETE
    TO authenticated
    USING (true);

-- Step 5: Create trigger for updated_at
CREATE TRIGGER categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Step 6: Grant permissions
GRANT SELECT ON public.categories TO anon;
GRANT ALL ON public.categories TO authenticated;
