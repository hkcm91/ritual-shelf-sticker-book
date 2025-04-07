
import { useCallback } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { ThemeName } from '@/themes';
import themes from '@/themes';

/**
 * Hook to handle theme selection
 */
export function useThemeSelector() {
  const store = useBookshelfStore();
  const activeTheme = store.activeTheme;
  const loadCustomization = store.loadCustomization;
  
  // Safely set active theme - with guard against undefined or same theme
  const handleSetActiveTheme = useCallback((theme: ThemeName) => {
    // Don't do anything if the theme is already active - prevents unnecessary updates
    if (theme === activeTheme) {
      return;
    }
    
    // Check if the function exists before calling it
    if (typeof store.setActiveTheme === 'function') {
      // Use setTimeout to break potential update cycles
      setTimeout(() => {
        store.setActiveTheme(theme);
      }, 0);
    } else {
      console.warn('setActiveTheme function not available in store');
    }
  }, [activeTheme, store]);
  
  // Handle theme deletion
  const handleDeleteTheme = useCallback((theme: ThemeName) => {
    if (typeof store.deleteTheme === 'function') {
      store.deleteTheme(theme);
    } else {
      console.warn('deleteTheme function not available in store');
    }
  }, [store]);
  
  // Get theme availability information
  const availableThemes = Object.keys(themes) as ThemeName[];
  
  // Safely validate a theme name
  const isValidTheme = useCallback((themeName: string): boolean => {
    return themeName === 'custom' || !!themes[themeName as keyof typeof themes];
  }, []);
  
  return {
    activeTheme: activeTheme as ThemeName || 'default',
    setActiveTheme: handleSetActiveTheme,
    deleteTheme: handleDeleteTheme,
    availableThemes,
    isValidTheme,
    loadSavedTheme: loadCustomization
  };
}
