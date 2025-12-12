import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProcessingStatus = ({ 
  processingStage, 
  progress, 
  estimatedTime, 
  onViewResults, 
  onUploadAnother,
  fileName 
}) => {
  const stages = [
    { id: 'upload', label: 'Upload Complete', icon: 'Upload' },
    { id: 'validation', label: 'File Validation', icon: 'CheckCircle' },
    { id: 'analysis', label: 'AI Analysis', icon: 'Brain' },
    { id: 'processing', label: 'Biomech Processing', icon: 'Activity' },
    { id: 'complete', label: 'Analysis Complete', icon: 'CheckCircle2' }
  ];

  const getCurrentStageIndex = () => {
    return stages?.findIndex(stage => stage?.id === processingStage);
  };

  const getStageStatus = (index) => {
    const currentIndex = getCurrentStageIndex();
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          {processingStage === 'complete' ? (
            <Icon name="CheckCircle2" size={32} className="text-success" />
          ) : (
            <Icon name="Brain" size={32} className="text-primary animate-pulse" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          {processingStage === 'complete' ? 'Analysis Complete!' : 'Processing Your Video'}
        </h2>
        <p className="text-muted-foreground">{fileName}</p>
      </div>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              processingStage === 'complete' ? 'bg-success' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {estimatedTime > 0 && processingStage !== 'complete' && (
          <p className="text-sm text-muted-foreground text-center">
            Estimated time remaining: {formatTime(estimatedTime)}
          </p>
        )}
      </div>
      {/* Processing Stages */}
      <div className="space-y-3">
        {stages?.map((stage, index) => {
          const status = getStageStatus(index);
          return (
            <div key={stage?.id} className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  status === 'completed'
                    ? 'bg-success text-success-foreground'
                    : status === 'active' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
                }`}
              >
                {status === 'completed' ? (
                  <Icon name="Check" size={16} />
                ) : status === 'active' ? (
                  <Icon name={stage?.icon} size={16} className="animate-pulse" />
                ) : (
                  <Icon name={stage?.icon} size={16} />
                )}
              </div>
              <span
                className={`font-medium ${
                  status === 'completed'
                    ? 'text-success'
                    : status === 'active' ?'text-primary' :'text-muted-foreground'
                }`}
              >
                {stage?.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Analysis Details */}
      {processingStage !== 'upload' && processingStage !== 'validation' && (
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <h4 className="font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Activity" size={16} className="text-accent" />
            <span>Analysis in Progress</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Eye" size={14} className="text-primary" />
              <span className="text-muted-foreground">Motion tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={14} className="text-primary" />
              <span className="text-muted-foreground">Joint analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={14} className="text-primary" />
              <span className="text-muted-foreground">Force calculation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="BarChart3" size={14} className="text-primary" />
              <span className="text-muted-foreground">Performance scoring</span>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      {processingStage === 'complete' && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="default"
            size="lg"
            onClick={onViewResults}
            iconName="BarChart3"
            iconPosition="left"
            fullWidth
          >
            View Analysis Results
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onUploadAnother}
            iconName="Plus"
            iconPosition="left"
            fullWidth
          >
            Upload Another Video
          </Button>
        </div>
      )}
      {/* Processing Info */}
      {processingStage !== 'complete' && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">What's Happening?</h4>
              <p className="text-sm text-muted-foreground">
                Our AI is analyzing your video frame by frame, tracking joint movements, 
                calculating biomechanical forces, and generating personalized coaching feedback. 
                This process ensures the most accurate analysis possible.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingStatus;