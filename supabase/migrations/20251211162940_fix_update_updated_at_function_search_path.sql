-- Location: supabase/migrations/20251211162940_fix_update_updated_at_function_search_path.sql
-- Purpose: Fix security lint error for update_updated_at_column function by setting fixed search_path
-- Issue: Function has role mutable search_path, which can lead to security vulnerabilities
-- Solution: Set explicit search_path to public, pg_catalog to ensure deterministic object resolution

-- Recreate function with fixed search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

-- Add comment explaining the security fix
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger function to automatically update updated_at timestamp. Fixed search_path set to prevent security vulnerabilities from mutable search_path.';