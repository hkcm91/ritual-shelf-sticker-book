
import { localStorageService } from './localStorageService';
import { cloudStorageService } from './cloudStorageService';
import { IStorageService, StorageBackend } from './types';

/**
 * Factory to create the appropriate storage service
 */
export const createStorageService = (backend: StorageBackend): IStorageService => {
  switch (backend) {
    case 'cloud':
      return cloudStorageService;
    case 'local':
    default:
      return localStorageService;
  }
};
