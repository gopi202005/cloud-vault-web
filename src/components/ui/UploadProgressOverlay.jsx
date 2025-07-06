import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const UploadProgressOverlay = () => {
  const [uploads, setUploads] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Mock upload data for demonstration
  useEffect(() => {
    const mockUploads = [
      {
        id: 1,
        name: 'presentation-slides.pdf',
        size: 2.5 * 1024 * 1024,
        progress: 75,
        status: 'uploading',
        speed: '1.2 MB/s'
      },
      {
        id: 2,
        name: 'video-project.mp4',
        size: 150 * 1024 * 1024,
        progress: 45,
        status: 'uploading',
        speed: '2.8 MB/s'
      },
      {
        id: 3,
        name: 'design-assets.zip',
        size: 25 * 1024 * 1024,
        progress: 100,
        status: 'completed',
        speed: '0 MB/s'
      }
    ];

    // Simulate active uploads
    const hasActiveUploads = mockUploads.some(upload => upload.status === 'uploading');
    if (hasActiveUploads) {
      setUploads(mockUploads);
      setIsVisible(true);
    }
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleCancelUpload = (uploadId) => {
    setUploads(prev => prev.filter(upload => upload.id !== uploadId));
    
    // Hide overlay if no uploads remain
    const remainingUploads = uploads.filter(upload => upload.id !== uploadId);
    if (remainingUploads.length === 0) {
      setIsVisible(false);
    }
  };

  const handleClearCompleted = () => {
    setUploads(prev => prev.filter(upload => upload.status !== 'completed'));
    
    // Hide overlay if no uploads remain
    const activeUploads = uploads.filter(upload => upload.status !== 'completed');
    if (activeUploads.length === 0) {
      setIsVisible(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const activeUploads = uploads.filter(upload => upload.status === 'uploading');
  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const totalProgress = uploads.length > 0 
    ? uploads.reduce((sum, upload) => sum + upload.progress, 0) / uploads.length 
    : 0;

  if (!isVisible || uploads.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block fixed bottom-6 right-6 z-upload-progress">
        <div className="w-80 bg-background border border-border rounded-interactive shadow-elevation-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                <Icon name="Upload" size={16} color="white" />
              </div>
              <div>
                <h3 className="text-sm font-body-medium text-text-primary">
                  File Uploads
                </h3>
                <p className="text-xs font-caption-normal text-text-secondary">
                  {activeUploads.length} active, {completedUploads.length} completed
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={handleMinimize}
                className="p-1.5 rounded-container hover:bg-border-light micro-interaction"
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Icon 
                  name={isMinimized ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                  color="var(--color-text-secondary)" 
                />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-container hover:bg-border-light micro-interaction"
                aria-label="Close"
              >
                <Icon name="X" size={16} color="var(--color-text-secondary)" />
              </button>
            </div>
          </div>

          {/* Progress Content */}
          {!isMinimized && (
            <div className="max-h-64 overflow-y-auto">
              {/* Overall Progress */}
              {activeUploads.length > 0 && (
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body-medium text-text-primary">
                      Overall Progress
                    </span>
                    <span className="text-xs font-data-normal text-text-secondary">
                      {Math.round(totalProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-border-light rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-primary transition-all duration-300 ease-smooth"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Individual Upload Items */}
              <div className="divide-y divide-border">
                {uploads.map((upload) => (
                  <div key={upload.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body-medium text-text-primary truncate">
                          {upload.name}
                        </p>
                        <p className="text-xs font-data-normal text-text-secondary">
                          {formatBytes(upload.size)} • {upload.speed}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-3">
                        {upload.status === 'completed' ? (
                          <div className="flex items-center justify-center w-6 h-6 bg-success rounded-full">
                            <Icon name="Check" size={12} color="white" />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCancelUpload(upload.id)}
                            className="p-1 rounded-container hover:bg-error hover:text-error-foreground micro-interaction"
                            aria-label="Cancel upload"
                          >
                            <Icon name="X" size={12} color="currentColor" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {upload.status === 'uploading' && (
                      <div className="w-full bg-border-light rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-primary transition-all duration-300 ease-smooth"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              {completedUploads.length > 0 && (
                <div className="p-4 border-t border-border bg-surface">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCompleted}
                    className="w-full"
                  >
                    Clear Completed
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-upload-progress">
        <div className="bg-background border-t border-border shadow-elevation-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                <Icon name="Upload" size={16} color="white" />
              </div>
              <div>
                <h3 className="text-sm font-body-medium text-text-primary">
                  Uploading {activeUploads.length} files
                </h3>
                <p className="text-xs font-caption-normal text-text-secondary">
                  {Math.round(totalProgress)}% complete
                </p>
              </div>
            </div>
            
            <button
              onClick={handleMinimize}
              className="p-2 rounded-container hover:bg-surface micro-interaction"
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Icon 
                name={isMinimized ? 'ChevronUp' : 'ChevronDown'} 
                size={20} 
                color="var(--color-text-secondary)" 
              />
            </button>
          </div>

          {/* Overall Progress Bar */}
          <div className="px-4 pb-2">
            <div className="w-full bg-border-light rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-primary transition-all duration-300 ease-smooth"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>

          {/* Expanded Content */}
          {!isMinimized && (
            <div className="max-h-48 overflow-y-auto border-t border-border">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-4 border-b border-border last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body-medium text-text-primary truncate">
                      {upload.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-data-normal text-text-secondary">
                        {upload.progress}%
                      </span>
                      <span className="text-xs font-data-normal text-text-secondary">
                        {upload.speed}
                      </span>
                    </div>
                  </div>
                  
                  {upload.status === 'completed' ? (
                    <div className="flex items-center justify-center w-8 h-8 bg-success rounded-full ml-3">
                      <Icon name="Check" size={16} color="white" />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCancelUpload(upload.id)}
                      className="p-2 rounded-container hover:bg-error hover:text-error-foreground micro-interaction ml-3"
                      aria-label="Cancel upload"
                    >
                      <Icon name="X" size={16} color="currentColor" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadProgressOverlay;