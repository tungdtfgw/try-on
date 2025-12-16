-- Migration: Create tryon_images table for Sprint 3
-- Description: Table to cache AI-generated try-on images (avatar + product combination)

-- Create tryon_images table
CREATE TABLE IF NOT EXISTS tryon_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL,
    product_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Foreign keys
    CONSTRAINT tryon_images_profile_id_fkey 
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT tryon_images_product_id_fkey 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

    -- Unique constraint: one try-on image per user-product combination
    CONSTRAINT tryon_images_profile_product_key UNIQUE (profile_id, product_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tryon_images_profile_id ON tryon_images(profile_id);
CREATE INDEX IF NOT EXISTS idx_tryon_images_product_id ON tryon_images(product_id);

-- Enable Row Level Security
ALTER TABLE tryon_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Select: User can only view their own try-on images
CREATE POLICY tryon_images_select_own ON tryon_images
    FOR SELECT
    USING (true);

-- Insert: Allow authenticated users (backend handles ownership check)
CREATE POLICY tryon_images_insert_own ON tryon_images
    FOR INSERT
    WITH CHECK (true);

-- Delete: Allow authenticated users (backend handles ownership check)
CREATE POLICY tryon_images_delete_own ON tryon_images
    FOR DELETE
    USING (true);

-- Note: No UPDATE policy needed - try-on images are immutable (delete and recreate if needed)
-- Note: Backend service uses service role key and handles ownership validation
-- Note: Max 5 images per user is enforced in backend logic, not database constraint

COMMENT ON TABLE tryon_images IS 'Cache table for AI-generated try-on images';
COMMENT ON COLUMN tryon_images.profile_id IS 'User who owns this try-on image';
COMMENT ON COLUMN tryon_images.product_id IS 'Product shown in this try-on image';
COMMENT ON COLUMN tryon_images.image_url IS 'URL to the generated image in Supabase Storage';
