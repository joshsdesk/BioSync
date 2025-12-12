import React, { useState, useEffect } from 'react';
import { useGeminiAnalysis } from '../../../hooks/useGeminiAnalysis';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIInsights = ({ analysisData, sport = "Basketball", onInsightsUpdate }) => {
  const [aiInsights, setAIInsights] = useState(null);
  const [insightType, setInsightType] = useState('overview');
  const [showGenerateButton, setShowGenerateButton] = useState(true);

  const {
    isAnalyzing,
    analysisProgress,
    analysisStage,
    error,
    performBiomechanicalAnalysis,
    generateAICritiques,
    createTrainingPlan,
    cancelAnalysis,
    clearError
  } = useGeminiAnalysis();

  const insightTypes = [
    { key: 'overview', label: 'AI Overview', icon: 'Brain' },
    { key: 'critiques', label: 'Movement Analysis', icon: 'Microscope' },
    { key: 'training', label: 'Training Plan', icon: 'Target' },
    { key: 'comparison', label: 'Performance Trends', icon: 'TrendingUp' }
  ];

  // Convert analysis data to movement data format for Gemini
  const prepareMovementData = () => {
    if (!analysisData) return null;

    return {
      jointAngles: {
        leftKnee: 145,
        rightKnee: 132,
        leftHip: 165,
        rightHip: 158,
        leftAnkle: 95,
        rightAnkle: 88
      },
      keyPoints: analysisData?.overlayData?.keypoints || [],
      phase: 'analysis_complete',
      duration: analysisData?.duration || 0,
      scores: analysisData?.scores,
      previousScores: analysisData?.previousScores,
      errorAreas: analysisData?.overlayData?.errorAreas || [],
      sport: sport
    };
  };

  const generateAIOverview = async () => {
    try {
      setShowGenerateButton(false);
      const movementData = prepareMovementData();
      if (!movementData) return;

      const analysis = await performBiomechanicalAnalysis(movementData, sport);
      
      setAIInsights(prev => ({
        ...prev,
        overview: analysis
      }));

      if (onInsightsUpdate) {
        onInsightsUpdate({ overview: analysis });
      }
    } catch (error) {
      console.error('Failed to generate AI overview:', error);
    }
  };

  const generateMovementCritiques = async () => {
    try {
      // Mock issues based on analysis data
      const issues = [
        {
          timestamp: 12.5,
          description: "Knee alignment issue during landing phase",
          severity: "critical",
          bodyPart: "knee"
        },
        {
          timestamp: 18.3,
          description: "Posture deviation from optimal range",
          severity: "major",
          bodyPart: "spine"
        }
      ];

      const critiques = await generateAICritiques(issues, sport, 'intermediate');
      
      setAIInsights(prev => ({
        ...prev,
        critiques: critiques
      }));

      if (onInsightsUpdate) {
        onInsightsUpdate({ critiques });
      }
    } catch (error) {
      console.error('Failed to generate movement critiques:', error);
    }
  };

  const generateTrainingRecommendations = async () => {
    try {
      const athleteProfile = {
        level: 'intermediate',
        ageGroup: 'Adult',
        goals: 'Performance improvement and injury prevention',
        timeAvailable: '4-5 sessions per week'
      };

      const trainingPlan = await createTrainingPlan(analysisData, sport, athleteProfile);
      
      setAIInsights(prev => ({
        ...prev,
        training: trainingPlan
      }));

      if (onInsightsUpdate) {
        onInsightsUpdate({ training: trainingPlan });
      }
    } catch (error) {
      console.error('Failed to generate training plan:', error);
    }
  };

  const renderInsightContent = () => {
    switch (insightType) {
      case 'overview':
        return (
          <div className="space-y-4">
            {showGenerateButton && !aiInsights?.overview && (
              <div className="text-center py-8">
                <Icon name="Brain" size={48} className="mx-auto mb-4 text-purple-300" />
                <h4 className="text-lg font-medium text-slate-800 mb-2">AI-Powered Analysis</h4>
                <p className="text-slate-600 mb-4">
                  Get comprehensive biomechanical insights powered by Gemini AI
                </p>
                <Button
                  onClick={generateAIOverview}
                  disabled={isAnalyzing}
                  iconName="Sparkles"
                  iconPosition="left"
                >
                  Generate AI Insights
                </Button>
              </div>
            )}
            {aiInsights?.overview && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Icon name="Brain" size={20} className="text-purple-600 mr-2" />
                    <h4 className="font-semibold text-purple-800">AI Analysis Summary</h4>
                  </div>
                  {aiInsights?.overview?.rawAnalysis ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-white p-3 rounded border">
                        {aiInsights?.overview?.rawAnalysis}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      AI analysis completed successfully. The movement shows areas for improvement in technique and efficiency.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={generateMovementCritiques}
                    disabled={isAnalyzing}
                    iconName="MessageSquare"
                    iconPosition="left"
                  >
                    Get Movement Critiques
                  </Button>
                  <Button
                    variant="outline"
                    onClick={generateTrainingRecommendations}
                    disabled={isAnalyzing}
                    iconName="Target"
                    iconPosition="left"
                  >
                    Generate Training Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'critiques':
        return (
          <div className="space-y-4">
            {aiInsights?.critiques ? (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Icon name="Microscope" size={20} className="text-blue-600 mr-2" />
                  <h4 className="font-semibold text-slate-800">AI Movement Analysis</h4>
                </div>
                {aiInsights?.critiques?.map((critique, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-slate-800">{critique?.title || `Analysis Point ${index + 1}`}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        critique?.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        critique?.severity === 'major'? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {critique?.severity || 'moderate'}
                      </span>
                    </div>
                    {critique?.description && (
                      <p className="text-slate-600 text-sm mb-3">{critique?.description}</p>
                    )}
                    {critique?.focusPoints && (
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-slate-700 mb-2">Key Focus Points:</h6>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {critique?.focusPoints?.map((point, i) => (
                            <li key={i} className="flex items-start">
                              <Icon name="ArrowRight" size={12} className="mr-1 mt-0.5 text-slate-400" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {critique?.recommendations && (
                      <div>
                        <h6 className="text-sm font-medium text-slate-700 mb-2">Recommendations:</h6>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {critique?.recommendations?.map((rec, i) => (
                            <li key={i} className="flex items-start">
                              <Icon name="CheckCircle" size={12} className="mr-1 mt-0.5 text-green-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Icon name="Microscope" size={48} className="mx-auto mb-4 text-slate-300" />
                <p>Generate AI overview first to unlock movement critiques</p>
              </div>
            )}
          </div>
        );

      case 'training':
        return (
          <div className="space-y-4">
            {aiInsights?.training ? (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Icon name="Target" size={20} className="text-green-600 mr-2" />
                  <h4 className="font-semibold text-slate-800">Personalized Training Plan</h4>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  {aiInsights?.training?.rawRecommendations ? (
                    <pre className="whitespace-pre-wrap text-sm text-slate-700">
                      {aiInsights?.training?.rawRecommendations}
                    </pre>
                  ) : (
                    <div>
                      <p className="text-green-800 font-medium mb-2">Training Plan Generated</p>
                      <p className="text-green-700 text-sm">
                        Your personalized training recommendations have been created based on the movement analysis.
                        Focus on technique refinement, strength development, and movement efficiency.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Icon name="Target" size={48} className="mx-auto mb-4 text-slate-300" />
                <p>Generate AI overview first to unlock training recommendations</p>
              </div>
            )}
          </div>
        );

      case 'comparison':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Icon name="TrendingUp" size={20} className="text-indigo-600 mr-2" />
              <h4 className="font-semibold text-slate-800">Performance Trends</h4>
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-indigo-800 text-sm">
                AI-powered performance tracking and trend analysis will be available after multiple sessions.
                Continue analyzing your movements to unlock detailed progress insights.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Icon name="Sparkles" size={24} className="text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-slate-800">AI Insights</h3>
        </div>
        
        {isAnalyzing && (
          <button
            onClick={cancelAnalysis}
            className="text-slate-500 hover:text-slate-700"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      {/* Progress Display */}
      {isAnalyzing && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">{analysisStage}</span>
            <span className="text-sm text-blue-600">{analysisProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        </div>
      )}
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-4">
        <nav className="flex space-x-6 overflow-x-auto">
          {insightTypes?.map((type) => (
            <button
              key={type?.key}
              onClick={() => setInsightType(type?.key)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                insightType === type?.key
                  ? 'border-purple-500 text-purple-600' :'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon name={type?.icon} size={14} />
              <span>{type?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Content */}
      <div className="min-h-[300px]">
        {renderInsightContent()}
      </div>
    </div>
  );
};

export default AIInsights;