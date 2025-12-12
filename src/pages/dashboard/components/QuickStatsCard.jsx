import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ title, value, subtitle, icon, trend, trendValue, color = "primary" }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10',
          icon: 'text-success',
          trend: trend === 'up' ? 'text-success' : 'text-destructive'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          icon: 'text-warning',
          trend: trend === 'up' ? 'text-success' : 'text-destructive'
        };
      case 'accent':
        return {
          bg: 'bg-accent/10',
          icon: 'text-accent',
          trend: trend === 'up' ? 'text-success' : 'text-destructive'
        };
      default:
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          trend: trend === 'up' ? 'text-success' : 'text-destructive'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-surface rounded-xl border border-border p-6 hover:shadow-biomech-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses?.bg} flex items-center justify-center`}>
          <Icon name={icon} size={24} className={colorClasses?.icon} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${colorClasses?.trend}`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default QuickStatsCard;