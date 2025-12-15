-- Migration: Create products table
-- Description: Tạo bảng products cho quản lý sản phẩm (Sprint 2 - US-04)

-- Step 1: Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id UUID NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Constraints
    CONSTRAINT products_name_length CHECK (LENGTH(TRIM(name)) BETWEEN 1 AND 200),
    CONSTRAINT products_price_positive CHECK (price > 0),
    CONSTRAINT products_description_length CHECK (description IS NULL OR LENGTH(description) <= 1000),
    
    -- Foreign Key
    CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) 
        REFERENCES public.categories(id) ON DELETE RESTRICT
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Step 3: Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- Allow everyone to read products (public endpoint)
CREATE POLICY products_select_all ON public.products
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow insert/update/delete for authenticated users (admin check done at backend)
CREATE POLICY products_insert_authenticated ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY products_update_authenticated ON public.products
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY products_delete_authenticated ON public.products
    FOR DELETE
    TO authenticated
    USING (true);

-- Step 5: Create trigger for updated_at
CREATE TRIGGER products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Step 6: Grant permissions
GRANT SELECT ON public.products TO anon;
GRANT ALL ON public.products TO authenticated;
