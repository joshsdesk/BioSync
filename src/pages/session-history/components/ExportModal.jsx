import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ sessions, onClose, onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeRecommendations: true,
    includeFocusAreas: true,
    includeNotes: false,
    includeComparison: false
  });
  const [selectedSessions, setSelectedSessions] = useState(
    sessions?.reduce((acc, session) => ({ ...acc, [session?.id]: true }), {})
  );

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', icon: 'FileText', description: 'Comprehensive report with charts and analysis' },
    { value: 'csv', label: 'CSV Data', icon: 'Table', description: 'Raw data for spreadsheet analysis' },
    { value: 'json', label: 'JSON Export', icon: 'Code', description: 'Technical data format for developers' }
  ];

  const handleExport = () => {
    const sessionsToExport = sessions?.filter(session => selectedSessions?.[session?.id]);
    onExport({
      sessions: sessionsToExport,
      format: exportFormat,
      options: exportOptions
    });
  };

  const toggleSessionSelection = (sessionId) => {
    setSelectedSessions(prev => ({
      ...prev,
      [sessionId]: !prev?.[sessionId]
    }));
  };

  const toggleAllSessions = () => {
    const allSelected = Object.values(selectedSessions)?.every(Boolean);
    const newSelection = sessions?.reduce((acc, session) => ({
      ...acc,
      [session?.id]: !allSelected
    }), {});
    setSelectedSessions(newSelection);
  };

  const selectedCount = Object.values(selectedSessions)?.filter(Boolean)?.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Export Session Data</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Export Format Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Export Format</h3>
            <div className="grid grid-cols-1 gap-3">
              {formatOptions?.map((format) => (
                <label
                  key={format?.value}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-biomech ${
                    exportFormat === format?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="exportFormat"
                    value={format?.value}
                    checked={exportFormat === format?.value}
                    onChange={(e) => setExportFormat(e?.target?.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <Icon name={format?.icon} size={20} className="text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-card-foreground">{format?.label}</div>
                    <div className="text-sm text-muted-foreground">{format?.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Session Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-card-foreground">Select Sessions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAllSessions}
              >
                {Object.values(selectedSessions)?.every(Boolean) ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
              {sessions?.map((session) => (
                <label
                  key={session?.id}
                  className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                >
                  <Checkbox
                    checked={selectedSessions?.[session?.id]}
                    onChange={() => toggleSessionSelection(session?.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-card-foreground truncate">
                        {session?.sport} - {session?.exercise}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {new Date(session.date)?.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Score: {session?.score}/100 • Duration: {session?.duration}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              {selectedCount} of {sessions?.length} sessions selected
            </div>
          </div>

          {/* Export Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Export Options</h3>
            <div className="space-y-3">
              <Checkbox
                label="Include Progress Charts"
                description="Add visual charts showing performance trends"
                checked={exportOptions?.includeCharts}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e?.target?.checked }))}
              />
              
              <Checkbox
                label="Include Recommendations"
                description="Add coaching recommendations and improvement tips"
                checked={exportOptions?.includeRecommendations}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeRecommendations: e?.target?.checked }))}
              />
              
              <Checkbox
                label="Include Focus Areas Analysis"
                description="Add detailed breakdown of biomechanical focus points"
                checked={exportOptions?.includeFocusAreas}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeFocusAreas: e?.target?.checked }))}
              />
              
              <Checkbox
                label="Include Session Notes"
                description="Add any personal notes or comments from sessions"
                checked={exportOptions?.includeNotes}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeNotes: e?.target?.checked }))}
              />
              
              {selectedCount > 1 && (
                <Checkbox
                  label="Include Session Comparison"
                  description="Add comparative analysis between selected sessions"
                  checked={exportOptions?.includeComparison}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeComparison: e?.target?.checked }))}
                />
              )}
            </div>
          </div>

          {/* Export Preview */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h4 className="font-medium text-card-foreground mb-2">Export Preview</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Format: {formatOptions?.find(f => f?.value === exportFormat)?.label}</div>
              <div>Sessions: {selectedCount} selected</div>
              <div>
                Options: {Object.entries(exportOptions)?.filter(([_, value]) => value)?.length} enabled
              </div>
              <div className="text-xs mt-2 text-muted-foreground">
                Estimated file size: {selectedCount < 5 ? 'Small' : selectedCount < 15 ? 'Medium' : 'Large'} 
                ({exportFormat === 'pdf' ? '2-5 MB' : exportFormat === 'csv' ? '< 1 MB' : '< 500 KB'})
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Export will include {selectedCount} session{selectedCount !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              iconName="Download"
              onClick={handleExport}
              disabled={selectedCount === 0}
            >
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;