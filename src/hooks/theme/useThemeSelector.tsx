
import { useCallback } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { ThemeName } from '@/themes';
import themes from '@/themes';

/**
 * Hook to handle theme selection
 */
export function useThemeSelector() {
  const { activeTheme, setActiveTheme, loadCustomization } = useBookshelfStore();
  
  // Safely set active theme
  const handleSetActiveTheme = useCallback((theme: ThemeName) => {
    if (theme !== activeTheme && setActiveTheme) {
      setActiveTheme(theme);
    }
  }, [activeTheme, setActiveTheme]);
  
  // Get theme availability information
  const availableThemes = Object.keys(themes) as ThemeName[];
  
  // Safely validate a theme name
  const isValidTheme = useCallback((themeName: string): boolean => {
    return themeName === 'custom' || !!themes[themeName as keyof typeof themes];
  }, []);
  
  return {
    activeTheme: activeTheme as ThemeName || 'default',
    setActiveTheme: handleSetActiveTheme,
    availableThemes,
    isValidTheme,
    loadSavedTheme: loadCustomization
  };
}
