
import { useCallback } from 'react';
import { useThemeApplication } from './useThemeApplication';
import { useThemeSelector } from './useThemeSelector';
import themes from '@/themes';
import { ThemeName } from '@/themes';

/**
 * Main theme hook that combines essential theme functionality
 */
export function useTheme() {
  const { applyTheme } = useThemeApplication();
  const { 
    activeTheme, 
    setActiveTheme, 
    availableThemes, 
    isValidTheme, 
    loadSavedTheme 
  } = useThemeSelector();

  // Ensure immediate theme application when changed
  const changeTheme = useCallback((themeName: ThemeName) => {
    if (isValidTheme(themeName)) {
      setActiveTheme(themeName);
      applyTheme(themeName);
    }
  }, [setActiveTheme, applyTheme, isValidTheme]);

  return {
    activeTheme,
    setActiveTheme: changeTheme,
    themes,
    availableThemes,
    loadSavedTheme,
    applyTheme,
    isValidTheme
  };
}
