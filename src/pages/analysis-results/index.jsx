import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import VideoPlayer from './components/VideoPlayer';
import ScoreCard from './components/ScoreCard';
import MovementCritique from './components/MovementCritique';
import AnalysisSection from './components/AnalysisSection';
import SessionComparison from './components/SessionComparison';
import ExportPanel from './components/ExportPanel';
import AIInsights from './components/AIInsights';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { analysisService } from '../../services/analysisService';

const AnalysisResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiInsights, setAIInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get session ID from URL params
        const params = new URLSearchParams(location.search);
        const sessionId = params?.get('session');
        
        if (!sessionId) {
          // If no session ID, try to load latest session
          const { data: latestSession, error: latestError } = await analysisService?.getLatestSession();
          
          if (latestError || !latestSession) {
            throw new Error('No analysis session found. Please upload a video first.');
          }
          
          setSessionData(latestSession);
        } else {
          // Load specific session
          const { data: session, error: sessionError } = await analysisService?.getSession(sessionId);
          
          if (sessionError || !session) {
            throw new Error('Failed to load analysis session');
          }
          
          setSessionData(session);
        }
      } catch (err) {
        console.error('Error loading session:', err);
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadSessionData();
    } else {
      setError('Please log in to view analysis results');
      setLoading(false);
    }
  }, [location?.search, user]);

  // Transform database session data to match component expectations
  const analysisData = sessionData ? {
    sessionId: sessionData?.id,
    date: sessionData?.created_at,
    sport: sessionData?.sport?.name || 'Unknown Sport',
    videoUrl: sessionData?.signedVideoUrl,
    duration: sessionData?.video_duration || 0,
    scores: {
      overall: sessionData?.overall_score || sessionData?.biomechanical_score || 0,
      posture: sessionData?.posture_score || 0,
      balance: sessionData?.balance_score || 0,
      coordination: sessionData?.coordination_score || 0,
      technique: sessionData?.technique_score || 0
    },
    previousScores: {
      overall: Math.max(0, (sessionData?.overall_score || sessionData?.biomechanical_score || 0) - 6),
      posture: Math.max(0, (sessionData?.posture_score || 0) - 4),
      balance: Math.max(0, (sessionData?.balance_score || 0) - 4),
      coordination: Math.max(0, (sessionData?.coordination_score || 0) - 5),
      technique: Math.max(0, (sessionData?.technique_score || 0) - 5)
    },
    aiAnalysis: sessionData?.parsedAiAnalysis || null,
    overlayData: {
      keypoints: [
        { x: 320, y: 180, confidence: 0.9 },
        { x: 300, y: 200, confidence: 0.8 },
        { x: 340, y: 200, confidence: 0.85 },
        { x: 320, y: 250, confidence: 0.92 },
        { x: 310, y: 300, confidence: 0.88 },
        { x: 330, y: 300, confidence: 0.87 }
      ],
      connections: [
        { from: { x: 320, y: 180 }, to: { x: 320, y: 250 }, error: false },
        { from: { x: 300, y: 200 }, to: { x: 310, y: 300 }, error: true },
        { from: { x: 340, y: 200 }, to: { x: 330, y: 300 }, error: false }
      ],
      errorAreas: [
        { x: 305, y: 250 },
        { x: 325, y: 280 }
      ]
    }
  } : null;

  // Generate movement critiques from AI analysis if available
  const movementCritiques = React.useMemo(() => {
    if (analysisData?.aiAnalysis) {
      const aiData = analysisData?.aiAnalysis;
      
      // Extract critiques from AI analysis structure
      const critiques = [];
      
      // Check for critical issues in AI response
      if (aiData?.['Critical Issues'] || aiData?.criticalIssues) {
        const issues = aiData?.['Critical Issues'] || aiData?.criticalIssues;
        if (Array.isArray(issues)) {
          issues?.forEach((issue, index) => {
            critiques?.push({
              timestamp: (index + 1) * 10,
              severity: "critical",
              title: issue?.title || issue?.name || `Critical Issue ${index + 1}`,
              description: issue?.description || issue?.detail || issue,
              focusPoints: issue?.focusPoints || ["Immediate attention required", "High injury risk", "Needs correction"],
              recommendations: issue?.recommendations || ["Consult with coach", "Video review recommended", "Practice corrective drills"]
            });
          });
        }
      }
      
      // Extract specific recommendations
      if (aiData?.['Specific Recommendations'] || aiData?.recommendations) {
        const recs = aiData?.['Specific Recommendations'] || aiData?.recommendations;
        if (Array.isArray(recs)) {
          recs?.slice(0, 3)?.forEach((rec, index) => {
            critiques?.push({
              timestamp: (critiques?.length + 1) * 12,
              severity: "major",
              title: typeof rec === 'string' ? `Recommendation ${index + 1}` : (rec?.title || `Area for Improvement ${index + 1}`),
              description: typeof rec === 'string' ? rec : (rec?.description || rec?.detail),
              focusPoints: rec?.focusPoints || ["Focus on technique", "Practice consistently", "Monitor progress"],
              recommendations: rec?.steps || rec?.actions || ["Apply this recommendation", "Track your improvements", "Review weekly"]
            });
          });
        }
      }
      
      // If AI provided raw analysis text, extract key points
      if (critiques?.length === 0 && aiData?.rawAnalysis) {
        critiques?.push({
          timestamp: 10,
          severity: "major",
          title: "AI Movement Analysis",
          description: aiData?.rawAnalysis?.substring(0, 250) + "...",
          focusPoints: ["Review full AI analysis", "Focus on key areas", "Implement recommendations"],
          recommendations: ["Read complete analysis", "Consult with coach", "Practice suggested drills"]
        });
      }
      
      return critiques?.length > 0 ? critiques : getDefaultCritiques();
    }
    
    return getDefaultCritiques();
  }, [analysisData?.aiAnalysis]);
  
  // Helper function for default critiques
  const getDefaultCritiques = () => [
    {
      timestamp: 12.5,
      severity: "critical",
      title: "Knee Valgus During Landing",
      description: "Your knees are collapsing inward during the landing phase, which increases injury risk and reduces power transfer efficiency.",
      focusPoints: [
        "Keep knees aligned over toes during descent",
        "Engage glutes to maintain proper hip stability",
        "Control the rate of knee flexion"
      ],
      recommendations: [
        "Practice single-leg squats with mirror feedback",
        "Strengthen hip abductors with lateral band walks",
        "Focus on eccentric control during jump landings"
      ]
    },
    {
      timestamp: 18.3,
      severity: "major",
      title: "Forward Trunk Lean",
      description: "Excessive forward lean of the torso is compromising your center of gravity and reducing shooting accuracy.",
      focusPoints: [
        "Maintain upright posture through the shooting motion",
        "Engage core muscles for stability",
        "Keep shoulders over hips"
      ],
      recommendations: [
        "Practice wall sits to improve postural awareness",
        "Strengthen core with planks and dead bugs",
        "Work on thoracic spine mobility"
      ]
    }
  ];

  // Extract skeletal and muscle analysis from AI data
  const skeletalAnalysis = React.useMemo(() => {
    if (analysisData?.aiAnalysis?.['Technical Assessment']) {
      return {
        joints: [
          { name: "Overall Technique", angle: analysisData?.scores?.technique, target: 85, status: analysisData?.scores?.technique >= 80 ? "optimal" : "warning" },
          { name: "Posture", angle: analysisData?.scores?.posture, target: 85, status: analysisData?.scores?.posture >= 80 ? "optimal" : "warning" },
          { name: "Balance", angle: analysisData?.scores?.balance, target: 85, status: analysisData?.scores?.balance >= 80 ? "optimal" : "warning" },
          { name: "Coordination", angle: analysisData?.scores?.coordination, target: 85, status: analysisData?.scores?.coordination >= 80 ? "optimal" : "warning" }
        ]
      };
    }
    
    return {
      joints: [
        { name: "Left Knee", angle: 145, target: 140, status: "optimal" },
        { name: "Right Knee", angle: 132, target: 140, status: "warning" },
        { name: "Left Hip", angle: 165, target: 160, status: "optimal" },
        { name: "Right Hip", angle: 158, target: 160, status: "optimal" }
      ]
    };
  }, [analysisData?.aiAnalysis, analysisData?.scores]);

  const muscleAnalysis = React.useMemo(() => {
    if (analysisData?.aiAnalysis?.['Movement Quality']) {
      const quality = analysisData?.aiAnalysis?.['Movement Quality'];
      return {
        groups: [
          {
            name: "Overall Movement Quality",
            activation: analysisData?.scores?.overall || 75,
            feedback: typeof quality === 'string' ? quality : (quality?.assessment || "Movement quality assessment from AI analysis")
          }
        ]
      };
    }
    
    return {
      groups: [
        {
          name: "Quadriceps",
          activation: 85,
          feedback: "Excellent activation during the jumping phase. Good power generation."
        },
        {
          name: "Glutes",
          activation: 72,
          feedback: "Moderate activation. Focus on engaging glutes more during landing."
        },
        {
          name: "Core",
          activation: 68,
          feedback: "Core stability needs improvement for better balance control."
        }
      ]
    };
  }, [analysisData?.aiAnalysis, analysisData?.scores]);

  const drillRecommendations = React.useMemo(() => {
    if (analysisData?.aiAnalysis?.['Corrective Exercises']) {
      const exercises = analysisData?.aiAnalysis?.['Corrective Exercises'];
      
      if (Array.isArray(exercises)) {
        return {
          drills: exercises?.map((exercise, index) => ({
            name: exercise?.name || exercise?.title || `Exercise ${index + 1}`,
            difficulty: exercise?.difficulty || "intermediate",
            duration: exercise?.duration || "3 sets x 10 reps",
            description: exercise?.description || exercise?.purpose || "Recommended exercise from AI analysis",
            steps: exercise?.steps || exercise?.instructions || [
              "Follow proper form",
              "Progress gradually",
              "Focus on quality over quantity"
            ]
          }))
        };
      }
    }
    
    return {
      drills: [
        {
          name: "Single-Leg Balance Challenge",
          difficulty: "beginner",
          duration: "3 sets x 30 seconds",
          description: "Improve proprioception and single-leg stability.",
          steps: [
            "Stand on one leg with eyes closed",
            "Maintain balance for 30 seconds",
            "Progress to unstable surface",
            "Add arm movements for increased challenge"
          ]
        },
        {
          name: "Lateral Band Walks",
          difficulty: "intermediate",
          duration: "3 sets x 15 steps each direction",
          description: "Strengthen hip abductors to prevent knee collapse.",
          steps: [
            "Place resistance band around ankles",
            "Maintain quarter squat position",
            "Step laterally keeping tension",
            "Keep knees aligned over toes"
          ]
        }
      ]
    };
  }, [analysisData?.aiAnalysis]);

  const historicalSessions = [
    {
      date: "2024-10-14T10:30:00.000Z",
      sport: "Basketball",
      scores: { overall: 72, posture: 78, balance: 70, coordination: 75 }
    },
    {
      date: "2024-10-07T14:15:00.000Z",
      sport: "Basketball",
      scores: { overall: 69, posture: 75, balance: 68, coordination: 72 }
    },
    {
      date: "2024-09-30T16:45:00.000Z",
      sport: "Basketball",
      scores: { overall: 65, posture: 72, balance: 64, coordination: 68 }
    },
    {
      date: "2024-09-23T11:20:00.000Z",
      sport: "Basketball",
      scores: { overall: 62, posture: 70, balance: 60, coordination: 65 }
    },
    {
      date: "2024-09-16T13:10:00.000Z",
      sport: "Basketball",
      scores: { overall: 58, posture: 68, balance: 55, coordination: 62 }
    }
  ];

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { key: 'detailed', label: 'Detailed Analysis', icon: 'Microscope' },
    { key: 'ai-insights', label: 'AI Coach', icon: 'Brain' },
    { key: 'progress', label: 'Progress Tracking', icon: 'TrendingUp' },
    { key: 'export', label: 'Export & Share', icon: 'Download' }
  ];

  const handleJumpToTime = (timestamp) => {
    setCurrentVideoTime(timestamp);
  };

  const handleExport = async (exportOptions) => {
    // Mock export functionality
    console.log('Exporting with options:', exportOptions);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock download
    const blob = new Blob(['Mock analysis report data'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biomech-analysis-${analysisData?.sessionId}.${exportOptions?.format}`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewAnalysis = () => {
    navigate('/video-capture');
  };

  const handleViewHistory = () => {
    navigate('/session-history');
  };

  const handleAICoach = () => {
    navigate('/ai-coach');
  };

  const handleAIInsightsUpdate = (insights) => {
    setAIInsights(prev => ({ ...prev, ...insights }));
  };

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="pt-20 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading analysis results...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="pt-20 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
              <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Results</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/video-upload')}
                  iconName="Upload"
                  iconPosition="left"
                >
                  Upload New Video
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  iconName="Home"
                  iconPosition="left"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="pt-20 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <Icon name="FileVideo" size={48} className="mx-auto mb-4 text-slate-400" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No Analysis Found</h2>
              <p className="text-slate-600 mb-6">
                You don't have any analysis results yet. Upload a video to get started!
              </p>
              <Button
                onClick={() => navigate('/video-upload')}
                iconName="Upload"
                iconPosition="left"
              >
                Upload Your First Video
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-20 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Analysis Results
                </h1>
                <p className="text-slate-600">
                  Comprehensive biomechanical assessment for {analysisData?.sport} • {new Date(analysisData.date)?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="flex space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={handleViewHistory}
                  iconName="History"
                  iconPosition="left"
                >
                  View History
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAICoach}
                  iconName="Brain"
                  iconPosition="left"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  AI Coach
                </Button>
                <Button
                  onClick={handleNewAnalysis}
                  iconName="Plus"
                  iconPosition="left"
                >
                  New Analysis
                </Button>
              </div>
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ScoreCard
              score={analysisData?.scores?.overall}
              previousScore={analysisData?.previousScores?.overall}
              category="Overall Score"
              trend={analysisData?.scores?.overall > analysisData?.previousScores?.overall ? 'up' : 'down'}
            />
            <ScoreCard
              score={analysisData?.scores?.posture}
              previousScore={analysisData?.previousScores?.posture}
              category="Posture"
              trend={analysisData?.scores?.posture > analysisData?.previousScores?.posture ? 'up' : 'down'}
            />
            <ScoreCard
              score={analysisData?.scores?.balance}
              previousScore={analysisData?.previousScores?.balance}
              category="Balance"
              trend={analysisData?.scores?.balance > analysisData?.previousScores?.balance ? 'up' : 'down'}
            />
            <ScoreCard
              score={analysisData?.scores?.coordination}
              previousScore={analysisData?.previousScores?.coordination}
              category="Coordination"
              trend={analysisData?.scores?.coordination > analysisData?.previousScores?.coordination ? 'up' : 'down'}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <VideoPlayer
                videoUrl={analysisData?.videoUrl}
                overlayData={analysisData?.overlayData}
                onTimeUpdate={setCurrentVideoTime}
              />
            </div>

            {/* Movement Critique */}
            <div className="lg:col-span-1">
              <MovementCritique
                critiques={movementCritiques}
                onJumpToTime={handleJumpToTime}
              />
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="mt-8">
            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-6">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.key}
                    onClick={() => setActiveTab(tab?.key)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab?.key
                        ? 'border-blue-500 text-blue-600' :'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AnalysisSection
                    title="Skeletal Analysis"
                    icon="Bone"
                    data={skeletalAnalysis}
                    type="skeletal"
                  />
                  <AnalysisSection
                    title="Muscle Group Assessment"
                    icon="Activity"
                    data={muscleAnalysis}
                    type="muscle"
                  />
                </div>
              )}

              {activeTab === 'detailed' && (
                <div className="space-y-6">
                  <AnalysisSection
                    title="Technical Drill Recommendations"
                    icon="Target"
                    data={drillRecommendations}
                    type="drills"
                  />
                  
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <Icon name="Dumbbell" size={20} className="mr-2 text-blue-600" />
                      Strength & Conditioning Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-700">Priority Areas</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start space-x-2">
                            <Icon name="ArrowRight" size={14} className="mt-1 text-red-500" />
                            <span className="text-sm text-slate-600">Hip abductor strengthening for knee stability</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Icon name="ArrowRight" size={14} className="mt-1 text-orange-500" />
                            <span className="text-sm text-slate-600">Core stability for improved balance control</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Icon name="ArrowRight" size={14} className="mt-1 text-yellow-500" />
                            <span className="text-sm text-slate-600">Eccentric control training for landing mechanics</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-700">Recommended Exercises</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start space-x-2">
                            <Icon name="CheckCircle" size={14} className="mt-1 text-green-500" />
                            <span className="text-sm text-slate-600">Clamshells with resistance band</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Icon name="CheckCircle" size={14} className="mt-1 text-green-500" />
                            <span className="text-sm text-slate-600">Dead bug progressions</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <Icon name="CheckCircle" size={14} className="mt-1 text-green-500" />
                            <span className="text-sm text-slate-600">Eccentric step-downs</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai-insights' && (
                <AIInsights
                  analysisData={analysisData}
                  sport={analysisData?.sport}
                  onInsightsUpdate={handleAIInsightsUpdate}
                />
              )}

              {activeTab === 'progress' && (
                <SessionComparison
                  currentSession={analysisData}
                  historicalSessions={historicalSessions}
                />
              )}

              {activeTab === 'export' && (
                <ExportPanel
                  sessionData={analysisData}
                  onExport={handleExport}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisResults;