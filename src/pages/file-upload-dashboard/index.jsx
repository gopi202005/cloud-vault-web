import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Sidebar from '../../components/ui/Sidebar';
import StorageQuotaIndicator from '../../components/ui/StorageQuotaIndicator';
import UploadProgressOverlay from '../../components/ui/UploadProgressOverlay';
import GlobalSearchBar from '../../components/ui/GlobalSearchBar';

// Import page components
import UploadZone from './components/UploadZone';
import FileGrid from './components/FileGrid';
import StorageStats from './components/StorageStats';
import FileFilters from './components/FileFilters';
import RecentUploads from './components/RecentUploads';

// Import storage hook
import useFileStorage from '../../hooks/useFileStorage';

const FileUploadDashboard = () => {
  const navigate = useNavigate();
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Use storage hook
  const {
    files,
    loading: storageLoading,
    error: storageError,
    storageStats,
    saveFile,
    deleteFile,
    deleteMultipleFiles,
    clearAllFiles
  } = useFileStorage();

  // Update filtered files when files change
  useEffect(() => {
    setFilteredFiles(files);
  }, [files]);

  // Clear upload messages after 5 seconds
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => {
        setUploadError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleFilesSelected = useCallback(async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadError('No files selected');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    
    const uploadResults = {
      successful: [],
      failed: []
    };

    try {
      for (const file of selectedFiles) {
        try {
          // Generate unique ID for the file
          const fileId = Date.now() + Math.random();
          
          const metadata = {
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadDate: new Date()
          };

          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 20) {
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: progress
            }));
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          // Save file to storage
          const savedFile = await saveFile(file, metadata);
          uploadResults.successful.push(savedFile);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          uploadResults.failed.push({
            name: file.name,
            error: error.message || 'Unknown error'
          });
        }
      }

      // Set success/error messages
      if (uploadResults.successful.length > 0) {
        setUploadSuccess(
          `Successfully uploaded ${uploadResults.successful.length} file${uploadResults.successful.length > 1 ? 's' : ''}`
        );
      }

      if (uploadResults.failed.length > 0) {
        const failedMessages = uploadResults.failed.map(f => `${f.name}: ${f.error}`);
        setUploadError(`Failed to upload ${uploadResults.failed.length} file${uploadResults.failed.length > 1 ? 's' : ''}:\n${failedMessages.join('\n')}`);
      }
    } catch (error) {
      console.error('Upload process error:', error);
      setUploadError(error.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [saveFile]);

  const handleFileSelect = useCallback((fileId, isSelected) => {
    setSelectedFiles(prev => {
      if (isSelected) {
        return [...prev, fileId];
      } else {
        return prev.filter(id => id !== fileId);
      }
    });
  }, []);

  const handleFileDelete = useCallback(async (fileId) => {
    try {
      await deleteFile(fileId);
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    } catch (error) {
      console.error('Delete error:', error);
      setUploadError('Failed to delete file');
    }
  }, [deleteFile]);

  const handleBulkDelete = useCallback(async (fileIds) => {
    try {
      await deleteMultipleFiles(fileIds);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Bulk delete error:', error);
      setUploadError('Failed to delete files');
    }
  }, [deleteMultipleFiles]);

  const handleFilePreview = useCallback((file) => {
    // Navigate to preview modal with file data
    navigate('/file-preview-modal', { state: { file } });
  }, [navigate]);

  const handleFilterChange = useCallback((filters) => {
    let filtered = [...files];
    
    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(file => {
        if (filters.type === 'image') return file.type.startsWith('image/');
        if (filters.type === 'video') return file.type.startsWith('video/');
        return true;
      });
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(file => {
        const fileDate = new Date(file.uploadDate);
        switch (filters.dateRange) {
          case 'today':
            return fileDate.toDateString() === now.toDateString();
          case 'week':
            return (now - fileDate) <= 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return (now - fileDate) <= 30 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }
    
    // Apply size filter
    if (filters.sizeRange !== 'all') {
      filtered = filtered.filter(file => {
        const sizeMB = file.size / (1024 * 1024);
        switch (filters.sizeRange) {
          case 'small':
            return sizeMB < 10;
          case 'medium':
            return sizeMB >= 10 && sizeMB <= 100;
          case 'large':
            return sizeMB > 100;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'newest':
        default:
          return new Date(b.uploadDate) - new Date(a.uploadDate);
      }
    });
    
    setFilteredFiles(filtered);
  }, [files]);

  if (storageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="HardDrive" size={20} color="white" />
                </div>
                <div>
                  <h1 className="text-xl font-heading font-semibold text-text-primary">
                    MediaVault
                  </h1>
                  <p className="text-sm text-text-secondary">
                    Local File Storage Dashboard
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block w-96">
                <GlobalSearchBar />
              </div>
              <StorageQuotaIndicator />
              <Button
                variant="ghost"
                iconName="Settings"
                onClick={() => navigate('/file-organization-manager')}
              />
            </div>
          </div>
        </header>

        {/* Success/Error Messages */}
        {uploadSuccess && (
          <div className="mx-6 mt-4">
            <div className="bg-success bg-opacity-10 border border-success text-success px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} color="currentColor" />
                <span className="text-sm font-medium">{uploadSuccess}</span>
              </div>
            </div>
          </div>
        )}

        {(storageError || uploadError) && (
          <div className="mx-6 mt-4">
            <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} color="currentColor" className="flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  {(storageError || uploadError).split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-6">
                {/* Upload Zone */}
                <section>
                  <UploadZone
                    onFilesSelected={handleFilesSelected}
                    isUploading={isUploading}
                  />
                </section>

                {/* File Tabs */}
                <section>
                  <div className="border-b border-border mb-6">
                    <nav className="flex space-x-8">
                      <button
                        onClick={() => setActiveTab('recent')}
                        className={`
                          py-2 px-1 border-b-2 font-medium text-sm transition-colors
                          ${activeTab === 'recent' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                          }
                        `}
                      >
                        Recent Uploads
                      </button>
                      <button
                        onClick={() => setActiveTab('all')}
                        className={`
                          py-2 px-1 border-b-2 font-medium text-sm transition-colors
                          ${activeTab === 'all' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                          }
                        `}
                      >
                        All Files ({filteredFiles.length})
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'recent' ? (
                    <RecentUploads
                      files={filteredFiles}
                      onFilePreview={handleFilePreview}
                      onFileDelete={handleFileDelete}
                    />
                  ) : (
                    <FileGrid
                      files={filteredFiles}
                      onFileSelect={handleFileSelect}
                      onFileDelete={handleFileDelete}
                      onBulkDelete={handleBulkDelete}
                      selectedFiles={selectedFiles}
                      onFilePreview={handleFilePreview}
                    />
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Storage Stats */}
                <section className="bg-surface rounded-lg p-4">
                  <StorageStats
                    totalFiles={storageStats?.totalFiles || 0}
                    totalSize={storageStats?.totalSize || 0}
                    storageUsed={storageStats?.storageUsed || 0}
                    storageLimit={storageStats?.storageQuota || 0}
                  />
                </section>

                {/* Filters */}
                <section className="bg-surface rounded-lg p-4">
                  <FileFilters
                    onFilterChange={handleFilterChange}
                    totalFiles={filteredFiles.length}
                  />
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Progress Overlay */}
      <UploadProgressOverlay />
    </div>
  );
};

export default FileUploadDashboard;