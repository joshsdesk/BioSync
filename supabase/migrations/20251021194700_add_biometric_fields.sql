-- Location: supabase/migrations/20251021194700_add_biometric_fields.sql
-- Schema Analysis: Extending existing user_profiles table with biometric data fields
-- Integration Type: Modificative - Adding columns to existing table
-- Dependencies: user_profiles table (existing)

-- Create enum types for biometric data
CREATE TYPE public.body_type AS ENUM ('ectomorph', 'mesomorph', 'endomorph', 'athletic', 'average');
CREATE TYPE public.activity_level AS ENUM ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active');
CREATE TYPE public.measurement_unit AS ENUM ('metric', 'imperial');

-- Add biometric columns to existing user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN age INTEGER,
ADD COLUMN height_cm DECIMAL(5,2),
ADD COLUMN weight_kg DECIMAL(5,2),
ADD COLUMN body_type public.body_type,
ADD COLUMN activity_level public.activity_level,
ADD COLUMN body_fat_percentage DECIMAL(4,2),
ADD COLUMN muscle_mass_kg DECIMAL(5,2),
ADD COLUMN measurement_unit public.measurement_unit DEFAULT 'metric'::public.measurement_unit,
ADD COLUMN injury_history TEXT,
ADD COLUMN fitness_goals TEXT,
ADD COLUMN medical_conditions TEXT,
ADD COLUMN biometric_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Add indexes for biometric queries
CREATE INDEX idx_user_profiles_body_type ON public.user_profiles(body_type);
CREATE INDEX idx_user_profiles_activity_level ON public.user_profiles(activity_level);
CREATE INDEX idx_user_profiles_biometric_updated ON public.user_profiles(biometric_updated_at);

-- Create function to calculate BMI
CREATE OR REPLACE FUNCTION public.calculate_bmi(height_cm_param DECIMAL, weight_kg_param DECIMAL)
RETURNS DECIMAL(4,2)
LANGUAGE sql
STABLE
AS $$
SELECT 
  CASE 
    WHEN height_cm_param > 0 AND weight_kg_param > 0 THEN
      ROUND((weight_kg_param / POWER(height_cm_param / 100, 2))::DECIMAL, 2)
    ELSE 
      NULL
  END;
$$;

-- Create function to get fitness category based on BMI
CREATE OR REPLACE FUNCTION public.get_fitness_category(bmi_value DECIMAL)
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
SELECT 
  CASE 
    WHEN bmi_value IS NULL THEN 'Unknown'
    WHEN bmi_value < 18.5 THEN 'Underweight'
    WHEN bmi_value >= 18.5 AND bmi_value < 25 THEN 'Normal weight'
    WHEN bmi_value >= 25 AND bmi_value < 30 THEN 'Overweight'
    WHEN bmi_value >= 30 THEN 'Obese'
    ELSE 'Unknown'
  END;
$$;

-- Create function to update biometric timestamp
CREATE OR REPLACE FUNCTION public.update_biometric_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only update timestamp if biometric fields are actually changed
  IF (OLD.age IS DISTINCT FROM NEW.age OR 
      OLD.height_cm IS DISTINCT FROM NEW.height_cm OR 
      OLD.weight_kg IS DISTINCT FROM NEW.weight_kg OR 
      OLD.body_type IS DISTINCT FROM NEW.body_type OR 
      OLD.activity_level IS DISTINCT FROM NEW.activity_level OR 
      OLD.body_fat_percentage IS DISTINCT FROM NEW.body_fat_percentage OR 
      OLD.muscle_mass_kg IS DISTINCT FROM NEW.muscle_mass_kg OR 
      OLD.measurement_unit IS DISTINCT FROM NEW.measurement_unit OR 
      OLD.injury_history IS DISTINCT FROM NEW.injury_history OR 
      OLD.fitness_goals IS DISTINCT FROM NEW.fitness_goals OR 
      OLD.medical_conditions IS DISTINCT FROM NEW.medical_conditions) THEN
    NEW.biometric_updated_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for biometric timestamp updates
CREATE TRIGGER trigger_update_biometric_timestamp
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_biometric_timestamp();

-- Add sample biometric data for existing users
DO $$
DECLARE
  existing_user_id UUID;
BEGIN
  -- Get first existing user ID
  SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
  
  IF existing_user_id IS NOT NULL THEN
    -- Update with sample biometric data
    UPDATE public.user_profiles 
    SET 
      age = 28,
      height_cm = 175.0,
      weight_kg = 70.0,
      body_type = 'athletic'::public.body_type,
      activity_level = 'very_active'::public.activity_level,
      body_fat_percentage = 12.5,
      muscle_mass_kg = 55.0,
      measurement_unit = 'metric'::public.measurement_unit,
      fitness_goals = 'Improve strength and endurance for competitive sports',
      biometric_updated_at = CURRENT_TIMESTAMP
    WHERE id = existing_user_id;
  END IF;
END $$;