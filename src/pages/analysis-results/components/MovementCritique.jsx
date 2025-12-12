import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MovementCritique = ({ critiques, onJumpToTime }) => {
  const [expandedItems, setExpandedItems] = useState(new Set([0]));

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(index)) {
      newExpanded?.delete(index);
    } else {
      newExpanded?.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'major':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'minor':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertTriangle';
      case 'major':
        return 'AlertCircle';
      case 'minor':
        return 'Info';
      default:
        return 'CheckCircle';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Icon name="MessageSquare" size={20} className="mr-2 text-blue-600" />
          Movement Analysis
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Step-by-step breakdown of your movement patterns
        </p>
      </div>
      <div className="divide-y divide-slate-200">
        {critiques?.map((critique, index) => (
          <div key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(critique?.severity)}`}>
                    <Icon name={getSeverityIcon(critique?.severity)} size={12} className="mr-1" />
                    {critique?.severity?.charAt(0)?.toUpperCase() + critique?.severity?.slice(1)}
                  </span>
                  <span className="text-sm text-slate-500 font-mono">
                    {critique?.timestamp}s
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onJumpToTime(critique?.timestamp)}
                    className="text-blue-600 hover:bg-blue-50 px-2 py-1 h-auto"
                  >
                    <Icon name="Play" size={12} className="mr-1" />
                    Jump to
                  </Button>
                </div>
                
                <h4 className="font-medium text-slate-800 mb-2">
                  {critique?.title}
                </h4>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {critique?.description}
                </p>
                
                {expandedItems?.has(index) && (
                  <div className="mt-4 space-y-3">
                    {critique?.focusPoints && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-700 mb-2">Key Focus Points:</h5>
                        <ul className="space-y-1">
                          {critique?.focusPoints?.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start space-x-2 text-sm text-slate-600">
                              <Icon name="ArrowRight" size={12} className="mt-0.5 text-blue-500 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {critique?.recommendations && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-700 mb-2">Recommendations:</h5>
                        <ul className="space-y-1">
                          {critique?.recommendations?.map((rec, recIndex) => (
                            <li key={recIndex} className="flex items-start space-x-2 text-sm text-slate-600">
                              <Icon name="CheckCircle" size={12} className="mt-0.5 text-green-500 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleExpanded(index)}
                className="ml-2 text-slate-400 hover:text-slate-600"
              >
                <Icon 
                  name={expandedItems?.has(index) ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovementCritique;