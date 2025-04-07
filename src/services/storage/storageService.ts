
import { IStorageService, StorageBackend, StorageOptions } from './types';
import { localStorageService } from './localStorageService';
import { cloudStorageService } from './cloudStorageService';
import { createStorageService } from './storageFactory';

// Initialize with local storage by default
let currentBackend: StorageBackend = 'local';
let storageProvider: IStorageService = localStorageService;

// Facade for all storage operations
export const storageService: IStorageService = {
  // Get current backend
  getBackend: (): StorageBackend => {
    return storageProvider.getBackend();
  },
  
  // Set storage backend
  setBackend: (backend: StorageBackend): void => {
    currentBackend = backend;
    storageProvider = createStorageService(backend);
    storageProvider.setBackend(backend);
  },
  
  // Reset all storage
  resetAllStorage: (): boolean => {
    return storageProvider.resetAllStorage();
  },
  
  // Reset bookshelf data
  resetBookshelfData: (): boolean => {
    return storageProvider.resetBookshelfData();
  },
  
  // Get item from storage
  getItem: <T>(key: string): T | null => {
    return storageProvider.getItem<T>(key);
  },
  
  // Set item in storage with optional image compression
  setItem: async (key: string, value: any, options?: StorageOptions): Promise<boolean> => {
    return storageProvider.setItem(key, value, options);
  },
  
  // Remove item from storage
  removeItem: (key: string): boolean => {
    return storageProvider.removeItem(key);
  },
  
  // Clear all storage
  clear: (): boolean => {
    return storageProvider.clear();
  },
  
  // Get storage usage statistics
  getUsageStats: () => {
    return storageProvider.getUsageStats();
  }
};

// Export the types for consumers
export type { StorageOptions, StorageBackend } from './types';
