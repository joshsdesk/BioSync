import React from 'react';
import Icon from '../../../components/AppIcon';

const FitnessProfile = ({ formData, onChange }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Target" size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Fitness Profile</h2>
          <p className="text-sm text-muted-foreground">Goals, history, and medical considerations</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Fitness Goals
          </label>
          <textarea
            placeholder="Describe your fitness and training goals (e.g., improve strength, increase endurance, weight loss, sport-specific training...)"
            value={formData?.fitness_goals || ''}
            onChange={(e) => onChange?.('fitness_goals', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Helps customize analysis recommendations for your objectives
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Injury History
          </label>
          <textarea
            placeholder="List any past injuries, chronic conditions, or areas of concern (e.g., previous knee surgery, lower back pain, shoulder impingement...)"
            value={formData?.injury_history || ''}
            onChange={(e) => onChange?.('injury_history', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Important for identifying potential movement compensations
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Medical Conditions
          </label>
          <textarea
            placeholder="Any relevant medical conditions or limitations (e.g., diabetes, high blood pressure, joint restrictions, medications affecting performance...)"
            value={formData?.medical_conditions || ''}
            onChange={(e) => onChange?.('medical_conditions', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Ensures safe and appropriate exercise recommendations
          </p>
        </div>
      </div>

      {/* Quick Goal Templates */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Quick Goal Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'Weight Loss', icon: 'TrendingDown', goal: 'Lose weight through improved nutrition and increased cardiovascular fitness while maintaining muscle mass' },
            { label: 'Strength Building', icon: 'Dumbbell', goal: 'Increase overall strength and muscle mass through progressive resistance training' },
            { label: 'Endurance Training', icon: 'Zap', goal: 'Improve cardiovascular endurance and stamina for long-duration activities' },
            { label: 'Sport Performance', icon: 'Trophy', goal: 'Enhance sport-specific skills, agility, and performance for competitive athletics' },
            { label: 'Injury Recovery', icon: 'Heart', goal: 'Safely return to activity following injury with focus on rehabilitation and prevention' },
            { label: 'General Fitness', icon: 'Activity', goal: 'Maintain overall health and fitness with balanced strength, cardio, and flexibility training' }
          ]?.map((template) => (
            <button
              key={template?.label}
              onClick={() => onChange?.('fitness_goals', template?.goal)}
              className="flex items-center space-x-2 p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors text-sm"
            >
              <Icon name={template?.icon} size={16} className="text-primary flex-shrink-0" />
              <span className="font-medium text-card-foreground">{template?.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-card-foreground">Medical Disclaimer</h4>
            <p className="text-xs text-muted-foreground mt-1">
              This information is for fitness analysis purposes only and is not a substitute for professional medical advice. 
              Always consult with healthcare providers before starting new exercise programs, especially if you have medical conditions or injuries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessProfile;