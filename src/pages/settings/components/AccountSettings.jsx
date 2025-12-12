import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AccountSettings = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    height: '5\'10"',
    weight: '175 lbs',
    athleteLevel: 'Professional',
    primarySport: 'Basketball'
  });

  const [subscriptionData] = useState({
    plan: 'Pro',
    status: 'Active',
    nextBilling: '2025-01-21',
    price: '$29.99/month'
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Handle profile update
    console.log('Saving profile:', profileData);
  };

  const handleExportData = () => {
    // Handle data export
    console.log('Exporting user data...');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-slate-600 mt-1">Manage your profile, subscription, and data export options</p>
      </div>

      {/* Profile Picture Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            AC
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm">
              <Icon name="Upload" size={16} className="mr-2" />
              Upload New Photo
            </Button>
            <p className="text-xs text-slate-500">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={profileData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            placeholder="Enter your full name"
          />
          <Input
            label="Email Address"
            type="email"
            value={profileData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            placeholder="Enter your email"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={profileData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            placeholder="Enter your phone number"
          />
          <Input
            label="Date of Birth"
            type="date"
            value={profileData?.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
          />
        </div>
      </div>

      {/* Athletic Profile */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Athletic Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Height"
            value={profileData?.height}
            onChange={(e) => handleInputChange('height', e?.target?.value)}
            placeholder={"e.g., 5'10\""}
          />
          <Input
            label="Weight"
            value={profileData?.weight}
            onChange={(e) => handleInputChange('weight', e?.target?.value)}
            placeholder="e.g., 175 lbs"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Athlete Level</label>
            <select
              value={profileData?.athleteLevel}
              onChange={(e) => handleInputChange('athleteLevel', e?.target?.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          <Input
            label="Primary Sport"
            value={profileData?.primarySport}
            onChange={(e) => handleInputChange('primarySport', e?.target?.value)}
            placeholder="e.g., Basketball"
          />
        </div>
      </div>

      {/* Subscription Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Subscription Details</h3>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Current Plan</p>
              <p className="text-lg font-semibold text-slate-900">{subscriptionData?.plan}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Status</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-lg font-semibold text-green-600">{subscriptionData?.status}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Price</p>
              <p className="text-lg font-semibold text-slate-900">{subscriptionData?.price}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Next Billing</p>
              <p className="text-lg font-semibold text-slate-900">{subscriptionData?.nextBilling}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <Button variant="outline" size="sm">Upgrade Plan</Button>
            <Button variant="outline" size="sm">View Billing History</Button>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Export</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Download" size={20} className="text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900">Export Your Data</h4>
              <p className="text-sm text-blue-700 mt-1">
                Download a copy of your profile information, analysis results, and session history
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={handleExportData}
              >
                Request Data Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveProfile}>
          <Icon name="Save" size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;