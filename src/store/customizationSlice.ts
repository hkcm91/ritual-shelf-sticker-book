
import { StateCreator } from 'zustand';
import { BookshelfState } from './bookshelfStore';
import { toast } from 'sonner';

// Define customization state structure
export interface CustomizationState {
  // General theme settings
  page: {
    background: string;
    backgroundImage: string;
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
  shelves: {
    thickness: number;
    color: string;
    backgroundImage: string;
    opacity: number;
    dividers: {
      enabled: boolean;
      booksPerSection: number;
      thickness: number;
      color: string;
    };
  };
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
  // UI state
  ui: {
    isCustomizationModalOpen: boolean;
  };
}

// Default values
const defaultCustomization: CustomizationState = {
  page: {
    background: '#f5f5f5',
    backgroundImage: '',
  },
  container: {
    background: '#a47148',
    backgroundImage: '',
    opacity: 1,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
  },
  shelves: {
    thickness: 20,
    color: '#8B5A2B',
    backgroundImage: '',
    opacity: 1,
    dividers: {
      enabled: false,
      booksPerSection: 6,
      thickness: 2,
      color: '#714621',
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
    backgroundImage: '/lovable-uploads/b613332c-c1a6-46ce-bd9f-6643f75a811a.png',
    textColor: '#ffffff',
  },
  ui: {
    isCustomizationModalOpen: false,
  }
};

// Create the customization slice
export const createCustomizationSlice: StateCreator<
  BookshelfState,
  [],
  [],
  CustomizationState
> = (set, get) => ({
  ...defaultCustomization,

  // Actions for customization state
  
  // General UI actions
  openCustomizationModal: () => set({ ui: { ...get().ui, isCustomizationModalOpen: true } }),
  closeCustomizationModal: () => set({ ui: { ...get().ui, isCustomizationModalOpen: false } }),
  
  // Page settings
  updatePageBackground: (color: string) => 
    set({ page: { ...get().page, background: color } }),
  updatePageBackgroundImage: (url: string) => 
    set({ page: { ...get().page, backgroundImage: url } }),
  
  // Container settings
  updateContainerBackground: (color: string) => 
    set({ container: { ...get().container, background: color } }),
  updateContainerBackgroundImage: (url: string) => 
    set({ container: { ...get().container, backgroundImage: url } }),
  updateContainerOpacity: (opacity: number) => 
    set({ container: { ...get().container, opacity } }),
  updateContainerBorder: (property: 'borderWidth' | 'borderStyle' | 'borderColor' | 'borderRadius', value: any) =>
    set({ container: { ...get().container, [property]: value } }),
  updateContainerPadding: (padding: number) =>
    set({ container: { ...get().container, padding } }),
  
  // Shelf settings
  updateShelfThickness: (thickness: number) =>
    set({ shelves: { ...get().shelves, thickness } }),
  updateShelfColor: (color: string) =>
    set({ shelves: { ...get().shelves, color } }),
  updateShelfBackgroundImage: (url: string) =>
    set({ shelves: { ...get().shelves, backgroundImage: url } }),
  updateShelfOpacity: (opacity: number) =>
    set({ shelves: { ...get().shelves, opacity } }),
  
  // Divider settings
  toggleDividers: (enabled: boolean) =>
    set({ shelves: { ...get().shelves, dividers: { ...get().shelves.dividers, enabled } } }),
  updateDividersSetting: (property: 'booksPerSection' | 'thickness' | 'color', value: any) =>
    set({ shelves: { ...get().shelves, dividers: { ...get().shelves.dividers, [property]: value } } }),
  
  // Slots settings
  updateSlotSetting: (
    property: 'addButtonBg' | 'addButtonColor' | 'addButtonHoverBg' | 
              'toggleInactiveColor' | 'toggleActiveColor' | 'toggleBorderColor' | 
              'emptyHoverBg',
    value: string
  ) => set({ slots: { ...get().slots, [property]: value } }),
  
  // Header settings
  updateHeaderSetting: (
    property: 'background' | 'backgroundImage' | 'textColor',
    value: string
  ) => set({ header: { ...get().header, [property]: value } }),
  
  // Save all customization settings to localStorage
  saveCustomization: () => {
    try {
      const { ui, ...settings } = get();
      localStorage.setItem('ritual-shelf-customization', JSON.stringify(settings));
      toast.success('Customization settings saved');
    } catch (error) {
      console.error('Error saving customization settings:', error);
      toast.error('Failed to save customization settings');
    }
  },
  
  // Load customization settings from localStorage
  loadCustomization: () => {
    try {
      const savedSettings = localStorage.getItem('ritual-shelf-customization');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        set({ ...get(), ...parsed });
      }
    } catch (error) {
      console.error('Error loading customization settings:', error);
    }
  },
  
  // Reset to default settings
  resetCustomization: () => {
    const { ui } = get();
    set({ ...defaultCustomization, ui });
    localStorage.removeItem('ritual-shelf-customization');
    toast.success('Customization settings reset to defaults');
  }
});
