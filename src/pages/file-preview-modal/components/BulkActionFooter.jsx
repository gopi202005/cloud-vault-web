import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionFooter = ({ 
  selectedFiles, 
  totalFiles, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDownload, 
  onBulkDelete, 
  onBulkOrganize 
}) => {
  const [showActions, setShowActions] = useState(false);
  const selectedCount = selectedFiles?.length || 0;
  const isAllSelected = selectedCount === totalFiles;

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-elevation-4 z-modal">
      <div className="flex items-center justify-between p-4">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <Icon name="Check" size={16} color="white" />
            </div>
            <span className="text-sm font-body-medium text-text-primary">
              {selectedCount} of {totalFiles} selected
            </span>
          </div>

          <Button
            variant="ghost"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="text-primary hover:text-primary"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              iconName="Download"
              onClick={onBulkDownload}
            >
              Download ({selectedCount})
            </Button>
            
            <Button
              variant="outline"
              iconName="FolderOpen"
              onClick={onBulkOrganize}
            >
              Organize
            </Button>
            
            <Button
              variant="outline"
              iconName="Trash2"
              onClick={onBulkDelete}
              className="text-error hover:text-error"
            >
              Delete
            </Button>
          </div>

          {/* Mobile Actions Menu */}
          <div className="md:hidden relative">
            <Button
              variant="primary"
              iconName="MoreHorizontal"
              onClick={() => setShowActions(!showActions)}
            >
              Actions
            </Button>

            {showActions && (
              <>
                <div 
                  className="fixed inset-0 bg-black bg-opacity-25 z-dropdown"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-background border border-border rounded-interactive shadow-elevation-3 z-tooltip">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onBulkDownload();
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-surface micro-interaction"
                    >
                      <Icon name="Download" size={16} color="currentColor" />
                      <span className="text-sm font-body-medium text-text-primary">
                        Download ({selectedCount})
                      </span>
                    </button>
                    
                    <button
                      onClick={() => {
                        onBulkOrganize();
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-surface micro-interaction"
                    >
                      <Icon name="FolderOpen" size={16} color="currentColor" />
                      <span className="text-sm font-body-medium text-text-primary">
                        Organize Files
                      </span>
                    </button>
                    
                    <div className="border-t border-border my-1" />
                    
                    <button
                      onClick={() => {
                        onBulkDelete();
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-surface micro-interaction text-error"
                    >
                      <Icon name="Trash2" size={16} color="currentColor" />
                      <span className="text-sm font-body-medium">
                        Delete Files
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionFooter;