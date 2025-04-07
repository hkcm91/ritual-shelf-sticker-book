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
    
    try {
      console.log(`Setting active theme: ${themeName}`);
      
      // Get the selected theme configuration
      if (themeName === 'custom') {
        // Just set the theme name for custom themes
        set({ activeTheme: themeName });
        localStorage.setItem('bookshelf-active-theme', themeName);
        toast.success(`Applied custom theme`);
        return;
      }
      
      // Handle built-in themes
      const themeKey = themeName as keyof typeof themes;
      if (!(themeKey in themes)) {
        toast.error(`Theme '${themeName}' not found, using default`);
        set({ activeTheme: 'default' });
        return;
      }
      
      const themeConfig = themes[themeKey];
      
      // Apply theme settings to customization state
      set({ 
        activeTheme: themeName,
        // Apply theme variables to our customization properties
        page: {
          ...currentState.page,
          background: themeConfig.variables['--page-bg'] || defaultCustomization.page.background,
          backgroundImage: themeConfig.textures.background || '',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        },
        container: {
          ...currentState.container,
          background: themeConfig.variables['--container-bg'] || defaultCustomization.container.background,
          backgroundImage: themeConfig.variables['--container-bg-image'] === 'none' ? '' 
            : themeConfig.variables['--container-bg-image'] || ''
        },
        shelfStyling: {
          ...currentState.shelfStyling,
          color: themeConfig.variables['--shelf-color'] || defaultCustomization.shelfStyling.color,
          backgroundImage: themeConfig.textures.shelf || '',
          thickness: parseInt(themeConfig.variables['--shelf-thickness'] || '20'),
          opacity: parseFloat(themeConfig.variables['--shelf-opacity'] || '1')
        },
        // Keep other existing customization properties
      });
      
      localStorage.setItem('bookshelf-active-theme', themeName);
      toast.success(`Theme changed to ${themeConfig.name}`);
    } catch (error) {
      console.error('Error applying theme:', error);
      set({ activeTheme: 'default' });
      toast.error('Failed to apply theme, reverting to default');
    }
  },
  
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
      
      localStorage.setItem('bookshelf-customization', JSON.stringify(customizationData));
      
      // Set activeTheme to custom
      set({ activeTheme: 'custom' });
      localStorage.setItem('bookshelf-active-theme', 'custom');
      
      toast.success('Customization settings saved as custom theme');
    } catch (error) {
      console.error('Failed to save customization:', error);
      toast.error('Failed to save customization settings');
    }
  },
  
  loadCustomization: () => {
    try {
      // Load from localStorage
      const savedCustomization = localStorage.getItem('bookshelf-customization');
      const savedTheme = localStorage.getItem('bookshelf-active-theme') || 'default';
      
      console.log('Loading saved theme:', savedTheme);
      
      if (savedCustomization) {
        try {
          const parsed = JSON.parse(savedCustomization);
          set(parsed);
          console.log('Loaded custom theme data from localStorage');
        } catch (parseError) {
          console.error('Error parsing saved customization:', parseError);
        }
      }
      
      // If it's not a custom theme, apply the theme settings
      if (savedTheme !== 'custom' && savedTheme in themes) {
        // We call setActiveTheme through API to ensure proper theme application
        const { setActiveTheme } = get();
        setActiveTheme(savedTheme as ThemeName);
      } else if (savedTheme === 'custom' && savedCustomization) {
        // Just set the theme name for custom themes
        set({ activeTheme: 'custom' });
        console.log('Applied custom theme from localStorage');
      } else {
        // Default case
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
      // Reset to default values
      set({
        ...defaultCustomization,
        activeTheme: 'default'
      });
      
      // Remove from localStorage
      localStorage.removeItem('bookshelf-customization');
      localStorage.removeItem('bookshelf-active-theme');
      
      // Apply default theme CSS variables
      Object.entries(themes.default.variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value as string);
      });
      
      toast.success('Customization settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset customization:', error);
      toast.error('Failed to reset customization settings');
    }
  },
});
