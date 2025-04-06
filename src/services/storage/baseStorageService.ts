
import { toast } from 'sonner';
import { compressImage } from '../../utils/imageUtils';
import { resetBookshelfData } from '../../utils/storageUtils';
import { IStorageService, StorageBackend, StorageOptions } from './types';

/**
 * Base abstract storage service that implements common functionality
 */
export abstract class BaseStorageService implements IStorageService {
  protected readonly PREFIX = 'ritual-bookshelf-';
  protected storageQuotaWarning = false;
  protected currentBackend: StorageBackend = 'local';

  /**
   * Set the storage backend
   */
  public setBackend(backend: StorageBackend): void {
    this.currentBackend = backend;
    console.log(`Storage backend set to: ${backend}`);
  }

  /**
   * Get current backend
   */
  public getBackend(): StorageBackend {
    return this.currentBackend;
  }

  /**
   * Reset bookshelf data only, preserving settings
   */
  public resetBookshelfData(): boolean {
    return resetBookshelfData();
  }

  /**
   * Helper method to compress image data if needed
   */
  protected async compressImageIfNeeded(value: any, options?: StorageOptions): Promise<any> {
    if (options?.compress && typeof value === 'string' && value.startsWith('data:image/')) {
      return compressImage(value, {
        quality: options.quality || 0.7,
        maxWidth: options.maxWidth || 800,
        maxHeight: options.maxHeight || 1200
      });
    }
    return value;
  }

  /**
   * Helper method to handle book covers in large objects
   */
  protected async processLargeObjectData(key: string, value: any): Promise<any> {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    // Special handling for books with large coverURL data
    if (key === 'books') {
      const processedValue = { ...value };
      for (const bookId in processedValue) {
        const book = processedValue[bookId];
        if (book.coverURL && typeof book.coverURL === 'string' && book.coverURL.length > 500000) {
          // Compress large cover images
          if (book.coverURL.startsWith('data:image/')) {
            book.coverURL = await compressImage(book.coverURL, {
              quality: 0.6,
              maxWidth: 600,
              maxHeight: 900
            });
            console.log(`Compressed large book cover for book ${bookId}`);
          }
        }
      }
      return processedValue;
    }
    
    return value;
  }

  // Abstract methods that each storage provider must implement
  public abstract resetAllStorage(): boolean;
  public abstract getItem<T>(key: string): T | null;
  public abstract setItem(key: string, value: any, options?: StorageOptions): Promise<boolean>;
  public abstract removeItem(key: string): boolean;
  public abstract clear(): boolean;
  public abstract getUsageStats(): { used: number, total: number, percent: number };
}
