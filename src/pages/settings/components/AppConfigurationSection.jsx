import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

export const AppConfigurationSection = () => {
  const [config, setConfig] = useState({
    theme: 'auto',
    language: 'en',
    videoQuality: 'high',
    autoSave: true,
    soundEffects: true,
    animations: true,
    storageUsed: 2.4,
    storageLimit: 10
  });

  const themeOptions = [
    { value: 'light', label: 'Light', icon: 'Sun' },
    { value: 'dark', label: 'Dark', icon: 'Moon' },
    { value: 'auto', label: 'Auto (System)', icon: 'Monitor' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' }
  ];

  const videoQualityOptions = [
    { value: 'low', label: 'Low (480p)', storage: '~50MB per hour' },
    { value: 'medium', label: 'Medium (720p)', storage: '~150MB per hour' },
    { value: 'high', label: 'High (1080p)', storage: '~300MB per hour' },
    { value: 'ultra', label: 'Ultra (4K)', storage: '~1GB per hour' }
  ];

  const toggleSetting = (key) => {
    setConfig(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }));
  };

  const clearCache = () => {
    // Clear cache logic
    console.log('Clearing application cache...');
  };

  const exportData = () => {
    // Export data logic
    console.log('Exporting application data...');
  };

  const getStoragePercentage = () => {
    return (config?.storageUsed / config?.storageLimit) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">App Configuration</h2>
        <Button variant="outline" size="sm">
          <Icon name="Check" size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Appearance Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Appearance</h3>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Theme Selection
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions?.map((theme) => (
                <button
                  key={theme?.value}
                  onClick={() => setConfig({...config, theme: theme?.value})}
                  className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all ${
                    config?.theme === theme?.value
                      ? 'border-primary bg-primary/10' :'border-border bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Icon name={theme?.icon} size={24} />
                  <span className="text-sm font-medium">{theme?.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Language Preference
            </label>
            <Select
              value={config?.language}
              onValueChange={(value) => setConfig({...config, language: value})}
            >
              {languageOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">
              Interface language and coaching feedback language
            </p>
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Performance</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Default Video Quality
            </label>
            <div className="space-y-2">
              {videoQualityOptions?.map((option) => (
                <label
                  key={option?.value}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    config?.videoQuality === option?.value
                      ? 'bg-primary/10 border-primary' :'bg-muted hover:bg-muted/80'
                  } border`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="videoQuality"
                      value={option?.value}
                      checked={config?.videoQuality === option?.value}
                      onChange={(e) => setConfig({...config, videoQuality: e?.target?.value})}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium text-foreground">{option?.label}</div>
                      <div className="text-xs text-muted-foreground">{option?.storage}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Auto-Save Sessions</h4>
              <p className="text-sm text-muted-foreground">
                Automatically save recording sessions and analysis data
              </p>
            </div>
            <button
              onClick={() => toggleSetting('autoSave')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config?.autoSave ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config?.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Sound Effects</h4>
              <p className="text-sm text-muted-foreground">
                Play audio feedback and notification sounds
              </p>
            </div>
            <button
              onClick={() => toggleSetting('soundEffects')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config?.soundEffects ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config?.soundEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Animations</h4>
              <p className="text-sm text-muted-foreground">
                Enable smooth animations and transitions
              </p>
            </div>
            <button
              onClick={() => toggleSetting('animations')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config?.animations ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config?.animations ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Storage Management */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Storage Management</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Storage Usage</h4>
              <span className="text-sm text-muted-foreground">
                {config?.storageUsed}GB of {config?.storageLimit}GB used
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full transition-all ${
                  getStoragePercentage() > 80 ? 'bg-destructive' : 
                  getStoragePercentage() > 60 ? 'bg-warning' : 'bg-primary'
                }`}
                style={{ width: `${getStoragePercentage()}%` }}
              ></div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={clearCache}>
                <Icon name="Trash2" size={16} className="mr-2" />
                Clear Cache
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="HardDrive" size={16} className="mr-2" />
                Manage Files
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Zap" size={16} className="mr-2" />
                Upgrade Storage
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-foreground">Data Export</h4>
                <p className="text-sm text-muted-foreground">Export all your data and settings</p>
              </div>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Icon name="Download" size={16} className="mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};