
import { toast } from 'sonner';
import { StorageSliceCreator } from './types';
import themes from '@/themes';
import { ThemeName } from '@/themes';
import { defaultCustomization } from '../types';

/**
 * Creates a slice with theme selection and application actions
 */
export const createThemeActions: StorageSliceCreator = (set, get, api) => ({
  // Required property must be explicitly defined, not optional
  activeTheme: 'default',
  
  setActiveTheme: (themeName) => {
    // Get current customization state
    const currentState = get();
    
    // Prevent unnecessary state updates causing re-renders
    if (currentState.activeTheme === themeName) {
      return;
    }
    
    try {
      console.log(`Setting active theme: ${themeName}`);
      
      // Validate theme name
      if (!themeName) {
        console.error('Invalid theme name (empty)');
        toast.error('Invalid theme selected');
        return;
      }
      
      // Get the selected theme configuration
      if (themeName === 'custom') {
        // Just set the theme name for custom themes
        set({ activeTheme: themeName });
        try {
          localStorage.setItem('bookshelf-active-theme', themeName);
        } catch (storageError) {
          console.error('Failed to save theme to localStorage:', storageError);
        }
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
      
      // Apply theme settings to customization state - do this in a single set()
      // to avoid multiple renders and potential loops
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
          thickness: parseInt(themeConfig.variables['--shelf-thickness'] as string || '20'),
          opacity: parseFloat(themeConfig.variables['--shelf-opacity'] as string || '1'),
          // If the theme has divider settings, apply them here too
          dividers: themeConfig.variables['--divider-thickness'] ? {
            ...currentState.shelfStyling.dividers,
            enabled: parseInt(themeConfig.variables['--divider-thickness'] as string) > 0,
            thickness: parseInt(themeConfig.variables['--divider-thickness'] as string || '6'),
            color: themeConfig.variables['--divider-color'] || '#714621',
          } : currentState.shelfStyling.dividers
        },
      });
      
      try {
        localStorage.setItem('bookshelf-active-theme', themeName);
      } catch (storageError) {
        console.error('Failed to save theme to localStorage:', storageError);
      }
      
      toast.success(`Theme changed to ${themeConfig.name}`);
    } catch (error) {
      console.error('Error applying theme:', error);
      // Fallback to default theme in case of errors
      set({ activeTheme: 'default' });
      toast.error('Failed to apply theme, reverting to default');
    }
  },

  // Helper function to delete a theme (will only be used for custom themes)
  deleteTheme: (themeName) => {
    if (themeName === 'default' || themeName === 'custom') {
      toast.error("Cannot delete built-in themes");
      return;
    }

    try {
      // If the active theme is being deleted, switch to default
      if (get().activeTheme === themeName) {
        get().setActiveTheme('default');
      }

      // In a real app, this would delete files on the server
      console.log(`Theme ${themeName} would be deleted from the server`);
      
      // Notify user
      toast.success(`Theme "${themeName}" deleted`);
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast.error('Failed to delete theme');
    }
  }
});
