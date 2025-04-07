
import { useCallback } from 'react';
import { useThemeApplication } from './useThemeApplication';
import { useCustomTheme } from './useCustomTheme';
import { useThemeSelector } from './useThemeSelector';
import themes from '@/themes';
import { ThemeName } from '@/themes';

/**
 * Main theme hook that combines all theme functionality
 */
export function useTheme() {
  const { applyTheme } = useThemeApplication();
  const { isCustomTheme, currentCustomTheme } = useCustomTheme();
  const { 
    activeTheme, 
    setActiveTheme, 
    availableThemes, 
    isValidTheme, 
    loadSavedTheme 
  } = useThemeSelector();

  // Create combined themes object that includes the custom theme
  const allThemes = {
    ...themes,
    custom: currentCustomTheme
  };
  
  return {
    activeTheme,
    setActiveTheme,
    themes: allThemes,
    availableThemes,
    isCustomTheme: isCustomTheme,
    currentCustomTheme,
    loadSavedTheme,
    applyTheme,
    isValidTheme
  };
}
