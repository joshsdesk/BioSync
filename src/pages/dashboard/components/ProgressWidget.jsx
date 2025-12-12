import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressWidget = () => {
  const focusAreas = [
    {
      area: "Knee Alignment",
      progress: 85,
      status: "excellent",
      improvement: "+12%",
      recommendation: "Maintain current form during squats"
    },
    {
      area: "Hip Mobility",
      progress: 72,
      status: "good",
      improvement: "+8%",
      recommendation: "Focus on dynamic warm-up exercises"
    },
    {
      area: "Ankle Stability",
      progress: 58,
      status: "needs-work",
      improvement: "+3%",
      recommendation: "Add balance training to routine"
    },
    {
      area: "Core Engagement",
      progress: 91,
      status: "excellent",
      improvement: "+15%",
      recommendation: "Continue current core strengthening"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-warning';
      case 'needs-work':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Progress Tracking</h3>
          <p className="text-sm text-muted-foreground">Key biomechanical focus areas</p>
        </div>
        <Icon name="Target" size={20} className="text-primary" />
      </div>
      <div className="space-y-4">
        {focusAreas?.map((area, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">{area?.area}</span>
                <span className={`text-xs ${getStatusColor(area?.status)}`}>
                  {area?.improvement}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">{area?.progress}%</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(area?.progress)}`}
                style={{ width: `${area?.progress}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-muted-foreground">{area?.recommendation}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="font-semibold text-success">+9.5% this week</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressWidget;