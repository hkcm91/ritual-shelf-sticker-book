
import { compressImage } from '../../utils/imageUtils';
import { StorageBackend, StorageOptions } from './types';
import { resetAllStorage as resetAllStorageUtil, resetBookshelfData as resetBookshelfDataUtil } from '../../utils/storageUtils';
import { toast } from 'sonner';

// Get storage usage statistics
const getUsageStats = () => {
  try {
    let total = 0;
    let keys = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += value.length * 2; // Approximate bytes (2 bytes per character in UTF-16)
          keys++;
        }
      }
    }
    
    // Calculate percentage of 5MB (common localStorage limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const percent = Math.round((total / maxSize) * 100);
    
    return {
      total,
      used: total, // Return as number instead of string
      keys,
      percent
    };
  } catch (e) {
    console.error('Error calculating storage usage:', e);
    return { total: 0, used: 0, keys: 0, percent: 0 };
  }
};

// Storage service with compression support
export const storageService = {
  // Current backend (local by default)
  private_backend: 'local' as StorageBackend,
  
  // Get current backend
  getBackend: (): StorageBackend => {
    return storageService.private_backend;
  },
  
  // Set storage backend
  setBackend: (backend: StorageBackend): void => {
    storageService.private_backend = backend;
    console.log(`Storage backend set to: ${backend}`);
  },
  
  // Reset all storage
  resetAllStorage: (): boolean => {
    return resetAllStorageUtil();
  },
  
  // Reset bookshelf data
  resetBookshelfData: (): boolean => {
    return resetBookshelfDataUtil();
  },
  
  // Get item from localStorage
  getItem: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return null;
    }
  },
  
  // Set item in localStorage with optional image compression
  setItem: async (key: string, value: any, options?: StorageOptions): Promise<boolean> => {
    try {
      let processedValue = value;
      
      // If compression is requested and we're storing books
      if (options?.compress && key === 'books') {
        processedValue = await compressBookCovers(value, options);
      }
      
      const serialized = JSON.stringify(processedValue);
      
      // Check if we're approaching storage limits
      if (serialized.length > 2 * 1024 * 1024) { // If over 2MB
        console.warn(`Large storage operation: ${(serialized.length / (1024 * 1024)).toFixed(2)}MB`);
        
        // If we're hitting extreme sizes, try emergency compression
        if (serialized.length > 4 * 1024 * 1024) {
          toast.warning('Storage size is getting large. Consider removing unused items.');
        }
      }
      
      try {
        localStorage.setItem(key, serialized);
        return true;
      } catch (storageError) {
        // If storage fails, try emergency cleanup
        console.error(`Storage error for ${key}:`, storageError);
        
        // If it's likely a quota issue, try to free some space
        if (storageError instanceof DOMException && 
            (storageError.name === 'QuotaExceededError' || storageError.code === 22)) {
          
          // Remove any temp storage items
          for (let i = 0; i < localStorage.length; i++) {
            const tempKey = localStorage.key(i);
            if (tempKey && tempKey.includes('temp-')) {
              localStorage.removeItem(tempKey);
            }
          }
          
          // Try again after cleanup
          try {
            localStorage.setItem(key, serialized);
            return true;
          } catch (retryError) {
            console.error('Final storage attempt failed:', retryError);
            toast.error('Storage is full. Please delete some items to continue.');
            return false;
          }
        }
        
        return false;
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      
      // Check if it's a quota error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error('Storage quota exceeded. Try removing some books or stickers.');
      }
      
      return false;
    }
  },
  
  // Remove item from localStorage
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },
  
  // Clear all localStorage
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
  
  // Get storage usage statistics
  getUsageStats
};

// Helper function to compress book covers in a books object
async function compressBookCovers(
  books: Record<string, any>,
  options: StorageOptions
): Promise<Record<string, any>> {
  const compressedBooks = { ...books };
  
  // Process each book
  for (const id in compressedBooks) {
    const book = compressedBooks[id];
    
    // Only process if it has a data URL coverURL
    if (
      book.coverURL && 
      typeof book.coverURL === 'string' && 
      book.coverURL.startsWith('data:image/')
    ) {
      try {
        // Check if the image is large enough to warrant compression
        if (book.coverURL.length > 50000) { // Roughly 50KB
          // Compress the image
          const compressedCover = await compressImage(
            book.coverURL,
            {
              quality: options.quality || 0.7,
              maxWidth: options.maxWidth || 600,
              maxHeight: options.maxHeight || 900
            }
          );
          
          // Update the book with compressed cover
          compressedBooks[id] = {
            ...book,
            coverURL: compressedCover
          };
          
          console.log(`Compressed cover for book ${id}: ${book.coverURL.length} -> ${compressedCover.length} bytes`);
        }
      } catch (err) {
        console.warn(`Failed to compress cover for book ${id}:`, err);
        // Keep original if compression fails
      }
    }
  }
  
  return compressedBooks;
}
