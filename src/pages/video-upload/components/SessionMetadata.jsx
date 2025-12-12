import React from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SessionMetadata = ({ 
  sessionData, 
  onSessionDataChange, 
  focusAreas, 
  onFocusAreasChange 
}) => {
  const availableFocusAreas = [
    { id: 'posture', label: 'Posture & Alignment', description: 'Spine, shoulder, and hip positioning' },
    { id: 'balance', label: 'Balance & Stability', description: 'Center of gravity and weight distribution' },
    { id: 'timing', label: 'Movement Timing', description: 'Sequence and coordination analysis' },
    { id: 'power', label: 'Power Generation', description: 'Force production and transfer' },
    { id: 'efficiency', label: 'Movement Efficiency', description: 'Energy conservation and optimization' },
    { id: 'technique', label: 'Technical Form', description: 'Sport-specific technique analysis' }
  ];

  const handleInputChange = (field, value) => {
    onSessionDataChange({
      ...sessionData,
      [field]: value
    });
  };

  const handleFocusAreaToggle = (areaId) => {
    const updatedAreas = focusAreas?.includes(areaId)
      ? focusAreas?.filter(id => id !== areaId)
      : [...focusAreas, areaId];
    onFocusAreasChange(updatedAreas);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="FileText" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Session Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Session Title"
          type="text"
          placeholder="e.g., Morning Training Session"
          value={sessionData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          description="Give your session a memorable name"
        />

        <Input
          label="Athlete Name"
          type="text"
          placeholder="e.g., Alex Chen"
          value={sessionData?.athleteName}
          onChange={(e) => handleInputChange('athleteName', e?.target?.value)}
          description="Name of the athlete being analyzed"
        />
      </div>
      <Input
        label="Session Description"
        type="text"
        placeholder="Describe the training focus, goals, or specific movements..."
        value={sessionData?.description}
        onChange={(e) => handleInputChange('description', e?.target?.value)}
        description="Optional details about this training session"
      />
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={18} className="text-accent" />
          <h4 className="font-semibold text-foreground">Analysis Focus Areas</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Select specific areas for detailed biomechanical analysis
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableFocusAreas?.map((area) => (
            <div key={area?.id} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <Checkbox
                label={area?.label}
                description={area?.description}
                checked={focusAreas?.includes(area?.id)}
                onChange={() => handleFocusAreaToggle(area?.id)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Analysis Enhancement</h4>
            <p className="text-sm text-muted-foreground">
              Providing detailed session information and focus areas helps our AI deliver more targeted 
              and accurate biomechanical analysis tailored to your specific training goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionMetadata;