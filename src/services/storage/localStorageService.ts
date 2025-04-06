
import { toast } from 'sonner';
import { BaseStorageService } from './baseStorageService';
import { StorageOptions } from './types';

/**
 * LocalStorage implementation of the storage service
 */
export class LocalStorageService extends BaseStorageService {
  /**
   * Reset all storage (clear all items with our prefix)
   */
  public resetAllStorage(): boolean {
    try {
      // Only clear items with our prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.PREFIX) || 
            key.startsWith('bookshelf-') || 
            key.startsWith('slot-') ||
            key.includes('background-image')) {
          localStorage.removeItem(key);
        }
      });
      
      toast.success('All storage has been reset');
      return true;
    } catch (error) {
      console.error(`Error clearing storage:`, error);
      toast.error('Failed to reset storage');
      return false;
    }
  }

  /**
   * Get an item from local storage
   */
  public getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(this.PREFIX + key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return null;
    }
  }

  /**
   * Store an item in local storage with optional compression for images
   */
  public async setItem(key: string, value: any, options?: StorageOptions): Promise<boolean> {
    try {
      // Handle image compression if needed
      value = await this.compressImageIfNeeded(value, options);
      
      // Process large objects (like books with big cover images)
      value = await this.processLargeObjectData(key, value);
      
      // Serialize the value
      const serialized = JSON.stringify(value);
      
      // Store in localStorage
      localStorage.setItem(this.PREFIX + key, serialized);
      
      // Reset warning flag on successful storage
      this.storageQuotaWarning = false;
      return true;
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        if (!this.storageQuotaWarning) {
          toast.error("Storage is full. Try using smaller images or removing unused items.");
          this.storageQuotaWarning = true;
        }
        return false;
      }
      
      console.error(`Error storing ${key} in storage:`, error);
      return false;
    }
  }

  /**
   * Remove an item from storage
   */
  public removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }

  /**
   * Clear all storage for this app
   */
  public clear(): boolean {
    try {
      // Only clear items with our prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error(`Error clearing storage:`, error);
      return false;
    }
  }

  /**
   * Get approximate usage statistics
   */
  public getUsageStats(): { used: number, total: number, percent: number } {
    let used = 0;
    
    // Calculate approximate usage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.PREFIX) || 
          key.startsWith('bookshelf-') || 
          key.startsWith('slot-') ||
          key.includes('background-image')) {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length * 2; // Rough estimate: 2 bytes per character
        }
      }
    });
    
    // Estimate total available (5MB is common minimum)
    const total = 5 * 1024 * 1024;
    const percent = Math.min(100, Math.round((used / total) * 100));
    
    return { used, total, percent };
  }
}

// Create and export singleton instance
export const localStorageService = new LocalStorageService();
