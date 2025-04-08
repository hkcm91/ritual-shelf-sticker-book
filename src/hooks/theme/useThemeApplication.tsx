
import { useEffect, useCallback, useState, useRef } from 'react';
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
  const activeTheme = useBookshelfStore(state => state.activeTheme);
  const page = useBookshelfStore(state => state.page);
  const container = useBookshelfStore(state => state.container);
  const shelfStyling = useBookshelfStore(state => state.shelfStyling);
  const header = useBookshelfStore(state => state.header);
  
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to track if we've already applied the theme
  const appliedThemeRef = useRef<string | null>(null);

  // Apply theme whenever activeTheme changes or any of the theme settings change
  const applyTheme = useCallback(() => {
    // Skip if already applying or if theme hasn't changed
    if (isApplying || appliedThemeRef.current === activeTheme) {
      return;
    }
    
    if (!activeTheme) {
      console.warn('No active theme set, using default');
      return;
    }
    
    setIsApplying(true);
    setError(null);
    
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
      
      // Mark the theme as applied
      appliedThemeRef.current = activeTheme;
      console.log('Theme applied successfully');
    } catch (error) {
      console.error('Error applying theme:', error);
      setError(error instanceof Error ? error : new Error('Unknown error applying theme'));
      toast.error('Error applying theme, using default');
      
      // Fallback to default theme
      try {
        applyPredefinedTheme(themes.default);
        appliedThemeRef.current = 'default';
      } catch (fallbackError) {
        console.error('Error applying fallback theme:', fallbackError);
      }
    } finally {
      setIsApplying(false);
    }
  }, [activeTheme, page, container, shelfStyling, header, isApplying]);

  // Apply theme once on initial render
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return { 
    applyTheme,
    isApplying,
    error,
    activeTheme
  };
}

export default useThemeApplication;
