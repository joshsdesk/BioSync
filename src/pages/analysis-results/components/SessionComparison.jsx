import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SessionComparison = ({ currentSession, historicalSessions }) => {
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [timeRange, setTimeRange] = useState('30d');

  const metrics = [
    { key: 'overall', label: 'Overall Score', color: '#3B82F6' },
    { key: 'posture', label: 'Posture', color: '#10B981' },
    { key: 'balance', label: 'Balance', color: '#F59E0B' },
    { key: 'coordination', label: 'Coordination', color: '#EF4444' }
  ];

  const timeRanges = [
    { key: '7d', label: 'Last 7 days' },
    { key: '30d', label: 'Last 30 days' },
    { key: '90d', label: 'Last 3 months' },
    { key: 'all', label: 'All time' }
  ];

  const getFilteredSessions = () => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return historicalSessions?.filter(session => new Date(session.date) >= cutoff);
  };

  const getChartData = () => {
    const sessions = getFilteredSessions();
    return sessions?.map(session => ({
      date: new Date(session.date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: session?.scores?.[selectedMetric] || 0,
      fullDate: session?.date
    }));
  };

  const getCurrentMetricScore = () => {
    return currentSession?.scores?.[selectedMetric] || 0;
  };

  const getAverageScore = () => {
    const sessions = getFilteredSessions();
    if (sessions?.length === 0) return 0;
    const sum = sessions?.reduce((acc, session) => acc + (session?.scores?.[selectedMetric] || 0), 0);
    return Math.round(sum / sessions?.length);
  };

  const getImprovement = () => {
    const sessions = getFilteredSessions();
    if (sessions?.length < 2) return 0;
    const firstScore = sessions?.[0]?.scores?.[selectedMetric] || 0;
    const currentScore = getCurrentMetricScore();
    return currentScore - firstScore;
  };

  const selectedMetricData = metrics?.find(m => m?.key === selectedMetric);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2 text-blue-600" />
          Progress Tracking
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Compare your current performance with historical data
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Metric</label>
            <div className="flex flex-wrap gap-2">
              {metrics?.map((metric) => (
                <Button
                  key={metric?.key}
                  variant={selectedMetric === metric?.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric(metric?.key)}
                  className="text-xs"
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: metric?.color }}
                  />
                  {metric?.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Time Range</label>
            <div className="flex flex-wrap gap-2">
              {timeRanges?.map((range) => (
                <Button
                  key={range?.key}
                  variant={timeRange === range?.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range?.key)}
                  className="text-xs"
                >
                  {range?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Current Score</p>
                <p className="text-2xl font-bold text-blue-800">{getCurrentMetricScore()}</p>
              </div>
              <Icon name="Target" size={24} className="text-blue-600" />
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Average Score</p>
                <p className="text-2xl font-bold text-green-800">{getAverageScore()}</p>
              </div>
              <Icon name="BarChart3" size={24} className="text-green-600" />
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Improvement</p>
                <p className={`text-2xl font-bold ${getImprovement() >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {getImprovement() > 0 ? '+' : ''}{getImprovement()}
                </p>
              </div>
              <Icon 
                name={getImprovement() >= 0 ? "TrendingUp" : "TrendingDown"} 
                size={24} 
                className={getImprovement() >= 0 ? 'text-green-600' : 'text-red-600'} 
              />
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={selectedMetricData?.color}
                strokeWidth={3}
                dot={{ fill: selectedMetricData?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: selectedMetricData?.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Recent Sessions */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Sessions</h4>
          <div className="space-y-2">
            {getFilteredSessions()?.slice(-5)?.reverse()?.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-slate-700">
                    {new Date(session.date)?.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-xs text-slate-500">{session?.sport}</span>
                </div>
                <div className="text-sm font-medium text-slate-800">
                  {session?.scores?.[selectedMetric] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionComparison;