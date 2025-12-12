import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PrivacySecurity = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: 'anonymous',
    sessionVisibility: 'private',
    analyticsTracking: true,
    marketingEmails: false,
    researchParticipation: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    biometricLogin: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePrivacyToggle = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev?.[setting]
    }));
  };

  const handlePrivacySelect = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSecurityToggle = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev?.[setting]
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePrivacy = () => {
    console.log('Saving privacy settings:', privacySettings);
  };

  const handleSaveSecurity = () => {
    console.log('Saving security settings:', securitySettings);
  };

  const handleChangePassword = () => {
    console.log('Changing password:', passwordForm);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Privacy & Security</h2>
        <p className="text-slate-600 mt-1">Control your data sharing preferences and account security settings</p>
      </div>

      {/* Data Sharing Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Sharing Preferences</h3>
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">Analysis Data Sharing</h4>
            <p className="text-sm text-slate-600 mb-4">Choose how your movement analysis data can be used</p>
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="dataSharing"
                  value="none"
                  checked={privacySettings?.dataSharing === 'none'}
                  onChange={(e) => handlePrivacySelect('dataSharing', e?.target?.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-slate-900">Do not share</div>
                  <div className="text-sm text-slate-600">Keep all data private and personal</div>
                </div>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="dataSharing"
                  value="anonymous"
                  checked={privacySettings?.dataSharing === 'anonymous'}
                  onChange={(e) => handlePrivacySelect('dataSharing', e?.target?.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-slate-900">Anonymous aggregation</div>
                  <div className="text-sm text-slate-600">Share anonymized data to improve AI models</div>
                </div>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="dataSharing"
                  value="research"
                  checked={privacySettings?.dataSharing === 'research'}
                  onChange={(e) => handlePrivacySelect('dataSharing', e?.target?.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-slate-900">Research participation</div>
                  <div className="text-sm text-slate-600">Contribute to sports science research studies</div>
                </div>
              </label>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">Session Visibility</h4>
            <p className="text-sm text-slate-600 mb-4">Control who can see your training sessions</p>
            <select
              value={privacySettings?.sessionVisibility}
              onChange={(e) => handlePrivacySelect('sessionVisibility', e?.target?.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="private">Private (only you)</option>
              <option value="coaches">Coaches and trainers only</option>
              <option value="team">Team members</option>
              <option value="public">Public (anonymous)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Communication Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Analytics Tracking</h4>
              <p className="text-sm text-slate-600">Allow usage analytics to improve app experience</p>
            </div>
            <button
              onClick={() => handlePrivacyToggle('analyticsTracking')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings?.analyticsTracking ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings?.analyticsTracking ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Marketing Emails</h4>
              <p className="text-sm text-slate-600">Receive updates about new features and promotions</p>
            </div>
            <button
              onClick={() => handlePrivacyToggle('marketingEmails')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings?.marketingEmails ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings?.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Research Participation</h4>
              <p className="text-sm text-slate-600">Participate in optional research surveys and studies</p>
            </div>
            <button
              onClick={() => handlePrivacyToggle('researchParticipation')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings?.researchParticipation ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings?.researchParticipation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Security</h3>
        <div className="space-y-6">
          {/* Password Change */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-4">Change Password</h4>
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordForm?.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                type="password"
                value={passwordForm?.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordForm?.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                placeholder="Confirm new password"
              />
              <Button size="sm" onClick={handleChangePassword}>Update Password</Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={() => handleSecurityToggle('twoFactorEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securitySettings?.twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securitySettings?.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {securitySettings?.twoFactorEnabled && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-700">2FA is enabled via authenticator app</p>
                <Button variant="outline" size="sm" className="mt-2">Manage 2FA Settings</Button>
              </div>
            )}
          </div>

          {/* Session Settings */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-4">Session Management</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Auto-logout after (minutes)
                </label>
                <select
                  value={securitySettings?.sessionTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({...prev, sessionTimeout: parseInt(e?.target?.value)}))}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>Never</option>
                </select>
              </div>
              <Button variant="outline" size="sm">Sign Out All Devices</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">Reset to Default</Button>
        <Button onClick={handleSavePrivacy}>
          <Icon name="Save" size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default PrivacySecurity;