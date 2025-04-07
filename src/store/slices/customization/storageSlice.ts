import { CustomizationSliceCreator, defaultCustomization } from './types';
import { toast } from 'sonner';
import themes from '@/themes';
import { ThemeName } from '@/themes';

export const createStorageSlice: CustomizationSliceCreator = (set, get, api) => ({
  // Required property must be explicitly defined, not optional
  activeTheme: 'default',
  
  setActiveTheme: (themeName) => {
    // Get current customization state
    const currentState = get();
    
    // Get the selected theme configuration
    const themeConfig = themes[themeName as ThemeName] || themes.default;
    
    // Apply theme settings to customization state
    set({ 
      activeTheme: themeName,
      // Apply theme variables to our customization properties
      page: {
        ...currentState.page,
        background: themeConfig.variables['--page-bg'] || defaultCustomization.page.background,
        backgroundImage: themeConfig.textures.background || ''
      },
      container: {
        ...currentState.container,
        background: themeConfig.variables['--container-bg'] || defaultCustomization.container.background,
        backgroundImage: themeConfig.textures.background || ''
      },
      shelfStyling: {
        ...currentState.shelfStyling,
        color: themeConfig.variables['--shelf-color'] || defaultCustomization.shelfStyling.color,
        backgroundImage: themeConfig.textures.shelf || ''
      },
      // Keep other existing customization properties
    });
    
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
      
      // Save as custom theme
      if (activeTheme !== 'custom') {
        set({ activeTheme: 'custom' });
        localStorage.setItem('bookshelf-active-theme', 'custom');
      }
      
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
        // If it's not a custom theme, apply the theme settings
        if (savedTheme !== 'custom') {
          // We call setActiveTheme through API to ensure proper theme application
          const { setActiveTheme } = get();
          setActiveTheme(savedTheme);
        } else {
          // Just set the theme name for custom themes
          set({ activeTheme: savedTheme });
        }
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
