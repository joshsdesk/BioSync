import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SkeletalOverlay from './SkeletalOverlay';

const VideoPlayer = ({ videoUrl, overlayData, onTimeUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showOverlay, setShowOverlay] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  // Fallback video URLs for demo purposes
  const fallbackVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    // Blob URL for completely offline fallback
    'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAr1tZGF0AAABrgYF//+c3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjY0MyA1YzY1NzA0IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAQAAAAAAAAAAEAAAAAAAAAAEAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAEAAAAAAAABkAAAAAAAAAAQAAAAAAAAAAEAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAZAAAIAAAAABAAAAAAGQQ==',
  ];

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video?.currentTime);
      onTimeUpdate?.(video?.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video?.duration);
      setIsLoading(false);
      setVideoError(false);
    };

    const handleError = (e) => {
      console.warn('Video load error:', e);
      setVideoError(true);
      setIsLoading(false);
      
      // Try fallback videos
      const currentIndex = fallbackVideos?.indexOf(video?.src);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < fallbackVideos?.length) {
        video.src = fallbackVideos?.[nextIndex];
        video?.load();
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setVideoError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setVideoError(false);
    };

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('loadedmetadata', handleLoadedMetadata);
    video?.addEventListener('error', handleError);
    video?.addEventListener('loadstart', handleLoadStart);
    video?.addEventListener('canplay', handleCanPlay);

    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video?.removeEventListener('error', handleError);
      video?.removeEventListener('loadstart', handleLoadStart);
      video?.removeEventListener('canplay', handleCanPlay);
    };
  }, [onTimeUpdate]);

  const togglePlay = () => {
    const video = videoRef?.current;
    if (videoError) return;
    
    if (video?.paused) {
      video?.play()?.catch((e) => {
        console.warn('Play failed:', e);
      });
      setIsPlaying(true);
    } else {
      video?.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    if (videoError) return;
    
    const video = videoRef?.current;
    const rect = e?.currentTarget?.getBoundingClientRect();
    const pos = (e?.clientX - rect?.left) / rect?.width;
    video.currentTime = pos * duration;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const handleVolumeChange = (e) => {
    if (videoError) return;
    
    const newVolume = parseFloat(e?.target?.value);
    setVolume(newVolume);
    if (videoRef?.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleRetryLoad = () => {
    const video = videoRef?.current;
    if (video) {
      setVideoError(false);
      setIsLoading(true);
      
      // Try the original URL first, then fallbacks
      const urlsToTry = [videoUrl, ...fallbackVideos];
      video.src = urlsToTry?.[0];
      video?.load();
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden">
      {/* Video Element */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={videoUrl || fallbackVideos?.[0]}
          className="w-full h-full object-cover"
          onEnded={() => setIsPlaying(false)}
          crossOrigin="anonymous"
        />
        
        {/* Loading State */}
        {isLoading && !videoError && (
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-lg">Loading video...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {videoError && (
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <Icon name="AlertTriangle" size={48} className="mx-auto text-yellow-500" />
              <div className="space-y-2">
                <h3 className="text-white text-xl font-semibold">Video Unavailable</h3>
                <p className="text-slate-300 max-w-md">
                  The training video could not be loaded. This is likely due to the demo video source being unavailable.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleRetryLoad}
                iconName="RefreshCw"
                iconPosition="left"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Retry Loading
              </Button>
              <p className="text-sm text-slate-400">
                In a real application, your uploaded videos would be stored securely and available for playback.
              </p>
            </div>
          </div>
        )}
        
        {/* Enhanced Skeletal Overlay */}
        {!videoError && !isLoading && (
          <SkeletalOverlay
            overlayData={overlayData}
            currentTime={currentTime}
            isVisible={showOverlay}
          />
        )}
        
        {/* Play/Pause Overlay */}
        {!videoError && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="w-16 h-16 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={32} />
            </Button>
          </div>
        )}
      </div>
      {/* Video Controls */}
      {!videoError && (
        <div className="bg-slate-800 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-300 font-mono min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-2 bg-slate-600 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm text-slate-300 font-mono min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                disabled={isLoading}
                className="text-white hover:bg-slate-700"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (videoRef?.current) {
                    videoRef.current.currentTime = Math.max(0, currentTime - 10);
                  }
                }}
                disabled={isLoading}
                className="text-white hover:bg-slate-700"
              >
                <Icon name="RotateCcw" size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (videoRef?.current) {
                    videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                  }
                }}
                disabled={isLoading}
                className="text-white hover:bg-slate-700"
              >
                <Icon name="RotateCw" size={20} />
              </Button>
              
              <div className="flex items-center space-x-2 ml-4">
                <Icon name="Volume2" size={16} className="text-slate-300" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  disabled={isLoading}
                  className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={showOverlay ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowOverlay(!showOverlay)}
                disabled={isLoading}
                className={showOverlay ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"}
              >
                <Icon name="Eye" size={16} className="mr-2" />
                Overlay
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (videoRef?.current?.requestFullscreen) {
                    videoRef?.current?.requestFullscreen();
                  }
                }}
                disabled={isLoading}
                className="text-white hover:bg-slate-700"
              >
                <Icon name="Maximize" size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;