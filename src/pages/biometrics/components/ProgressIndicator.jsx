import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ completionPercentage }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-primary';
    if (percentage >= 25) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-primary';
    if (percentage >= 25) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  const getProgressMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent! Your profile is comprehensive.';
    if (percentage >= 50) return 'Good progress! Add more details for better analysis.';
    if (percentage >= 25) return 'Getting started! Complete essential fields first.';
    return 'Begin by filling in your basic information.';
  };

  const getProgressIcon = (percentage) => {
    if (percentage >= 80) return 'CheckCircle';
    if (percentage >= 50) return 'Target';
    if (percentage >= 25) return 'Clock';
    return 'AlertCircle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getProgressIcon(completionPercentage)} 
            size={20} 
            className={getProgressColor(completionPercentage)} 
          />
          <div>
            <h3 className="font-medium text-card-foreground">Profile Completion</h3>
            <p className="text-sm text-muted-foreground">
              {getProgressMessage(completionPercentage)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getProgressColor(completionPercentage)}`}>
            {completionPercentage}%
          </div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressBgColor(completionPercentage)}`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Essential Fields Checklist */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-card-foreground mb-2">Essential Fields</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { field: 'age', label: 'Age', icon: 'Calendar' },
            { field: 'height_cm', label: 'Height', icon: 'Ruler' },
            { field: 'weight_kg', label: 'Weight', icon: 'Scale' },
            { field: 'body_type', label: 'Body Type', icon: 'User' },
            { field: 'activity_level', label: 'Activity', icon: 'Zap' }
          ]?.map((item) => {
            const isCompleted = completionPercentage > 0; // This is a simplified check
            return (
              <div 
                key={item?.field}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  isCompleted 
                    ? 'bg-success/10 border border-success/20' :'bg-muted/50 border border-muted'
                }`}
              >
                <Icon 
                  name={isCompleted ? 'Check' : item?.icon} 
                  size={14} 
                  className={isCompleted ? 'text-success' : 'text-muted-foreground'} 
                />
                <span className={`text-xs ${isCompleted ? 'text-success font-medium' : 'text-muted-foreground'}`}>
                  {item?.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Benefits */}
      {completionPercentage < 100 && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-card-foreground">Why Complete Your Profile?</h4>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• More accurate biomechanical analysis</li>
                <li>• Personalized training recommendations</li>
                <li>• Better injury risk assessment</li>
                <li>• Customized performance insights</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;