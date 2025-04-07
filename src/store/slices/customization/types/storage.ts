
import { CustomizationSliceCreator } from '../types';
import { ThemeName } from '@/themes';

export interface StorageState {
  activeTheme: ThemeName | string;
}

export interface ThemeActions {
  setActiveTheme: (themeName: ThemeName | string) => void;
  deleteTheme?: (themeName: ThemeName) => void;
}

export interface StorageActions {
  saveCustomization: () => void;
  loadCustomization: () => void;
  resetCustomization: () => void;
}

// Use export type for re-exporting types with isolatedModules enabled
export type { CustomizationSliceCreator as StorageSliceCreator };
