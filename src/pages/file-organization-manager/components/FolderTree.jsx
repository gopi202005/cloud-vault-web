import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FolderTree = ({ folders, selectedFolder, onFolderSelect, onFolderCreate, onFolderRename, onFolderDelete, onFolderMove }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [draggedFolder, setDraggedFolder] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const dragCounter = useRef(0);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderClick = (folder) => {
    onFolderSelect(folder);
    setContextMenu(null);
  };

  const handleContextMenu = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      folder
    });
  };

  const handleCreateFolder = (parentId) => {
    const newFolder = {
      id: `folder_${Date.now()}`,
      name: 'New Folder',
      parentId,
      children: [],
      fileCount: 0,
      createdAt: new Date().toISOString()
    };
    onFolderCreate(newFolder);
    setEditingFolder(newFolder.id);
    setNewFolderName('New Folder');
    setContextMenu(null);
  };

  const handleRenameStart = (folder) => {
    setEditingFolder(folder.id);
    setNewFolderName(folder.name);
    setContextMenu(null);
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (newFolderName.trim() && editingFolder) {
      onFolderRename(editingFolder, newFolderName.trim());
    }
    setEditingFolder(null);
    setNewFolderName('');
  };

  const handleRenameCancel = () => {
    setEditingFolder(null);
    setNewFolderName('');
  };

  const handleDeleteFolder = (folder) => {
    if (window.confirm(`Are you sure you want to delete "${folder.name}" and all its contents?`)) {
      onFolderDelete(folder.id);
    }
    setContextMenu(null);
  };

  const handleDragStart = (e, folder) => {
    setDraggedFolder(folder);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', folder.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, folder) => {
    e.preventDefault();
    dragCounter.current++;
    if (draggedFolder && draggedFolder.id !== folder.id) {
      setDropTarget(folder.id);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDropTarget(null);
    }
  };

  const handleDrop = (e, targetFolder) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDropTarget(null);
    
    if (draggedFolder && targetFolder && draggedFolder.id !== targetFolder.id) {
      // Check if target is not a child of dragged folder
      const isChildFolder = (parent, child) => {
        if (parent.id === child.id) return true;
        return parent.children?.some(c => isChildFolder(c, child));
      };
      
      if (!isChildFolder(draggedFolder, targetFolder)) {
        onFolderMove(draggedFolder.id, targetFolder.id);
      }
    }
    setDraggedFolder(null);
  };

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolder?.id === folder.id;
    const isEditing = editingFolder === folder.id;
    const isDropTarget = dropTarget === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.id} className="select-none">
        <div
          className={`
            flex items-center space-x-2 py-2 px-3 rounded-container cursor-pointer
            transition-all duration-150 ease-smooth
            ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-surface'}
            ${isDropTarget ? 'bg-accent bg-opacity-20 border-2 border-accent border-dashed' : ''}
          `}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => !isEditing && handleFolderClick(folder)}
          onContextMenu={(e) => handleContextMenu(e, folder)}
          draggable={folder.id !== 'root'}
          onDragStart={(e) => handleDragStart(e, folder)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, folder)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folder)}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="p-1 rounded-container hover:bg-border-light micro-interaction"
            >
              <Icon
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                size={16}
                color={isSelected ? 'white' : 'var(--color-text-secondary)'}
              />
            </button>
          )}

          {/* Folder Icon */}
          <Icon
            name={isExpanded ? 'FolderOpen' : 'Folder'}
            size={18}
            color={isSelected ? 'white' : 'var(--color-accent)'}
          />

          {/* Folder Name */}
          {isEditing ? (
            <form onSubmit={handleRenameSubmit} className="flex-1">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={handleRenameCancel}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleRenameCancel();
                  }
                }}
                className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded-container focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </form>
          ) : (
            <div className="flex-1 flex items-center justify-between">
              <span className={`text-sm font-body-medium truncate ${isSelected ? 'text-primary-foreground' : 'text-text-primary'}`}>
                {folder.name}
              </span>
              {folder.fileCount > 0 && (
                <span className={`text-xs font-data-normal px-2 py-1 rounded-full ${isSelected ? 'bg-primary-foreground bg-opacity-20 text-primary-foreground' : 'bg-surface text-text-secondary'}`}>
                  {folder.fileCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Child Folders */}
        {isExpanded && hasChildren && (
          <div>
            {folder.children.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-heading-semibold text-text-primary">Folders</h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="Plus"
          onClick={() => handleCreateFolder('root')}
          className="text-text-secondary hover:text-text-primary"
        >
          New
        </Button>
      </div>

      {/* Folder Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {folders.map(folder => renderFolder(folder))}
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
              onClick={() => handleCreateFolder(contextMenu.folder.id)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-body-normal text-text-primary hover:bg-surface"
            >
              <Icon name="Plus" size={16} color="var(--color-text-secondary)" />
              <span>New Folder</span>
            </button>
            <button
              onClick={() => handleRenameStart(contextMenu.folder)}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-body-normal text-text-primary hover:bg-surface"
            >
              <Icon name="Edit" size={16} color="var(--color-text-secondary)" />
              <span>Rename</span>
            </button>
            {contextMenu.folder.id !== 'root' && (
              <button
                onClick={() => handleDeleteFolder(contextMenu.folder)}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-body-normal text-error hover:bg-error hover:bg-opacity-10"
              >
                <Icon name="Trash2" size={16} color="var(--color-error)" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FolderTree;