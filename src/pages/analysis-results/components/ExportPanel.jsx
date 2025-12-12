import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportPanel = ({ sessionData, onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeVideo, setIncludeVideo] = useState(false);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { key: 'pdf', label: 'PDF Report', icon: 'FileText', description: 'Comprehensive analysis report' },
    { key: 'json', label: 'JSON Data', icon: 'Code', description: 'Raw analysis data' },
    { key: 'csv', label: 'CSV Export', icon: 'Table', description: 'Spreadsheet-compatible format' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    const exportOptions = {
      format: exportFormat,
      includeVideo,
      includeCharts,
      includeRecommendations,
      sessionData
    };
    
    try {
      await onExport(exportOptions);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedSize = () => {
    let size = 2; // Base report size in MB
    if (includeVideo) size += 50;
    if (includeCharts) size += 5;
    if (includeRecommendations) size += 1;
    return size?.toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Icon name="Download" size={20} className="mr-2 text-blue-600" />
          Export Analysis
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Generate detailed reports for coaches or personal records
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Export Format Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Export Format</label>
          <div className="space-y-2">
            {exportFormats?.map((format) => (
              <div
                key={format?.key}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  exportFormat === format?.key
                    ? 'border-blue-500 bg-blue-50' :'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setExportFormat(format?.key)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    exportFormat === format?.key
                      ? 'border-blue-500 bg-blue-500' :'border-slate-300'
                  }`}>
                    {exportFormat === format?.key && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <Icon name={format?.icon} size={16} className="text-slate-600" />
                  <div>
                    <div className="font-medium text-slate-800">{format?.label}</div>
                    <div className="text-sm text-slate-500">{format?.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Export Options */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Include in Export</label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Video" size={16} className="text-slate-600" />
                <div>
                  <div className="font-medium text-slate-800">Original Video</div>
                  <div className="text-sm text-slate-500">Include analyzed video file</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVideo}
                  onChange={(e) => setIncludeVideo(e?.target?.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="BarChart3" size={16} className="text-slate-600" />
                <div>
                  <div className="font-medium text-slate-800">Charts & Graphs</div>
                  <div className="text-sm text-slate-500">Progress tracking visualizations</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e?.target?.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Target" size={16} className="text-slate-600" />
                <div>
                  <div className="font-medium text-slate-800">Recommendations</div>
                  <div className="text-sm text-slate-500">Training drills and improvement tips</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRecommendations}
                  onChange={(e) => setIncludeRecommendations(e?.target?.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Export Summary */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Estimated File Size</span>
            <span className="text-sm font-bold text-blue-800">{getEstimatedSize()} MB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Export Format</span>
            <span className="text-sm font-bold text-blue-800 uppercase">{exportFormat}</span>
          </div>
        </div>
        
        {/* Export Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={handleExport}
            loading={isExporting}
            className="flex-1"
            iconName="Download"
            iconPosition="left"
          >
            {isExporting ? 'Generating...' : 'Export Report'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: 'BiomechCoach Analysis Report',
                  text: `Check out my latest biomechanical analysis results!`,
                  url: window.location?.href
                });
              }
            }}
            iconName="Share"
            iconPosition="left"
          >
            Share
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Email to coach functionality
                const subject = encodeURIComponent('BiomechCoach Analysis Report');
                const body = encodeURIComponent(`Hi Coach,\n\nI've completed a new biomechanical analysis session. Here are my results:\n\nOverall Score: ${sessionData?.scores?.overall}/100\nDate: ${new Date(sessionData.date)?.toLocaleDateString()}\nSport: ${sessionData?.sport}\n\nPlease review and let me know your feedback.\n\nBest regards`);
                window.open(`mailto:?subject=${subject}&body=${body}`);
              }}
              iconName="Mail"
              iconPosition="left"
            >
              Email Coach
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Print functionality
                window.print();
              }}
              iconName="Printer"
              iconPosition="left"
            >
              Print Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;