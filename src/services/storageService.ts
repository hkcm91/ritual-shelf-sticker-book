
import { compressImage } from '../utils/imageUtils';
import { toast } from 'sonner';

// Storage types
export type StorageOptions = {
  compress?: boolean;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

export type StorageBackend = 'local' | 'cloud';

// Storage service with various backends
class StorageService {
  private readonly PREFIX = 'ritual-bookshelf-';
  private storageQuotaWarning = false;
  private currentBackend: StorageBackend = 'local';

  // Set the storage backend
  public setBackend(backend: StorageBackend): void {
    this.currentBackend = backend;
    console.log(`Storage backend set to: ${backend}`);
  }

  // Get current backend
  public getBackend(): StorageBackend {
    return this.currentBackend;
  }
  
  // Reset all storage (local only for now)
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

  // Get an item from storage
  public getItem<T>(key: string): T | null {
    try {
      if (this.currentBackend === 'local') {
        const value = localStorage.getItem(this.PREFIX + key);
        return value ? JSON.parse(value) : null;
      } else {
        // Cloud storage implementation will go here
        console.log('Cloud storage not yet implemented for getItem');
        return null;
      }
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return null;
    }
  }

  // Store an item with optional compression for images
  public async setItem(key: string, value: any, options?: StorageOptions): Promise<boolean> {
    try {
      // Handle image data URLs by compressing if needed
      if (options?.compress && typeof value === 'string' && value.startsWith('data:image/')) {
        value = await compressImage(value, {
          quality: options.quality || 0.7,
          maxWidth: options.maxWidth || 800,
          maxHeight: options.maxHeight || 1200
        });
      }

      // Stringify the value
      const serialized = JSON.stringify(value);
      
      if (this.currentBackend === 'local') {
        // Store in localStorage
        localStorage.setItem(this.PREFIX + key, serialized);
      } else {
        // Cloud storage implementation will go here
        console.log('Cloud storage not yet implemented for setItem');
        return false;
      }
      
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

  // Remove an item from storage
  public removeItem(key: string): boolean {
    try {
      if (this.currentBackend === 'local') {
        localStorage.removeItem(this.PREFIX + key);
      } else {
        // Cloud storage implementation will go here
        console.log('Cloud storage not yet implemented for removeItem');
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }

  // Clear all storage for this app
  public clear(): boolean {
    try {
      if (this.currentBackend === 'local') {
        // Only clear items with our prefix
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(this.PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        // Cloud storage implementation will go here
        console.log('Cloud storage not yet implemented for clear');
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error clearing storage:`, error);
      return false;
    }
  }

  // Get approximate usage statistics
  public getUsageStats(): { used: number, total: number, percent: number } {
    if (this.currentBackend === 'local') {
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
    } else {
      // Cloud storage stats will go here
      console.log('Cloud storage not yet implemented for getUsageStats');
      return { used: 0, total: 100, percent: 0 };
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
