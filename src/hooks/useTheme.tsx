
import { useEffect } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes, { ThemeName } from '@/themes';
import { toast } from 'sonner';

export function useTheme() {
  const { activeTheme, setActiveTheme, page, container, shelfStyling } = useBookshelfStore();

  // Apply theme whenever activeTheme changes
  useEffect(() => {
    if (!activeTheme) {
      return;
    }
    
    try {
      // Fix for type safety
      let themeToApply = themes.default; // Default fallback
      
      if (activeTheme !== 'custom' && activeTheme in themes) {
        const themeKey = activeTheme as keyof typeof themes;
        themeToApply = themes[themeKey];
      } else if (activeTheme === 'custom') {
        // For custom theme, we use the current state values
        // The CSS variables will be applied by the components
        return;
      }
      
      // Apply CSS variables to root
      Object.entries(themeToApply.variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value as string);
      });
      
      // Apply textures for backgrounds if available
      if (themeToApply.textures) {
        document.documentElement.style.setProperty(
          '--shelf-texture', 
          `url(${themeToApply.textures.shelf || ''})`
        );
        document.documentElement.style.setProperty(
          '--page-bg-image', 
          themeToApply.textures.background ? `url(${themeToApply.textures.background})` : 'none'
        );
      }
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Error applying theme');
    }
  }, [activeTheme]);
  
  // Determine if the current state is a custom theme or matches a predefined theme
  const isCustomTheme = () => {
    if (activeTheme !== 'custom') {
      return false;
    }
    
    // The user has explicitly set a custom theme
    return true;
  };
  
  // Get current custom theme
  const currentCustomTheme = {
    name: "Custom Theme",
    variables: {
      '--page-bg': page?.background || '#f5f5f5',
      '--container-bg': container?.background || '#a47148',
      '--shelf-color': shelfStyling?.color || '#8B5A2B',
      // Add more variables as needed
    },
    textures: {
      shelf: shelfStyling?.backgroundImage || '',
      background: page?.backgroundImage || '',
    }
  };
  
  return {
    activeTheme: activeTheme as ThemeName,
    setActiveTheme,
    themes: { ...themes, custom: currentCustomTheme },
    availableThemes: Object.keys(themes) as ThemeName[],
    isCustomTheme: isCustomTheme(),
    currentCustomTheme
  };
}
