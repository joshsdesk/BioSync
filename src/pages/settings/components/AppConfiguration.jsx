import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppConfiguration = () => {
  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    language: 'en',
    videoQuality: 'auto',
    autoSave: true,
    offlineMode: false,
    cacheSize: '2GB'
  });

  const [storageInfo] = useState({
    used: '1.2GB',
    available: '3.8GB',
    videos: '800MB',
    analyses: '300MB',
    cache: '100MB'
  });

  const themes = [
    { id: 'light', name: 'Light', description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', description: 'Easy on the eyes in low light' },
    { id: 'auto', name: 'Auto', description: 'Follows system preference' }
  ];

  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'fr', name: 'Français', flag: '🇫🇷' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'it', name: 'Italiano', flag: '🇮🇹' },
    { id: 'pt', name: 'Português', flag: '🇵🇹' },
    { id: 'zh', name: '中文', flag: '🇨🇳' },
    { id: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const handleSettingChange = (setting, value) => {
    setAppSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleToggle = (setting) => {
    setAppSettings(prev => ({
      ...prev,
      [setting]: !prev?.[setting]
    }));
  };

  const handleClearCache = () => {
    console.log('Clearing cache...');
  };

  const handleClearAnalyses = () => {
    console.log('Clearing analyses...');
  };

  const handleSaveSettings = () => {
    console.log('Saving app settings:', appSettings);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">App Configuration</h2>
        <p className="text-slate-600 mt-1">Customize theme, language, video quality, and storage management</p>
      </div>

      {/* Theme Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes?.map((theme) => (
            <button
              key={theme?.id}
              onClick={() => handleSettingChange('theme', theme?.id)}
              className={`p-4 rounded-lg border text-left transition-colors ${
                appSettings?.theme === theme?.id
                  ? 'bg-blue-50 border-blue-200' :'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">{theme?.name}</h4>
                {appSettings?.theme === theme?.id && (
                  <Icon name="Check" size={16} className="text-blue-600" />
                )}
              </div>
              <p className="text-sm text-slate-600">{theme?.description}</p>
              {/* Theme Preview */}
              <div className="mt-3 h-12 rounded border overflow-hidden">
                {theme?.id === 'light' && (
                  <div className="h-full bg-white border-b-2 border-slate-200"></div>
                )}
                {theme?.id === 'dark' && (
                  <div className="h-full bg-slate-900 border-b-2 border-slate-700"></div>
                )}
                {theme?.id === 'auto' && (
                  <div className="h-full bg-gradient-to-r from-white to-slate-900"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {languages?.map((language) => (
            <button
              key={language?.id}
              onClick={() => handleSettingChange('language', language?.id)}
              className={`p-3 rounded-lg border text-center transition-colors ${
                appSettings?.language === language?.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700' :'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-lg mb-1">{language?.flag}</div>
              <div className="text-sm font-medium">{language?.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Video Quality Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Video Quality Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Default Video Quality</label>
            <select
              value={appSettings?.videoQuality}
              onChange={(e) => handleSettingChange('videoQuality', e?.target?.value)}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Auto (recommended)</option>
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
              <option value="4k">4K Ultra HD</option>
            </select>
            <p className="text-sm text-slate-500 mt-1">Higher quality uses more storage space</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Auto-Save Videos</h4>
              <p className="text-sm text-slate-600">Automatically save processed videos locally</p>
            </div>
            <button
              onClick={() => handleToggle('autoSave')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                appSettings?.autoSave ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appSettings?.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Offline Mode</h4>
              <p className="text-sm text-slate-600">Download content for offline analysis</p>
            </div>
            <button
              onClick={() => handleToggle('offlineMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                appSettings?.offlineMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appSettings?.offlineMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Storage Management */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Storage Management</h3>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Storage Used</span>
              <span className="text-sm text-slate-600">{storageInfo?.used} of 5GB</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <Icon name="Video" size={24} className="text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900">Videos</div>
              <div className="text-xs text-slate-600">{storageInfo?.videos}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <Icon name="BarChart3" size={24} className="text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900">Analyses</div>
              <div className="text-xs text-slate-600">{storageInfo?.analyses}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <Icon name="Database" size={24} className="text-orange-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900">Cache</div>
              <div className="text-xs text-slate-600">{storageInfo?.cache}</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              className="w-full justify-center"
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Clear Cache ({storageInfo?.cache})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAnalyses}
              className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
            >
              <Icon name="AlertTriangle" size={16} className="mr-2" />
              Clear Old Analyses
            </Button>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700 block mb-2">Cache Size Limit</label>
            <select
              value={appSettings?.cacheSize}
              onChange={(e) => handleSettingChange('cacheSize', e?.target?.value)}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="500MB">500MB</option>
              <option value="1GB">1GB</option>
              <option value="2GB">2GB (recommended)</option>
              <option value="5GB">5GB</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Advanced</h3>
        <div className="space-y-3">
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Export App Settings
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Upload" size={16} className="mr-2" />
            Import Settings
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reset to Factory Defaults
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveSettings}>
          <Icon name="Save" size={16} className="mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default AppConfiguration;