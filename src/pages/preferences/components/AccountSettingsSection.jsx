import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export const AccountSettingsSection = () => {
  const [profileData, setProfileData] = useState({
    displayName: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 123-4567',
    bio: 'Professional athlete focused on biomechanical optimization'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleSave = () => {
    // Save profile data logic here
    setIsEditing(false);
  };

  const handleAvatarUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Account Settings</h2>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Icon name={isEditing ? "Check" : "Edit"} size={16} className="mr-2" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Management */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Profile Information</h3>
          
          {/* Avatar Upload */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profile avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={32} className="text-accent-foreground" />
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90">
                  <Icon name="Camera" size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h4 className="font-medium text-foreground">Profile Picture</h4>
              <p className="text-sm text-muted-foreground">Upload a new avatar image</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={profileData?.displayName}
              onChange={(e) => setProfileData({...profileData, displayName: e?.target?.value})}
              disabled={!isEditing}
              placeholder="Enter your display name"
            />
            <Input
              label="Email Address"
              type="email"
              value={profileData?.email}
              onChange={(e) => setProfileData({...profileData, email: e?.target?.value})}
              disabled={!isEditing}
              placeholder="Enter your email"
            />
            <Input
              label="Phone Number"
              value={profileData?.phone}
              onChange={(e) => setProfileData({...profileData, phone: e?.target?.value})}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <textarea
                value={profileData?.bio}
                onChange={(e) => setProfileData({...profileData, bio: e?.target?.value})}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Subscription Details</h3>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-foreground">Pro Plan</h4>
                <p className="text-sm text-muted-foreground">Unlimited analysis sessions</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">$29.99/month</div>
                <div className="text-sm text-muted-foreground">Next billing: Dec 21, 2025</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="CreditCard" size={16} className="mr-2" />
                Manage Billing
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>

        {/* Data Export Options */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Data Export</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">Export Analysis Data</h4>
                <p className="text-sm text-muted-foreground">Download all your biomechanical analysis results</p>
              </div>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">Export Session Videos</h4>
                <p className="text-sm text-muted-foreground">Download all your recorded training sessions</p>
              </div>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};