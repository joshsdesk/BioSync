import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SessionCard = ({ session, onView, onCompare, onExport, isSelected, onSelect }) => {
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBgColor = (score) => {
    if (score >= 85) return 'bg-success/10';
    if (score >= 70) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-biomech hover:shadow-biomech-lg ${
      isSelected ? 'ring-2 ring-primary' : ''
    }`}>
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <Image
                src={session?.thumbnail}
                alt={session?.thumbnailAlt}
                className="w-full h-full object-cover"
              />
            </div>
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Check" size={14} className="text-primary-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-card-foreground truncate">{session?.sport}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(session?.score)} ${getScoreColor(session?.score)}`}>
                {session?.score}
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(session?.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{formatTime(session?.date)} • {session?.duration}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-3">
              <Button
                variant="outline"
                size="xs"
                iconName="Eye"
                onClick={() => onView(session)}
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="BarChart3"
                onClick={() => onCompare(session)}
              >
                Compare
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="Download"
                onClick={() => onExport(session)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(session?.id, e?.target?.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <div className="w-20 h-14 rounded-lg overflow-hidden bg-muted">
            <Image
              src={session?.thumbnail}
              alt={session?.thumbnailAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-5 gap-4 items-center">
          <div>
            <h3 className="font-semibold text-card-foreground">{session?.sport}</h3>
            <p className="text-sm text-muted-foreground">{session?.exercise}</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div>{formatDate(session?.date)}</div>
            <div>{formatTime(session?.date)}</div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {session?.duration}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(session?.score)} ${getScoreColor(session?.score)}`}>
              {session?.score}
            </div>
            {session?.improvement > 0 && (
              <div className="flex items-center text-success text-xs">
                <Icon name="TrendingUp" size={12} />
                <span className="ml-1">+{session?.improvement}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              onClick={() => onView(session)}
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="BarChart3"
              onClick={() => onCompare(session)}
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              onClick={() => onExport(session)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;