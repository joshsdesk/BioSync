import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

export const NotificationPreferencesSection = () => {
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    progressReminders: false,
    coachingTips: true,
    weeklyReports: true,
    emailUpdates: false,
    pushNotifications: true
  });

  const [frequency, setFrequency] = useState({
    progressReminders: 'daily',
    coachingTips: 'weekly',
    weeklyReports: 'weekly'
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev?.[key]
    }));
  };

  const handleFrequencyChange = (key, value) => {
    setFrequency(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const frequencyOptions = [
    { value: 'never', label: 'Never' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
        <Button variant="outline" size="sm">
          <Icon name="Check" size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Analysis Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Analysis Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Analysis Completion Alerts</h4>
              <p className="text-sm text-muted-foreground">Get notified when your biomechanical analysis is complete</p>
            </div>
            <button
              onClick={() => toggleNotification('analysisComplete')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.analysisComplete ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications?.analysisComplete ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1 mr-4">
              <h4 className="font-medium text-foreground">Progress Reminders</h4>
              <p className="text-sm text-muted-foreground">Remind me to review my training progress</p>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                value={frequency?.progressReminders}
                onValueChange={(value) => handleFrequencyChange('progressReminders', value)}
                disabled={!notifications?.progressReminders}
                className="w-24"
              >
                {frequencyOptions?.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </Select>
              <button
                onClick={() => toggleNotification('progressReminders')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications?.progressReminders ? 'bg-primary' : 'bg-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications?.progressReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1 mr-4">
              <h4 className="font-medium text-foreground">Coaching Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive AI-powered coaching tips and insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                value={frequency?.coachingTips}
                onValueChange={(value) => handleFrequencyChange('coachingTips', value)}
                disabled={!notifications?.coachingTips}
                className="w-24"
              >
                {frequencyOptions?.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </Select>
              <button
                onClick={() => toggleNotification('coachingTips')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications?.coachingTips ? 'bg-primary' : 'bg-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications?.coachingTips ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-lg font-medium text-foreground">Communication Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1 mr-4">
              <h4 className="font-medium text-foreground">Weekly Reports</h4>
              <p className="text-sm text-muted-foreground">Get weekly summaries of your training progress</p>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                value={frequency?.weeklyReports}
                onValueChange={(value) => handleFrequencyChange('weeklyReports', value)}
                disabled={!notifications?.weeklyReports}
                className="w-24"
              >
                {frequencyOptions?.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </Select>
              <button
                onClick={() => toggleNotification('weeklyReports')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications?.weeklyReports ? 'bg-primary' : 'bg-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications?.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Email Updates</h4>
              <p className="text-sm text-muted-foreground">Receive product updates and feature announcements</p>
            </div>
            <button
              onClick={() => toggleNotification('emailUpdates')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.emailUpdates ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications?.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Push Notifications</h4>
              <p className="text-sm text-muted-foreground">Enable browser push notifications for real-time updates</p>
            </div>
            <button
              onClick={() => toggleNotification('pushNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications?.pushNotifications ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications?.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};