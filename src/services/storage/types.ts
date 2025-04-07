
/**
 * Core storage types and interfaces
 */

// Storage options for compression and optimization
export type StorageOptions = {
  compress?: boolean;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
};

// Available storage backends
export type StorageBackend = 'local' | 'cloud';

// Interface that all storage providers must implement
export interface IStorageService {
  getBackend(): StorageBackend;
  setBackend(backend: StorageBackend): void;
  resetAllStorage(): boolean;
  resetBookshelfData(): boolean;
  getItem<T>(key: string): T | null;
  setItem(key: string, value: any, options?: StorageOptions): Promise<boolean>;
  removeItem(key: string): boolean;
  clear(): boolean;
  getUsageStats(): { used: number, total: number, percent: number, keys?: number };
}
