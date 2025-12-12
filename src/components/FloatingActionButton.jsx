import React, { useState } from 'react';
import { Plus, MessageCircle, Camera, Upload, BarChart3, Clock } from 'lucide-react';
import Icon from './AppIcon';


const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      icon: Camera,
      label: 'Video Capture',
      href: '/video-capture',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Upload,
      label: 'Upload Video',
      href: '/video-upload',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: MessageCircle,
      label: 'AI Coach',
      href: '/ai-coach',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: BarChart3,
      label: 'Analysis Results',
      href: '/analysis-results',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      icon: Clock,
      label: 'Session History',
      href: '/session-history',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  const handleItemClick = (href) => {
    window.location.href = href;
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu Items */}
      <div className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {menuItems?.map((item, index) => {
          const Icon = item?.icon;
          return (
            <div
              key={index}
              className={`flex items-center space-x-3 transition-all duration-300 ${
                isOpen ? 'translate-x-0' : 'translate-x-12'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                {item?.label}
              </span>
              <button
                onClick={() => handleItemClick(item?.href)}
                className={`w-12 h-12 rounded-full ${item?.color} text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center`}
                title={item?.label}
              >
                <Icon size={20} />
              </button>
            </div>
          );
        })}
      </div>
      {/* Main FAB Button */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        title={isOpen ? 'Close menu' : 'Quick actions'}
      >
        <Plus size={24} className="transition-transform duration-300" />
      </button>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;