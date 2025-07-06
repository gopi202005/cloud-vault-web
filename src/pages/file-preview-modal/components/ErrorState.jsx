import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorState = ({ 
  error, 
  fileName, 
  onRetry, 
  onClose, 
  onSkip 
}) => {
  const getErrorMessage = (error) => {
    switch (error?.type) {
      case 'CORRUPTED_FILE':
        return {
          title: 'File Corrupted',
          message: 'This file appears to be corrupted and cannot be displayed.',
          icon: 'AlertTriangle',
          color: 'error'
        };
      case 'UNSUPPORTED_FORMAT':
        return {
          title: 'Unsupported Format',
          message: 'This file format is not supported for preview.',
          icon: 'FileX',
          color: 'warning'
        };
      case 'NETWORK_ERROR':
        return {
          title: 'Network Error',
          message: 'Unable to load the file. Please check your connection.',
          icon: 'WifiOff',
          color: 'error'
        };
      case 'FILE_NOT_FOUND':
        return {
          title: 'File Not Found',
          message: 'The file could not be found in storage.',
          icon: 'Search',
          color: 'error'
        };
      default:
        return {
          title: 'Preview Error',
          message: 'An error occurred while trying to preview this file.',
          icon: 'AlertCircle',
          color: 'error'
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="flex-1 flex items-center justify-center bg-surface">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Error Icon */}
        <div className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-${errorInfo.color} bg-opacity-10`}>
          <Icon 
            name={errorInfo.icon} 
            size={40} 
            color={`var(--color-${errorInfo.color})`} 
          />
        </div>

        {/* Error Title */}
        <h3 className="text-xl font-heading-semibold text-text-primary mb-2">
          {errorInfo.title}
        </h3>

        {/* File Name */}
        <p className="text-sm font-body-medium text-text-secondary mb-4 break-words">
          {fileName}
        </p>

        {/* Error Message */}
        <p className="text-sm font-body-normal text-text-secondary mb-8">
          {errorInfo.message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              variant="primary"
              iconName="RefreshCw"
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
          
          {onSkip && (
            <Button
              variant="outline"
              iconName="SkipForward"
              onClick={onSkip}
            >
              Skip File
            </Button>
          )}
          
          <Button
            variant="ghost"
            iconName="X"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        {/* Technical Details */}
        {error?.details && (
          <details className="mt-8 text-left">
            <summary className="text-sm font-body-medium text-text-secondary cursor-pointer">
              Technical Details
            </summary>
            <pre className="mt-2 p-4 bg-surface-raised rounded text-xs font-mono whitespace-pre-wrap break-words text-text-secondary">
              {error.details}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorState;