import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilePreviewHeader = ({ 
  fileName, 
  fileType, 
  onClose, 
  onDownload, 
  onDelete,
  currentIndex,
  totalFiles 
}) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return 'Image';
      case 'video': return 'Video';
      case 'document': return 'FileText';
      case 'archive': return 'Archive';
      default: return 'File';
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'image': return 'text-success';
      case 'video': return 'text-accent';
      case 'document': return 'text-primary';
      case 'archive': return 'text-warning';
      default: return 'text-secondary';
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-background">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className={`flex items-center justify-center w-10 h-10 rounded-container bg-surface ${getFileTypeColor(fileType)}`}>
          <Icon name={getFileIcon(fileType)} size={20} color="currentColor" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-heading-semibold text-text-primary truncate">
            {fileName}
          </h2>
          {totalFiles > 1 && (
            <p className="text-sm font-caption-normal text-text-secondary">
              {currentIndex} of {totalFiles} files
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        <Button
          variant="ghost"
          iconName="Download"
          onClick={onDownload}
          className="hidden sm:flex"
        >
          Download
        </Button>
        
        <Button
          variant="ghost"
          iconName="Trash2"
          onClick={onDelete}
          className="hidden sm:flex text-error hover:text-error"
        >
          Delete
        </Button>

        {/* Mobile Action Menu */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            iconName="MoreVertical"
            onClick={() => {}}
          />
        </div>

        <Button
          variant="ghost"
          iconName="X"
          onClick={onClose}
          className="ml-2"
        />
      </div>
    </div>
  );
};

export default FilePreviewHeader;