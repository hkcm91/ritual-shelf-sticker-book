
import { toast } from 'sonner';
import { CustomizationSliceCreator } from './types';
import { defaultCustomization } from './types';

export const createStorageSlice: CustomizationSliceCreator = (set, get) => ({
  // Save all customization settings to localStorage
  saveCustomization: () => {
    try {
      const state = get();
      const { page, container, shelfStyling, slots, header } = state;
      
      const settings = { page, container, shelfStyling, slots, header };
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
        
        set((state) => ({
          page: parsed.page || state.page,
          container: parsed.container || state.container,
          shelfStyling: parsed.shelfStyling || state.shelfStyling,
          slots: parsed.slots || state.slots,
          header: parsed.header || state.header
        }));
      }
    } catch (error) {
      console.error('Error loading customization settings:', error);
    }
  },
  
  // Reset to default settings
  resetCustomization: () => {
    set({
      page: defaultCustomization.page,
      container: defaultCustomization.container,
      shelfStyling: defaultCustomization.shelfStyling,
      slots: defaultCustomization.slots,
      header: defaultCustomization.header
    });
    
    localStorage.removeItem('ritual-shelf-customization');
    toast.success('Customization settings reset to defaults');
  }
});
