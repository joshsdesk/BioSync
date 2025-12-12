import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useGeminiAnalysis, useGeminiChat } from '../../hooks/useGeminiAnalysis';

const AICoach = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analysis');
  const [selectedSport, setSelectedSport] = useState('Basketball');
  const [athleteLevel, setAthleteLevel] = useState('intermediate');
  const [movementData, setMovementData] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [chatMessage, setChatMessage] = useState('');

  const {
    isAnalyzing,
    analysisProgress,
    analysisStage,
    error: analysisError,
    performBiomechanicalAnalysis,
    generateAICritiques,
    createTrainingPlan,
    getCoachingTips,
    cancelAnalysis,
    clearError
  } = useGeminiAnalysis();

  const {
    chatHistory,
    isProcessing: isChatProcessing,
    error: chatError,
    sendMessage,
    clearChat
  } = useGeminiChat();

  const sports = [
    'Basketball', 'Soccer', 'Tennis', 'Running', 'Swimming', 
    'Volleyball', 'Baseball', 'Golf', 'Track & Field', 'General'
  ];

  const tabs = [
    { key: 'analysis', label: 'Movement Analysis', icon: 'Microscope' },
    { key: 'chat', label: 'AI Coach Chat', icon: 'MessageCircle' },
    { key: 'recommendations', label: 'Training Plan', icon: 'Target' },
    { key: 'tips', label: 'Real-time Tips', icon: 'Lightbulb' }
  ];

  const handleAnalyzeMovement = async () => {
    if (!movementData?.trim()) {
      alert('Please provide movement data to analyze');
      return;
    }

    try {
      // Parse movement data (simplified for demo)
      const parsedData = {
        jointAngles: { knee: 145, hip: 165, ankle: 95 },
        keyPoints: [{ x: 320, y: 180, confidence: 0.9 }],
        phase: 'landing',
        duration: 2.5
      };

      const analysis = await performBiomechanicalAnalysis(parsedData, selectedSport);
      setAnalysisResults(analysis);
      
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleGenerateCritiques = async () => {
    if (!analysisResults) {
      alert('Please perform movement analysis first');
      return;
    }

    try {
      const mockIssues = [
        { timestamp: 1.2, description: 'Knee valgus during landing', severity: 'critical', bodyPart: 'knee' },
        { timestamp: 2.1, description: 'Forward trunk lean', severity: 'major', bodyPart: 'trunk' }
      ];

      const critiques = await generateAICritiques(mockIssues, selectedSport, athleteLevel);
      setAnalysisResults(prev => ({ ...prev, critiques }));
      
    } catch (error) {
      console.error('Critique generation failed:', error);
    }
  };

  const handleGenerateTrainingPlan = async () => {
    if (!analysisResults) {
      alert('Please perform movement analysis first');
      return;
    }

    try {
      const athleteProfile = {
        level: athleteLevel,
        ageGroup: 'Adult',
        goals: 'Performance improvement and injury prevention',
        timeAvailable: '4-5 sessions per week'
      };

      const trainingPlan = await createTrainingPlan(analysisResults, selectedSport, athleteProfile);
      setAnalysisResults(prev => ({ ...prev, trainingPlan }));
      
    } catch (error) {
      console.error('Training plan generation failed:', error);
    }
  };

  const handleGetCoachingTips = async () => {
    try {
      const mockIssues = { postureIssue: true, balanceIssue: false, coordinationIssue: true };
      const tips = await getCoachingTips('landing phase', mockIssues, selectedSport);
      setAnalysisResults(prev => ({ ...prev, coachingTips: tips }));
      
    } catch (error) {
      console.error('Coaching tips generation failed:', error);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage?.trim()) return;

    try {
      await sendMessage(chatMessage, analysisResults);
      setChatMessage('');
    } catch (error) {
      console.error('Chat message failed:', error);
    }
  };

  const handleGoToAnalysis = () => {
    navigate('/video-capture');
  };

  useEffect(() => {
    if (analysisError || chatError) {
      // Auto-clear errors after 5 seconds
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [analysisError, chatError, clearError]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-20 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
                  <Icon name="Brain" size={32} className="mr-3 text-purple-600" />
                  AI Performance Coach
                </h1>
                <p className="text-slate-600">
                  Get personalized biomechanical analysis and coaching powered by Gemini AI
                </p>
              </div>
              
              <div className="flex space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={handleGoToAnalysis}
                  iconName="Video"
                  iconPosition="left"
                >
                  Record Movement
                </Button>
              </div>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Analysis Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sport
                </label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e?.target?.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sports?.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Athlete Level
                </label>
                <select
                  value={athleteLevel}
                  onChange={(e) => setAthleteLevel(e?.target?.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {(analysisError || chatError) && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span>{analysisError || chatError}</span>
                <button 
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Progress Display */}
          {isAnalyzing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">{analysisStage}</span>
                <div className="flex space-x-2">
                  <span className="text-sm text-blue-600">{analysisProgress}%</span>
                  <button
                    onClick={cancelAnalysis}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
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
          <div className="border-b border-slate-200 mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.key}
                  onClick={() => setActiveTab(tab?.key)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab?.key
                      ? 'border-purple-500 text-purple-600' :'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Movement Data Input</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Enter movement data or upload video for AI analysis. For demo purposes, any text input will trigger a sample analysis.
                  </p>
                  <textarea
                    value={movementData}
                    onChange={(e) => setMovementData(e?.target?.value)}
                    placeholder="Describe the movement or paste motion capture data..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex space-x-3 mt-4">
                    <Button
                      onClick={handleAnalyzeMovement}
                      disabled={isAnalyzing || !movementData?.trim()}
                      iconName="Play"
                      iconPosition="left"
                    >
                      Analyze Movement
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGenerateCritiques}
                      disabled={isAnalyzing || !analysisResults}
                      iconName="MessageSquare"
                      iconPosition="left"
                    >
                      Generate Critiques
                    </Button>
                  </div>
                </div>

                {analysisResults && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Analysis Results</h3>
                    <div className="space-y-4">
                      {analysisResults?.rawAnalysis && (
                        <div>
                          <h4 className="font-medium text-slate-700 mb-2">AI Analysis</h4>
                          <div className="p-3 bg-slate-50 rounded-md">
                            <pre className="whitespace-pre-wrap text-sm text-slate-700">
                              {analysisResults?.rawAnalysis}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {analysisResults?.critiques && (
                        <div>
                          <h4 className="font-medium text-slate-700 mb-2">Movement Critiques</h4>
                          <div className="space-y-2">
                            {analysisResults?.critiques?.map((critique, index) => (
                              <div key={index} className="p-3 border border-slate-200 rounded-md">
                                <h5 className="font-medium text-slate-800">{critique?.title}</h5>
                                <p className="text-sm text-slate-600 mt-1">{critique?.description}</p>
                                {critique?.recommendations && (
                                  <div className="mt-2">
                                    <span className="text-xs font-medium text-slate-500">Recommendations:</span>
                                    <ul className="text-xs text-slate-600 mt-1 list-disc list-inside">
                                      {critique?.recommendations?.map((rec, i) => (
                                        <li key={i}>{rec}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Coach Chat</h3>
                
                <div className="h-96 border border-slate-200 rounded-md p-4 mb-4 overflow-y-auto bg-slate-50">
                  {chatHistory?.length === 0 ? (
                    <div className="text-center text-slate-500 mt-20">
                      <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-slate-300" />
                      <p>Start a conversation with your AI coach</p>
                      <p className="text-sm mt-1">Ask about technique, training, or get personalized advice</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatHistory?.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message?.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message?.role === 'user' ?'bg-purple-600 text-white' :'bg-white border border-slate-200 text-slate-800'
                            }`}
                          >
                            <p className="text-sm">{message?.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message?.timestamp?.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e?.target?.value)}
                    onKeyPress={(e) => e?.key === 'Enter' && handleSendChatMessage()}
                    placeholder="Ask your AI coach a question..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    onClick={handleSendChatMessage}
                    disabled={isChatProcessing || !chatMessage?.trim()}
                    iconName="Send"
                    iconPosition="left"
                  >
                    Send
                  </Button>
                </div>
                
                {chatHistory?.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearChat}
                    className="mt-3"
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    Clear Chat
                  </Button>
                )}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Training Plan Generator</h3>
                    <Button
                      onClick={handleGenerateTrainingPlan}
                      disabled={isAnalyzing || !analysisResults}
                      iconName="Target"
                      iconPosition="left"
                    >
                      Generate Plan
                    </Button>
                  </div>
                  
                  {analysisResults?.trainingPlan ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <h4 className="font-medium text-green-800 mb-2">Personalized Training Plan</h4>
                        <div className="text-sm text-green-700">
                          {analysisResults?.trainingPlan?.rawRecommendations ? (
                            <pre className="whitespace-pre-wrap">
                              {analysisResults?.trainingPlan?.rawRecommendations}
                            </pre>
                          ) : (
                            <p>Training plan generated successfully!</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Icon name="Target" size={48} className="mx-auto mb-4 text-slate-300" />
                      <p>Generate AI-powered training recommendations</p>
                      <p className="text-sm mt-1">Complete movement analysis first to get personalized plans</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Real-time Coaching Tips</h3>
                    <Button
                      onClick={handleGetCoachingTips}
                      disabled={isAnalyzing}
                      iconName="Lightbulb"
                      iconPosition="left"
                    >
                      Get Tips
                    </Button>
                  </div>
                  
                  {analysisResults?.coachingTips ? (
                    <div className="space-y-3">
                      {analysisResults?.coachingTips?.map((tip, index) => (
                        <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex items-start space-x-3">
                            <Icon name="Lightbulb" size={20} className="text-yellow-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-yellow-800">{tip?.tip}</p>
                              {tip?.focus && (
                                <p className="text-sm text-yellow-700 mt-1">Focus: {tip?.focus}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Icon name="Lightbulb" size={48} className="mx-auto mb-4 text-slate-300" />
                      <p>Get instant coaching tips for your movement</p>
                      <p className="text-sm mt-1">AI-powered suggestions for immediate improvement</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AICoach;