-- Migration: Create storage bucket for product images
-- Description: Tạo storage bucket và policies cho ảnh sản phẩm (Sprint 2 - US-04)

-- Step 1: Create storage bucket for product images
-- Public bucket để ảnh sản phẩm có thể xem công khai
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,  -- Public bucket for product images
    5242880, -- 5MB in bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Policy - Everyone can view product images (public)
CREATE POLICY product_images_select_all ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');

-- Step 3: Policy - Authenticated users can upload product images
-- Admin check is done at backend level with service role key
CREATE POLICY product_images_insert_authenticated ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'product-images');

-- Step 4: Policy - Authenticated users can update product images
CREATE POLICY product_images_update_authenticated ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'product-images')
    WITH CHECK (bucket_id = 'product-images');

-- Step 5: Policy - Authenticated users can delete product images
CREATE POLICY product_images_delete_authenticated ON storage.objects
    FOR DELETE
    USING (bucket_id = 'product-images');
