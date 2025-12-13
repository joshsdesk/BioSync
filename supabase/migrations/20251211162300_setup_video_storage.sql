-- Migration: Setup Video Storage for BioSync
-- Creates storage buckets for training videos and thumbnails

-- ============================================
-- STORAGE BUCKETS SETUP
-- ============================================

-- Create private bucket for training videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'training-videos',
  'training-videos',
  false, -- PRIVATE - users can only access their own videos
  524288000, -- 500MB file size limit
  ARRAY[
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/avi',
    'video/webm',
    'video/x-matroska'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create private bucket for video thumbnails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'video-thumbnails',
  'video-thumbnails',
  false, -- PRIVATE - thumbnails for user's own videos
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create public bucket for profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true, -- PUBLIC - profile images can be viewed by anyone
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Training Videos Bucket Policies
-- Users can upload their own videos
CREATE POLICY "users_upload_own_videos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'training-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own videos
CREATE POLICY "users_view_own_videos" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'training-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own videos
CREATE POLICY "users_update_own_videos" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'training-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own videos
CREATE POLICY "users_delete_own_videos" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'training-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Video Thumbnails Bucket Policies
-- Users can upload their own thumbnails
CREATE POLICY "users_upload_own_thumbnails" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'video-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own thumbnails
CREATE POLICY "users_view_own_thumbnails" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'video-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own thumbnails
CREATE POLICY "users_delete_own_thumbnails" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'video-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Profile Images Bucket Policies
-- Authenticated users can upload profile images
CREATE POLICY "authenticated_upload_profile_images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-images');

-- Anyone can view profile images (public bucket)
CREATE POLICY "public_view_profile_images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profile-images');

-- Users can delete their own profile images
CREATE POLICY "users_delete_own_profile_images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'profile-images' AND
  name LIKE 'profiles/' || auth.uid()::text || '%'
);