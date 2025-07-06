import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/file-upload-dashboard',
      icon: 'LayoutGrid',
      tooltip: 'File upload and collection overview'
    },
    {
      id: 'organize',
      label: 'Organize',
      path: '/file-organization-manager',
      icon: 'FolderOpen',
      tooltip: 'File categorization and folder management'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-sidebar lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-background border-r border-border z-sidebar
          transition-transform duration-300 ease-smooth
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          w-sidebar-width lg:w-sidebar-width
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-sidebar-padding border-b border-border">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-container">
              <Icon name="HardDrive" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-heading-semibold text-text-primary">
                MediaVault
              </h1>
              <p className="text-xs font-caption-normal text-text-secondary">
                Local Storage
              </p>
            </div>
          </div>
          
          {/* Mobile Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-interactive hover:bg-surface micro-interaction"
            aria-label="Close sidebar"
          >
            <Icon name="X" size={20} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-sidebar-padding">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-interactive
                    text-left font-body-medium transition-all duration-150 ease-smooth
                    micro-interaction group relative
                    ${isActiveRoute(item.path)
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    }
                  `}
                  title={item.tooltip}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={isActiveRoute(item.path) ? 'white' : 'currentColor'} 
                  />
                  <span className="flex-1">{item.label}</span>
                  
                  {/* Active Indicator */}
                  {isActiveRoute(item.path) && (
                    <div className="absolute right-2 w-2 h-2 bg-accent rounded-full" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-sidebar-padding border-t border-border">
          <div className="flex items-center space-x-3 p-3 rounded-interactive bg-surface">
            <div className="flex items-center justify-center w-8 h-8 bg-success rounded-full">
              <Icon name="Wifi" size={16} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-body-medium text-text-primary">Local Mode</p>
              <p className="text-xs font-caption-normal text-text-secondary">
                Files stored locally
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button - Fixed Position */}
      <button
        onClick={toggleSidebar}
        className={`
          fixed top-4 left-4 z-modal lg:hidden
          p-3 bg-primary text-primary-foreground rounded-interactive
          shadow-elevation-3 micro-interaction
          ${!isCollapsed ? 'hidden' : 'block'}
        `}
        aria-label="Open sidebar"
      >
        <Icon name="Menu" size={20} color="white" />
      </button>
    </>
  );
};

export default Sidebar;