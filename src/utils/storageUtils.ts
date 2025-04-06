
/**
 * Utility functions for managing application storage
 */

import { toast } from 'sonner';

/**
 * Reset all local storage items related to the application
 */
export const resetAllStorage = (): boolean => {
  try {
    // Get all keys from localStorage
    const keys = Object.keys(localStorage);
    
    // Filter for our application-specific keys
    const appKeys = keys.filter(key => 
      key.startsWith('ritual-bookshelf-') || 
      key.startsWith('bookshelf-') ||
      key.startsWith('slot-') ||
      key.includes('background-image')
    );
    
    // Remove each key
    appKeys.forEach(key => localStorage.removeItem(key));
    
    console.log(`Cleared ${appKeys.length} storage items`);
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Get total size of all application storage items in bytes
 */
export const getAppStorageSize = (): number => {
  let totalSize = 0;
  
  try {
    // Get all keys
    const keys = Object.keys(localStorage);
    
    // Filter for our application's keys
    const appKeys = keys.filter(key => 
      key.startsWith('ritual-bookshelf-') || 
      key.startsWith('bookshelf-') ||
      key.startsWith('slot-') ||
      key.includes('background-image')
    );
    
    // Sum up the sizes
    appKeys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length * 2; // Approximate: 2 bytes per character
      }
    });
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};
