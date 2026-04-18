-- ============================================
-- ARCHIVE — DATABASE MIGRATION LOG
-- ============================================

-- DATE: 2026-04-16
-- Project: Archive (shoparchive.pro)
-- Database: Supabase (otlqamyuzkslsnpohijp)

-- ============================================
-- STEP 1 — CREATE INVENTORY TABLE
-- ============================================

CREATE TABLE inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  subcategory text,
  price numeric NOT NULL,
  condition text,
  size text,
  brand text,
  location text,
  status text DEFAULT 'available',
  image_url text,
  source text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- STEP 2 — DISABLE ROW LEVEL SECURITY ON INVENTORY
-- Allows anonymous read/write access
-- ============================================

ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3 — STORAGE POLICY FOR PRODUCT IMAGES
-- Allows anonymous upload and read of photos
-- ============================================

CREATE POLICY "allow all storage for anon"
ON storage.objects
FOR ALL
TO anon
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- ============================================
-- STEP 4 — CREATE CATEGORIES TABLE
-- ============================================

CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  subcategories text[],
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- STEP 5 — SEED BASE CATEGORIES
-- Note: DELETE FROM categories was run first
-- to clear earlier test data before this insert
-- ============================================

INSERT INTO categories (name) VALUES
('Footwear'),
('Apparel'),
('Video Games'),
('Toys'),
('Audio');

-- ============================================
-- NOTES
-- Storage bucket 'product-images' created manually
-- in Supabase dashboard as a public bucket
-- RLS policies also added via dashboard UI for
-- storage bucket (SELECT, INSERT, UPDATE, DELETE)
-- ============================================
