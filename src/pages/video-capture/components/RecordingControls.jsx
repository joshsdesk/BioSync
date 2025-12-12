import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecordingControls = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  onPauseRecording,
  isPaused,
  recordingTime,
  canRecord 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-center space-y-6">
        {/* Timer Display */}
        <div className="space-y-2">
          <div className="text-3xl font-mono font-bold text-foreground">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            {isRecording ? (isPaused ? 'Recording Paused' : 'Recording in Progress') : 'Ready to Record'}
          </div>
        </div>

        {/* Main Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <Button
              onClick={onStartRecording}
              disabled={!canRecord}
              size="lg"
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-4 rounded-full"
            >
              <Icon name="Circle" size={24} className="mr-2 fill-current" />
              Start Recording
            </Button>
          ) : (
            <>
              <Button
                onClick={onPauseRecording}
                variant="outline"
                size="lg"
                className="px-6 py-3"
              >
                <Icon name={isPaused ? "Play" : "Pause"} size={20} className="mr-2" />
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              
              <Button
                onClick={onStopRecording}
                variant="destructive"
                size="lg"
                className="px-8 py-3 rounded-full"
              >
                <Icon name="Square" size={20} className="mr-2" />
                Stop Recording
              </Button>
            </>
          )}
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-center space-x-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Icon name="Settings" size={16} className="mr-2" />
            Settings
          </Button>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Icon name="Camera" size={16} className="mr-2" />
            Switch Camera
          </Button>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Icon name="Mic" size={16} className="mr-2" />
            Audio
          </Button>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className="flex items-center space-x-1 text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Live Analysis Active</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="text-muted-foreground">
              AI Coaching Enabled
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isRecording && (
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-3">Quick Actions</div>
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="Upload" size={14} className="mr-1" />
                Upload Video
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="History" size={14} className="mr-1" />
                View History
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="BarChart3" size={14} className="mr-1" />
                Results
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingControls;