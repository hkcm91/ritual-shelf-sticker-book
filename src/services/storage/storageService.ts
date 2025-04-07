
import { localStorageService } from './localStorageService';
import { cloudStorageService } from './cloudStorageService';
import { StorageBackend, StorageOptions } from './types';

/**
 * Main storage service that delegates to the appropriate implementation
 * based on the current backend setting
 */
class StorageService {
  private currentBackend: StorageBackend = 'local';

  /**
   * Set the storage backend
   */
  public setBackend(backend: StorageBackend): void {
    this.currentBackend = backend;
    
    // Also update the underlying service's backend
    if (backend === 'local') {
      localStorageService.setBackend(backend);
    } else {
      cloudStorageService.setBackend(backend);
    }
    
    console.log(`Storage backend set to: ${backend}`);
  }

  /**
   * Get current backend
   */
  public getBackend(): StorageBackend {
    return this.currentBackend;
  }
  
  /**
   * Reset all storage
   */
  public resetAllStorage(): boolean {
    if (this.currentBackend === 'local') {
      return localStorageService.resetAllStorage();
    } else {
      return cloudStorageService.resetAllStorage();
    }
  }

  /**
   * Reset only bookshelf data, preserving settings
   */
  public resetBookshelfData(): boolean {
    if (this.currentBackend === 'local') {
      return localStorageService.resetBookshelfData();
    } else {
      return cloudStorageService.resetBookshelfData();
    }
  }

  /**
   * Get an item from storage
   */
  public getItem<T>(key: string): T | null {
    if (this.currentBackend === 'local') {
      return localStorageService.getItem<T>(key);
    } else {
      return cloudStorageService.getItem<T>(key);
    }
  }

  /**
   * Store an item with optional compression for images
   */
  public async setItem(key: string, value: any, options?: StorageOptions): Promise<boolean> {
    if (this.currentBackend === 'local') {
      return localStorageService.setItem(key, value, options);
    } else {
      return cloudStorageService.setItem(key, value, options);
    }
  }

  /**
   * Remove an item from storage
   */
  public removeItem(key: string): boolean {
    if (this.currentBackend === 'local') {
      return localStorageService.removeItem(key);
    } else {
      return cloudStorageService.removeItem(key);
    }
  }

  /**
   * Clear all storage for this app
   */
  public clear(): boolean {
    if (this.currentBackend === 'local') {
      return localStorageService.clear();
    } else {
      return cloudStorageService.clear();
    }
  }

  /**
   * Get approximate usage statistics
   */
  public getUsageStats(): { used: number, total: number, percent: number } {
    if (this.currentBackend === 'local') {
      return localStorageService.getUsageStats();
    } else {
      return cloudStorageService.getUsageStats();
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Re-export types
export type { StorageBackend, StorageOptions } from './types';
