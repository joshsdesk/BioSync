import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceChart = () => {
  const performanceData = [
    { date: "Oct 14", score: 72, sessions: 2 },
    { date: "Oct 15", score: 75, sessions: 1 },
    { date: "Oct 16", score: 78, sessions: 3 },
    { date: "Oct 17", score: 82, sessions: 2 },
    { date: "Oct 18", score: 79, sessions: 1 },
    { date: "Oct 19", score: 85, sessions: 2 },
    { date: "Oct 20", score: 88, sessions: 1 },
    { date: "Oct 21", score: 91, sessions: 2 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-biomech-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">
            Score: <span className="font-semibold">{payload?.[0]?.value}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {payload?.[0]?.payload?.sessions} session(s)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Performance Trend</h3>
          <p className="text-sm text-muted-foreground">Last 7 days biomechanical scores</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-xs text-muted-foreground">Biomech Score</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(30, 64, 175)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(30, 64, 175)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
            />
            <YAxis 
              domain={[60, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="rgb(30, 64, 175)"
              strokeWidth={3}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-success" />
          <span className="text-sm text-success font-medium">+12% improvement</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Average: <span className="font-medium text-foreground">81.2</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;