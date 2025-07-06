import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const StorageQuotaIndicator = () => {
  const [storageData, setStorageData] = useState({
    used: 0,
    total: 0,
    percentage: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateStorageInfo = async () => {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          const used = estimate.usage || 0;
          const total = estimate.quota || 0;
          const percentage = total > 0 ? (used / total) * 100 : 0;
          
          setStorageData({
            used,
            total,
            percentage: Math.round(percentage * 100) / 100
          });
        } else {
          // Fallback for browsers that don't support storage estimation
          const mockUsed = 2.5 * 1024 * 1024 * 1024; // 2.5GB
          const mockTotal = 10 * 1024 * 1024 * 1024; // 10GB
          setStorageData({
            used: mockUsed,
            total: mockTotal,
            percentage: 25
          });
        }
      } catch (error) {
        console.error('Error estimating storage:', error);
      }
    };

    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = () => {
    if (storageData.percentage >= 90) return 'error';
    if (storageData.percentage >= 75) return 'warning';
    return 'success';
  };

  const getStatusIcon = () => {
    if (storageData.percentage >= 90) return 'AlertTriangle';
    if (storageData.percentage >= 75) return 'AlertCircle';
    return 'HardDrive';
  };

  const statusColor = getStatusColor();
  const statusIcon = getStatusIcon();

  return (
    <div className="relative">
      {/* Desktop View */}
      <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-surface rounded-interactive border border-border">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-${statusColor}`}>
          <Icon 
            name={statusIcon} 
            size={16} 
            color="white" 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-body-medium text-text-primary">
              Storage
            </span>
            <span className="text-xs font-data-normal text-text-secondary">
              {storageData.percentage}%
            </span>
          </div>
          
          <div className="w-full bg-border-light rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-${statusColor} transition-all duration-300 ease-smooth`}
              style={{ width: `${Math.min(storageData.percentage, 100)}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-data-normal text-text-secondary">
              {formatBytes(storageData.used)}
            </span>
            <span className="text-xs font-data-normal text-text-secondary">
              {formatBytes(storageData.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center justify-center w-10 h-10 rounded-full
            bg-${statusColor} text-${statusColor}-foreground
            micro-interaction shadow-elevation-2
          `}
          aria-label="Storage quota"
        >
          <Icon 
            name={statusIcon} 
            size={20} 
            color="white" 
          />
        </button>

        {/* Mobile Expanded View */}
        {isExpanded && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-dropdown"
              onClick={() => setIsExpanded(false)}
            />
            <div className="absolute top-12 right-0 w-64 p-4 bg-background rounded-interactive border border-border shadow-elevation-3 z-tooltip">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-${statusColor}`}>
                  <Icon 
                    name={statusIcon} 
                    size={16} 
                    color="white" 
                  />
                </div>
                <div>
                  <h3 className="text-sm font-body-medium text-text-primary">
                    Storage Usage
                  </h3>
                  <p className="text-xs font-caption-normal text-text-secondary">
                    {storageData.percentage}% used
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-border-light rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full bg-${statusColor} transition-all duration-300 ease-smooth`}
                  style={{ width: `${Math.min(storageData.percentage, 100)}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs font-data-normal text-text-secondary">
                <span>{formatBytes(storageData.used)} used</span>
                <span>{formatBytes(storageData.total)} total</span>
              </div>
              
              {storageData.percentage >= 75 && (
                <div className={`mt-3 p-2 rounded-container bg-${statusColor === 'error' ? 'error' : 'warning'} bg-opacity-10`}>
                  <p className={`text-xs font-caption-normal text-${statusColor}`}>
                    {storageData.percentage >= 90 
                      ? 'Storage almost full. Consider cleaning up files.' :'Storage getting full. Monitor usage closely.'
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StorageQuotaIndicator;