import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState({
    analysisComplete: {
      enabled: true,
      email: true,
      push: true,
      frequency: 'immediate'
    },
    progressReminder: {
      enabled: true,
      email: false,
      push: true,
      frequency: 'daily'
    },
    coachingTips: {
      enabled: true,
      email: true,
      push: false,
      frequency: 'weekly'
    },
    sessionReminder: {
      enabled: false,
      email: false,
      push: true,
      frequency: 'custom'
    }
  });

  const handleToggleNotification = (type, setting) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev?.[type],
        [setting]: !prev?.[type]?.[setting]
      }
    }));
  };

  const handleFrequencyChange = (type, frequency) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev?.[type],
        frequency
      }
    }));
  };

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications);
  };

  const NotificationRow = ({ type, title, description, icon }) => {
    const setting = notifications?.[type];
    
    return (
      <div className="flex items-start justify-between p-4 border border-slate-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 min-w-[200px]">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Enable</span>
            <button
              onClick={() => handleToggleNotification(type, 'enabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                setting?.enabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  setting?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {setting?.enabled && (
            <>
              {/* Email Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Email</span>
                <button
                  onClick={() => handleToggleNotification(type, 'email')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    setting?.email ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      setting?.email ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Push Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Push</span>
                <button
                  onClick={() => handleToggleNotification(type, 'push')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    setting?.push ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      setting?.push ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Frequency Selector */}
              <div>
                <label className="text-sm text-slate-600 block mb-1">Frequency</label>
                <select
                  value={setting?.frequency}
                  onChange={(e) => handleFrequencyChange(type, e?.target?.value)}
                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Notification Preferences</h2>
        <p className="text-slate-600 mt-1">Control how and when you receive updates about your biomechanical analysis</p>
      </div>

      <div className="space-y-6">
        <NotificationRow
          type="analysisComplete"
          title="Analysis Completion Alerts"
          description="Get notified when your movement analysis is ready for review"
          icon="CheckCircle"
        />

        <NotificationRow
          type="progressReminder"
          title="Progress Reminders"
          description="Regular updates on your performance improvements and training streaks"
          icon="TrendingUp"
        />

        <NotificationRow
          type="coachingTips"
          title="Coaching Notifications"
          description="Personalized tips and recommendations from your AI coach"
          icon="MessageCircle"
        />

        <NotificationRow
          type="sessionReminder"
          title="Session Reminders"
          description="Reminders to maintain your training schedule and consistency"
          icon="Calendar"
        />
      </div>

      {/* Quiet Hours */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quiet Hours</h3>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-slate-900">Do Not Disturb</h4>
              <p className="text-sm text-slate-600">Disable push notifications during specified hours</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">From</label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Until</label>
              <input
                type="time"
                defaultValue="08:00"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end space-x-3">
        <Button variant="outline">Reset to Default</Button>
        <Button onClick={handleSaveNotifications}>
          <Icon name="Save" size={16} className="mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;