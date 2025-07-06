import React from 'react';
import Icon from '../../../components/AppIcon';

const StorageStats = ({ totalFiles, totalSize, storageUsed, storageLimit }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const storagePercentage = storageLimit > 0 ? (storageUsed / storageLimit) * 100 : 0;
  
  const getStorageColor = () => {
    if (storagePercentage >= 90) return 'error';
    if (storagePercentage >= 75) return 'warning';
    return 'success';
  };

  const storageColor = getStorageColor();

  const stats = [
    {
      label: 'Total Files',
      value: totalFiles.toLocaleString(),
      icon: 'Files',
      color: 'primary'
    },
    {
      label: 'Total Size',
      value: formatFileSize(totalSize),
      icon: 'HardDrive',
      color: 'accent'
    },
    {
      label: 'Storage Used',
      value: `${storagePercentage.toFixed(1)}%`,
      icon: 'PieChart',
      color: storageColor
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Storage Overview
        </h3>
        
        {/* Storage Progress */}
        <div className="bg-surface rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Storage Usage</span>
            <span className="text-sm text-text-secondary">{storagePercentage.toFixed(1)}%</span>
          </div>
          
          <div className="w-full bg-border-light rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full bg-${storageColor} transition-all duration-300`}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>{formatFileSize(storageUsed)} used</span>
            <span>{formatFileSize(storageLimit)} total</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-${stat.color} bg-opacity-10`}>
              <Icon name={stat.icon} size={20} color={`var(--color-${stat.color})`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Storage Tips */}
      <div className="bg-surface rounded-lg p-4">
        <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
          <Icon name="Lightbulb" size={16} color="var(--color-warning)" className="mr-2" />
          Storage Tips
        </h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <p>• Compress large video files before uploading</p>
          <p>• Use WebP format for images to save space</p>
          <p>• Regularly clean up unused files</p>
          <p>• Monitor storage usage to avoid limits</p>
        </div>
      </div>
    </div>
  );
};

export default StorageStats;