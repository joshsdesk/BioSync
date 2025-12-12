import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import AppImage from '../AppImage';

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('idle'); // idle, processing, completed
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Record', path: '/video-capture', icon: 'Video' },
    { label: 'Upload', path: '/video-upload', icon: 'Upload' },
    { label: 'Results', path: '/analysis-results', icon: 'BarChart3' },
    { label: 'History', path: '/session-history', icon: 'History' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getSessionStatusIcon = () => {
    switch (sessionStatus) {
      case 'processing':
        return 'Loader2';
      case 'completed':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  const getSessionStatusColor = () => {
    switch (sessionStatus) {
      case 'processing':
        return 'text-warning';
      case 'completed':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-surface border-b border-border h-header">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            {/* Option 1: Replace with an actual image */}
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <AppImage
                src="/assets/images/biosync-logo.png"
                alt="BioSync Logo"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Option 2: Use a different SVG icon - uncomment to use */}
            {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
              >
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div> */}
            
            {/* Option 3: Use Lucide Icon - uncomment to use */}
            {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-primary-foreground" />
            </div> */}
            
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">BioSync</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Train. Track. Transform.</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-biomech ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Session Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-muted">
            <Icon
              name={getSessionStatusIcon()}
              size={14}
              className={`${getSessionStatusColor()} ${
                sessionStatus === 'processing' ? 'animate-spin' : ''
              }`}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {sessionStatus === 'processing' && 'Analyzing...'}
              {sessionStatus === 'completed' && 'Analysis Complete'}
              {sessionStatus === 'idle' && 'Ready'}
            </span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-biomech"
            >
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-accent-foreground" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-foreground">Alex Chen</div>
                <div className="text-xs text-muted-foreground">Professional Athlete</div>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                className={`text-muted-foreground transition-transform ${
                  userMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-biomech-lg z-dropdown animate-fade-in">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-accent-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-popover-foreground">Alex Chen</div>
                      <div className="text-sm text-muted-foreground">alex.chen@email.com</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-biomech">
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-biomech"
                    onClick={() => navigate('/biometrics')}
                  >
                    <Icon name="Activity" size={16} />
                    <span>Biometric Data</span>
                  </button>
                  <button 
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-biomech"
                    onClick={() => navigate('/preferences')}
                  >
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-biomech">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-destructive hover:bg-muted rounded-md transition-biomech">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {}}
          >
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-navigation">
        <div className="flex items-center justify-around py-2">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-biomech ${
                  isActive
                    ? 'text-primary' :'text-muted-foreground'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="text-xs font-medium">{item?.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;