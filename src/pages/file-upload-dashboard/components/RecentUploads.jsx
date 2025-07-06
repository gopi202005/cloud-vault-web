import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RecentUploads = ({ files, onFilePreview, onFileDelete }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffInMinutes = Math.floor((now - uploadDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return uploadDate.toLocaleDateString();
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

  // Show only the 6 most recent files
  const recentFiles = files.slice(0, 6);

  if (recentFiles.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center w-12 h-12 bg-surface rounded-full mx-auto mb-3">
          <Icon name="Clock" size={24} color="var(--color-text-secondary)" />
        </div>
        <p className="text-text-secondary">No recent uploads</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentFiles.map((file) => (
        <div
          key={file.id}
          className="flex items-center space-x-4 p-3 bg-surface rounded-lg hover:bg-border-light transition-colors group"
        >
          {/* File Thumbnail/Icon */}
          <div className="flex-shrink-0">
            {file.type.startsWith('image/') ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => onFilePreview(file)}
                />
              </div>
            ) : (
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-lg bg-background cursor-pointer ${getFileTypeColor(file.type)}`}
                onClick={() => onFilePreview(file)}
              >
                <Icon name={getFileIcon(file.type)} size={20} color="currentColor" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-text-primary truncate">
              {file.name}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-text-secondary">
                {formatFileSize(file.size)}
              </span>
              <span className="text-xs text-text-secondary">•</span>
              <span className="text-xs text-text-secondary">
                {formatTimeAgo(file.uploadDate)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="xs"
              iconName="Eye"
              onClick={() => onFilePreview(file)}
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
            />
            <Button
              variant="danger"
              size="xs"
              iconName="Trash2"
              onClick={() => onFileDelete(file.id)}
            />
          </div>
        </div>
      ))}
      
      {files.length > 6 && (
        <div className="text-center pt-2">
          <Button variant="ghost" size="sm">
            View All {files.length} Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentUploads;