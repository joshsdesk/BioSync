import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';


import { AccountSettingsSection } from './components/AccountSettingsSection';
import { NotificationPreferencesSection } from './components/NotificationPreferencesSection';
import { AnalysisPreferencesSection } from './components/AnalysisPreferencesSection';
import { PrivacySecuritySection } from './components/PrivacySecuritySection';
import { AppConfigurationSection } from './components/AppConfigurationSection';

const Preferences = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');

  const preferenceSections = [
    { id: 'account', label: 'Account Settings', icon: 'User' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'analysis', label: 'Analysis Preferences', icon: 'BarChart3' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'Shield' },
    { id: 'app', label: 'App Configuration', icon: 'Settings' }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettingsSection />;
      case 'notifications':
        return <NotificationPreferencesSection />;
      case 'analysis':
        return <AnalysisPreferencesSection />;
      case 'privacy':
        return <PrivacySecuritySection />;
      case 'app':
        return <AppConfigurationSection />;
      default:
        return <AccountSettingsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-header">
        {/* Page Header */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="hover:bg-muted"
                >
                  <Icon name="ArrowLeft" size={20} />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Preferences</h1>
                  <p className="text-sm text-muted-foreground">
                    Customize your BioSync experience with personalized settings for account management, analysis preferences, and app configurations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-lg p-4 sticky top-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Preference Categories</h3>
                <nav className="space-y-1">
                  {preferenceSections?.map((section) => (
                    <button
                      key={section?.id}
                      onClick={() => setActiveSection(section?.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === section?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={section?.icon} size={16} />
                      <span>{section?.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-surface border border-border rounded-lg">
                {renderActiveSection()}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {preferenceSections?.map((section) => (
              <button
                key={section?.id}
                onClick={() => setActiveSection(section?.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === section?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={section?.icon} size={16} />
                <span className="whitespace-nowrap">{section?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;