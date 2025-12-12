import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const BodyComposition = ({ formData, onChange }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Activity" size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Body Composition</h2>
          <p className="text-sm text-muted-foreground">Advanced metrics for detailed analysis (optional)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Body Fat Percentage
          </label>
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              min="3"
              max="50"
              placeholder="e.g., 15.5"
              value={formData?.body_fat_percentage || ''}
              onChange={(e) => onChange?.('body_fat_percentage', e?.target?.value)}
              className="w-full pr-8"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Use DEXA, BodPod, or similar method for accuracy
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Muscle Mass (kg)
          </label>
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              min="10"
              max="100"
              placeholder="e.g., 45.2"
              value={formData?.muscle_mass_kg || ''}
              onChange={(e) => onChange?.('muscle_mass_kg', e?.target?.value)}
              className="w-full pr-8"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-muted-foreground">kg</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Lean muscle mass for power calculations
          </p>
        </div>
      </div>

      {/* Body Composition Analysis */}
      {(formData?.body_fat_percentage || formData?.muscle_mass_kg) && (
        <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <h4 className="text-sm font-medium text-card-foreground mb-3">Composition Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData?.body_fat_percentage && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Body Fat</span>
                  <span className="text-xs font-medium">
                    {(() => {
                      const bf = parseFloat(formData?.body_fat_percentage);
                      if (bf < 6) return 'Essential Fat';
                      if (bf < 14) return 'Athletic';
                      if (bf < 18) return 'Fitness';
                      if (bf < 25) return 'Average';
                      return 'Above Average';
                    })()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-primary transition-all duration-300"
                    style={{ 
                      width: `${Math?.min(parseFloat(formData?.body_fat_percentage) * 2, 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {formData?.muscle_mass_kg && formData?.weight_kg && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Muscle Mass Ratio</span>
                  <span className="text-xs font-medium">
                    {((parseFloat(formData?.muscle_mass_kg) / parseFloat(formData?.weight_kg)) * 100)?.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-success transition-all duration-300"
                    style={{ 
                      width: `${Math?.min((parseFloat(formData?.muscle_mass_kg) / parseFloat(formData?.weight_kg)) * 100 * 2, 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Measurement Methods Info */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-card-foreground">Measurement Methods</h4>
            <div className="text-xs text-muted-foreground mt-1 space-y-1">
              <div><strong>Most Accurate:</strong> DEXA scan, BodPod, Hydrostatic weighing</div>
              <div><strong>Good:</strong> Bioelectrical impedance (quality scale)</div>
              <div><strong>Estimate:</strong> Calipers, visual assessment</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <Icon name="Lock" size={12} className="inline mr-1" />
          Body composition data is optional but enhances personalized recommendations for training intensity and recovery.
        </p>
      </div>
    </div>
  );
};

export default BodyComposition;