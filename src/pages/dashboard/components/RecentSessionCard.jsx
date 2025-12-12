import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RecentSessionCard = ({ session }) => {
  const navigate = useNavigate();

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-success/10';
    if (score >= 70) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const handleViewDetails = () => {
    navigate('/analysis-results', { state: { sessionId: session?.id } });
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-biomech-lg transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={session?.thumbnail}
            alt={session?.thumbnailAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Icon name="Play" size={20} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-foreground truncate">{session?.sport}</h4>
              <p className="text-sm text-muted-foreground">{session?.date}</p>
            </div>
            <div className={`px-3 py-1 rounded-full ${getScoreBg(session?.score)}`}>
              <span className={`text-sm font-semibold ${getScoreColor(session?.score)}`}>
                {session?.score}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>{session?.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Target" size={12} />
              <span>{session?.focusArea}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {session?.improvements > 0 && (
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="TrendingUp" size={12} />
                  <span className="text-xs font-medium">+{session?.improvements}%</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground">{session?.analysisType}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="text-xs"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentSessionCard;