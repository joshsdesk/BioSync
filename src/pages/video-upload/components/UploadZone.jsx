import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFileSelect, uploadProgress, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = ['.mp4', '.mov', '.avi', '.webm'];
  const maxFileSize = 500; // MB

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      const extension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
      return supportedFormats?.includes(extension) && file?.size <= maxFileSize * 1024 * 1024;
    });

    if (validFiles?.length > 0) {
      onFileSelect(validFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-105'
            : isUploading
            ? 'border-warning bg-warning/5' :'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".mp4,.mov,.avi,.webm"
          onChange={handleFileInput}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-warning/20 rounded-full flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-warning animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Uploading Video...</h3>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="VideoIcon" size={40} className="text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isDragOver ? 'Drop your videos here' : 'Upload Training Videos'}
              </h3>
              <p className="text-muted-foreground">
                Drag and drop your videos or click to browse
              </p>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={openFileDialog}
              iconName="Upload"
              iconPosition="left"
              className="mx-auto"
            >
              Choose Files
            </Button>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p className="font-medium">Supported Formats:</p>
                <p>{supportedFormats?.join(', ')}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Max File Size:</p>
                <p>{maxFileSize}MB per file</p>
              </div>
            </div>
          </div>
        )}

        {isDragOver && (
          <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center">
            <div className="text-primary font-semibold text-lg">Drop files here</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadZone;