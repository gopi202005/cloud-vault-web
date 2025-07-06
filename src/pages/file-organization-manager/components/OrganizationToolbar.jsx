import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OrganizationToolbar = ({ 
  currentFolder, 
  viewMode, 
  onViewModeChange, 
  sortBy, 
  sortOrder, 
  onSortChange,
  selectedFiles,
  onBulkAction,
  onSearch,
  searchQuery,
  onUndo,
  canUndo
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  const sortOptions = [
    { value: 'name', label: 'Name', icon: 'Type' },
    { value: 'size', label: 'Size', icon: 'HardDrive' },
    { value: 'type', label: 'Type', icon: 'FileType' },
    { value: 'modified', label: 'Modified', icon: 'Clock' }
  ];

  const bulkActions = [
    { value: 'move', label: 'Move to Folder', icon: 'FolderOpen' },
    { value: 'tag', label: 'Add Tags', icon: 'Tag' },
    { value: 'delete', label: 'Delete Files', icon: 'Trash2', danger: true }
  ];

  const handleSortChange = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(newSortBy, newSortOrder);
    setShowSortMenu(false);
  };

  const handleBulkAction = (action) => {
    onBulkAction(action, selectedFiles);
    setShowBulkMenu(false);
  };

  const breadcrumbPath = currentFolder ? currentFolder.path || [currentFolder] : [];

  return (
    <div className="bg-background border-b border-border">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between p-4">
        {/* Left Section - Breadcrumb & Actions */}
        <div className="flex items-center space-x-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2">
            <Icon name="Home" size={16} color="var(--color-text-secondary)" />
            {breadcrumbPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <Icon name="ChevronRight" size={14} color="var(--color-text-secondary)" />
                <button
                  className={`text-sm font-body-medium transition-colors duration-150 ${
                    index === breadcrumbPath.length - 1
                      ? 'text-text-primary cursor-default' :'text-text-secondary hover:text-text-primary'
                  }`}
                  disabled={index === breadcrumbPath.length - 1}
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Undo Button */}
          {canUndo && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Undo"
              onClick={onUndo}
              className="text-text-secondary hover:text-text-primary"
            >
              Undo
            </Button>
          )}
        </div>

        {/* Right Section - Search & View Controls */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Icon
              name="Search"
              size={16}
              color="var(--color-text-secondary)"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <Input
              type="search"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface rounded-interactive p-1">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              iconName="Grid3X3"
              onClick={() => onViewModeChange('grid')}
              className="rounded-container"
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              iconName="List"
              onClick={() => onViewModeChange('list')}
              className="rounded-container"
            />
          </div>

          {/* Sort Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowUpDown"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="text-text-secondary hover:text-text-primary"
            >
              Sort
            </Button>
            
            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-dropdown"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-interactive shadow-elevation-4 py-2 z-tooltip">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`
                        flex items-center justify-between w-full px-4 py-2 text-sm font-body-normal
                        transition-colors duration-150
                        ${sortBy === option.value ? 'text-primary bg-primary bg-opacity-10' : 'text-text-primary hover:bg-surface'}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name={option.icon} size={16} color="currentColor" />
                        <span>{option.label}</span>
                      </div>
                      {sortBy === option.value && (
                        <Icon
                          name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                          size={16}
                          color="currentColor"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary bg-opacity-10 border-t border-primary border-opacity-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <Icon name="Check" size={16} color="white" />
            </div>
            <span className="text-sm font-body-medium text-text-primary">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bulk Actions Menu */}
            <div className="relative">
              <Button
                variant="primary"
                size="sm"
                iconName="MoreHorizontal"
                onClick={() => setShowBulkMenu(!showBulkMenu)}
              >
                Actions
              </Button>
              
              {showBulkMenu && (
                <>
                  <div
                    className="fixed inset-0 z-dropdown"
                    onClick={() => setShowBulkMenu(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-interactive shadow-elevation-4 py-2 z-tooltip">
                    {bulkActions.map(action => (
                      <button
                        key={action.value}
                        onClick={() => handleBulkAction(action.value)}
                        className={`
                          flex items-center space-x-3 w-full px-4 py-2 text-sm font-body-normal
                          transition-colors duration-150
                          ${action.danger
                            ? 'text-error hover:bg-error hover:bg-opacity-10' :'text-text-primary hover:bg-surface'
                          }
                        `}
                      >
                        <Icon
                          name={action.icon}
                          size={16}
                          color={action.danger ? 'var(--color-error)' : 'var(--color-text-secondary)'}
                        />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => onBulkAction('clear', [])}
              className="text-text-secondary hover:text-text-primary"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationToolbar;