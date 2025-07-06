import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import GlobalSearchBar from '../../components/ui/GlobalSearchBar';
import StorageQuotaIndicator from '../../components/ui/StorageQuotaIndicator';
import UploadProgressOverlay from '../../components/ui/UploadProgressOverlay';
import FolderTree from './components/FolderTree';
import FileGrid from './components/FileGrid';
import FilePropertiesPanel from './components/FilePropertiesPanel';
import OrganizationToolbar from './components/OrganizationToolbar';

import Button from '../../components/ui/Button';

const FileOrganizationManager = () => {
  const navigate = useNavigate();
  
  // State management
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockFolders = [
      {
        id: 'root',
        name: 'My Files',
        parentId: null,
        children: [
          {
            id: 'photos',
            name: 'Photos',
            parentId: 'root',
            children: [
              { id: 'vacation', name: 'Vacation 2024', parentId: 'photos', children: [], fileCount: 15 },
              { id: 'family', name: 'Family', parentId: 'photos', children: [], fileCount: 8 }
            ],
            fileCount: 23
          },
          {
            id: 'videos',
            name: 'Videos',
            parentId: 'root',
            children: [
              { id: 'projects', name: 'Projects', parentId: 'videos', children: [], fileCount: 5 }
            ],
            fileCount: 12
          },
          { id: 'documents', name: 'Documents', parentId: 'root', children: [], fileCount: 7 }
        ],
        fileCount: 42
      }
    ];

    const mockFiles = [
      {
        id: 'file1',
        name: 'beach-sunset.jpg',
        type: 'image/jpeg',
        size: 2.5 * 1024 * 1024,
        lastModified: '2024-01-15T10:30:00Z',
        folderId: 'vacation',
        url: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: [{ id: 'tag1', name: 'Nature', color: '#10b981' }]
      },
      {
        id: 'file2',
        name: 'mountain-hike.jpg',
        type: 'image/jpeg',
        size: 3.2 * 1024 * 1024,
        lastModified: '2024-01-14T15:45:00Z',
        folderId: 'vacation',
        url: 'https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_640.jpg?auto=compress&cs=tinysrgb&w=400',
        tags: [{ id: 'tag1', name: 'Nature', color: '#10b981' }, { id: 'tag2', name: 'Adventure', color: '#f59e0b' }]
      },
      {
        id: 'file3',
        name: 'family-dinner.jpg',
        type: 'image/jpeg',
        size: 1.8 * 1024 * 1024,
        lastModified: '2024-01-13T19:20:00Z',
        folderId: 'family',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80',
        tags: [{ id: 'tag3', name: 'Family', color: '#ef4444' }]
      },
      {
        id: 'file4',
        name: 'project-demo.mp4',
        type: 'video/mp4',
        size: 45.7 * 1024 * 1024,
        lastModified: '2024-01-12T14:10:00Z',
        folderId: 'projects',
        tags: [{ id: 'tag4', name: 'Work', color: '#3b82f6' }]
      },
      {
        id: 'file5',
        name: 'presentation.pdf',
        type: 'application/pdf',
        size: 5.2 * 1024 * 1024,
        lastModified: '2024-01-11T09:30:00Z',
        folderId: 'documents',
        tags: [{ id: 'tag4', name: 'Work', color: '#3b82f6' }]
      }
    ];

    const mockTags = [
      { id: 'tag1', name: 'Nature', color: '#10b981' },
      { id: 'tag2', name: 'Adventure', color: '#f59e0b' },
      { id: 'tag3', name: 'Family', color: '#ef4444' },
      { id: 'tag4', name: 'Work', color: '#3b82f6' },
      { id: 'tag5', name: 'Personal', color: '#8b5cf6' }
    ];

    setFolders(mockFolders);
    setFiles(mockFiles);
    setTags(mockTags);
    setSelectedFolder(mockFolders[0]);
  }, []);

  // Get files for current folder
  const getCurrentFolderFiles = () => {
    if (!selectedFolder) return [];
    
    let folderFiles = files.filter(file => file.folderId === selectedFolder.id);
    
    // Apply search filter
    if (searchQuery) {
      folderFiles = folderFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.tags && file.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    return folderFiles;
  };

  // Folder operations
  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    setSelectedFiles([]);
  };

  const handleFolderCreate = (newFolder) => {
    const updateFolders = (folders) => {
      return folders.map(folder => {
        if (folder.id === newFolder.parentId) {
          return {
            ...folder,
            children: [...(folder.children || []), newFolder]
          };
        }
        if (folder.children) {
          return {
            ...folder,
            children: updateFolders(folder.children)
          };
        }
        return folder;
      });
    };
    
    setFolders(updateFolders(folders));
    addToUndoStack('create_folder', { folder: newFolder });
  };

  const handleFolderRename = (folderId, newName) => {
    const updateFolders = (folders) => {
      return folders.map(folder => {
        if (folder.id === folderId) {
          return { ...folder, name: newName };
        }
        if (folder.children) {
          return {
            ...folder,
            children: updateFolders(folder.children)
          };
        }
        return folder;
      });
    };
    
    setFolders(updateFolders(folders));
    addToUndoStack('rename_folder', { folderId, newName });
  };

  const handleFolderDelete = (folderId) => {
    const removeFolderFromTree = (folders) => {
      return folders.filter(folder => folder.id !== folderId).map(folder => ({
        ...folder,
        children: folder.children ? removeFolderFromTree(folder.children) : []
      }));
    };
    
    setFolders(removeFolderFromTree(folders));
    setFiles(files.filter(file => file.folderId !== folderId));
    addToUndoStack('delete_folder', { folderId });
  };

  const handleFolderMove = (folderId, targetFolderId) => {
    // Implementation for moving folders
    addToUndoStack('move_folder', { folderId, targetFolderId });
  };

  // File operations
  const handleFileSelect = (fileIds) => {
    setSelectedFiles(fileIds);
  };

  const handleFileMove = (fileIds, targetFolderId) => {
    const updatedFiles = files.map(file =>
      fileIds.includes(file.id) ? { ...file, folderId: targetFolderId } : file
    );
    setFiles(updatedFiles);
    addToUndoStack('move_files', { fileIds, targetFolderId });
  };

  const handleFileDelete = (fileIds) => {
    setFiles(files.filter(file => !fileIds.includes(file.id)));
    setSelectedFiles([]);
    addToUndoStack('delete_files', { fileIds });
  };

  const handleFilePreview = (file) => {
    navigate('/file-preview-modal', { state: { file } });
  };

  // Tag operations
  const handleTagAdd = (fileIds, tag) => {
    const updatedFiles = files.map(file => {
      if (fileIds.includes(file.id)) {
        const existingTags = file.tags || [];
        const hasTag = existingTags.some(t => t.id === tag.id);
        if (!hasTag) {
          return { ...file, tags: [...existingTags, tag] };
        }
      }
      return file;
    });
    setFiles(updatedFiles);
    addToUndoStack('add_tag', { fileIds, tag });
  };

  const handleTagRemove = (fileIds, tag) => {
    const updatedFiles = files.map(file => {
      if (fileIds.includes(file.id)) {
        const filteredTags = (file.tags || []).filter(t => t.id !== tag.id);
        return { ...file, tags: filteredTags };
      }
      return file;
    });
    setFiles(updatedFiles);
    addToUndoStack('remove_tag', { fileIds, tag });
  };

  // Bulk operations
  const handleBulkAction = (action, fileIds) => {
    switch (action) {
      case 'move':
        // Show folder selection modal
        break;
      case 'tag':
        // Show tag selection modal
        break;
      case 'delete':
        handleFileDelete(fileIds);
        break;
      case 'clear':
        setSelectedFiles([]);
        break;
      default:
        break;
    }
  };

  // Smart collections
  const handleSmartCollectionCreate = (collection) => {
    // Filter files based on collection criteria
    let filteredFiles = [];
    
    switch (collection.id) {
      case 'images':
        filteredFiles = files.filter(f => f.type.startsWith('image/'));
        break;
      case 'videos':
        filteredFiles = files.filter(f => f.type.startsWith('video/'));
        break;
      case 'large_files':
        filteredFiles = files.filter(f => f.size > 10 * 1024 * 1024);
        break;
      case 'recent':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filteredFiles = files.filter(f => new Date(f.lastModified) > weekAgo);
        break;
      default:
        break;
    }
    
    // Create virtual folder for smart collection
    const smartFolder = {
      id: `smart_${collection.id}`,
      name: collection.name,
      isSmartCollection: true,
      files: filteredFiles
    };
    
    setSelectedFolder(smartFolder);
  };

  // Undo functionality
  const addToUndoStack = (action, data) => {
    setUndoStack(prev => [...prev.slice(-9), { action, data, timestamp: Date.now() }]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];
      // Implement undo logic based on action type
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  // View controls
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-background border-b border-border sticky top-0 z-header">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-heading-semibold text-text-primary">
                File Organization Manager
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <GlobalSearchBar />
              <StorageQuotaIndicator />
              
              <Button
                variant="primary"
                iconName="Upload"
                onClick={() => navigate('/file-upload-dashboard')}
              >
                Upload Files
              </Button>
            </div>
          </div>
        </header>

        {/* Three-Panel Layout */}
        <div className="flex h-screen-minus-header">
          {/* Left Panel - Folder Tree */}
          <div className={`${isLeftPanelCollapsed ? 'w-0' : 'w-1/4'} min-w-0 transition-all duration-300 ease-smooth border-r border-border`}>
            {!isLeftPanelCollapsed && (
              <FolderTree
                folders={folders}
                selectedFolder={selectedFolder}
                onFolderSelect={handleFolderSelect}
                onFolderCreate={handleFolderCreate}
                onFolderRename={handleFolderRename}
                onFolderDelete={handleFolderDelete}
                onFolderMove={handleFolderMove}
              />
            )}
          </div>

          {/* Center Panel - File Grid */}
          <div className={`${isLeftPanelCollapsed ? 'w-3/4' : isRightPanelCollapsed ? 'w-3/4' : 'w-1/2'} flex flex-col transition-all duration-300 ease-smooth`}>
            <OrganizationToolbar
              currentFolder={selectedFolder}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              selectedFiles={selectedFiles}
              onBulkAction={handleBulkAction}
              onSearch={handleSearch}
              searchQuery={searchQuery}
              onUndo={handleUndo}
              canUndo={undoStack.length > 0}
            />
            
            <FileGrid
              files={getCurrentFolderFiles()}
              viewMode={viewMode}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onFileMove={handleFileMove}
              onFileDelete={handleFileDelete}
              onFilePreview={handleFilePreview}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>

          {/* Right Panel - Properties */}
          <div className={`${isRightPanelCollapsed ? 'w-0' : 'w-1/4'} min-w-0 transition-all duration-300 ease-smooth`}>
            {!isRightPanelCollapsed && (
              <FilePropertiesPanel
                selectedFiles={selectedFiles}
                files={files}
                tags={tags}
                onTagAdd={handleTagAdd}
                onTagRemove={handleTagRemove}
                onFileUpdate={() => {}}
                onSmartCollectionCreate={handleSmartCollectionCreate}
              />
            )}
          </div>

          {/* Panel Toggle Buttons */}
          <div className="fixed left-1/4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="sm"
              iconName={isLeftPanelCollapsed ? 'ChevronRight' : 'ChevronLeft'}
              onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
              className="bg-background border border-border shadow-elevation-2"
            />
          </div>
          
          <div className="fixed right-1/4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="sm"
              iconName={isRightPanelCollapsed ? 'ChevronLeft' : 'ChevronRight'}
              onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
              className="bg-background border border-border shadow-elevation-2"
            />
          </div>
        </div>
      </div>

      {/* Upload Progress Overlay */}
      <UploadProgressOverlay />
    </div>
  );
};

export default FileOrganizationManager;