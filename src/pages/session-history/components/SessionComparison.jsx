import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SessionComparison = ({ sessions, onClose, onRemoveSession }) => {
  if (sessions?.length === 0) return null;

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

  const calculateImprovement = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100)?.toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Session Comparison</h2>
            <span className="text-sm text-muted-foreground">({sessions?.length} sessions)</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Comparison Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sessions?.map((session, index) => (
              <div key={session?.id} className="bg-muted/50 border border-border rounded-lg p-4">
                {/* Session Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-muted-foreground">Session {index + 1}</span>
                    {index > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon 
                          name={sessions?.[index]?.score > sessions?.[index - 1]?.score ? "TrendingUp" : "TrendingDown"} 
                          size={14} 
                          className={sessions?.[index]?.score > sessions?.[index - 1]?.score ? "text-success" : "text-destructive"}
                        />
                        <span className={`text-xs font-medium ${
                          sessions?.[index]?.score > sessions?.[index - 1]?.score ? "text-success" : "text-destructive"
                        }`}>
                          {calculateImprovement(sessions?.[index]?.score, sessions?.[index - 1]?.score)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="X"
                    onClick={() => onRemoveSession(session?.id)}
                  />
                </div>

                {/* Session Thumbnail */}
                <div className="w-full h-32 rounded-lg overflow-hidden bg-muted mb-4">
                  <Image
                    src={session?.thumbnail}
                    alt={session?.thumbnailAlt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Session Details */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{session?.sport}</h3>
                    <p className="text-sm text-muted-foreground">{session?.exercise}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm font-medium text-card-foreground">{formatDate(session?.date)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="text-sm font-medium text-card-foreground">{session?.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Biomech Score</span>
                    <div className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreBgColor(session?.score)} ${getScoreColor(session?.score)}`}>
                      {session?.score}/100
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="border-t border-border pt-3">
                    <h4 className="text-sm font-medium text-card-foreground mb-2">Key Focus Areas</h4>
                    <div className="space-y-2">
                      {session?.focusAreas?.slice(0, 3)?.map((area, areaIndex) => (
                        <div key={areaIndex} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{area?.name}</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getScoreColor(area?.score)?.replace('text-', 'bg-')}`}
                                style={{ width: `${area?.score}%` }}
                              />
                            </div>
                            <span className={`font-medium ${getScoreColor(area?.score)}`}>
                              {area?.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {session?.recommendations && (
                    <div className="border-t border-border pt-3">
                      <h4 className="text-sm font-medium text-card-foreground mb-2">Top Recommendation</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {session?.recommendations?.[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Summary */}
          {sessions?.length > 1 && (
            <div className="mt-8 bg-muted/30 border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Comparison Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.max(...sessions?.map(s => s?.score))}
                  </div>
                  <div className="text-sm text-muted-foreground">Highest Score</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-card-foreground mb-1">
                    {Math.round(sessions?.reduce((sum, s) => sum + s?.score, 0) / sessions?.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-1">
                    +{calculateImprovement(
                      sessions?.[sessions?.length - 1]?.score,
                      sessions?.[0]?.score
                    )}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Improvement</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Compare up to 5 sessions to track your progress
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close Comparison
            </Button>
            <Button variant="default" iconName="Download">
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionComparison;