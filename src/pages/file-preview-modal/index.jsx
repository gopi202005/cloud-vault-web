import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilePreviewHeader from './components/FilePreviewHeader';
import ImageViewer from './components/ImageViewer';
import VideoPlayer from './components/VideoPlayer';
import FileMetadata from './components/FileMetadata';
import NavigationControls from './components/NavigationControls';
import BulkActionFooter from './components/BulkActionFooter';
import ErrorState from './components/ErrorState';

const FilePreviewModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentFileIndex, setCurrentFileIndex] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock file data
  const mockFiles = [
    {
      id: 1,
      name: 'summer-vacation-2024.jpg',
      type: 'image',
      format: 'JPEG',
      size: 2.5 * 1024 * 1024,
      dimensions: '1920 × 1080',
      uploadDate: '2024-01-15T10:30:00Z',
      lastModified: '2024-01-15T10:30:00Z',
      path: '/Photos/Vacation',
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      tags: ['vacation', 'summer', '2024']
    },
    {
      id: 2,
      name: 'project-presentation.mp4',
      type: 'video',
      format: 'MP4',
      size: 45.8 * 1024 * 1024,
      dimensions: '1280 × 720',
      uploadDate: '2024-01-14T14:20:00Z',
      lastModified: '2024-01-14T14:20:00Z',
      path: '/Videos/Work',
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      tags: ['work', 'presentation']
    },
    {
      id: 3,
      name: 'design-mockup.png',
      type: 'image',
      format: 'PNG',
      size: 8.2 * 1024 * 1024,
      dimensions: '2560 × 1440',
      uploadDate: '2024-01-13T09:15:00Z',
      lastModified: '2024-01-13T09:15:00Z',
      path: '/Design/Assets',
      src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=2560&h=1440&fit=crop',
      tags: ['design', 'mockup', 'ui']
    },
    {
      id: 4,
      name: 'team-meeting-recording.mp4',
      type: 'video',
      format: 'MP4',
      size: 125.6 * 1024 * 1024,
      dimensions: '1920 × 1080',
      uploadDate: '2024-01-12T16:45:00Z',
      lastModified: '2024-01-12T16:45:00Z',
      path: '/Videos/Meetings',
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_1mb.mp4',
      tags: ['meeting', 'team', 'recording']
    },
    {
      id: 5,
      name: 'product-catalog.pdf',
      type: 'document',
      format: 'PDF',
      size: 15.3 * 1024 * 1024,
      dimensions: 'A4 (210 × 297mm)',
      uploadDate: '2024-01-11T11:30:00Z',
      lastModified: '2024-01-11T11:30:00Z',
      path: '/Documents/Marketing',
      src: null, // PDF preview not supported in this demo
      tags: ['product', 'catalog', 'marketing']
    }
  ];

  const currentFile = mockFiles[currentFileIndex - 1];
  const totalFiles = mockFiles.length;

  // Initialize from URL params
  useEffect(() => {
    const fileId = searchParams.get('id');
    const index = searchParams.get('index');
    
    if (index) {
      const indexNum = parseInt(index, 10);
      if (indexNum >= 1 && indexNum <= totalFiles) {
        setCurrentFileIndex(indexNum);
      }
    } else if (fileId) {
      const fileIndex = mockFiles.findIndex(f => f.id.toString() === fileId);
      if (fileIndex !== -1) {
        setCurrentFileIndex(fileIndex + 1);
      }
    }
    
    setIsLoading(false);
  }, [searchParams, totalFiles]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          if (currentFileIndex > 1) {
            handlePrevious();
          }
          break;
        case 'ArrowRight':
          if (currentFileIndex < totalFiles) {
            handleNext();
          }
          break;
        case 'Delete':
          handleDelete();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentFileIndex, totalFiles]);

  const handleClose = useCallback(() => {
    navigate('/file-upload-dashboard');
  }, [navigate]);

  const handlePrevious = useCallback(() => {
    if (currentFileIndex > 1) {
      setCurrentFileIndex(prev => prev - 1);
      setError(null);
    }
  }, [currentFileIndex]);

  const handleNext = useCallback(() => {
    if (currentFileIndex < totalFiles) {
      setCurrentFileIndex(prev => prev + 1);
      setError(null);
    }
  }, [currentFileIndex, totalFiles]);

  const handleDownload = useCallback(() => {
    if (currentFile?.src) {
      const link = document.createElement('a');
      link.href = currentFile.src;
      link.download = currentFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [currentFile]);

  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete "${currentFile?.name}"?`)) {
      console.log('Deleting file:', currentFile?.name);
      // In a real app, this would delete the file and update the list
      handleClose();
    }
  }, [currentFile, handleClose]);

  const handleOrganize = useCallback(() => {
    navigate('/file-organization-manager', { 
      state: { selectedFile: currentFile } 
    });
  }, [navigate, currentFile]);

  const handleAddToCollection = useCallback((collectionId) => {
    console.log('Adding file to collection:', collectionId, currentFile?.name);
    // In a real app, this would add the file to the specified collection
  }, [currentFile]);

  const handleFileLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleFileError = useCallback((errorEvent) => {
    setIsLoading(false);
    setError({
      type: 'NETWORK_ERROR',
      message: 'Failed to load file',
      details: errorEvent
    });
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
  }, []);

  const handleSkip = useCallback(() => {
    if (currentFileIndex < totalFiles) {
      handleNext();
    } else {
      handleClose();
    }
  }, [currentFileIndex, totalFiles, handleNext, handleClose]);

  // Bulk actions
  const handleSelectAll = useCallback(() => {
    setSelectedFiles(mockFiles.map(f => f.id));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const handleBulkDownload = useCallback(() => {
    console.log('Bulk downloading files:', selectedFiles);
    // In a real app, this would download all selected files
  }, [selectedFiles]);

  const handleBulkDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      console.log('Bulk deleting files:', selectedFiles);
      // In a real app, this would delete all selected files
      setSelectedFiles([]);
    }
  }, [selectedFiles]);

  const handleBulkOrganize = useCallback(() => {
    navigate('/file-organization-manager', { 
      state: { selectedFiles: selectedFiles } 
    });
  }, [navigate, selectedFiles]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-modal flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentFile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-modal flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl font-heading-semibold mb-2">File Not Found</h2>
          <p className="text-sm font-body-normal mb-4">The requested file could not be found.</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-interactive hover:bg-opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderFileContent = () => {
    if (error) {
      return (
        <ErrorState
          error={error}
          fileName={currentFile.name}
          onRetry={handleRetry}
          onClose={handleClose}
          onSkip={totalFiles > 1 ? handleSkip : null}
        />
      );
    }

    switch (currentFile.type) {
      case 'image':
        return (
          <ImageViewer
            src={currentFile.src}
            alt={currentFile.name}
            onLoad={handleFileLoad}
            onError={handleFileError}
          />
        );
      case 'video':
        return (
          <VideoPlayer
            src={currentFile.src}
            onLoad={handleFileLoad}
            onError={handleFileError}
          />
        );
      default:
        return (
          <ErrorState
            error={{ type: 'UNSUPPORTED_FORMAT' }}
            fileName={currentFile.name}
            onClose={handleClose}
            onSkip={totalFiles > 1 ? handleSkip : null}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-modal">
      <div className="flex flex-col h-full">
        {/* Header */}
        <FilePreviewHeader
          fileName={currentFile.name}
          fileType={currentFile.type}
          onClose={handleClose}
          onDownload={handleDownload}
          onDelete={handleDelete}
          currentIndex={currentFileIndex}
          totalFiles={totalFiles}
        />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* File Viewer */}
          <div className="flex-1 relative">
            {renderFileContent()}
          </div>

          {/* Metadata Panel - Desktop */}
          <div className="hidden lg:block">
            <FileMetadata
              file={currentFile}
              onOrganize={handleOrganize}
              onAddToCollection={handleAddToCollection}
            />
          </div>
        </div>

        {/* Mobile Metadata Panel */}
        <div className="lg:hidden">
          <FileMetadata
            file={currentFile}
            onOrganize={handleOrganize}
            onAddToCollection={handleAddToCollection}
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <NavigationControls
        currentIndex={currentFileIndex}
        totalFiles={totalFiles}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasMultipleFiles={totalFiles > 1}
      />

      {/* Bulk Actions Footer */}
      <BulkActionFooter
        selectedFiles={selectedFiles}
        totalFiles={totalFiles}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkDownload={handleBulkDownload}
        onBulkDelete={handleBulkDelete}
        onBulkOrganize={handleBulkOrganize}
      />
    </div>
  );
};

export default FilePreviewModal;