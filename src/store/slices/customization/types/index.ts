
import { ThemeName } from '@/themes';
import { CustomizationSliceCreator, UIState, UIActions } from './base';
import { ShelfStyling, ShelfDividers, ShelfStylingActions } from './shelfStyling';
import { PageStyle, PageStyleActions } from './page';
import { ContainerStyle, ContainerStyleActions } from './container';
import { SlotStyle, HeaderStyle, ElementStyleActions } from './elements';
import { StorageActions, ThemeActions } from './storage';

// Define customization state structure - combining all interfaces
export interface CustomizationState extends 
  UIActions,
  ShelfStylingActions, 
  PageStyleActions, 
  ContainerStyleActions,
  ElementStyleActions,
  StorageActions,
  ThemeActions {
  // Theme - explicitly required, not optional
  activeTheme: ThemeName | string;
  
  // General theme settings
  page: PageStyle;
  
  // Bookshelf container settings
  container: ContainerStyle;
  
  // Shelf settings
  shelfStyling: ShelfStyling;
  
  // Slot customization
  slots: SlotStyle;
  
  // Header styling
  header: HeaderStyle;
  
  // UI state for customization
  ui: UIState;
}

// Default values - all required properties must be initialized
export const defaultCustomization: CustomizationState = {
  activeTheme: 'default',
  
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
      booksPerSection: 4,
      booksPerRow: 1,
      thickness: 6,
      color: '#a37d4f',
      opacity: 0.8,
      orientation: 'vertical',
      height: 200  // Added the missing height property with default value 200
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
    linkDividerToShelfColor: true,
  },
  
  // Initialize all action functions
  openCustomizationModal: () => {},
  closeCustomizationModal: () => {},
  setLinkDividerToShelfColor: () => {},
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
  setActiveTheme: () => {},
};

// Re-export types for use in other files
export type { 
  CustomizationSliceCreator,
  UIState, 
  UIActions,
  ShelfStyling, 
  ShelfDividers,
  ShelfStylingActions,
  PageStyle, 
  PageStyleActions,
  ContainerStyle, 
  ContainerStyleActions,
  SlotStyle, 
  HeaderStyle, 
  ElementStyleActions,
  StorageActions,
  ThemeActions
};
