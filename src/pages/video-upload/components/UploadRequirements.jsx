import React from 'react';
import Icon from '../../../components/AppIcon';

const UploadRequirements = () => {
  const requirements = [
    {
      icon: 'Video',
      title: 'Video Quality',
      items: [
        'Minimum 720p resolution (1080p recommended)',
        'Clear view of full body movement',
        'Good lighting conditions',
        'Stable camera position'
      ]
    },
    {
      icon: 'Clock',
      title: 'Duration Guidelines',
      items: [
        'Minimum 10 seconds per movement',
        'Maximum 5 minutes per video',
        'Include complete movement cycles',
        'Multiple angles preferred'
      ]
    },
    {
      icon: 'Shield',
      title: 'File Requirements',
      items: [
        'Supported: MP4, MOV, AVI, WEBM',
        'Maximum 500MB per file',
        'H.264 codec recommended',
        'Frame rate: 30fps or higher'
      ]
    }
  ];

  const tips = [
    {
      icon: 'Camera',
      text: 'Position camera at athlete\'s side for best biomechanical analysis'
    },
    {
      icon: 'Sun',
      text: 'Ensure even lighting to avoid shadows on the athlete'
    },
    {
      icon: 'Users',
      text: 'Clear background helps AI focus on movement patterns'
    },
    {
      icon: 'Zap',
      text: 'Multiple repetitions provide more accurate analysis'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="CheckCircle" size={20} className="text-success" />
        <h3 className="text-lg font-semibold text-foreground">Upload Requirements</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {requirements?.map((req, index) => (
          <div key={index} className="p-4 bg-surface border border-border rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={req?.icon} size={16} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">{req?.title}</h4>
            </div>
            <ul className="space-y-2">
              {req?.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                  <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
          <Icon name="Lightbulb" size={18} className="text-accent" />
          <span>Pro Tips for Better Analysis</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips?.map((tip, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Icon name={tip?.icon} size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{tip?.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Privacy & Security</h4>
            <p className="text-sm text-muted-foreground">
              All uploaded videos are encrypted and processed securely. Videos are automatically 
              deleted after 30 days unless saved to your personal library. We never share your 
              training data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRequirements;