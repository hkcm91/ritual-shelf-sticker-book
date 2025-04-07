
import { CustomizationSliceCreator } from '../types';
import { ThemeName } from '@/themes';

export interface StorageState {
  activeTheme: ThemeName | string;
}

export interface ThemeActions {
  setActiveTheme: (themeName: ThemeName | string) => void;
}

export interface StorageActions {
  saveCustomization: () => void;
  loadCustomization: () => void;
  resetCustomization: () => void;
}

export type StorageSliceCreator = CustomizationSliceCreator;
