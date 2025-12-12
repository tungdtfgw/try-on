-- Migration: Create storage bucket for body photos
-- Description: Tạo storage bucket và policies cho ảnh toàn thân (US-02)

-- Create storage bucket for body photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'body-photos',
    'body-photos',
    false,
    5242880, -- 5MB in bytes
    ARRAY['image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can view their own photos
CREATE POLICY body_photos_select_own ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'body-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can upload to their own folder
CREATE POLICY body_photos_insert_own ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'body-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can update their own photos
CREATE POLICY body_photos_update_own ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'body-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
        bucket_id = 'body-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can delete their own photos
CREATE POLICY body_photos_delete_own ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'body-photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
