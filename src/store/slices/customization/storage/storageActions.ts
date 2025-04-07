
import { toast } from 'sonner';
import { StorageSliceCreator, defaultCustomization } from '../types';

/**
 * Creates a slice with localStorage-related actions
 */
export const createStorageActions: StorageSliceCreator = (set, get, api) => ({
  saveCustomization: () => {
    try {
      // Save current state to localStorage
      const { page, container, shelfStyling, slots, header, activeTheme } = get();
      
      const customizationData = {
        page, 
        container, 
        shelfStyling, 
        slots, 
        header,
        activeTheme: 'custom' // Always save as custom theme
      };
      
      try {
        localStorage.setItem('bookshelf-customization', JSON.stringify(customizationData));
      } catch (storageError) {
        if (storageError instanceof DOMException && storageError.name === 'QuotaExceededError') {
          // Handle quota exceeded error
          console.error('Storage quota exceeded:', storageError);
          toast.error('Storage limit reached. Try reducing image sizes.');
          return;
        }
        console.error('Failed to save customization to localStorage:', storageError);
        toast.error('Failed to save customization settings');
        return;
      }
      
      // Only set theme to custom if it's not already custom
      if (get().activeTheme !== 'custom') {
        set({ activeTheme: 'custom' });
        localStorage.setItem('bookshelf-active-theme', 'custom');
      }
      
      toast.success('Customization settings saved as custom theme');
    } catch (error) {
      console.error('Failed to save customization:', error);
      toast.error('Failed to save customization settings');
    }
  },
  
  loadCustomization: () => {
    try {
      // Load from localStorage
      let savedCustomization = null;
      let savedTheme = 'default';
      
      try {
        savedCustomization = localStorage.getItem('bookshelf-customization');
        savedTheme = localStorage.getItem('bookshelf-active-theme') || 'default';
      } catch (storageError) {
        console.error('Error accessing localStorage:', storageError);
        toast.error('Could not access saved settings');
      }
      
      console.log('Loading saved theme:', savedTheme);
      
      if (savedCustomization) {
        try {
          const parsed = JSON.parse(savedCustomization);
          // Validate parsed data
          if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Invalid customization data format');
          }
          
          // Apply saved state without triggering other side effects
          const currentState = get();
          if (JSON.stringify(parsed) !== JSON.stringify(currentState)) {
            set(parsed);
            console.log('Loaded custom theme data from localStorage');
          }
        } catch (parseError) {
          console.error('Error parsing saved customization:', parseError);
          toast.error('Saved customization data was corrupted');
          // Continue with default theme
          savedTheme = 'default';
        }
      }
      
      // If it's not a custom theme, apply the theme settings
      if (savedTheme !== 'custom' && savedTheme !== get().activeTheme) {
        // Prevent circular dependencies by getting the function directly
        setTimeout(() => {
          try {
            const { setActiveTheme } = get();
            if (setActiveTheme && typeof setActiveTheme === 'function') {
              setActiveTheme(savedTheme);
            }
          } catch (themeError) {
            console.error('Error setting theme:', themeError);
            // Fallback to default
            set({ activeTheme: 'default' });
          }
        }, 0);
      } else if (savedTheme === 'custom' && savedCustomization) {
        // Just set the theme name for custom themes without triggering other effects
        if (get().activeTheme !== 'custom') {
          set({ activeTheme: 'custom' });
          console.log('Applied custom theme from localStorage');
        }
      } else if (get().activeTheme !== 'default' && !savedTheme) {
        // Default case - only set if different to prevent loops
        set({ activeTheme: 'default' });
        console.log('Applied default theme (no saved theme found)');
      }
      
    } catch (error) {
      console.error('Failed to load customization:', error);
      toast.error('Failed to load saved customization settings');
      // Fallback to default theme
      set({ activeTheme: 'default' });
    }
  },
  
  resetCustomization: () => {
    try {
      // Get current theme
      const currentTheme = get().activeTheme;
      
      // Only reset if needed
      if (currentTheme !== 'default' || JSON.stringify(get()) !== JSON.stringify(defaultCustomization)) {
        // Reset to default values
        set({
          ...defaultCustomization,
          activeTheme: 'default'
        });
        
        // Remove from localStorage
        try {
          localStorage.removeItem('bookshelf-customization');
          localStorage.removeItem('bookshelf-active-theme');
        } catch (storageError) {
          console.error('Error clearing localStorage:', storageError);
        }
        
        // Apply default theme CSS variables
        try {
          const themes = get().themes || {};
          if (themes.default && themes.default.variables) {
            Object.entries(themes.default.variables).forEach(([key, value]) => {
              document.documentElement.style.setProperty(key, value as string);
            });
          }
        } catch (cssError) {
          console.error('Error applying default CSS variables:', cssError);
        }
        
        toast.success('Customization settings reset to defaults');
      }
    } catch (error) {
      console.error('Failed to reset customization:', error);
      toast.error('Failed to reset customization settings');
    }
  },
});
