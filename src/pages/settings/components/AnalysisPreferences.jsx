import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisPreferences = () => {
  const [preferences, setPreferences] = useState({
    defaultSports: ['Basketball', 'Tennis'],
    feedbackIntensity: 75,
    coachingVoice: 'professional',
    measurementUnits: 'imperial',
    autoAnalysis: true,
    detailedReports: true,
    compareToElite: false,
    videoQuality: 'high'
  });

  const availableSports = [
    'Basketball', 'Tennis', 'Golf', 'Running', 'Swimming', 'Baseball',
    'Soccer', 'Volleyball', 'Martial Arts', 'Cycling', 'Weightlifting', 'Yoga'
  ];

  const coachingVoices = [
    { id: 'professional', name: 'Professional Coach', description: 'Clear, instructional tone' },
    { id: 'motivational', name: 'Motivational', description: 'Energetic and encouraging' },
    { id: 'analytical', name: 'Technical Analyst', description: 'Detailed and precise feedback' },
    { id: 'friendly', name: 'Friendly Mentor', description: 'Supportive and conversational' }
  ];

  const handleSportToggle = (sport) => {
    setPreferences(prev => ({
      ...prev,
      defaultSports: prev?.defaultSports?.includes(sport)
        ? prev?.defaultSports?.filter(s => s !== sport)
        : [...prev?.defaultSports, sport]
    }));
  };

  const handleSliderChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setPreferences(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const handleSavePreferences = () => {
    console.log('Saving analysis preferences:', preferences);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Analysis Preferences</h2>
        <p className="text-slate-600 mt-1">Customize your biomechanical analysis experience and coaching feedback</p>
      </div>

      {/* Default Sports Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Default Sport Selections</h3>
        <p className="text-sm text-slate-600 mb-4">Choose your primary sports for quick analysis setup</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableSports?.map((sport) => (
            <button
              key={sport}
              onClick={() => handleSportToggle(sport)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                preferences?.defaultSports?.includes(sport)
                  ? 'bg-blue-50 border-blue-200 text-blue-700' :'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Intensity */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Feedback Intensity</h3>
        <p className="text-sm text-slate-600 mb-4">Adjust how detailed and critical your coaching feedback should be</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Gentle</span>
            <span className="text-sm font-medium text-slate-700">Intensive</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={preferences?.feedbackIntensity}
              onChange={(e) => handleSliderChange('feedbackIntensity', parseInt(e?.target?.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-center mt-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                {preferences?.feedbackIntensity}%
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Focus on positives</span>
            <span>Balanced feedback</span>
            <span>Detailed corrections</span>
          </div>
        </div>
      </div>

      {/* Coaching Voice */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Coaching Voice Style</h3>
        <p className="text-sm text-slate-600 mb-4">Select the tone and style for your AI coach feedback</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coachingVoices?.map((voice) => (
            <button
              key={voice?.id}
              onClick={() => handleSelectChange('coachingVoice', voice?.id)}
              className={`p-4 rounded-lg border text-left transition-colors ${
                preferences?.coachingVoice === voice?.id
                  ? 'bg-blue-50 border-blue-200' :'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">{voice?.name}</h4>
                {preferences?.coachingVoice === voice?.id && (
                  <Icon name="Check" size={16} className="text-blue-600" />
                )}
              </div>
              <p className="text-sm text-slate-600">{voice?.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Measurement Units */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Measurement Units</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => handleSelectChange('measurementUnits', 'imperial')}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              preferences?.measurementUnits === 'imperial' ?'bg-blue-50 border-blue-200 text-blue-700' :'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Imperial (ft, lbs, mph)
          </button>
          <button
            onClick={() => handleSelectChange('measurementUnits', 'metric')}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              preferences?.measurementUnits === 'metric' ?'bg-blue-50 border-blue-200 text-blue-700' :'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Metric (m, kg, km/h)
          </button>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Advanced Analysis Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Auto-Start Analysis</h4>
              <p className="text-sm text-slate-600">Automatically begin analysis when video upload completes</p>
            </div>
            <button
              onClick={() => handleToggle('autoAnalysis')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences?.autoAnalysis ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences?.autoAnalysis ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Detailed Reports</h4>
              <p className="text-sm text-slate-600">Include comprehensive biomechanical breakdowns in results</p>
            </div>
            <button
              onClick={() => handleToggle('detailedReports')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences?.detailedReports ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences?.detailedReports ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Compare to Elite Athletes</h4>
              <p className="text-sm text-slate-600">Show comparisons to professional athlete benchmarks</p>
            </div>
            <button
              onClick={() => handleToggle('compareToElite')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences?.compareToElite ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences?.compareToElite ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Video Quality */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Video Processing Quality</h3>
        <select
          value={preferences?.videoQuality}
          onChange={(e) => handleSelectChange('videoQuality', e?.target?.value)}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="standard">Standard (faster processing)</option>
          <option value="high">High (recommended)</option>
          <option value="ultra">Ultra (best accuracy)</option>
        </select>
        <p className="text-sm text-slate-500 mt-1">Higher quality takes longer but provides more accurate analysis</p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">Reset to Default</Button>
        <Button onClick={handleSavePreferences}>
          <Icon name="Save" size={16} className="mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default AnalysisPreferences;