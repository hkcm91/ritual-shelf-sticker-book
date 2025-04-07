
import { StateCreator } from 'zustand';
import { BookshelfState } from '../../bookshelfStore';
import { ThemeName } from '@/themes';

// Define styling interfaces
export interface ShelfStyling {
  thickness: number;
  color: string;
  backgroundImage?: string;
  opacity: number;
  dividers: {
    enabled: boolean;
    booksPerSection: number;
    booksPerRow: number;
    thickness: number;
    color: string;
    orientation: 'vertical' | 'horizontal' | 'both';
  };
}

// Define customization state structure
export interface CustomizationState {
  // Theme - explicitly required, not optional
  activeTheme: ThemeName | string;
  setActiveTheme: (themeName: ThemeName | string) => void;
  
  // General theme settings
  page: {
    background: string;
    backgroundImage: string;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    backgroundAttachment?: string;
  };
  // Bookshelf container settings
  container: {
    background: string;
    backgroundImage: string;
    opacity: number;
    borderWidth: number;
    borderStyle: string;
    borderColor: string;
    borderRadius: number;
    padding: number;
  };
  // Shelf settings
  shelfStyling: ShelfStyling;
  // Slot customization
  slots: {
    addButtonBg: string;
    addButtonColor: string;
    addButtonHoverBg: string;
    toggleInactiveColor: string;
    toggleActiveColor: string;
    toggleBorderColor: string;
    emptyHoverBg: string;
  };
  // Header styling
  header: {
    background: string;
    backgroundImage: string;
    textColor: string;
  };
  // UI state for customization
  ui: {
    isCustomizationModalOpen: boolean;
  };
  
  // Actions
  openCustomizationModal: () => void;
  closeCustomizationModal: () => void;
  
  // Page settings
  updatePageBackground: (color: string) => void;
  updatePageBackgroundImage: (url: string) => void;
  updatePageSetting: (
    property: 'backgroundSize' | 'backgroundRepeat' | 'backgroundPosition' | 'backgroundAttachment',
    value: string
  ) => void;
  
  // Container settings
  updateContainerBackground: (color: string) => void;
  updateContainerBackgroundImage: (url: string) => void;
  updateContainerOpacity: (opacity: number) => void;
  updateContainerBorder: (property: 'borderWidth' | 'borderStyle' | 'borderColor' | 'borderRadius', value: any) => void;
  updateContainerPadding: (padding: number) => void;
  
  // Shelf settings
  updateShelfThickness: (thickness: number) => void;
  updateShelfColor: (color: string) => void;
  updateShelfBackgroundImage: (url: string) => void;
  updateShelfOpacity: (opacity: number) => void;
  
  // Divider settings
  toggleDividers: (enabled: boolean) => void;
  updateDividersSetting: (property: 'booksPerSection' | 'booksPerRow' | 'thickness' | 'color' | 'orientation', value: any) => void;
  updateAllDividerSettings: (settings: {
    enabled?: boolean;
    booksPerSection?: number;
    booksPerRow?: number;
    thickness?: number;
    color?: string;
    orientation?: 'vertical' | 'horizontal' | 'both';
  }) => void;
  
  // Slots settings
  updateSlotSetting: (
    property: 'addButtonBg' | 'addButtonColor' | 'addButtonHoverBg' | 
              'toggleInactiveColor' | 'toggleActiveColor' | 'toggleBorderColor' | 
              'emptyHoverBg',
    value: string
  ) => void;
  
  // Header settings
  updateHeaderSetting: (
    property: 'background' | 'backgroundImage' | 'textColor',
    value: string
  ) => void;
  
  // Storage actions
  saveCustomization: () => void;
  loadCustomization: () => void;
  resetCustomization: () => void;
}

// Default values - all required properties must be initialized
export const defaultCustomization: CustomizationState = {
  activeTheme: 'default',
  setActiveTheme: () => {},
  
  page: {
    background: '#f5f5f5',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  container: {
    background: '#d8bd93',
    backgroundImage: '',
    opacity: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    padding: 16,
  },
  shelfStyling: {
    thickness: 20,
    color: '#d2b48c',
    opacity: 1,
    dividers: {
      enabled: false,
      booksPerSection: 6,
      booksPerRow: 2,
      thickness: 2,
      color: '#a37d4f',
      orientation: 'vertical'
    },
  },
  slots: {
    addButtonBg: 'rgba(255, 255, 255, 0.9)',
    addButtonColor: '#555555',
    addButtonHoverBg: '#ffffff',
    toggleInactiveColor: 'rgba(200, 200, 200, 0.5)',
    toggleActiveColor: 'rgba(80, 80, 80, 0.9)',
    toggleBorderColor: 'rgba(180, 180, 180, 0.7)',
    emptyHoverBg: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    background: '#a47148',
    backgroundImage: '',
    textColor: '#ffffff',
  },
  ui: {
    isCustomizationModalOpen: false,
  },
  
  // These will be implemented by the slices
  openCustomizationModal: () => {},
  closeCustomizationModal: () => {},
  updatePageBackground: () => {},
  updatePageBackgroundImage: () => {},
  updatePageSetting: () => {},
  updateContainerBackground: () => {},
  updateContainerBackgroundImage: () => {},
  updateContainerOpacity: () => {},
  updateContainerBorder: () => {},
  updateContainerPadding: () => {},
  updateShelfThickness: () => {},
  updateShelfColor: () => {},
  updateShelfBackgroundImage: () => {},
  updateShelfOpacity: () => {},
  toggleDividers: () => {},
  updateDividersSetting: () => {},
  updateAllDividerSettings: () => {},
  updateSlotSetting: () => {},
  updateHeaderSetting: () => {},
  saveCustomization: () => {},
  loadCustomization: () => {},
  resetCustomization: () => {},
};

// Update the type for slice creators to match the change in index.ts
export type CustomizationSliceCreator = StateCreator<
  BookshelfState,
  [],
  [],
  Partial<BookshelfState>
>;

// Type for slice actions only
export type CustomizationActionSlice = Partial<CustomizationState>;
