import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FileGrid = ({ files, onFileSelect, onFileDelete, onBulkDelete, selectedFiles, onFilePreview }) => {
  const [selectAll, setSelectAll] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (type) => {
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('image/')) return 'Image';
    return 'File';
  };

  const getFileTypeColor = (type) => {
    if (type.startsWith('video/')) return 'text-accent';
    if (type.startsWith('image/')) return 'text-success';
    return 'text-secondary';
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      files.forEach(file => onFileSelect(file.id, true));
    } else {
      files.forEach(file => onFileSelect(file.id, false));
    }
  };

  const isFileSelected = (fileId) => {
    return selectedFiles.includes(fileId);
  };

  const selectedCount = selectedFiles.length;

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 bg-surface rounded-full mx-auto mb-4">
          <Icon name="FolderOpen" size={32} color="var(--color-text-secondary)" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          No files uploaded yet
        </h3>
        <p className="text-text-secondary">
          Upload your first media files to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Header */}
      <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-text-primary">
              Select All ({files.length})
            </span>
          </label>
          
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {selectedCount} selected
              </span>
              <Button
                variant="danger"
                size="sm"
                iconName="Trash2"
                onClick={() => onBulkDelete(selectedFiles)}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-sm text-text-secondary">
          {files.length} files total
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className={`
              relative group bg-background border rounded-lg overflow-hidden
              transition-all duration-200 hover:shadow-lg hover:scale-105
              ${isFileSelected(file.id) ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-border'}
            `}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={isFileSelected(file.id)}
                onChange={(e) => onFileSelect(file.id, e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
            </div>

            {/* File Actions */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Eye"
                  onClick={() => onFilePreview(file)}
                  className="bg-background bg-opacity-90 hover:bg-opacity-100"
                />
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Download"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = file.url;
                    link.download = file.name;
                    link.click();
                  }}
                  className="bg-background bg-opacity-90 hover:bg-opacity-100"
                />
                <Button
                  variant="danger"
                  size="xs"
                  iconName="Trash2"
                  onClick={() => onFileDelete(file.id)}
                  className="bg-background bg-opacity-90 hover:bg-opacity-100"
                />
              </div>
            </div>

            {/* File Preview */}
            <div className="aspect-square bg-surface relative overflow-hidden">
              {file.type.startsWith('image/') ? (
                <Image
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => onFilePreview(file)}
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  onClick={() => onFilePreview(file)}
                >
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-surface ${getFileTypeColor(file.type)}`}>
                    <Icon name={getFileIcon(file.type)} size={32} color="currentColor" />
                  </div>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="p-3">
              <h4 className="text-sm font-medium text-text-primary truncate mb-1">
                {file.name}
              </h4>
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{formatFileSize(file.size)}</span>
                <span>{formatDate(file.uploadDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileGrid;