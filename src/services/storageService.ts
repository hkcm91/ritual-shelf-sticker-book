
import { compressImage } from '../utils/imageUtils';
import { toast } from 'sonner';

// Storage types
export type StorageOptions = {
  compress?: boolean;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

// Storage service with various backends
class StorageService {
  private readonly PREFIX = 'ritual-bookshelf-';
  private storageQuotaWarning = false;

  // Get an item from storage
  public getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(this.PREFIX + key);
      return value ? JSON.parse(value) : null;
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

      // Stringify and store
      const serialized = JSON.stringify(value);
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

  // Remove an item from storage
  public removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }

  // Clear all storage for this app
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

  // Get approximate usage statistics
  public getUsageStats(): { used: number, total: number, percent: number } {
    let used = 0;
    
    // Calculate approximate usage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.PREFIX)) {
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

// Export singleton instance
export const storageService = new StorageService();
