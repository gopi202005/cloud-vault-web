import { useState, useEffect, useCallback } from 'react';
import storageService from '../utils/storageService';

const useFileStorage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageStats, setStorageStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    storageUsed: 0,
    storageQuota: 0
  });

  // Load files from storage on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedFiles = await storageService.getAllFiles();
      setFiles(storedFiles);
      
      const stats = await storageService.getStorageStats();
      setStorageStats(stats);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files from storage');
      
      // Fallback to empty state
      setFiles([]);
      setStorageStats({
        totalFiles: 0,
        totalSize: 0,
        storageUsed: 0,
        storageQuota: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFile = useCallback(async (file, metadata) => {
    try {
      setError(null);
      
      // Check storage availability
      const canStore = await storageService.canStore(file.size);
      if (!canStore) {
        throw new Error('Storage quota exceeded. Please delete some files to free up space.');
      }

      const savedFile = await storageService.saveFile(file, metadata);
      
      // Add to local state
      const fileWithUrl = {
        ...savedFile,
        url: URL.createObjectURL(file)
      };
      
      setFiles(prev => [fileWithUrl, ...prev]);
      
      // Update storage stats
      const stats = await storageService.getStorageStats();
      setStorageStats(stats);
      
      return fileWithUrl;
    } catch (err) {
      console.error('Error saving file:', err);
      setError(err.message || 'Failed to save file');
      throw err;
    }
  }, []);

  const deleteFile = useCallback(async (fileId) => {
    try {
      setError(null);
      
      await storageService.deleteFile(fileId);
      
      // Remove from local state
      setFiles(prev => prev.filter(f => f.id !== fileId));
      
      // Update storage stats
      const stats = await storageService.getStorageStats();
      setStorageStats(stats);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file');
      throw err;
    }
  }, []);

  const deleteMultipleFiles = useCallback(async (fileIds) => {
    try {
      setError(null);
      
      await storageService.deleteMultipleFiles(fileIds);
      
      // Remove from local state
      setFiles(prev => prev.filter(f => !fileIds.includes(f.id)));
      
      // Update storage stats
      const stats = await storageService.getStorageStats();
      setStorageStats(stats);
    } catch (err) {
      console.error('Error deleting files:', err);
      setError('Failed to delete files');
      throw err;
    }
  }, []);

  const clearAllFiles = useCallback(async () => {
    try {
      setError(null);
      
      await storageService.clearAllFiles();
      
      // Clear local state
      setFiles([]);
      setStorageStats({
        totalFiles: 0,
        totalSize: 0,
        storageUsed: 0,
        storageQuota: 0
      });
    } catch (err) {
      console.error('Error clearing all files:', err);
      setError('Failed to clear all files');
      throw err;
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const stats = await storageService.getStorageStats();
      setStorageStats(stats);
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  }, []);

  return {
    files,
    loading,
    error,
    storageStats,
    saveFile,
    deleteFile,
    deleteMultipleFiles,
    clearAllFiles,
    refreshStats,
    reload: loadFiles
  };
};

export default useFileStorage;