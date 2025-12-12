import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreCard = ({ score, previousScore, category, trend }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-slate-500';
  };

  const scoreDifference = previousScore ? score - previousScore : 0;

  return (
    <div className={`p-6 rounded-xl border-2 ${getScoreBackground(score)} transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{category}</h3>
        {previousScore && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">
              {scoreDifference > 0 ? '+' : ''}{scoreDifference}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-end space-x-4">
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-slate-500 text-lg font-medium mb-1">
          / 100
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      {previousScore && (
        <div className="mt-3 text-sm text-slate-600">
          Previous: <span className="font-medium">{previousScore}</span>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;