import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PersonalInfo = ({ formData, onChange }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="User" size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground">Basic demographic and physical data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Age
          </label>
          <Input
            type="number"
            min="13"
            max="120"
            placeholder="Enter your age"
            value={formData?.age || ''}
            onChange={(e) => onChange?.('age', e?.target?.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used for age-specific analysis recommendations
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Body Type
          </label>
          <Select
            value={formData?.body_type || ''}
            onValueChange={(value) => onChange?.('body_type', value)}
            placeholder="Select body type"
          >
            <option value="">Select body type</option>
            <option value="ectomorph">Ectomorph (Lean, narrow frame)</option>
            <option value="mesomorph">Mesomorph (Athletic, muscular)</option>
            <option value="endomorph">Endomorph (Larger frame, higher body fat)</option>
            <option value="athletic">Athletic (Trained, low body fat)</option>
            <option value="average">Average (Typical build)</option>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Helps customize movement analysis patterns
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-card-foreground mb-2">
          Activity Level
        </label>
        <Select
          value={formData?.activity_level || ''}
          onValueChange={(value) => onChange?.('activity_level', value)}
          placeholder="Select activity level"
        >
          <option value="">Select activity level</option>
          <option value="sedentary">Sedentary (Little to no exercise)</option>
          <option value="lightly_active">Lightly Active (Light exercise 1-3 days/week)</option>
          <option value="moderately_active">Moderately Active (Moderate exercise 3-5 days/week)</option>
          <option value="very_active">Very Active (Hard exercise 6-7 days/week)</option>
          <option value="extremely_active">Extremely Active (Very hard exercise, physical job)</option>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Influences recommended training intensity and recovery times
        </p>
      </div>

      <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-card-foreground">Privacy Notice</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Your personal data is securely stored and used only to enhance analysis accuracy. 
              This information helps our AI provide personalized biomechanical insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;