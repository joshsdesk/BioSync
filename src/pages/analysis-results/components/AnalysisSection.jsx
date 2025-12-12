import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisSection = ({ title, icon, data, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderSkeletalAnalysis = () => (
    <div className="space-y-4">
      {data?.joints?.map((joint, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              joint?.status === 'optimal' ? 'bg-green-500' :
              joint?.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="font-medium text-slate-700">{joint?.name}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-slate-800">{joint?.angle}°</div>
            <div className="text-xs text-slate-500">Target: {joint?.target}°</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMuscleAnalysis = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data?.groups?.map((group, index) => (
        <div key={index} className="p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-800">{group?.name}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              group?.activation >= 80 ? 'bg-green-100 text-green-700' :
              group?.activation >= 60 ? 'bg-yellow-100 text-yellow-700': 'bg-red-100 text-red-700'
            }`}>
              {group?.activation}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full ${
                group?.activation >= 80 ? 'bg-green-500' :
                group?.activation >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${group?.activation}%` }}
            />
          </div>
          <p className="text-sm text-slate-600">{group?.feedback}</p>
        </div>
      ))}
    </div>
  );

  const renderDrillRecommendations = () => (
    <div className="space-y-4">
      {data?.drills?.map((drill, index) => (
        <div key={index} className="border border-slate-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium text-slate-800 mb-1">{drill?.name}</h4>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  drill?.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  drill?.difficulty === 'intermediate'? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {drill?.difficulty}
                </span>
                <span className="text-sm text-slate-500">{drill?.duration}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Icon name="Play" size={14} className="mr-1" />
              Watch
            </Button>
          </div>
          <p className="text-sm text-slate-600 mb-3">{drill?.description}</p>
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-slate-700">Instructions:</h5>
            <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
              {drill?.steps?.map((step, stepIndex) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'skeletal':
        return renderSkeletalAnalysis();
      case 'muscle':
        return renderMuscleAnalysis();
      case 'drills':
        return renderDrillRecommendations();
      default:
        return <div className="text-slate-500">No data available</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div 
        className="p-4 bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name={icon} size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-slate-500"
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default AnalysisSection;