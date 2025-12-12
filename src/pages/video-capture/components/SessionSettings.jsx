import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SessionSettings = ({ settings, onSettingsChange, disabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const focusAreas = [
    { id: 'posture', label: 'Posture & Alignment', description: 'Spine, head, and shoulder positioning' },
    { id: 'balance', label: 'Balance & Stability', description: 'Weight distribution and center of gravity' },
    { id: 'timing', label: 'Movement Timing', description: 'Rhythm and coordination analysis' },
    { id: 'range', label: 'Range of Motion', description: 'Joint mobility and flexibility assessment' },
    { id: 'power', label: 'Power Generation', description: 'Force production and transfer efficiency' },
    { id: 'technique', label: 'Sport-Specific Technique', description: 'Form and execution quality' }
  ];

  const coachingIntensity = [
    { value: 'minimal', label: 'Minimal', description: 'Critical errors only' },
    { value: 'moderate', label: 'Moderate', description: 'Important corrections and praise' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive real-time guidance' }
  ];

  const handleFocusAreaChange = (areaId, checked) => {
    const updatedAreas = checked 
      ? [...settings?.focusAreas, areaId]
      : settings?.focusAreas?.filter(id => id !== areaId);
    
    onSettingsChange({
      ...settings,
      focusAreas: updatedAreas
    });
  };

  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Session Settings</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>

        {/* Quick Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Session Duration</label>
            <select
              value={settings?.duration}
              onChange={(e) => handleSettingChange('duration', e?.target?.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="120">2 minutes</option>
              <option value="300">5 minutes</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Video Quality</label>
            <select
              value={settings?.quality}
              onChange={(e) => handleSettingChange('quality', e?.target?.value)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="720p">HD (720p)</option>
              <option value="1080p">Full HD (1080p)</option>
              <option value="4k">4K Ultra HD</option>
            </select>
          </div>
        </div>

        {/* Expanded Settings */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-border">
            {/* Session Name */}
            <div className="space-y-2">
              <Input
                label="Session Name"
                type="text"
                placeholder="Enter session name (optional)"
                value={settings?.sessionName}
                onChange={(e) => handleSettingChange('sessionName', e?.target?.value)}
                disabled={disabled}
              />
            </div>

            {/* Focus Areas */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Focus Areas
              </label>
              <div className="space-y-2">
                {focusAreas?.map(option => (
                  <label key={option?.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings?.focusAreas?.includes(option?.id)}
                      onChange={(e) => {
                        const newAreas = e?.target?.checked
                          ? [...(settings?.focusAreas || []), option?.id]
                          : (settings?.focusAreas || [])?.filter(area => area !== option?.id);
                        onSettingsChange?.({ ...settings, focusAreas: newAreas });
                      }}
                      disabled={disabled}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-foreground">{option?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coaching Intensity */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Coaching Intensity
              </label>
              <select
                value={settings?.coachingIntensity || 'moderate'}
                onChange={(e) => onSettingsChange?.({ ...settings, coachingIntensity: e?.target?.value })}
                disabled={disabled}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              >
                <option value="low">Low - Gentle & Encouraging</option>
                <option value="moderate">Moderate - Motivational</option>
                <option value="high">High - Intense & Challenging</option>
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Controls the intensity and frequency of AI voice coaching feedback
              </p>
            </div>

            {/* Settings Toggles */}
            <div className="space-y-3 pt-4 border-t border-border">
              {/* Auto-Save Session */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">Auto-Save Session</div>
                  <div className="text-xs text-muted-foreground">Automatically save recording and analysis</div>
                </div>
                <Checkbox
                  checked={settings?.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e?.target?.checked)}
                  disabled={disabled}
                />
              </div>

              {/* Show Skeleton Overlay */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">Show Skeleton Overlay</div>
                  <div className="text-xs text-muted-foreground">Display real-time joint tracking</div>
                </div>
                <Checkbox
                  checked={settings?.showSkeleton}
                  onChange={(e) => handleSettingChange('showSkeleton', e?.target?.checked)}
                  disabled={disabled}
                />
              </div>

              {/* Audio Feedback Toggle */}
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Volume2" size={16} className="text-primary" />
                  <span className="text-sm text-foreground">Voice Coaching (TTS)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSettingsChange?.({ ...settings, audioFeedback: !settings?.audioFeedback })}
                  disabled={disabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings?.audioFeedback ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings?.audioFeedback ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <p className="text-xs text-muted-foreground ml-6">
                Enable AI voice coaching with motivational feedback every 7 seconds during training
              </p>

              {/* Export Analysis */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="text-sm font-medium text-foreground">Export Analysis</div>
                  <div className="text-xs text-muted-foreground">Generate detailed report after session</div>
                </div>
                <Checkbox
                  checked={settings?.exportAnalysis}
                  onChange={(e) => handleSettingChange('exportAnalysis', e?.target?.checked)}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        )}

        {/* Preset Buttons */}
        <div className="flex items-center space-x-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              duration: '60',
              quality: '1080p',
              sessionName: '',
              focusAreas: ['posture', 'technique'],
              coachingIntensity: 'moderate',
              autoSave: true,
              showSkeleton: true,
              audioFeedback: true,
              exportAnalysis: false
            })}
            disabled={disabled}
          >
            <Icon name="Zap" size={14} className="mr-1" />
            Quick Start
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({
              duration: '300',
              quality: '4k',
              sessionName: '',
              focusAreas: focusAreas?.map(area => area?.id),
              coachingIntensity: 'detailed',
              autoSave: true,
              showSkeleton: true,
              audioFeedback: true,
              exportAnalysis: true
            })}
            disabled={disabled}
          >
            <Icon name="Target" size={14} className="mr-1" />
            Professional
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionSettings;