import React, { useState, useRef, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ImageViewer = ({ src, alt, onLoad, onError }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.1));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.1), 5));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 bg-slate-900 overflow-hidden"
      onWheel={handleWheel}
    >
      {/* Image Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`transition-transform duration-200 ${isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-default'}`}
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          }}
          onMouseDown={handleMouseDown}
        >
          <Image
            ref={imageRef}
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain select-none"
            onLoad={onLoad}
            onError={onError}
            draggable={false}
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black bg-opacity-75 rounded-interactive p-2">
        <Button
          variant="ghost"
          iconName="ZoomOut"
          onClick={handleZoomOut}
          disabled={zoom <= 0.1}
          className="text-white hover:bg-white hover:bg-opacity-20"
        />
        
        <span className="text-white text-sm font-data-normal px-2 min-w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <Button
          variant="ghost"
          iconName="ZoomIn"
          onClick={handleZoomIn}
          disabled={zoom >= 5}
          className="text-white hover:bg-white hover:bg-opacity-20"
        />
        
        <div className="w-px h-6 bg-white bg-opacity-30 mx-1" />
        
        <Button
          variant="ghost"
          iconName="RotateCcw"
          onClick={handleResetZoom}
          className="text-white hover:bg-white hover:bg-opacity-20"
        />
        
        <Button
          variant="ghost"
          iconName={isFullscreen ? "Minimize2" : "Maximize2"}
          onClick={toggleFullscreen}
          className="text-white hover:bg-white hover:bg-opacity-20"
        />
      </div>

      {/* Zoom Indicator */}
      {zoom !== 1 && (
        <div className="absolute top-6 left-6 bg-black bg-opacity-75 text-white px-3 py-1 rounded-container text-sm font-data-normal">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
};

export default ImageViewer;