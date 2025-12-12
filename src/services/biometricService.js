import { supabase } from '../lib/supabase';

// Biometric data management service
export const biometricService = {
  // Get user's biometric profile
  async getUserBiometrics(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')?.select(`id,age,height_cm,weight_kg,body_type,activity_level,body_fat_percentage,muscle_mass_kg,measurement_unit,injury_history,fitness_goals,medical_conditions,biometric_updated_at`)?.eq('id', userId)
        ?.single();

      if (error) {
        throw new Error(error?.message || 'Failed to fetch biometric data');
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message || 'An unexpected error occurred' };
    }
  },

  // Update user's biometric data
  async updateBiometrics(userId, biometricData) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update(biometricData)
        ?.eq('id', userId)
        ?.select();

      if (error) {
        throw new Error(error?.message || 'Failed to update biometric data');
      }

      return { data: data?.[0], error: null };
    } catch (error) {
      return { data: null, error: error?.message || 'An unexpected error occurred' };
    }
  },

  // Calculate BMI
  calculateBMI(heightCm, weightKg) {
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      return null;
    }
    
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math?.round(bmi * 10) / 10;
  },

  // Get BMI category
  getBMICategory(bmi) {
    if (!bmi) return 'Unknown';
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
    if (bmi >= 25 && bmi < 30) return 'Overweight';
    if (bmi >= 30) return 'Obese';
    
    return 'Unknown';
  },

  // Convert height between units
  convertHeight: {
    cmToImperial(heightCm) {
      if (!heightCm) return { feet: 0, inches: 0 };
      
      const totalInches = heightCm / 2.54;
      const feet = Math?.floor(totalInches / 12);
      const inches = Math?.round(totalInches % 12);
      
      return { feet, inches };
    },

    imperialToCm(feet, inches) {
      if (!feet && !inches) return 0;
      
      const totalInches = (feet || 0) * 12 + (inches || 0);
      return Math?.round(totalInches * 2.54 * 10) / 10;
    },

    formatImperial(heightCm) {
      const { feet, inches } = this.cmToImperial(heightCm);
      return `${feet}'${inches}"`;
    }
  },

  // Convert weight between units
  convertWeight: {
    kgToLbs(weightKg) {
      if (!weightKg) return 0;
      return Math?.round(weightKg * 2.20462 * 10) / 10;
    },

    lbsToKg(weightLbs) {
      if (!weightLbs) return 0;
      return Math?.round(weightLbs / 2.20462 * 10) / 10;
    }
  },

  // Calculate ideal weight range (Hamwi method)
  calculateIdealWeightRange(heightCm, gender = 'unspecified') {
    if (!heightCm) return null;

    const heightInches = heightCm / 2.54;
    const baseHeight = gender?.toLowerCase() === 'male' ? 60 : 60; // 5 feet
    const baseWeight = gender?.toLowerCase() === 'male' ? 48 : 45.5; // kg
    const weightPerInch = gender?.toLowerCase() === 'male' ? 2.7 : 2.2; // kg

    if (heightInches < baseHeight) return null;

    const idealWeight = baseWeight + (heightInches - baseHeight) * weightPerInch;
    const range = idealWeight * 0.1; // ±10%

    return {
      min: Math?.round((idealWeight - range) * 10) / 10,
      max: Math?.round((idealWeight + range) * 10) / 10,
      ideal: Math?.round(idealWeight * 10) / 10
    };
  },

  // Get fitness level based on activity level and body composition
  getFitnessLevel(activityLevel, bodyFatPercentage, age) {
    const activityScore = {
      sedentary: 1,
      lightly_active: 2,
      moderately_active: 3,
      very_active: 4,
      extremely_active: 5
    }?.[activityLevel] || 0;

    let bodyFatScore = 0;
    if (bodyFatPercentage) {
      if (bodyFatPercentage < 10) bodyFatScore = 5;
      else if (bodyFatPercentage < 15) bodyFatScore = 4;
      else if (bodyFatPercentage < 20) bodyFatScore = 3;
      else if (bodyFatPercentage < 25) bodyFatScore = 2;
      else bodyFatScore = 1;
    }

    const totalScore = (activityScore * 2 + bodyFatScore) / 3;

    if (totalScore >= 4.5) return 'Elite';
    if (totalScore >= 3.5) return 'Advanced';
    if (totalScore >= 2.5) return 'Intermediate';
    if (totalScore >= 1.5) return 'Beginner';
    return 'Sedentary';
  },

  // Validate biometric inputs
  validateBiometricData(data) {
    const errors = {};

    if (data?.age) {
      const age = parseInt(data?.age);
      if (isNaN(age) || age < 13 || age > 120) {
        errors.age = 'Age must be between 13 and 120 years';
      }
    }

    if (data?.height_cm) {
      const height = parseFloat(data?.height_cm);
      if (isNaN(height) || height < 100 || height > 250) {
        errors.height_cm = 'Height must be between 100 and 250 cm';
      }
    }

    if (data?.weight_kg) {
      const weight = parseFloat(data?.weight_kg);
      if (isNaN(weight) || weight < 20 || weight > 500) {
        errors.weight_kg = 'Weight must be between 20 and 500 kg';
      }
    }

    if (data?.body_fat_percentage) {
      const bf = parseFloat(data?.body_fat_percentage);
      if (isNaN(bf) || bf < 3 || bf > 50) {
        errors.body_fat_percentage = 'Body fat percentage must be between 3% and 50%';
      }
    }

    if (data?.muscle_mass_kg) {
      const muscle = parseFloat(data?.muscle_mass_kg);
      if (isNaN(muscle) || muscle < 10 || muscle > 100) {
        errors.muscle_mass_kg = 'Muscle mass must be between 10 and 100 kg';
      }
    }

    return {
      isValid: Object?.keys(errors)?.length === 0,
      errors
    };
  }
};

export default biometricService;