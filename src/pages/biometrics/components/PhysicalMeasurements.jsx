import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PhysicalMeasurements = ({ formData, measurementUnit, onChange }) => {
  const convertHeightDisplay = (heightCm) => {
    if (!heightCm) return '';
    if (measurementUnit === 'imperial') {
      const totalInches = heightCm / 2.54;
      const feet = Math?.floor(totalInches / 12);
      const inches = Math?.round(totalInches % 12);
      return `${feet}ft ${inches}in`;
    }
    return `${heightCm} cm`;
  };

  const convertWeightDisplay = (weightKg) => {
    if (!weightKg) return '';
    if (measurementUnit === 'imperial') {
      return `${Math?.round(weightKg * 2.20462)} lbs`;
    }
    return `${weightKg} kg`;
  };

  const handleHeightChange = (value) => {
    if (measurementUnit === 'imperial') {
      // Convert feet and inches to cm
      const parts = value?.split?.(/[ft'"\s]+/)?.filter(p => p);
      if (parts?.length >= 2) {
        const feet = parseFloat(parts?.[0]) || 0;
        const inches = parseFloat(parts?.[1]) || 0;
        const totalInches = (feet * 12) + inches;
        const heightCm = totalInches * 2.54;
        onChange?.('height_cm', heightCm?.toFixed(1));
      }
    } else {
      onChange?.('height_cm', value);
    }
  };

  const handleWeightChange = (value) => {
    if (measurementUnit === 'imperial') {
      // Convert lbs to kg
      const weightKg = parseFloat(value) / 2.20462;
      onChange?.('weight_kg', weightKg?.toFixed(1));
    } else {
      onChange?.('weight_kg', value);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Ruler" size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Physical Measurements</h2>
          <p className="text-sm text-muted-foreground">Height and weight for accurate biomechanical analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Height {measurementUnit === 'imperial' ? '(feet, inches)' : '(cm)'}
          </label>
          <div className="relative">
            <Input
              type={measurementUnit === 'imperial' ? 'text' : 'number'}
              placeholder={measurementUnit === 'imperial' ? "e.g., 5ft 10in" : "e.g., 178"}
              value={
                measurementUnit === 'imperial' 
                  ? convertHeightDisplay(formData?.height_cm)?.replace('ft ', 'ft ')?.replace('in', 'in')
                  : formData?.height_cm || ''
              }
              onChange={(e) => handleHeightChange(e?.target?.value)}
              className="w-full pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-muted-foreground">
                {measurementUnit === 'imperial' ? 'ft/in' : 'cm'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {measurementUnit === 'imperial' ?'Format: 5ft 10in or 5\'10"' :'Height in centimeters'
            }
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Weight {measurementUnit === 'imperial' ? '(lbs)' : '(kg)'}
          </label>
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              min="20"
              max="500"
              placeholder={measurementUnit === 'imperial' ? "e.g., 154" : "e.g., 70"}
              value={
                measurementUnit === 'imperial' && formData?.weight_kg
                  ? Math?.round(formData?.weight_kg * 2.20462)
                  : measurementUnit === 'metric' 
                    ? formData?.weight_kg || '' :''
              }
              onChange={(e) => handleWeightChange(e?.target?.value)}
              className="w-full pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-muted-foreground">
                {measurementUnit === 'imperial' ? 'lbs' : 'kg'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Current weight for movement load calculations
          </p>
        </div>
      </div>

      {/* BMI Display */}
      {formData?.height_cm && formData?.weight_kg && (
        <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-card-foreground">Body Mass Index (BMI)</h4>
              <p className="text-xs text-muted-foreground">Calculated from height and weight</p>
            </div>
            <div className="text-right">
              {(() => {
                const height = parseFloat(formData?.height_cm);
                const weight = parseFloat(formData?.weight_kg);
                const bmi = weight / Math?.pow(height / 100, 2);
                const category = 
                  bmi < 18.5 ? 'Underweight' :
                  bmi < 25 ? 'Normal' :
                  bmi < 30 ? 'Overweight' : 'Obese';
                const color = 
                  bmi < 18.5 ? 'text-warning' :
                  bmi < 25 ? 'text-success' :
                  bmi < 30 ? 'text-warning' : 'text-destructive';

                return (
                  <div>
                    <span className="text-lg font-semibold text-card-foreground">
                      {bmi?.toFixed(1)}
                    </span>
                    <div className={`text-xs font-medium ${color}`}>
                      {category}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Target" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-card-foreground">Measurement Tips</h4>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• Measure height without shoes, standing straight</li>
              <li>• Weigh yourself at the same time of day consistently</li>
              <li>• Use the same scale and conditions for accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalMeasurements;