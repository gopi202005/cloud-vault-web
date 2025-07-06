import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NavigationControls = ({ 
  currentIndex, 
  totalFiles, 
  onPrevious, 
  onNext, 
  hasMultipleFiles 
}) => {
  if (!hasMultipleFiles) return null;

  return (
    <>
      {/* Desktop Navigation Arrows */}
      <div className="hidden md:block">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={currentIndex <= 1}
          className={`
            fixed left-6 top-1/2 transform -translate-y-1/2 z-modal
            w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-75
            text-white rounded-full transition-all duration-150
            flex items-center justify-center
            ${currentIndex <= 1 ? 'opacity-50 cursor-not-allowed' : 'micro-interaction'}
          `}
          aria-label="Previous file"
        >
          <Icon name="ChevronLeft" size={24} color="white" />
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={currentIndex >= totalFiles}
          className={`
            fixed right-6 top-1/2 transform -translate-y-1/2 z-modal
            w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-75
            text-white rounded-full transition-all duration-150
            flex items-center justify-center
            ${currentIndex >= totalFiles ? 'opacity-50 cursor-not-allowed' : 'micro-interaction'}
          `}
          aria-label="Next file"
        >
          <Icon name="ChevronRight" size={24} color="white" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-modal">
        <div className="flex items-center space-x-4 bg-black bg-opacity-75 rounded-interactive p-3">
          <Button
            variant="ghost"
            iconName="ChevronLeft"
            onClick={onPrevious}
            disabled={currentIndex <= 1}
            className="text-white hover:bg-white hover:bg-opacity-20 disabled:opacity-50"
          />
          
          <span className="text-white text-sm font-data-normal px-3">
            {currentIndex} / {totalFiles}
          </span>
          
          <Button
            variant="ghost"
            iconName="ChevronRight"
            onClick={onNext}
            disabled={currentIndex >= totalFiles}
            className="text-white hover:bg-white hover:bg-opacity-20 disabled:opacity-50"
          />
        </div>
      </div>

      {/* File Counter - Desktop */}
      <div className="hidden md:block fixed bottom-6 left-1/2 transform -translate-x-1/2 z-modal">
        <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-interactive">
          <span className="text-sm font-data-normal">
            {currentIndex} of {totalFiles}
          </span>
        </div>
      </div>
    </>
  );
};

export default NavigationControls;