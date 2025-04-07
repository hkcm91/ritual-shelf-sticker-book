
import { CustomizationSliceCreator, defaultCustomization } from './types';
import { toast } from 'sonner';

export const createStorageSlice: CustomizationSliceCreator = (set, get) => ({
  activeTheme: 'default',
  
  setActiveTheme: (themeName) => {
    set({ activeTheme: themeName });
    localStorage.setItem('bookshelf-active-theme', themeName);
    toast.success(`Theme changed to ${themeName}`);
  },
  
  saveCustomization: () => {
    try {
      // Save current state to localStorage
      const { page, container, shelfStyling, slots, header, activeTheme } = get();
      
      localStorage.setItem('bookshelf-customization', JSON.stringify({
        page, 
        container, 
        shelfStyling, 
        slots, 
        header,
        activeTheme
      }));
      
      toast.success('Customization settings saved');
    } catch (error) {
      console.error('Failed to save customization:', error);
      toast.error('Failed to save customization settings');
    }
  },
  
  loadCustomization: () => {
    try {
      // Load from localStorage
      const savedCustomization = localStorage.getItem('bookshelf-customization');
      const savedTheme = localStorage.getItem('bookshelf-active-theme');
      
      if (savedCustomization) {
        const parsed = JSON.parse(savedCustomization);
        set(parsed);
      }
      
      if (savedTheme) {
        set({ activeTheme: savedTheme });
      }
      
    } catch (error) {
      console.error('Failed to load customization:', error);
      toast.error('Failed to load saved customization settings');
    }
  },
  
  resetCustomization: () => {
    try {
      // Reset to default values
      set({
        ...defaultCustomization,
        activeTheme: 'default'
      });
      
      // Remove from localStorage
      localStorage.removeItem('bookshelf-customization');
      localStorage.removeItem('bookshelf-active-theme');
      
      toast.success('Customization settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset customization:', error);
      toast.error('Failed to reset customization settings');
    }
  },
});
