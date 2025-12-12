import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  const currentDate = new Date()?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date()?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Alex!</h1>
          <p className="text-white/90 mb-1">Ready to improve your biomechanics today?</p>
          <div className="flex items-center space-x-4 text-white/80 text-sm">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-white/80">Day Streak</div>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Icon name="Flame" size={32} className="text-warning" />
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-4 right-20 w-24 h-24 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-4 left-20 w-16 h-16 border border-white/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default WelcomeHeader;