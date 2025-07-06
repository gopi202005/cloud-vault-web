import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FileFilters = ({ onFilterChange, totalFiles }) => {
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    dateRange: 'all',
    sizeRange: 'all',
    sortBy: 'newest'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = {
    type: [
      { value: 'all', label: 'All Files', icon: 'Files' },
      { value: 'image', label: 'Images', icon: 'Image' },
      { value: 'video', label: 'Videos', icon: 'Video' }
    ],
    dateRange: [
      { value: 'all', label: 'All Time' },
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' }
    ],
    sizeRange: [
      { value: 'all', label: 'Any Size' },
      { value: 'small', label: '< 10MB' },
      { value: 'medium', label: '10MB - 100MB' },
      { value: 'large', label: '> 100MB' }
    ],
    sortBy: [
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'name', label: 'Name A-Z' },
      { value: 'size', label: 'Size (Large to Small)' }
    ]
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    onFilterChange({ ...newFilters, search: searchQuery });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onFilterChange({ ...activeFilters, search: value });
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      type: 'all',
      dateRange: 'all',
      sizeRange: 'all',
      sortBy: 'newest'
    };
    setActiveFilters(defaultFilters);
    setSearchQuery('');
    onFilterChange({ ...defaultFilters, search: '' });
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== 'all' && value !== 'newest') || searchQuery;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Filters & Search
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        )}
      </div>

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
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* File Type Filter */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          File Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {filterOptions.type.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('type', option.value)}
              className={`
                flex items-center space-x-3 p-3 rounded-lg text-left transition-all
                ${activeFilters.type === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface hover:bg-border-light text-text-primary'
                }
              `}
            >
              <Icon 
                name={option.icon} 
                size={16} 
                color={activeFilters.type === option.value ? 'white' : 'currentColor'} 
              />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Upload Date
        </label>
        <select
          value={activeFilters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="w-full p-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {filterOptions.dateRange.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Size Range Filter */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          File Size
        </label>
        <select
          value={activeFilters.sizeRange}
          onChange={(e) => handleFilterChange('sizeRange', e.target.value)}
          className="w-full p-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {filterOptions.sizeRange.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Sort By
        </label>
        <select
          value={activeFilters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full p-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {filterOptions.sortBy.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results Summary */}
      <div className="p-3 bg-surface rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} color="var(--color-text-secondary)" />
          <span className="text-sm text-text-secondary">
            Showing {totalFiles} files
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileFilters;