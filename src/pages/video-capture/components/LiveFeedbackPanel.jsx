import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveFeedbackPanel = ({ 
  isRecording, 
  selectedSport, 
  feedbackEnabled, 
  onToggleFeedback,
  currentScore 
}) => {
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);

  // Mock real-time feedback data
  const mockFeedbackData = {
    running: [
      { time: 5, message: "Good posture! Keep your head up and shoulders relaxed.", type: "positive", score: 85 },
      { time: 12, message: "Try to land more on your midfoot rather than heel striking.", type: "correction", score: 72 },
      { time: 18, message: "Excellent cadence! Maintain this rhythm.", type: "positive", score: 88 },
      { time: 25, message: "Slight forward lean detected. Straighten your torso.", type: "correction", score: 76 }
    ],
    weightlifting: [
      { time: 3, message: "Perfect setup! Your feet are properly positioned.", type: "positive", score: 92 },
      { time: 8, message: "Keep your core tight throughout the movement.", type: "correction", score: 78 },
      { time: 15, message: "Great depth! Full range of motion achieved.", type: "positive", score: 89 },
      { time: 22, message: "Control the descent more slowly for better form.", type: "correction", score: 74 }
    ]
  };

  useEffect(() => {
    if (isRecording && feedbackEnabled) {
      const interval = setInterval(() => {
        const sportFeedback = mockFeedbackData?.[selectedSport] || mockFeedbackData?.running;
        const randomFeedback = sportFeedback?.[Math.floor(Math.random() * sportFeedback?.length)];
        
        const newMessage = {
          id: Date.now(),
          ...randomFeedback,
          timestamp: new Date()
        };
        
        setFeedbackMessages(prev => [...prev?.slice(-4), newMessage]);
        
        // Simulate TTS playback
        if (feedbackEnabled) {
          setIsPlaying(true);
          setTimeout(() => setIsPlaying(false), 2000);
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [isRecording, feedbackEnabled, selectedSport]);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score) => {
    if (score >= 85) return 'bg-success/10';
    if (score >= 70) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'CheckCircle';
      case 'correction':
        return 'AlertTriangle';
      default:
        return 'Info';
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'correction':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Live Feedback</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={feedbackEnabled ? "default" : "outline"}
            size="sm"
            onClick={onToggleFeedback}
            disabled={!isRecording}
          >
            <Icon name={feedbackEnabled ? "Volume2" : "VolumeX"} size={16} className="mr-2" />
            {feedbackEnabled ? 'On' : 'Off'}
          </Button>
        </div>
      </div>
      {/* Current Score Display */}
      <div className={`p-4 rounded-lg mb-6 ${getScoreBackground(currentScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Current Form Score</div>
            <div className={`text-2xl font-bold ${getScoreColor(currentScore)}`}>
              {currentScore}/100
            </div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${currentScore}, 100`}
                className={getScoreColor(currentScore)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-medium ${getScoreColor(currentScore)}`}>
                {currentScore}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Audio Controls */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Volume2" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Audio Coaching</span>
          </div>
          <div className="flex items-center space-x-2">
            {isPlaying && (
              <div className="flex items-center space-x-1">
                <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
            <span className="text-xs text-muted-foreground">{volume}%</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(e?.target?.value)}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
        />
      </div>
      {/* Feedback Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="text-sm font-medium text-foreground mb-3">Recent Feedback</div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {feedbackMessages?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="MessageSquare" size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {isRecording 
                  ? 'AI analysis in progress...' :'Start recording to receive live feedback'
                }
              </p>
            </div>
          ) : (
            feedbackMessages?.map((message) => (
              <div key={message?.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <Icon 
                  name={getMessageIcon(message?.type)} 
                  size={16} 
                  className={`mt-0.5 ${getMessageColor(message?.type)}`} 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{message?.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {message?.timestamp?.toLocaleTimeString()}
                    </span>
                    <span className={`text-xs font-medium ${getScoreColor(message?.score)}`}>
                      Score: {message?.score}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Feedback Settings */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-3">Feedback Preferences</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Icon name="Zap" size={12} className="mr-1" />
            Real-time
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Icon name="Clock" size={12} className="mr-1" />
            Interval
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveFeedbackPanel;