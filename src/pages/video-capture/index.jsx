import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CameraPreview from './components/CameraPreview';
import RecordingControls from './components/RecordingControls';
import SportSelector from './components/SportSelector';
import LiveFeedbackPanel from './components/LiveFeedbackPanel';
import SessionSettings from './components/SessionSettings';
import ttsCoachingService from '../../services/ttsCoachingService';

const VideoCapture = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedSport, setSelectedSport] = useState('running');
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);
  const [currentScore, setCurrentScore] = useState(82);
  const [canRecord, setCanRecord] = useState(true);
  const [voiceCoachingActive, setVoiceCoachingActive] = useState(false);

  const [sessionSettings, setSessionSettings] = useState({
    duration: '60',
    quality: '1080p',
    sessionName: '',
    focusAreas: ['posture', 'technique'],
    coachingIntensity: 'moderate',
    autoSave: true,
    showSkeleton: true,
    audioFeedback: true,
    exportAnalysis: false
  });

  /* --- Effects --- */
  // Timer effect
  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop if duration limit is reached
          if (sessionSettings?.duration !== 'unlimited' && newTime >= parseInt(sessionSettings?.duration)) {
            handleStopRecording();
            return prev;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, sessionSettings?.duration]);

  // Mock score updates during recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      const scoreInterval = setInterval(() => {
        setCurrentScore(prev => {
          const variation = Math.random() * 10 - 5; // ±5 points
          const newScore = Math.max(60, Math.min(95, prev + variation));
          return Math.round(newScore);
        });
      }, 3000);
      return () => clearInterval(scoreInterval);
    }
  }, [isRecording, isPaused]);

  // Voice coaching effect
  useEffect(() => {
    const initializeVoiceCoaching = async () => {
      if (isRecording && !isPaused && sessionSettings?.audioFeedback) {
        try {
          await ttsCoachingService?.startCoaching({
            sport: selectedSport,
            interval: 7, // Coaching tip every 7 seconds
            intensity: sessionSettings?.coachingIntensity || 'moderate',
            focusAreas: sessionSettings?.focusAreas || ['posture', 'technique']
          });
          setVoiceCoachingActive(true);
        } catch (error) {
          console.error('Failed to start voice coaching:', error);
          setVoiceCoachingActive(false);
        }
      } else if (isPaused) {
        ttsCoachingService?.pause();
        setVoiceCoachingActive(false);
      } else if (!isRecording) {
        ttsCoachingService?.stop();
        setVoiceCoachingActive(false);
      }
    };

    initializeVoiceCoaching();

    return () => {
      if (!isRecording) {
        ttsCoachingService?.stop();
      }
    };
  }, [isRecording, isPaused, sessionSettings?.audioFeedback, selectedSport, sessionSettings?.coachingIntensity, sessionSettings?.focusAreas]);

  /* --- Handlers --- */
  const handleStartRecording = () => {
    if (!canRecord) return;

    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setCurrentScore(82);

    // Simulate camera initialization
    setTimeout(() => {
      console.log('Recording started with settings:', sessionSettings);
    }, 100);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);

    // Auto-save if enabled
    if (sessionSettings?.autoSave) {
      handleSaveSession();
    }

    // Navigate to results if export is enabled
    if (sessionSettings?.exportAnalysis) {
      setTimeout(() => {
        navigate('/analysis-results');
      }, 1000);
    }

    // Stop voice coaching
    ttsCoachingService?.stop();
    setVoiceCoachingActive(false);
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);

    // Handle voice coaching pause/resume
    if (!isPaused) {
      ttsCoachingService?.pause();
    } else {
      ttsCoachingService?.resume();
    }
  };

  const handleSaveSession = () => {
    const sessionData = {
      id: Date.now(),
      sport: selectedSport,
      duration: recordingTime,
      score: currentScore,
      settings: sessionSettings,
      timestamp: new Date(),
      name: sessionSettings?.sessionName || `${selectedSport} Session`
    };

    // Mock save to localStorage
    const existingSessions = JSON.parse(localStorage.getItem('biomech_sessions') || '[]');
    existingSessions?.push(sessionData);
    localStorage.setItem('biomech_sessions', JSON.stringify(existingSessions));

    console.log('Session saved:', sessionData);
  };

  const handleToggleFeedback = () => {
    setFeedbackEnabled(!feedbackEnabled);
  };

  const handleSportChange = (sport) => {
    if (!isRecording) {
      setSelectedSport(sport);
    }
  };

  const handleSettingsChange = (newSettings) => {
    if (!isRecording) {
      setSessionSettings(newSettings);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <main className="pt-20 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Video Capture</h1>
                <p className="text-muted-foreground mt-2">
                  Record your movement with real-time AI analysis and coaching feedback
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/video-upload')}
                  disabled={isRecording}
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  Upload Video
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/session-history')}
                  disabled={isRecording}
                >
                  <Icon name="History" size={16} className="mr-2" />
                  History
                </Button>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Camera and Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Camera Preview */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <CameraPreview
                  isRecording={isRecording}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  selectedSport={selectedSport}
                  showSkeleton={sessionSettings?.showSkeleton}
                  recordingTime={recordingTime}
                />
              </div>

              {/* Recording Controls */}
              <RecordingControls
                isRecording={isRecording}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onPauseRecording={handlePauseRecording}
                isPaused={isPaused}
                recordingTime={recordingTime}
                canRecord={canRecord}
              />

              {/* Mobile-only Live Feedback */}
              <div className="lg:hidden">
                <LiveFeedbackPanel
                  isRecording={isRecording}
                  selectedSport={selectedSport}
                  feedbackEnabled={feedbackEnabled}
                  onToggleFeedback={handleToggleFeedback}
                  currentScore={currentScore}
                />
              </div>
            </div>

            {/* Right Column - Settings and Feedback */}
            <div className="space-y-6">
              {/* Sport Selection */}
              <SportSelector
                selectedSport={selectedSport}
                onSportChange={handleSportChange}
                disabled={isRecording}
              />

              {/* Session Settings */}
              <SessionSettings
                settings={sessionSettings}
                onSettingsChange={handleSettingsChange}
                disabled={isRecording}
              />

              {/* Desktop Live Feedback */}
              <div className="hidden lg:block">
                <LiveFeedbackPanel
                  isRecording={isRecording}
                  selectedSport={selectedSport}
                  feedbackEnabled={feedbackEnabled}
                  onToggleFeedback={handleToggleFeedback}
                  currentScore={currentScore}
                />
              </div>
            </div>
          </div>

          {/* Status Bar */}
          {isRecording && (
            <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-8 md:right-8 z-50">
              <div className="bg-card border border-border rounded-lg p-4 shadow-biomech-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-foreground">
                        {isPaused ? 'Recording Paused' : 'Recording Active'}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Sport: {selectedSport}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Score: <span className={currentScore >= 85 ? 'text-success' : currentScore >= 70 ? 'text-warning' : 'text-destructive'}>
                        {currentScore}/100
                      </span>
                    </div>

                    {/* Voice Coaching Status Indicator */}
                    {sessionSettings?.audioFeedback && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Icon
                          name={voiceCoachingActive ? "Volume2" : "VolumeX"}
                          size={14}
                          className={voiceCoachingActive ? "text-success" : "text-muted-foreground"}
                        />
                        <span className={voiceCoachingActive ? "text-success" : "text-muted-foreground"}>
                          {voiceCoachingActive ? 'Coach Active' : 'Coach Paused'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePauseRecording}
                    >
                      <Icon name={isPaused ? "Play" : "Pause"} size={14} className="mr-1" />
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleStopRecording}
                    >
                      <Icon name="Square" size={14} className="mr-1" />
                      Stop
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoCapture;