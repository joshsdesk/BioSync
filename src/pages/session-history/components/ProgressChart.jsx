import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProgressChart = ({ data, chartType, onChartTypeChange }) => {
  const chartTypes = [
    { value: 'line', label: 'Progress Line', icon: 'TrendingUp' },
    { value: 'bar', label: 'Score Comparison', icon: 'BarChart3' },
    { value: 'improvement', label: 'Improvement Rate', icon: 'Activity' }
  ];

  const formatTooltipLabel = (label) => {
    const date = new Date(label);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-biomech-lg">
          <p className="font-medium text-popover-foreground">{formatTooltipLabel(label)}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
              {entry?.dataKey === 'score' && '/100'}
              {entry?.dataKey === 'improvement' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                name="Biomech Score"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="sport" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                name="Average Score"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'improvement':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="improvement" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
                name="Improvement Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Progress Analytics</h3>
        <div className="flex items-center space-x-2">
          {chartTypes?.map((type) => (
            <button
              key={type?.value}
              onClick={() => onChartTypeChange(type?.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-biomech ${
                chartType === type?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={type?.icon} size={16} />
              <span className="hidden sm:inline">{type?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full">
        {renderChart()}
      </div>
      {/* Chart Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {data?.length > 0 ? Math.max(...data?.map(d => d?.score)) : 0}
          </div>
          <div className="text-sm text-muted-foreground">Best Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">
            {data?.length > 0 ? Math.round(data?.reduce((sum, d) => sum + d?.score, 0) / data?.length) : 0}
          </div>
          <div className="text-sm text-muted-foreground">Average Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {data?.length > 0 ? data?.filter(d => d?.improvement > 0)?.length : 0}
          </div>
          <div className="text-sm text-muted-foreground">Improved Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-card-foreground">
            {data?.length}
          </div>
          <div className="text-sm text-muted-foreground">Total Sessions</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;