import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilePropertiesPanel = ({ selectedFiles, files, tags, onTagAdd, onTagRemove, onFileUpdate, onSmartCollectionCreate }) => {
  const [availableTags, setAvailableTags] = useState(tags || []);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [smartCollections, setSmartCollections] = useState([]);

  useEffect(() => {
    // Initialize smart collections
    const collections = [
      {
        id: 'images',
        name: 'All Images',
        icon: 'Image',
        criteria: { type: 'image' },
        count: files.filter(f => f.type.startsWith('image/')).length
      },
      {
        id: 'videos',
        name: 'All Videos',
        icon: 'Video',
        criteria: { type: 'video' },
        count: files.filter(f => f.type.startsWith('video/')).length
      },
      {
        id: 'large_files',
        name: 'Large Files (>10MB)',
        icon: 'HardDrive',
        criteria: { size: '>10MB' },
        count: files.filter(f => f.size > 10 * 1024 * 1024).length
      },
      {
        id: 'recent',
        name: 'Recent (Last 7 days)',
        icon: 'Clock',
        criteria: { date: 'last7days' },
        count: files.filter(f => {
          const fileDate = new Date(f.lastModified);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return fileDate > weekAgo;
        }).length
      }
    ];
    setSmartCollections(collections);
  }, [files]);

  const selectedFileObjects = files.filter(f => selectedFiles.includes(f.id));
  const hasSelection = selectedFiles.length > 0;
  const isMultipleSelection = selectedFiles.length > 1;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !availableTags.some(tag => tag.name === newTag.trim())) {
      const tag = {
        id: `tag_${Date.now()}`,
        name: newTag.trim(),
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
      };
      setAvailableTags([...availableTags, tag]);
      onTagAdd(selectedFiles, tag);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleTagClick = (tag) => {
    const hasTag = selectedFileObjects.every(file => 
      file.tags && file.tags.some(t => t.id === tag.id)
    );
    
    if (hasTag) {
      onTagRemove(selectedFiles, tag);
    } else {
      onTagAdd(selectedFiles, tag);
    }
  };

  const getCommonTags = () => {
    if (selectedFileObjects.length === 0) return [];
    
    const firstFileTags = selectedFileObjects[0].tags || [];
    return firstFileTags.filter(tag =>
      selectedFileObjects.every(file =>
        file.tags && file.tags.some(t => t.id === tag.id)
      )
    );
  };

  const getTotalSize = () => {
    return selectedFileObjects.reduce((total, file) => total + file.size, 0);
  };

  const getFileTypes = () => {
    const types = [...new Set(selectedFileObjects.map(f => f.type))];
    return types.length > 3 ? `${types.slice(0, 3).join(', ')} +${types.length - 3}` : types.join(', ');
  };

  return (
    <div className="h-full flex flex-col bg-background border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-heading-semibold text-text-primary">Properties</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {hasSelection ? (
          <div className="space-y-6">
            {/* File Information */}
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-heading-medium text-text-primary">
                {isMultipleSelection ? `${selectedFiles.length} files selected` : 'File Information'}
              </h3>
              
              {!isMultipleSelection && selectedFileObjects[0] && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-caption-medium text-text-secondary uppercase tracking-wide">Name</label>
                    <p className="text-sm font-body-normal text-text-primary mt-1 break-words">
                      {selectedFileObjects[0].name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-caption-medium text-text-secondary uppercase tracking-wide">Type</label>
                    <p className="text-sm font-body-normal text-text-primary mt-1">
                      {selectedFileObjects[0].type}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-caption-medium text-text-secondary uppercase tracking-wide">Size</label>
                    <p className="text-sm font-body-normal text-text-primary mt-1">
                      {formatFileSize(selectedFileObjects[0].size)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-caption-medium text-text-secondary uppercase tracking-wide">Modified</label>
                    <p className="text-sm font-body-normal text-text-primary mt-1">
                      {formatDate(selectedFileObjects[0].lastModified)}
                    </p>
                  </div>
                </div>
              )}

              {isMultipleSelection && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-caption-medium text-text-secondary uppercase tracking-wide">Total Size</label>
                    <p className="text-sm font-body-normal text-text-primary mt-1">
                      {formatFileSize(getTotalSize())}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-caption-medium text-text-secondary uppercase tracking-wide">File Types</label>
                    <p className="text-sm font-body-normal text-text-primary mt-1">
                      {getFileTypes()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tags Section */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-heading-medium text-text-primary">Tags</h3>
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Plus"
                  onClick={() => setShowTagInput(true)}
                >
                  Add
                </Button>
              </div>

              {/* Current Tags */}
              <div className="space-y-2 mb-4">
                {getCommonTags().map(tag => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 rounded-container border border-border"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-sm font-body-normal text-text-primary">{tag.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="X"
                      onClick={() => onTagRemove(selectedFiles, tag)}
                      className="text-text-secondary hover:text-error"
                    />
                  </div>
                ))}
              </div>

              {/* Add New Tag */}
              {showTagInput && (
                <form onSubmit={handleAddTag} className="mb-4">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Enter tag name"
                      className="flex-1"
                      autoFocus
                    />
                    <Button type="submit" variant="primary" size="sm">
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowTagInput(false);
                        setNewTag('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Available Tags */}
              <div className="space-y-2">
                <label className="text-xs font-caption-medium text-text-secondary uppercase tracking-wide">Available Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => {
                    const isApplied = selectedFileObjects.some(file =>
                      file.tags && file.tags.some(t => t.id === tag.id)
                    );
                    
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag)}
                        className={`
                          flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-body-medium
                          transition-all duration-150 ease-smooth
                          ${isApplied
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface text-text-secondary hover:bg-border-light hover:text-text-primary'
                          }
                        `}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isApplied ? 'white' : tag.color }}
                        />
                        <span>{tag.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Smart Collections */
          <div className="p-4">
            <h3 className="text-sm font-heading-medium text-text-primary mb-4">Smart Collections</h3>
            <div className="space-y-2">
              {smartCollections.map(collection => (
                <button
                  key={collection.id}
                  onClick={() => onSmartCollectionCreate(collection)}
                  className="flex items-center justify-between w-full p-3 rounded-interactive hover:bg-surface micro-interaction text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-accent bg-opacity-10 rounded-container">
                      <Icon name={collection.icon} size={16} color="var(--color-accent)" />
                    </div>
                    <div>
                      <p className="text-sm font-body-medium text-text-primary">{collection.name}</p>
                      <p className="text-xs font-caption-normal text-text-secondary">
                        {collection.count} files
                      </p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={16} color="var(--color-text-secondary)" />
                </button>
              ))}
            </div>

            {/* Storage Info */}
            <div className="mt-8 p-4 bg-surface rounded-interactive">
              <h4 className="text-sm font-heading-medium text-text-primary mb-3">Storage Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Total Files</span>
                  <span className="text-text-primary font-data-normal">{files.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Total Size</span>
                  <span className="text-text-primary font-data-normal">
                    {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Images</span>
                  <span className="text-text-primary font-data-normal">
                    {files.filter(f => f.type.startsWith('image/')).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Videos</span>
                  <span className="text-text-primary font-data-normal">
                    {files.filter(f => f.type.startsWith('video/')).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePropertiesPanel;