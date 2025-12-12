import React from 'react';
import Icon from '../../../components/AppIcon';

const BiometricSummary = ({ formData, measurementUnit, bmi, bmiCategory, profileData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never updated';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const convertHeight = (heightCm) => {
    if (!heightCm) return 'Not set';
    if (measurementUnit === 'imperial') {
      const totalInches = heightCm / 2.54;
      const feet = Math?.floor(totalInches / 12);
      const inches = Math?.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
    return `${heightCm} cm`;
  };

  const convertWeight = (weightKg) => {
    if (!weightKg) return 'Not set';
    if (measurementUnit === 'imperial') {
      return `${Math?.round(weightKg * 2.20462)} lbs`;
    }
    return `${weightKg} kg`;
  };

  const getBmiColor = (category) => {
    switch (category) {
      case 'Normal weight': return 'text-success';
      case 'Underweight': return 'text-warning';
      case 'Overweight': return 'text-warning';
      case 'Obese': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityLevelIcon = (level) => {
    switch (level) {
      case 'sedentary': return 'Circle';
      case 'lightly_active': return 'Zap';
      case 'moderately_active': return 'Target';
      case 'very_active': return 'Flame';
      case 'extremely_active': return 'Rocket';
      default: return 'Activity';
    }
  };

  const formatActivityLevel = (level) => {
    if (!level) return 'Not set';
    return level?.split('_')?.map(word =>
      word?.charAt(0)?.toUpperCase() + word?.slice(1)
    )?.join(' ');
  };

  const formatBodyType = (type) => {
    if (!type) return 'Not set';
    return type?.charAt(0)?.toUpperCase() + type?.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={16} className="text-primary" />
          </div>
          <h3 className="font-semibold text-card-foreground">Quick Stats</h3>
        </div>

        <div className="space-y-4">
          {/* Basic Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-card-foreground">
                {formData?.age || '—'}
              </div>
              <div className="text-xs text-muted-foreground">Age</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-card-foreground">
                {convertHeight(formData?.height_cm)?.split(' ')?.[0] || '—'}
              </div>
              <div className="text-xs text-muted-foreground">
                Height {measurementUnit === 'imperial' ? '(ft)' : '(cm)'}
              </div>
            </div>
          </div>

          {/* Weight and BMI */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-card-foreground">
                {convertWeight(formData?.weight_kg)?.split(' ')?.[0] || '—'}
              </div>
              <div className="text-xs text-muted-foreground">
                Weight {measurementUnit === 'imperial' ? '(lbs)' : '(kg)'}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-lg font-semibold ${getBmiColor(bmiCategory)}`}>
                {bmi || '—'}
              </div>
              <div className="text-xs text-muted-foreground">BMI</div>
            </div>
          </div>

          {/* BMI Category */}
          {bmi && (
            <div className="text-center p-3 bg-accent/5 border border-accent/20 rounded-lg">
              <div className={`text-sm font-medium ${getBmiColor(bmiCategory)}`}>
                {bmiCategory}
              </div>
              <div className="text-xs text-muted-foreground mt-1">BMI Category</div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={16} className="text-primary" />
          </div>
          <h3 className="font-semibold text-card-foreground">Profile Overview</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Body Type</span>
            </div>
            <span className="text-sm font-medium text-card-foreground">
              {formatBodyType(formData?.body_type)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon
                name={getActivityLevelIcon(formData?.activity_level)}
                size={14}
                className="text-muted-foreground"
              />
              <span className="text-sm text-muted-foreground">Activity Level</span>
            </div>
            <span className="text-sm font-medium text-card-foreground">
              {formatActivityLevel(formData?.activity_level)}
            </span>
          </div>

          {formData?.body_fat_percentage && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Percent" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Body Fat</span>
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {formData?.body_fat_percentage}%
              </span>
            </div>
          )}

          {formData?.muscle_mass_kg && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Icon name="Dumbbell" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Muscle Mass</span>
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {formData?.muscle_mass_kg} kg
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last Updated</span>
          </div>
          <span className="text-sm font-medium text-card-foreground">
            {formatDate(profileData?.biometric_updated_at)}
          </span>
        </div>
      </div>

      {/* Analysis Impact */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-card-foreground">Analysis Enhancement</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Complete biometric data enables personalized movement analysis,
              injury risk assessment, and performance optimization recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricSummary;