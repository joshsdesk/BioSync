-- Location: supabase/migrations/20250121164648_sports_analysis_platform.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete sports analysis platform
-- Dependencies: None - fresh project

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'coach', 'athlete');
CREATE TYPE public.sport_category AS ENUM (
    'basketball', 'tennis', 'golf', 'soccer', 'baseball', 'swimming', 
    'running', 'weightlifting', 'volleyball', 'gymnastics', 'martial_arts',
    'boxing', 'cycling', 'track_field', 'custom'
);
CREATE TYPE public.analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE public.session_type AS ENUM ('training', 'competition', 'practice', 'assessment');

-- 2. Core Tables
-- User profiles table (intermediary for auth)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'athlete'::public.user_role,
    bio TEXT,
    profile_image_url TEXT,
    phone TEXT,
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Sports management
CREATE TABLE public.sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category public.sport_category NOT NULL,
    description TEXT,
    movement_focus TEXT[], -- Array of movement types to analyze
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Analysis sessions
CREATE TABLE public.analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    sport_id UUID REFERENCES public.sports(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    session_type public.session_type DEFAULT 'training'::public.session_type,
    video_url TEXT, -- Storage path for uploaded video
    thumbnail_url TEXT, -- Storage path for video thumbnail
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    status public.analysis_status DEFAULT 'pending'::public.analysis_status,
    ai_analysis JSONB, -- Structured AI analysis results
    biomechanical_score INTEGER CHECK (biomechanical_score >= 0 AND biomechanical_score <= 100),
    focus_areas TEXT[], -- Areas user wants to focus on
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Session feedback and coaching notes
CREATE TABLE public.session_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    improvement_suggestions TEXT[],
    drill_recommendations TEXT[],
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Custom sports created by users
CREATE TABLE public.custom_sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    movement_types TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Analysis history and progress tracking
CREATE TABLE public.progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    sport_id UUID REFERENCES public.sports(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL, -- e.g., "knee_tracking", "posture_score"
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit TEXT, -- e.g., "degrees", "percentage", "seconds"
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_sports_category ON public.sports(category);
CREATE INDEX idx_sports_is_custom ON public.sports(is_custom);
CREATE INDEX idx_analysis_sessions_user_id ON public.analysis_sessions(user_id);
CREATE INDEX idx_analysis_sessions_sport_id ON public.analysis_sessions(sport_id);
CREATE INDEX idx_analysis_sessions_status ON public.analysis_sessions(status);
CREATE INDEX idx_analysis_sessions_created_at ON public.analysis_sessions(created_at);
CREATE INDEX idx_session_feedback_session_id ON public.session_feedback(session_id);
CREATE INDEX idx_session_feedback_coach_id ON public.session_feedback(coach_id);
CREATE INDEX idx_custom_sports_user_id ON public.custom_sports(user_id);
CREATE INDEX idx_progress_tracking_user_id ON public.progress_tracking(user_id);
CREATE INDEX idx_progress_tracking_sport_id ON public.progress_tracking(sport_id);

-- 4. Storage Buckets
-- Private bucket for training videos (user-specific access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'training-videos',
    'training-videos',
    false,
    524288000, -- 500MB limit per video
    ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);

-- Private bucket for thumbnails and processed content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'video-thumbnails',
    'video-thumbnails',
    false,
    10485760, -- 10MB limit for thumbnails
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Public bucket for profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-images',
    'profile-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

-- Function to get user's sport preferences
CREATE OR REPLACE FUNCTION public.get_user_sports_summary(user_uuid UUID)
RETURNS TABLE(
    total_sessions INTEGER,
    favorite_sport TEXT,
    average_score DECIMAL
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $func$
SELECT 
    COUNT(*)::INTEGER as total_sessions,
    s.name as favorite_sport,
    AVG(asa.biomechanical_score)::DECIMAL as average_score
FROM public.analysis_sessions asa
JOIN public.sports s ON asa.sport_id = s.id
WHERE asa.user_id = user_uuid
GROUP BY s.name
ORDER BY COUNT(*) DESC
LIMIT 1;
$func$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'athlete'::public.user_role)
    );
    RETURN NEW;
END;
$func$;

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies using correct patterns

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, private write for sports
CREATE POLICY "public_can_read_sports"
ON public.sports
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_users_manage_sports"
ON public.sports
FOR ALL
TO authenticated
USING (created_by = auth.uid() OR created_by IS NULL)
WITH CHECK (created_by = auth.uid());

-- Pattern 2: Simple user ownership for analysis sessions
CREATE POLICY "users_manage_own_analysis_sessions"
ON public.analysis_sessions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for custom sports
CREATE POLICY "users_manage_own_custom_sports"
ON public.custom_sports
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for progress tracking
CREATE POLICY "users_manage_own_progress_tracking"
ON public.progress_tracking
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Complex policy for session feedback (coaches can give feedback)
CREATE POLICY "users_view_session_feedback"
ON public.session_feedback
FOR SELECT
TO authenticated
USING (
    coach_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.analysis_sessions asa 
        WHERE asa.id = session_id AND asa.user_id = auth.uid()
    )
);

CREATE POLICY "coaches_create_session_feedback"
ON public.session_feedback
FOR INSERT
TO authenticated
WITH CHECK (coach_id = auth.uid());

CREATE POLICY "coaches_manage_own_feedback"
ON public.session_feedback
FOR UPDATE
TO authenticated
USING (coach_id = auth.uid())
WITH CHECK (coach_id = auth.uid());

CREATE POLICY "coaches_delete_own_feedback"
ON public.session_feedback
FOR DELETE
TO authenticated
USING (coach_id = auth.uid());

-- 8. Storage RLS Policies

-- Private training videos - only uploader can access
CREATE POLICY "users_view_own_training_videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'training-videos' AND owner = auth.uid());

CREATE POLICY "users_upload_training_videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'training-videos' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_training_videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'training-videos' AND owner = auth.uid())
WITH CHECK (bucket_id = 'training-videos' AND owner = auth.uid());

CREATE POLICY "users_delete_own_training_videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'training-videos' AND owner = auth.uid());

-- Private video thumbnails
CREATE POLICY "users_view_own_thumbnails"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'video-thumbnails' AND owner = auth.uid());

CREATE POLICY "users_upload_thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'video-thumbnails'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_manage_own_thumbnails"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'video-thumbnails' AND owner = auth.uid())
WITH CHECK (bucket_id = 'video-thumbnails' AND owner = auth.uid());

-- Public profile images
CREATE POLICY "public_can_view_profile_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

CREATE POLICY "authenticated_users_upload_profile_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "users_manage_profile_images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'profile-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'profile-images' AND owner = auth.uid());

-- 9. Triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analysis_sessions_updated_at
    BEFORE UPDATE ON public.analysis_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Default Sports Data
DO $$
DECLARE
    basketball_id UUID := gen_random_uuid();
    tennis_id UUID := gen_random_uuid();
    weightlifting_id UUID := gen_random_uuid();
    running_id UUID := gen_random_uuid();
    golf_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO public.sports (id, name, category, description, movement_focus, is_custom) VALUES
        (basketball_id, 'Basketball', 'basketball', 'Shooting, dribbling, defensive moves and court positioning', 
         ARRAY['shooting_form', 'dribbling_technique', 'defensive_stance', 'jumping_mechanics'], false),
        (tennis_id, 'Tennis', 'tennis', 'Serves, forehands, backhands and court movement',
         ARRAY['serve_technique', 'forehand_form', 'backhand_form', 'footwork', 'swing_path'], false),
        (weightlifting_id, 'Weightlifting', 'weightlifting', 'Squat, deadlift, bench press and Olympic lifts',
         ARRAY['squat_depth', 'deadlift_form', 'bench_technique', 'spine_alignment', 'knee_tracking'], false),
        (running_id, 'Running', 'running', 'Gait analysis, form correction and efficiency',
         ARRAY['stride_length', 'foot_strike', 'posture', 'arm_swing', 'cadence'], false),
        (golf_id, 'Golf', 'golf', 'Swing analysis, putting technique and stance',
         ARRAY['swing_plane', 'tempo', 'impact_position', 'follow_through', 'stance'], false);
END $$;

-- 11. Mock Data for Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    coach_uuid UUID := gen_random_uuid();
    athlete_uuid UUID := gen_random_uuid();
    basketball_sport_id UUID;
    session_id UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@sportsanalyzer.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sports Admin", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (coach_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'coach@sportsanalyzer.com', crypt('coach123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Coach", "role": "coach"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (athlete_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'athlete@sportsanalyzer.com', crypt('athlete123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Athlete", "role": "athlete"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Get basketball sport ID
    SELECT id INTO basketball_sport_id FROM public.sports WHERE name = 'Basketball';

    -- Create sample analysis session
    INSERT INTO public.analysis_sessions (
        id, user_id, sport_id, title, description, session_type, 
        status, biomechanical_score, focus_areas, ai_analysis
    ) VALUES (
        session_id, athlete_uuid, basketball_sport_id, 
        'Free Throw Practice Session', 
        'Working on consistent free throw form and follow-through',
        'practice', 'completed', 87,
        ARRAY['shooting_form', 'follow_through', 'stance'],
        '{"movement_analysis": {"shooting_form": 8.7, "balance": 9.2, "follow_through": 8.1}, "recommendations": ["Focus on elbow alignment", "Extend follow-through duration"]}'::jsonb
    );

    -- Create sample feedback
    INSERT INTO public.session_feedback (
        session_id, coach_id, feedback_text, improvement_suggestions, 
        drill_recommendations, rating
    ) VALUES (
        session_id, coach_uuid,
        'Great improvement in shooting consistency! Your form has much better balance now.',
        ARRAY['Work on consistent elbow positioning', 'Focus on smooth release'],
        ARRAY['50 free throws daily', 'Wall shooting drills', 'Balance board exercises'],
        4
    );

    -- Create sample progress tracking
    INSERT INTO public.progress_tracking (user_id, sport_id, session_id, metric_name, metric_value, metric_unit)
    VALUES 
        (athlete_uuid, basketball_sport_id, session_id, 'shooting_accuracy', 87.5, 'percentage'),
        (athlete_uuid, basketball_sport_id, session_id, 'elbow_alignment', 8.7, 'score'),
        (athlete_uuid, basketball_sport_id, session_id, 'follow_through_consistency', 8.1, 'score');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 12. Cleanup Function for Development
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@sportsanalyzer.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.progress_tracking WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.session_feedback WHERE coach_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.analysis_sessions WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.custom_sports WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$func$;