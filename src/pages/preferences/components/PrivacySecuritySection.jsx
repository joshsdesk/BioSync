import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export const PrivacySecuritySection = () => {
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    sessionVisibility: 'private',
    analyticsTracking: true,
    marketingEmails: false,
    twoFactorAuth: false,
    sessionTimeout: 30
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const sessionVisibilityOptions = [
    { value: 'private', label: 'Private (Only me)', description: 'Sessions are visible only to you' },
    { value: 'team', label: 'Team Members', description: 'Visible to your team and coaches' },
    { value: 'public', label: 'Public', description: 'Visible to all BioSync users' }
  ];

  const togglePrivacySetting = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }));
  };

  const handlePasswordChange = () => {
    // Password change logic here
    console.log('Password change requested');
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Privacy & Security</h2>
        <Button variant="outline" size="sm">
          <Icon name="Check" size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Data Privacy */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Data Privacy</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Data Sharing for Research</h4>
              <p className="text-sm text-muted-foreground">
                Allow anonymous data sharing to improve biomechanical analysis algorithms
              </p>
            </div>
            <button
              onClick={() => togglePrivacySetting('dataSharing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy?.dataSharing ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy?.dataSharing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Session Visibility</h4>
            <div className="space-y-2">
              {sessionVisibilityOptions?.map((option) => (
                <label
                  key={option?.value}
                  className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    privacy?.sessionVisibility === option?.value
                      ? 'bg-primary/10 border-primary' :'bg-muted hover:bg-muted/80'
                  } border`}
                >
                  <input
                    type="radio"
                    name="sessionVisibility"
                    value={option?.value}
                    checked={privacy?.sessionVisibility === option?.value}
                    onChange={(e) => setPrivacy({...privacy, sessionVisibility: e?.target?.value})}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-medium text-foreground">{option?.label}</div>
                    <div className="text-sm text-muted-foreground">{option?.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Analytics Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Allow usage analytics to help improve the application experience
              </p>
            </div>
            <button
              onClick={() => togglePrivacySetting('analyticsTracking')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy?.analyticsTracking ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy?.analyticsTracking ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Marketing Communications</h4>
              <p className="text-sm text-muted-foreground">
                Receive marketing emails about new features and promotions
              </p>
            </div>
            <button
              onClick={() => togglePrivacySetting('marketingEmails')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy?.marketingEmails ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy?.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Account Security</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                disabled={!privacy?.twoFactorAuth}
              >
                Configure
              </Button>
              <button
                onClick={() => togglePrivacySetting('twoFactorAuth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy?.twoFactorAuth ? 'bg-primary' : 'bg-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy?.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-foreground">Password Security</h4>
                <p className="text-sm text-muted-foreground">Last changed: Nov 15, 2025</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <Icon name="Key" size={16} className="mr-2" />
                Change Password
              </Button>
            </div>
            
            {showPasswordForm && (
              <div className="mt-4 p-4 border border-border rounded-lg bg-background space-y-4">
                <Input
                  type="password"
                  label="Current Password"
                  value={passwordData?.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e?.target?.value})}
                  placeholder="Enter current password"
                />
                <Input
                  type="password"
                  label="New Password"
                  value={passwordData?.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e?.target?.value})}
                  placeholder="Enter new password"
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  value={passwordData?.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e?.target?.value})}
                  placeholder="Confirm new password"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handlePasswordChange}>
                    Update Password
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Session Timeout: {privacy?.sessionTimeout} minutes
            </label>
            <div className="relative">
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={privacy?.sessionTimeout}
                onChange={(e) => setPrivacy({...privacy, sessionTimeout: parseInt(e?.target?.value)})}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5 min</span>
                <span>30 min</span>
                <span>60 min</span>
                <span>2 hours</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically sign out after period of inactivity
            </p>
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