
import { ThemeName } from '@/themes';

export interface StorageActions {
  saveCustomization: () => void;
  loadCustomization: () => void;
  resetCustomization: () => void;
  setActiveTheme: (themeName: ThemeName | string) => void;
}
