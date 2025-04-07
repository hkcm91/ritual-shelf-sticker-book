
import { useEffect, useCallback } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes from '@/themes';
import { toast } from 'sonner';
import { 
  applyPredefinedTheme,
  applyCustomTheme
} from './application';

/**
 * Hook to apply the active theme to the DOM
 */
export function useThemeApplication() {
  const { activeTheme, page, container, shelfStyling, header } = useBookshelfStore();

  // Apply theme whenever activeTheme changes or any of the theme settings change
  const applyTheme = useCallback(() => {
    if (!activeTheme) {
      console.warn('No active theme set, using default');
      return;
    }
    
    try {
      console.log('Applying theme:', activeTheme);
      
      if (activeTheme !== 'custom' && activeTheme in themes) {
        // Apply predefined theme
        const themeKey = activeTheme as keyof typeof themes;
        const themeToApply = themes[themeKey];
        applyPredefinedTheme(themeToApply);
      } 
      else if (activeTheme === 'custom') {
        // Apply custom theme settings
        applyCustomTheme(page, container, shelfStyling, header);
      } 
      else {
        console.warn(`Unknown theme: ${activeTheme}, falling back to default`);
        const defaultTheme = themes.default;
        applyPredefinedTheme(defaultTheme);
      }
      
      console.log('Theme applied successfully');
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Error applying theme, using default');
      
      // Fallback to default theme
      try {
        applyPredefinedTheme(themes.default);
      } catch (fallbackError) {
        console.error('Error applying fallback theme:', fallbackError);
      }
    }
  }, [activeTheme, page, container, shelfStyling, header]);

  // Apply theme once when component mounts and when dependencies change
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return { applyTheme };
}
