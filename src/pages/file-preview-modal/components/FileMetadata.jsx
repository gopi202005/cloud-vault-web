import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileMetadata = ({ file, onOrganize, onAddToCollection }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('');

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const collections = [
    { id: 'work', name: 'Work Projects', count: 24 },
    { id: 'personal', name: 'Personal', count: 18 },
    { id: 'archive', name: 'Archive', count: 45 },
    { id: 'favorites', name: 'Favorites', count: 12 }
  ];

  const metadataItems = [
    { label: 'File Size', value: formatBytes(file.size), icon: 'HardDrive' },
    { label: 'Dimensions', value: file.dimensions || 'N/A', icon: 'Maximize2' },
    { label: 'Format', value: file.format || file.type, icon: 'FileType' },
    { label: 'Upload Date', value: formatDate(file.uploadDate), icon: 'Calendar' },
    { label: 'Last Modified', value: formatDate(file.lastModified), icon: 'Clock' },
    { label: 'Location', value: file.path || '/Uploads', icon: 'Folder' }
  ];

  return (
    <div className="w-80 bg-background border-l border-border overflow-y-auto">
      {/* Mobile Toggle */}
      <div className="lg:hidden border-b border-border">
        <Button
          variant="ghost"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between p-4"
        >
          File Details
        </Button>
      </div>

      <div className={`${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* File Info */}
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-heading-semibold text-text-primary mb-4">
            File Details
          </h3>
          
          <div className="space-y-4">
            {metadataItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-surface rounded-container text-text-secondary">
                  <Icon name={item.icon} size={16} color="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body-medium text-text-secondary">
                    {item.label}
                  </p>
                  <p className="text-sm font-body-normal text-text-primary break-words">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div className="p-6 border-b border-border">
          <h4 className="text-base font-heading-medium text-text-primary mb-4">
            Add to Collection
          </h4>
          
          <div className="space-y-2 mb-4">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-interactive
                  transition-all duration-150 ease-smooth text-left
                  ${selectedCollection === collection.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface hover:bg-border-light text-text-primary'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name="Folder" 
                    size={16} 
                    color={selectedCollection === collection.id ? 'white' : 'currentColor'} 
                  />
                  <span className="text-sm font-body-medium">
                    {collection.name}
                  </span>
                </div>
                <span className="text-xs font-data-normal opacity-75">
                  {collection.count}
                </span>
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            iconName="Plus"
            onClick={() => onAddToCollection?.(selectedCollection)}
            disabled={!selectedCollection}
            className="w-full"
          >
            Add to Collection
          </Button>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          <h4 className="text-base font-heading-medium text-text-primary mb-4">
            Quick Actions
          </h4>
          
          <Button
            variant="outline"
            iconName="FolderOpen"
            onClick={onOrganize}
            className="w-full justify-start"
          >
            Organize File
          </Button>
          
          <Button
            variant="outline"
            iconName="Share2"
            onClick={() => {}}
            className="w-full justify-start"
          >
            Share File
          </Button>
          
          <Button
            variant="outline"
            iconName="Copy"
            onClick={() => {}}
            className="w-full justify-start"
          >
            Copy Path
          </Button>
          
          <Button
            variant="outline"
            iconName="Edit3"
            onClick={() => {}}
            className="w-full justify-start"
          >
            Rename File
          </Button>
        </div>

        {/* File Tags */}
        <div className="p-6 border-t border-border">
          <h4 className="text-base font-heading-medium text-text-primary mb-4">
            Tags
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {file.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-accent bg-opacity-10 text-accent text-xs font-caption-medium rounded-container"
              >
                {tag}
                <button className="ml-1 hover:text-error">
                  <Icon name="X" size={12} color="currentColor" />
                </button>
              </span>
            )) || (
              <p className="text-sm font-caption-normal text-text-secondary">
                No tags added
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            iconName="Plus"
            onClick={() => {}}
            className="w-full justify-start text-text-secondary"
          >
            Add Tag
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileMetadata;