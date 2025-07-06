// File Storage Service using IndexedDB and localStorage
class StorageService {
  constructor() {
    this.dbName = 'MediaVaultDB';
    this.dbVersion = 1;
    this.storeName = 'files';
    this.db = null;
    this.isSupported = this.checkSupport();
  }

  checkSupport() {
    return 'indexedDB' in window && 'localStorage' in window;
  }

  async init() {
    if (!this.isSupported) {
      throw new Error('IndexedDB or localStorage not supported');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('uploadDate', 'uploadDate', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async saveFile(file, metadata) {
    try {
      if (!this.db) await this.init();

      const fileData = {
        id: metadata.id,
        name: metadata.name,
        type: metadata.type,
        size: metadata.size,
        uploadDate: metadata.uploadDate,
        blob: file
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(fileData);

        request.onsuccess = () => {
          // Save metadata to localStorage for quick access
          this.saveMetadata(metadata);
          resolve(metadata);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }

  async getFile(id) {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);

        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            // Create object URL for the blob
            const url = URL.createObjectURL(result.blob);
            resolve({
              id: result.id,
              name: result.name,
              type: result.type,
              size: result.size,
              uploadDate: result.uploadDate,
              url: url
            });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  }

  async getAllFiles() {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          const files = request.result.map(file => ({
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadDate: file.uploadDate,
            url: URL.createObjectURL(file.blob)
          }));
          resolve(files);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting all files:', error);
      // Fallback to metadata from localStorage
      return this.getMetadataFromStorage();
    }
  }

  async deleteFile(id) {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);

        request.onsuccess = () => {
          this.removeMetadata(id);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async deleteMultipleFiles(ids) {
    try {
      if (!this.db) await this.init();

      const promises = ids.map(id => this.deleteFile(id));
      return Promise.all(promises);
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw error;
    }
  }

  saveMetadata(metadata) {
    try {
      const existingMetadata = this.getMetadataFromStorage();
      const updatedMetadata = [...existingMetadata.filter(m => m.id !== metadata.id), metadata];
      localStorage.setItem('mediaVaultFiles', JSON.stringify(updatedMetadata));
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  }

  getMetadataFromStorage() {
    try {
      const metadata = localStorage.getItem('mediaVaultFiles');
      return metadata ? JSON.parse(metadata) : [];
    } catch (error) {
      console.error('Error getting metadata from storage:', error);
      return [];
    }
  }

  removeMetadata(id) {
    try {
      const existingMetadata = this.getMetadataFromStorage();
      const updatedMetadata = existingMetadata.filter(m => m.id !== id);
      localStorage.setItem('mediaVaultFiles', JSON.stringify(updatedMetadata));
    } catch (error) {
      console.error('Error removing metadata:', error);
    }
  }

  async getStorageStats() {
    try {
      if (!this.db) await this.init();

      const files = await this.getAllFiles();
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      // Get storage quota if available
      let quota = 0;
      let used = 0;
      
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        quota = estimate.quota || 0;
        used = estimate.usage || 0;
      }

      return {
        totalFiles: files.length,
        totalSize: totalSize,
        storageUsed: used,
        storageQuota: quota
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        storageUsed: 0,
        storageQuota: 0
      };
    }
  }

  async clearAllFiles() {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onsuccess = () => {
          localStorage.removeItem('mediaVaultFiles');
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing all files:', error);
      throw error;
    }
  }

  // Check if storage is available and not full
  async canStore(fileSize) {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const available = (estimate.quota || 0) - (estimate.usage || 0);
        return available > fileSize;
      }
      return true; // Assume available if we can't check
    } catch (error) {
      console.error('Error checking storage availability:', error);
      return true;
    }
  }
}

// Create and export singleton instance
const storageService = new StorageService();
export default storageService;