import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

export const AnalysisPreferencesSection = () => {
  const [preferences, setPreferences] = useState({
    defaultSport: 'basketball',
    feedbackIntensity: 70,
    coachingVoice: 'professional',
    measurementUnit: 'metric',
    autoAnalysis: true,
    detailedReports: true,
    videoQuality: 'high'
  });

  const sportOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'football', label: 'Football' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'golf', label: 'Golf' },
    { value: 'running', label: 'Running' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'cycling', label: 'Cycling' }
  ];

  const coachingVoiceOptions = [
    { value: 'encouraging', label: 'Encouraging' },
    { value: 'professional', label: 'Professional' },
    { value: 'direct', label: 'Direct' },
    { value: 'motivational', label: 'Motivational' }
  ];

  const measurementOptions = [
    { value: 'metric', label: 'Metric (cm, kg)' },
    { value: 'imperial', label: 'Imperial (in, lbs)' }
  ];

  const videoQualityOptions = [
    { value: 'low', label: 'Low (480p)' },
    { value: 'medium', label: 'Medium (720p)' },
    { value: 'high', label: 'High (1080p)' },
    { value: 'ultra', label: 'Ultra (4K)' }
  ];

  const handleSliderChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Analysis Preferences</h2>
        <Button variant="outline" size="sm">
          <Icon name="Check" size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Default Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Default Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Default Sport
            </label>
            <Select
              value={preferences?.defaultSport}
              onValueChange={(value) => setPreferences({...preferences, defaultSport: value})}
            >
              {sportOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">Pre-selected sport for new analysis sessions</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Measurement Units
            </label>
            <Select
              value={preferences?.measurementUnit}
              onValueChange={(value) => setPreferences({...preferences, measurementUnit: value})}
            >
              {measurementOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">Unit system for measurements and reports</p>
          </div>
        </div>
      </div>

      {/* Feedback Settings */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Feedback Settings</h3>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Feedback Intensity: {preferences?.feedbackIntensity}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={preferences?.feedbackIntensity}
                onChange={(e) => handleSliderChange('feedbackIntensity', parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Gentle</span>
                <span>Moderate</span>
                <span>Intense</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">How detailed and critical should the feedback be</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Coaching Voice Style
            </label>
            <Select
              value={preferences?.coachingVoice}
              onValueChange={(value) => setPreferences({...preferences, coachingVoice: value})}
            >
              {coachingVoiceOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">Tone and style of AI coaching feedback</p>
          </div>
        </div>
      </div>

      {/* Analysis Options */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Analysis Options</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Auto-Analysis</h4>
              <p className="text-sm text-muted-foreground">Automatically start analysis when video upload is complete</p>
            </div>
            <button
              onClick={() => togglePreference('autoAnalysis')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences?.autoAnalysis ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences?.autoAnalysis ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Detailed Reports</h4>
              <p className="text-sm text-muted-foreground">Generate comprehensive biomechanical analysis reports</p>
            </div>
            <button
              onClick={() => togglePreference('detailedReports')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences?.detailedReports ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences?.detailedReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Video Quality Preference
            </label>
            <Select
              value={preferences?.videoQuality}
              onValueChange={(value) => setPreferences({...preferences, videoQuality: value})}
            >
              {videoQualityOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">Default video quality for recording and analysis</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};