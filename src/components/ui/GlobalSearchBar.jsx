import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const GlobalSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Mock search results for demonstration
  const mockFiles = [
    { id: 1, name: 'presentation-slides.pdf', type: 'document', size: '2.5 MB', modified: '2024-01-15', path: '/Documents/Work' },
    { id: 2, name: 'vacation-photos.zip', type: 'archive', size: '45.2 MB', modified: '2024-01-14', path: '/Photos/2024' },
    { id: 3, name: 'project-demo.mp4', type: 'video', size: '128.7 MB', modified: '2024-01-13', path: '/Videos/Projects' },
    { id: 4, name: 'budget-spreadsheet.xlsx', type: 'document', size: '1.8 MB', modified: '2024-01-12', path: '/Documents/Finance' },
    { id: 5, name: 'design-mockups.psd', type: 'image', size: '15.3 MB', modified: '2024-01-11', path: '/Design/Assets' }
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Handle click outside to close search
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = mockFiles.filter(file =>
        file.name.toLowerCase().includes(query.toLowerCase()) ||
        file.path.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoading(false);
    }, 300);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(search => search !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      performSearch(searchQuery);
    }
  };

  const handleRecentSearchClick = (search) => {
    setSearchQuery(search);
    performSearch(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'document': return 'FileText';
      case 'image': return 'Image';
      case 'video': return 'Video';
      case 'archive': return 'Archive';
      default: return 'File';
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'document': return 'text-primary';
      case 'image': return 'text-success';
      case 'video': return 'text-accent';
      case 'archive': return 'text-warning';
      default: return 'text-secondary';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Icon 
            name="Search" 
            size={20} 
            color="var(--color-text-secondary)"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsExpanded(true)}
            placeholder="Search files and folders..."
            className="
              w-full pl-10 pr-12 py-3 
              bg-surface border border-border rounded-interactive
              text-text-primary placeholder-text-secondary
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-150 ease-smooth
            "
          />
          
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
          
          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setIsExpanded(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-container hover:bg-border-light micro-interaction"
              aria-label="Clear search"
            >
              <Icon name="X" size={16} color="var(--color-text-secondary)" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-interactive shadow-elevation-4 z-dropdown max-h-96 overflow-hidden">
          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-body-medium text-text-primary">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={clearRecentSearches}
                  className="text-text-secondary hover:text-text-primary"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex items-center space-x-3 w-full p-2 rounded-container hover:bg-surface micro-interaction text-left"
                  >
                    <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
                    <span className="text-sm font-body-normal text-text-primary">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="upload-progress-gradient w-full h-4 rounded-container mb-2" />
                  <div className="upload-progress-gradient w-3/4 h-4 rounded-container mx-auto mb-2" />
                  <div className="upload-progress-gradient w-1/2 h-4 rounded-container mx-auto" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-border">
                  {searchResults.map((file) => (
                    <button
                      key={file.id}
                      className="flex items-center space-x-4 w-full p-4 hover:bg-surface micro-interaction text-left"
                      onClick={() => {
                        // Handle file selection
                        console.log('Selected file:', file);
                        setIsExpanded(false);
                      }}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-container bg-surface ${getFileTypeColor(file.type)}`}>
                        <Icon name={getFileIcon(file.type)} size={20} color="currentColor" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body-medium text-text-primary truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-data-normal text-text-secondary">
                            {file.size}
                          </span>
                          <span className="text-xs text-text-secondary">•</span>
                          <span className="text-xs font-caption-normal text-text-secondary">
                            {file.modified}
                          </span>
                        </div>
                        <p className="text-xs font-caption-normal text-text-secondary truncate mt-1">
                          {file.path}
                        </p>
                      </div>
                      
                      <Icon name="ChevronRight" size={16} color="var(--color-text-secondary)" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Icon name="Search" size={32} color="var(--color-text-secondary)" className="mx-auto mb-3" />
                  <p className="text-sm font-body-medium text-text-primary mb-1">No files found</p>
                  <p className="text-xs font-caption-normal text-text-secondary">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Search Tips */}
          {!searchQuery && recentSearches.length === 0 && (
            <div className="p-4">
              <h3 className="text-sm font-body-medium text-text-primary mb-3">Search Tips</h3>
              <div className="space-y-2 text-xs font-caption-normal text-text-secondary">
                <p>• Search by filename or folder path</p>
                <p>• Use specific file extensions (e.g., .pdf, .jpg)</p>
                <p>• Search for partial matches</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;