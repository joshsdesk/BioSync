import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import UploadZone from './components/UploadZone';
import SportSelector from './components/SportSelector';
import SessionMetadata from './components/SessionMetadata';
import UploadRequirements from './components/UploadRequirements';
import ProcessingStatus from './components/ProcessingStatus';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { analysisService } from '../../services/analysisService';
import { supabase } from '../../lib/supabase';
import { analyzeVideoMovement } from '../../services/geminiAnalysis';
import { compressionService } from '../../services/compressionService';
import { v4 as uuidv4 } from 'uuid';

const VideoUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('upload'); // upload, metadata, compression, processing
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [detectedSport, setDetectedSport] = useState('');
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState('upload');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [sessionData, setSessionData] = useState({
    title: '',
    athleteName: '',
    description: ''
  });
  const [focusAreas, setFocusAreas] = useState([]);
  const [customSports, setCustomSports] = useState([]); // New state for custom sports
  const [uploadError, setUploadError] = useState(null);
  const [actualUploadProgress, setActualUploadProgress] = useState(0);

  // Auto-detect sport from filename
  const detectSportFromFilename = (filename) => {
    const sportKeywords = {
      basketball: ['basketball', 'bball', 'shoot', 'dribble'],
      tennis: ['tennis', 'serve', 'forehand', 'backhand'],
      golf: ['golf', 'swing', 'putt', 'drive'],
      soccer: ['soccer', 'football', 'kick', 'goal'],
      baseball: ['baseball', 'bat', 'pitch', 'swing'],
      swimming: ['swim', 'stroke', 'freestyle', 'butterfly'],
      running: ['run', 'sprint', 'jog', 'marathon'],
      weightlifting: ['lift', 'squat', 'deadlift', 'bench'],
      volleyball: ['volleyball', 'spike', 'serve', 'block'],
      gymnastics: ['gymnastics', 'floor', 'vault', 'beam']
    };

    const lowerFilename = filename?.toLowerCase();
    for (const [sport, keywords] of Object.entries(sportKeywords)) {
      if (keywords?.some(keyword => lowerFilename?.includes(keyword))) {
        return sport;
      }
    }
    return null;
  };

  // Handle custom sport addition
  const handleAddCustomSport = (customSport) => {
    const newCustomSport = {
      value: customSport?.name?.toLowerCase()?.replace(/\s+/g, '-'),
      label: customSport?.name,
      description: customSport?.description || 'Custom sport added by user',
      isCustom: true
    };

    setCustomSports(prev => [...prev, newCustomSport]);
    setSelectedSport(newCustomSport?.value);
  };

  const handleFileSelect = (files) => {
    setSelectedFiles(files);

    // Auto-detect sport from first file
    if (files?.length > 0) {
      const detected = detectSportFromFilename(files?.[0]?.name);
      if (detected) {
        setDetectedSport(detected);
        setSelectedSport(detected);
        setIsAutoDetected(true);
      }
    }

    setCurrentStep('metadata');
  };

  const handleStartProcessing = async () => {
    if (!selectedSport || selectedFiles?.length === 0 || !user) {
      if (!user) {
        setUploadError('You must be logged in to upload videos');
      }
      return;
    }

    setCurrentStep('processing');
    setIsUploading(true);
    setUploadError(null);

    try {
      const file = selectedFiles?.[0];
      const sessionId = uuidv4();

      // Step ½: Compress Video
      setProcessingStage('compression');
      const compressedFile = await compressionService.compressVideo(file, (progress) => {
        setProcessingProgress(progress);
        setEstimatedTime(Math.round((100 - progress) * 0.5));
      });

      // Step 1: Upload video to Supabase Storage
      setProcessingStage('upload');
      const { data: videoUploadData, error: videoUploadError } = await storageService?.uploadVideo(
        compressedFile,
        user?.id,
        sessionId
      );

      if (videoUploadError) throw new Error(`Video upload failed: ${videoUploadError.message}`);

      setActualUploadProgress(30);

      // Step 2: Generate and upload thumbnail
      setProcessingStage('validation');
      let thumbnailUrl = null;
      try {
        const thumbnailFile = await storageService?.generateVideoThumbnail(file);
        const { data: thumbUploadData, error: thumbUploadError } = await storageService?.uploadThumbnail(
          thumbnailFile,
          user?.id,
          sessionId
        );

        if (!thumbUploadError) {
          thumbnailUrl = thumbUploadData?.path;
        }
      } catch (thumbError) {
        console.warn('Thumbnail generation failed:', thumbError);
      }

      setActualUploadProgress(50);

      // Step 3: Get video duration and sport ID
      const videoDuration = await getVideoDuration(file);
      const { data: sportData } = await supabase?.from('sports')?.select('id')?.eq('name', selectedSport)?.single();

      // Step 4: Create analysis session in database
      const { data: createdSession, error: sessionError } = await analysisService?.createSession({
        sportId: sportData?.id || null,
        title: sessionData?.title,
        description: sessionData?.description,
        athleteName: sessionData?.athleteName,
        sessionDate: new Date()?.toISOString()?.split('T')?.[0],
        videoUrl: videoUploadData?.path,
        thumbnailUrl: thumbnailUrl,
        videoDuration: videoDuration,
        focusAreas: focusAreas,
        tags: []
      });

      if (sessionError) throw new Error(`Session creation failed: ${sessionError.message}`);

      setActualUploadProgress(70);
      setIsUploading(false);

      // Step 5: Update session status to processing
      await analysisService?.updateSessionStatus(createdSession?.id, 'processing');

      // Step 6: Call Gemini AI for video analysis
      setProcessingStage('analysis');
      setProcessingProgress(10);
      setEstimatedTime(120);

      try {
        // Simulate progressive analysis stages with real AI processing
        const analysisPromises = [];

        // Start AI analysis
        const aiAnalysisPromise = analyzeVideoMovement(
          file,
          selectedSport,
          focusAreas?.join(', ') || 'overall technique'
        );

        analysisPromises?.push(aiAnalysisPromise);

        // Simulate progress during AI processing
        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => {
            const newProgress = Math.min(prev + 3, 85);
            setEstimatedTime(Math.max(0, Math.round((100 - newProgress) * 1.2)));
            return newProgress;
          });
        }, 1500);

        // Wait for AI analysis to complete
        const aiResults = await aiAnalysisPromise;
        clearInterval(progressInterval);

        setProcessingProgress(90);
        setEstimatedTime(10);

        // Step 7: Extract scores from AI analysis
        const scores = aiResults?.Scoring || aiResults?.scoring || {};
        const overallScore = scores?.['Overall technique'] || scores?.overall || 75;
        const postureScore = scores?.posture || scores?.Posture || 75;
        const balanceScore = scores?.balance || scores?.Balance || 75;
        const coordinationScore = scores?.coordination || scores?.Coordination || 75;
        const techniqueScore = scores?.technique || scores?.['Sport-specific effectiveness'] || 75;

        // Step 8: Store AI analysis in database
        await supabase?.from('analysis_sessions')?.update({
          status: 'completed',
          ai_analysis: aiResults,
          biomechanical_score: overallScore,
          overall_score: overallScore,
          posture_score: postureScore,
          balance_score: balanceScore,
          coordination_score: coordinationScore,
          technique_score: techniqueScore,
          processing_completed_at: new Date()?.toISOString()
        })?.eq('id', createdSession?.id);

        setProcessingProgress(100);
        setEstimatedTime(0);
        setProcessingStage('complete');

        // Wait a moment before navigating
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Navigate to results with session ID
        navigate(`/analysis-results?session=${createdSession?.id}`);

      } catch (aiError) {
        console.error('AI analysis error:', aiError);

        // Update session with error status but allow viewing
        await analysisService?.updateSessionStatus(
          createdSession?.id,
          'completed',
          `Analysis completed with warnings: ${aiError?.message}`
        );

        // Still navigate to results page - user can see uploaded video
        navigate(`/analysis-results?session=${createdSession?.id}`);
      }

    } catch (error) {
      console.error('Upload/processing error:', error);
      setUploadError(error?.message);
      setIsUploading(false);
      setCurrentStep('metadata');
      alert(`Upload failed: ${error?.message}`);
    }
  };

  // Helper function to get video duration
  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(null);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleViewResults = () => {
    navigate('/analysis-results');
  };

  const handleUploadAnother = () => {
    setCurrentStep('upload');
    setSelectedFiles([]);
    setSelectedSport('');
    setDetectedSport('');
    setIsAutoDetected(false);
    setUploadProgress(0);
    setProcessingProgress(0);
    setSessionData({ title: '', athleteName: '', description: '' });
    setFocusAreas([]);
  };

  const handleBackToUpload = () => {
    setCurrentStep('upload');
    setSelectedFiles([]);
  };

  const canProceed = selectedSport && sessionData?.title && focusAreas?.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Video Upload</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your training videos for comprehensive biomechanical analysis.
              Our AI will provide detailed feedback on your movement patterns and technique.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[
                { id: 'upload', label: 'Upload', icon: 'Upload' },
                { id: 'metadata', label: 'Details', icon: 'FileText' },
                { id: 'processing', label: 'Analysis', icon: 'Brain' }
              ]?.map((step, index) => {
                const isActive = currentStep === step?.id;
                const isCompleted =
                  (currentStep === 'metadata' && step?.id === 'upload') ||
                  (currentStep === 'processing' && ['upload', 'metadata']?.includes(step?.id));

                return (
                  <React.Fragment key={step?.id}>
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                          ? 'bg-success text-success-foreground'
                          : isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                          }`}
                      >
                        {isCompleted ? (
                          <Icon name="Check" size={20} />
                        ) : (
                          <Icon name={step?.icon} size={20} />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}
                      >
                        {step?.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`w-16 h-0.5 ${isCompleted ? 'bg-success' : 'bg-muted'
                          }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-4xl mx-auto">
            {currentStep === 'upload' && (
              <div className="space-y-8">
                <UploadZone
                  onFileSelect={handleFileSelect}
                  uploadProgress={uploadProgress}
                  isUploading={isUploading}
                />
                <UploadRequirements />
              </div>
            )}

            {currentStep === 'metadata' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    onClick={handleBackToUpload}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Back to Upload
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {selectedFiles?.length} file(s) selected
                  </div>
                </div>

                <SportSelector
                  selectedSport={selectedSport}
                  onSportChange={setSelectedSport}
                  detectedSport={detectedSport}
                  isAutoDetected={isAutoDetected}
                  customSports={customSports}
                  onAddCustomSport={handleAddCustomSport}
                />

                <SessionMetadata
                  sessionData={sessionData}
                  onSessionDataChange={setSessionData}
                  focusAreas={focusAreas}
                  onFocusAreasChange={setFocusAreas}
                />

                <div className="flex flex-col items-end gap-2 pt-6">
                  {!canProceed && (
                    <p className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                      ⚠️ Complete all fields to start:
                      {!selectedSport && " Select a Sport,"}
                      {!sessionData?.title && " Enter Title,"}
                      {focusAreas?.length === 0 && " Choose Focus Area"}
                    </p>
                  )}
                  <div title={!canProceed ? "Please select a sport, enter a title, and choose at least one focus area." : ""}>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleStartProcessing}
                      disabled={!canProceed}
                      iconName="Play"
                      iconPosition="left"
                    >
                      Start Analysis
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'processing' && (
              <>
                {uploadError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{uploadError}</p>
                  </div>
                )}
                <ProcessingStatus
                  processingStage={processingStage}
                  progress={isUploading ? actualUploadProgress : processingProgress}
                  estimatedTime={estimatedTime}
                  onViewResults={handleViewResults}
                  onUploadAnother={handleUploadAnother}
                  fileName={selectedFiles?.[0]?.name || 'video.mp4'}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoUpload;