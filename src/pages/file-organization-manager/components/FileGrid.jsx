import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FileGrid = ({ files, viewMode, selectedFiles, onFileSelect, onFileMove, onFileDelete, onFilePreview, sortBy, sortOrder }) => {
  const [draggedFiles, setDraggedFiles] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const dragCounter = useRef(0);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    return 'File';
  };

  const getFileTypeColor = (type) => {
    if (type.startsWith('image/')) return 'text-success';
    if (type.startsWith('video/')) return 'text-accent';
    if (type.includes('pdf')) return 'text-primary';
    if (type.includes('zip') || type.includes('rar')) return 'text-warning';
    return 'text-secondary';
  };

  const handleFileClick = (file, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      const newSelection = selectedFiles.includes(file.id)
        ? selectedFiles.filter(id => id !== file.id)
        : [...selectedFiles, file.id];
      onFileSelect(newSelection);
    } else if (event.shiftKey && selectedFiles.length > 0) {
      // Range select with Shift
      const lastSelectedIndex = files.findIndex(f => f.id === selectedFiles[selectedFiles.length - 1]);
      const currentIndex = files.findIndex(f => f.id === file.id);
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const rangeIds = files.slice(start, end + 1).map(f => f.id);
      onFileSelect([...new Set([...selectedFiles, ...rangeIds])]);
    } else {
      // Single select
      onFileSelect([file.id]);
    }
  };

  const handleFileDoubleClick = (file) => {
    onFilePreview(file);
  };

  const handleContextMenu = (e, file) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedFiles.includes(file.id)) {
      onFileSelect([file.id]);
    }
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file
    });
  };

  const handleDragStart = (e, file) => {
    const filesToDrag = selectedFiles.includes(file.id) 
      ? files.filter(f => selectedFiles.includes(f.id))
      : [file];
    
    setDraggedFiles(filesToDrag);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(filesToDrag.map(f => f.id)));
  };

  const handleDeleteFiles = () => {
    const filesToDelete = selectedFiles.length > 0 ? selectedFiles : [contextMenu.file.id];
    const fileNames = files.filter(f => filesToDelete.includes(f.id)).map(f => f.name);
    
    if (window.confirm(`Are you sure you want to delete ${fileNames.length} file(s)?\n\n${fileNames.slice(0, 3).join('\n')}${fileNames.length > 3 ? '\n...' : ''}`)) {
      onFileDelete(filesToDelete);
    }
    setContextMenu(null);
  };

  const sortedFiles = [...files].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'size':
        aValue = a.size;
        bValue = b.size;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'modified':
        aValue = new Date(a.lastModified);
        bValue = new Date(b.lastModified);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderGridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {sortedFiles.map((file) => {
        const isSelected = selectedFiles.includes(file.id);
        const isImage = file.type.startsWith('image/');
        
        return (
          <div
            key={file.id}
            className={`
              relative group cursor-pointer rounded-interactive border-2 transition-all duration-150 ease-smooth
              ${isSelected ? 'border-primary bg-primary bg-opacity-10' : 'border-transparent hover:border-border hover:bg-surface'}
            `}
            onClick={(e) => handleFileClick(file, e)}
            onDoubleClick={() => handleFileDoubleClick(file)}
            onContextMenu={(e) => handleContextMenu(e, file)}
            draggable
            onDragStart={(e) => handleDragStart(e, file)}
          >
            {/* Selection Checkbox */}
            <div className={`absolute top-2 left-2 z-10 ${isSelected || 'opacity-0 group-hover:opacity-100'} transition-opacity duration-150`}>
              <div className={`w-5 h-5 rounded-container border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-background border-border'}`}>
                {isSelected && <Icon name="Check" size={12} color="white" />}
              </div>
            </div>

            {/* File Preview */}
            <div className="aspect-square p-4 flex items-center justify-center bg-surface rounded-t-interactive overflow-hidden">
              {isImage ? (
                <Image
                  src={file.url || file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-container"
                />
              ) : (
                <div className={`flex items-center justify-center w-16 h-16 rounded-interactive bg-background ${getFileTypeColor(file.type)}`}>
                  <Icon name={getFileIcon(file.type)} size={32} color="currentColor" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="p-3 bg-background rounded-b-interactive">
              <p className="text-sm font-body-medium text-text-primary truncate mb-1" title={file.name}>
                {file.name}
              </p>
              <div className="flex items-center justify-between text-xs font-data-normal text-text-secondary">
                <span>{formatFileSize(file.size)}</span>
                <span>{formatDate(file.lastModified)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="divide-y divide-border">
      {sortedFiles.map((file) => {
        const isSelected = selectedFiles.includes(file.id);
        const isImage = file.type.startsWith('image/');
        
        return (
          <div
            key={file.id}
            className={`
              flex items-center space-x-4 p-4 cursor-pointer transition-all duration-150 ease-smooth
              ${isSelected ? 'bg-primary bg-opacity-10' : 'hover:bg-surface'}
            `}
            onClick={(e) => handleFileClick(file, e)}
            onDoubleClick={() => handleFileDoubleClick(file)}
            onContextMenu={(e) => handleContextMenu(e, file)}
            draggable
            onDragStart={(e) => handleDragStart(e, file)}
          >
            {/* Selection Checkbox */}
            <div className={`w-5 h-5 rounded-container border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-background border-border'}`}>
              {isSelected && <Icon name="Check" size={12} color="white" />}
            </div>

            {/* File Preview */}
            <div className="w-12 h-12 flex items-center justify-center bg-surface rounded-interactive overflow-hidden flex-shrink-0">
              {isImage ? (
                <Image
                  src={file.url || file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`flex items-center justify-center w-full h-full ${getFileTypeColor(file.type)}`}>
                  <Icon name={getFileIcon(file.type)} size={20} color="currentColor" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body-medium text-text-primary truncate mb-1">
                {file.name}
              </p>
              <div className="flex items-center space-x-4 text-xs font-data-normal text-text-secondary">
                <span>{formatFileSize(file.size)}</span>
                <span>{file.type}</span>
                <span>{formatDate(file.lastModified)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilePreview(file);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreVertical"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContextMenu(e, file);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* File Content */}
      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Icon name="Folder" size={64} color="var(--color-text-secondary)" className="mb-4" />
            <h3 className="text-lg font-heading-semibold text-text-primary mb-2">No files in this folder</h3>
            <p className="text-sm font-body-normal text-text-secondary">
              Upload files or move them from other folders to get started
            </p>
          </div>
        ) : viewMode === 'grid' ? renderGridView() : renderListView()}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-dropdown"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed bg-background border border-border rounded-interactive shadow-elevation-4 py-2 z-tooltip min-w-48"
            style={{
              left: contextMenu.x,
              top: contextMenu.y
            }}
          >
            <button
              onClick={() => {
                onFilePreview(contextMenu.file);
                setContextMenu(null);
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-body-normal text-text-primary hover:bg-surface"
            >
              <Icon name="Eye" size={16} color="var(--color-text-secondary)" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => {
                // Handle download
                setContextMenu(null);
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-body-normal text-text-primary hover:bg-surface"
            >
              <Icon name="Download" size={16} color="var(--color-text-secondary)" />
              <span>Download</span>
            </button>
            <div className="border-t border-border my-1" />
            <button
              onClick={handleDeleteFiles}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-body-normal text-error hover:bg-error hover:bg-opacity-10"
            >
              <Icon name="Trash2" size={16} color="var(--color-error)" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileGrid;