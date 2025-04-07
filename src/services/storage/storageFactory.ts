
import { storageService } from './storageService';
import { cloudStorageService } from './cloudStorageService';
import { StorageBackend } from './types';

/**
 * Storage provider types
 */
export type StorageProvider = 'local' | 'cloud' | 'mobile';

/**
 * Storage factory configuration
 */
export interface StorageFactoryConfig {
  defaultProvider: StorageProvider;
  cloudConfig?: {
    apiKey?: string;
    userId?: string;
    endpoint?: string;
  };
}

/**
 * Storage provider factory
 * 
 * This factory allows easy switching between storage providers
 * based on the platform and user preferences.
 */
class StorageFactory {
  private initialized = false;
  private config: StorageFactoryConfig = {
    defaultProvider: 'local'
  };
  
  /**
   * Initialize the storage factory with configuration
   */
  public init(config: StorageFactoryConfig): boolean {
    try {
      this.config = { ...config };
      
      // Initialize default provider
      if (config.defaultProvider === 'cloud' && config.cloudConfig) {
        cloudStorageService.init(config.cloudConfig);
      }
      
      // Set the storage service backend
      storageService.setBackend(
        config.defaultProvider === 'mobile' ? 'local' : config.defaultProvider as StorageBackend
      );
      
      this.initialized = true;
      console.log(`Storage factory initialized with default provider: ${config.defaultProvider}`);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize storage factory:', error);
      return false;
    }
  }
  
  /**
   * Get the appropriate storage service based on provider
   */
  public getStorage(provider?: StorageProvider) {
    // Always return the main storage service, which delegates to the right implementation
    return storageService;
  }
  
  /**
   * Check if platform-specific features are available
   */
  public isPlatformSupported(platform: 'web' | 'mobile' | 'desktop'): boolean {
    // Simple platform detection
    if (platform === 'web') {
      return true;
    }
    
    if (platform === 'mobile') {
      // Check for mobile capabilities
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      return isMobile;
    }
    
    if (platform === 'desktop') {
      // Check for desktop capabilities
      return !this.isPlatformSupported('mobile');
    }
    
    return false;
  }
}

// Export singleton instance
export const storageFactory = new StorageFactory();
