import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFilesSelected, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const supportedFormats = {
    video: ['MP4', 'AVI', 'MOV', 'WebM'],
    image: ['JPEG', 'PNG', 'GIF', 'WebP', 'SVG']
  };

  const maxFileSize = 500 * 1024 * 1024; // 500MB

  const validateFile = useCallback((file) => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File "${file.name}" is too large. Maximum size is 500MB.`;
    }
    
    // Check file type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      return `File "${file.name}" is not a supported format. Please upload video or image files only.`;
    }
    
    return null;
  }, [maxFileSize]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setError(null);
    
    const files = Array.from(e.dataTransfer?.files || []);
    
    if (files.length === 0) {
      setError('No files were dropped.');
      return;
    }

    // Validate files
    const validationErrors = [];
    const validFiles = [];
    
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    }
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
    }
    
    if (validFiles.length > 0) {
      onFilesSelected?.(validFiles);
    }
  }, [validateFile, onFilesSelected]);

  const handleFileSelect = useCallback((e) => {
    console.log('File input changed:', e.target?.files);
    setError(null);
    
    const files = Array.from(e.target?.files || []);
    
    if (files.length === 0) {
      return;
    }

    // Validate files
    const validationErrors = [];
    const validFiles = [];
    
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    }
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
    }
    
    if (validFiles.length > 0) {
      onFilesSelected?.(validFiles);
    }
    
    // Reset input value to allow same file selection
    if (e.target) {
      e.target.value = '';
    }
  }, [validateFile, onFilesSelected]);

  const handleBrowseClick = useCallback((e) => {
    console.log('Browse button clicked, opening file dialog');
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any existing errors
    setError(null);
    
    // Debug file input ref
    console.log('File input ref:', fileInputRef.current);
    
    if (fileInputRef.current) {
      try {
        fileInputRef.current.click();
      } catch (err) {
        console.error('Error opening file dialog:', err);
        setError('Failed to open file dialog. Please try again.');
      }
    } else {
      console.error('File input ref is null');
      setError('File input is not ready. Please try again.');
    }
  }, []);

  const handleUploadZoneClick = useCallback((e) => {
    console.log('Upload zone clicked');
    
    // Prevent if disabled
    if (isUploading) {
      return;
    }
    
    // Only trigger file input if not clicking on the button or other interactive elements
    if (!e.target.closest('button') && !e.target.closest('input')) {
      handleBrowseClick(e);
    }
  }, [isUploading, handleBrowseClick]);

  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="w-full">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error text-error rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} color="currentColor" className="flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              {error.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary bg-opacity-5 scale-105' :'border-border hover:border-primary hover:bg-surface'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadZoneClick}
        role="button"
        tabIndex={0}
        aria-label="Upload files by clicking or dragging and dropping"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="File upload input"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary bg-opacity-10 rounded-full">
              <Icon name="Upload" size={32} color="var(--color-primary)" />
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center justify-center w-12 h-12 bg-accent bg-opacity-10 rounded-lg">
                <Icon name="Video" size={24} color="var(--color-accent)" />
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-success bg-opacity-10 rounded-lg">
                <Icon name="Image" size={24} color="var(--color-success)" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              {isDragOver ? 'Drop files here' : 'Upload your media files'}
            </h3>
            <p className="text-sm text-text-secondary">
              Drag and drop files here, or click to browse
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="primary"
              iconName="FolderOpen"
              iconPosition="left"
              onClick={handleBrowseClick}
              disabled={isUploading}
              type="button"
            >
              Browse Files
            </Button>
            <div className="text-xs text-text-secondary">
              Max file size: 500MB
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-text-secondary">
            <div>
              <p className="font-medium mb-1">Video Formats:</p>
              <p>{supportedFormats.video.join(', ')}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Image Formats:</p>
              <p>{supportedFormats.image.join(', ')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-success bg-success bg-opacity-10 px-3 py-2 rounded-lg">
            <Icon name="Shield" size={16} color="var(--color-success)" />
            <span>Files stored locally in your browser - 100% private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;