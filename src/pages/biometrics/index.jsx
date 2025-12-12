import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import Icon from '../../components/AppIcon';
import PersonalInfo from './components/PersonalInfo';
import PhysicalMeasurements from './components/PhysicalMeasurements';
import BodyComposition from './components/BodyComposition';
import FitnessProfile from './components/FitnessProfile';
import ProgressIndicator from './components/ProgressIndicator';
import BiometricSummary from './components/BiometricSummary';

const BiometricsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [measurementUnit, setMeasurementUnit] = useState('metric');

  const [formData, setFormData] = useState({
    age: '',
    height_cm: '',
    weight_kg: '',
    body_type: '',
    activity_level: '',
    body_fat_percentage: '',
    muscle_mass_kg: '',
    measurement_unit: 'metric',
    injury_history: '',
    fitness_goals: '',
    medical_conditions: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', user?.id)
        ?.single();

      if (error) {
        setError(error?.message || 'Failed to load profile data');
        return;
      }

      setProfileData(data);
      setMeasurementUnit(data?.measurement_unit || 'metric');
      
      // Populate form with existing data
      setFormData({
        age: data?.age || '',
        height_cm: data?.height_cm || '',
        weight_kg: data?.weight_kg || '',
        body_type: data?.body_type || '',
        activity_level: data?.activity_level || '',
        body_fat_percentage: data?.body_fat_percentage || '',
        muscle_mass_kg: data?.muscle_mass_kg || '',
        measurement_unit: data?.measurement_unit || 'metric',
        injury_history: data?.injury_history || '',
        fitness_goals: data?.fitness_goals || '',
        medical_conditions: data?.medical_conditions || ''
      });
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionPercentage = () => {
    const fields = ['age', 'height_cm', 'weight_kg', 'body_type', 'activity_level'];
    const filledFields = fields?.filter(field => formData?.[field] && formData?.[field] !== '');
    return Math?.round((filledFields?.length / fields?.length) * 100);
  };

  const convertHeight = (heightCm, unit) => {
    if (!heightCm) return '';
    if (unit === 'imperial') {
      const totalInches = heightCm / 2.54;
      const feet = Math?.floor(totalInches / 12);
      const inches = Math?.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
    return `${heightCm} cm`;
  };

  const convertWeight = (weightKg, unit) => {
    if (!weightKg) return '';
    if (unit === 'imperial') {
      return `${Math?.round(weightKg * 2.20462)} lbs`;
    }
    return `${weightKg} kg`;
  };

  const calculateBMI = () => {
    const height = parseFloat(formData?.height_cm);
    const weight = parseFloat(formData?.weight_kg);
    if (height && weight && height > 0) {
      return (weight / Math?.pow(height / 100, 2))?.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return 'Unknown';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUnitToggle = (unit) => {
    setMeasurementUnit(unit);
    handleInputChange('measurement_unit', unit);
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        ?.from('user_profiles')
        ?.update({
          age: formData?.age ? parseInt(formData?.age) : null,
          height_cm: formData?.height_cm ? parseFloat(formData?.height_cm) : null,
          weight_kg: formData?.weight_kg ? parseFloat(formData?.weight_kg) : null,
          body_type: formData?.body_type || null,
          activity_level: formData?.activity_level || null,
          body_fat_percentage: formData?.body_fat_percentage ? parseFloat(formData?.body_fat_percentage) : null,
          muscle_mass_kg: formData?.muscle_mass_kg ? parseFloat(formData?.muscle_mass_kg) : null,
          measurement_unit: formData?.measurement_unit,
          injury_history: formData?.injury_history || null,
          fitness_goals: formData?.fitness_goals || null,
          medical_conditions: formData?.medical_conditions || null
        })
        ?.eq('id', user?.id);

      if (error) {
        setError(error?.message || 'Failed to save biometric data');
        return;
      }

      setSuccess('Biometric data saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Reload profile data to get updated timestamps
      await loadProfileData();
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-header px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader2" size={32} className="animate-spin text-primary" />
              <span className="ml-3 text-lg text-muted-foreground">Loading biometric data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-header px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Biometric Data</h1>
                <p className="text-muted-foreground">
                  Manage your physical characteristics for enhanced AI analysis accuracy
                </p>
              </div>
            </div>
            
            <ProgressIndicator 
              completionPercentage={calculateCompletionPercentage()}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator?.clipboard?.writeText(error)}
                  className="ml-auto text-xs"
                >
                  Copy Error
                </Button>
              </div>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-success">{success}</span>
              </div>
            </div>
          )}

          {/* Measurement Unit Toggle */}
          <div className="mb-8 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground">Measurement Units</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred unit system</p>
              </div>
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => handleUnitToggle('metric')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    measurementUnit === 'metric' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Metric
                </button>
                <button
                  onClick={() => handleUnitToggle('imperial')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    measurementUnit === 'imperial' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Input Forms */}
            <div className="lg:col-span-2 space-y-6">
              <PersonalInfo 
                formData={formData}
                onChange={handleInputChange}
              />
              
              <PhysicalMeasurements 
                formData={formData}
                measurementUnit={measurementUnit}
                onChange={handleInputChange}
              />
              
              <BodyComposition 
                formData={formData}
                onChange={handleInputChange}
              />
              
              <FitnessProfile 
                formData={formData}
                onChange={handleInputChange}
              />
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              <BiometricSummary 
                formData={formData}
                measurementUnit={measurementUnit}
                bmi={calculateBMI()}
                bmiCategory={getBMICategory(calculateBMI())}
                profileData={profileData}
              />

              {/* Save Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-medium text-card-foreground mb-4">Save Changes</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? (
                      <>
                        <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Icon name="Save" size={16} className="mr-2" />
                        Save Biometric Data
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Changes will be applied to future analysis sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricsPage;