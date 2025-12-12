import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CameraPreview = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  selectedSport,
  showSkeleton,
  recordingTime 
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      // Check if browser supports permissions API
      if (navigator?.permissions?.query) {
        const cameraPermission = await navigator.permissions?.query({ name: 'camera' });
        setPermissionState(cameraPermission?.state);
        
        if (cameraPermission?.state === 'granted') {
          initializeCamera();
        } else if (cameraPermission?.state === 'denied') {
          setCameraError('Camera access was denied. Please enable camera permissions in your browser settings.');
          setIsLoading(false);
        } else {
          // Permission is 'prompt' - user hasn't been asked yet
          setIsLoading(false);
        }
      } else {
        // Fallback for browsers without permissions API
        initializeCamera();
      }
    } catch (error) {
      console.error('Permission check error:', error);
      initializeCamera(); // Fallback to attempting camera access
    }
  };

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);

      // Check if getUserMedia is supported
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      const mediaStream = await navigator.mediaDevices?.getUserMedia({
        video: {
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          facingMode: 'user'
        },
        audio: true
      });
      
      setStream(mediaStream);
      setPermissionState('granted');
      
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setCameraError(null);
    } catch (error) {
      console.error('Camera initialization error:', error);
      
      // Handle specific error types
      if (error?.name === 'NotAllowedError') {
        setCameraError('Camera access was denied. Please click "Allow" when prompted or check your browser permissions.');
        setPermissionState('denied');
      } else if (error?.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a camera and try again.');
      } else if (error?.name === 'NotReadableError') {
        setCameraError('Camera is being used by another application. Please close other applications and try again.');
      } else if (error?.name === 'OverconstrainedError') {
        setCameraError('Camera does not support the required settings. Trying with basic settings...');
        // Try with basic constraints
        tryBasicCamera();
        return;
      } else if (error?.message?.includes('Permission dismissed') || error?.name === 'AbortError') {
        setCameraError('Camera permission was dismissed or cancelled. Please try again and click "Allow" when prompted.');
        setPermissionState('prompt'); // Reset to prompt state so user can try again
      } else {
        setCameraError('Camera initialization failed. Please refresh the page and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tryBasicCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices?.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      setPermissionState('granted');
      
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setCameraError(null);
    } catch (error) {
      setCameraError('Camera access failed. Please check your camera permissions and try again.');
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    setCameraError(null); // Clear any previous error
    setPermissionState('prompt'); // Reset permission state
    await initializeCamera();
  };

  const openBrowserSettings = () => {
    // Provide instructions for different browsers
    const userAgent = navigator?.userAgent?.toLowerCase();
    let instructions = '';
    
    if (userAgent?.includes('chrome')) {
      instructions = 'Click the camera icon in the address bar and select "Always allow".';
    } else if (userAgent?.includes('firefox')) {
      instructions = 'Click the shield icon in the address bar and enable camera permissions.';
    } else if (userAgent?.includes('safari')) {
      instructions = 'Go to Safari > Settings > Websites > Camera and allow access.';
    } else {
      instructions = 'Check your browser settings to enable camera permissions for this website.';
    }
    
    alert(`To enable camera access:\n\n${instructions}\n\nThen refresh the page and try again.`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const renderSkeletonOverlay = () => {
    if (!showSkeleton) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <circle cx="200" cy="80" r="25" fill="none" stroke="#10B981" strokeWidth="2" className="animate-pulse" />
          
          {/* Spine */}
          <line x1="200" y1="105" x2="200" y2="300" stroke="#10B981" strokeWidth="3" />
          
          {/* Shoulders */}
          <line x1="150" y1="140" x2="250" y2="140" stroke="#10B981" strokeWidth="2" />
          
          {/* Arms */}
          <line x1="150" y1="140" x2="120" y2="200" stroke="#10B981" strokeWidth="2" />
          <line x1="120" y1="200" x2="100" y2="260" stroke="#10B981" strokeWidth="2" />
          <line x1="250" y1="140" x2="280" y2="200" stroke="#10B981" strokeWidth="2" />
          <line x1="280" y1="200" x2="300" y2="260" stroke="#10B981" strokeWidth="2" />
          
          {/* Hips */}
          <line x1="170" y1="300" x2="230" y2="300" stroke="#10B981" strokeWidth="2" />
          
          {/* Legs */}
          <line x1="170" y1="300" x2="160" y2="400" stroke="#10B981" strokeWidth="2" />
          <line x1="160" y1="400" x2="150" y2="500" stroke="#10B981" strokeWidth="2" />
          <line x1="230" y1="300" x2="240" y2="400" stroke="#10B981" strokeWidth="2" />
          <line x1="240" y1="400" x2="250" y2="500" stroke="#10B981" strokeWidth="2" />
          
          {/* Joint markers */}
          <circle cx="150" cy="140" r="4" fill="#DC2626" className="animate-pulse" />
          <circle cx="250" cy="140" r="4" fill="#DC2626" className="animate-pulse" />
          <circle cx="120" cy="200" r="4" fill="#F59E0B" />
          <circle cx="280" cy="200" r="4" fill="#F59E0B" />
          <circle cx="170" cy="300" r="4" fill="#DC2626" className="animate-pulse" />
          <circle cx="230" cy="300" r="4" fill="#DC2626" className="animate-pulse" />
          <circle cx="160" cy="400" r="4" fill="#F59E0B" />
          <circle cx="240" cy="400" r="4" fill="#F59E0B" />
        </svg>
      </div>
    );
  };

  // Enhanced error UI with better recovery options for permission dismissed
  if (cameraError) {
    return (
      <div className="relative w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <Icon 
            name={permissionState === 'denied' ? "CameraOff" : "Camera"} 
            size={48} 
            className="text-muted-foreground mx-auto mb-4" 
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {permissionState === 'denied' ? 'Camera Access Blocked' : 'Camera Permission Required'}
          </h3>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            {cameraError}
          </p>
          
          <div className="flex flex-col space-y-3">
            {(permissionState === 'prompt' || cameraError?.includes('dismissed') || cameraError?.includes('cancelled')) && (
              <Button onClick={requestPermission} className="w-full">
                <Icon name="Camera" size={16} className="mr-2" />
                Try Camera Access Again
              </Button>
            )}
            
            {permissionState === 'denied' && (
              <Button onClick={openBrowserSettings} variant="outline" className="w-full">
                <Icon name="Settings" size={16} className="mr-2" />
                Open Browser Settings
              </Button>
            )}
            
            <Button onClick={initializeCamera} variant="outline" className="w-full">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Retry Connection
            </Button>
            
            {/* Alternative action for users who can't enable camera */}
            <Button 
              onClick={() => window.location.href = '/video-upload'} 
              variant="secondary" 
              className="w-full"
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Upload Video Instead
            </Button>
          </div>
          
          {/* Enhanced help text with troubleshooting steps */}
          <div className="mt-6 p-4 bg-background rounded-lg border">
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="flex items-start space-x-1">
                <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
                <span>Camera access is required for live motion analysis and recording</span>
              </p>
              {cameraError?.includes('dismissed') && (
                <p className="flex items-start space-x-1">
                  <Icon name="AlertTriangle" size={14} className="mt-0.5 flex-shrink-0 text-warning" />
                  <span>If you accidentally clicked "Block", refresh the page or click the camera icon in your address bar</span>
                </p>
              )}
              <p className="flex items-start space-x-1">
                <Icon name="HelpCircle" size={14} className="mt-0.5 flex-shrink-0" />
                <span>Having trouble? Make sure no other apps are using your camera</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Permission prompt UI
  if (permissionState === 'prompt' && !isLoading && !stream) {
    return (
      <div className="relative w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <Icon name="Camera" size={48} className="text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Start Recording</h3>
          <p className="text-muted-foreground mb-6">
            Click below to enable your camera and begin motion analysis
          </p>
          <Button onClick={requestPermission} size="lg">
            <Icon name="Camera" size={16} className="mr-2" />
            Enable Camera
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              {permissionState === 'prompt' ? 'Requesting camera access...' : 'Initializing camera...'}
            </p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: 'none' }}
      />
      
      {renderSkeletonOverlay()}
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-destructive-foreground rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">REC</span>
        </div>
      )}
      
      {/* Timer */}
      {isRecording && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
          <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
        </div>
      )}
      
      {/* Sport indicator */}
      {selectedSport && (
        <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg">
          <span className="text-sm font-medium">{selectedSport}</span>
        </div>
      )}
      
      {/* Quality indicators */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          <Icon name="Wifi" size={14} />
          <span className="text-xs">HD</span>
        </div>
        <div className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          <Icon name="Mic" size={14} />
          <span className="text-xs">ON</span>
        </div>
      </div>
    </div>
  );
};

export default CameraPreview;