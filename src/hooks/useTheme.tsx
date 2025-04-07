
import { useEffect, useMemo } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes, { ThemeName } from '@/themes';

export function useTheme() {
  const { activeTheme, setActiveTheme } = useBookshelfStore();

  // Apply theme whenever activeTheme changes
  useEffect(() => {
    if (!activeTheme) {
      return;
    }
    
    // Fix for type safety
    let themeToApply = themes.default; // Default fallback
    
    if (activeTheme !== 'custom' && activeTheme in themes) {
      const themeKey = activeTheme as keyof typeof themes;
      themeToApply = themes[themeKey];
    }
    
    // Apply CSS variables to root
    Object.entries(themeToApply.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value as string);
    });
    
    // Apply textures for backgrounds if available
    if (themeToApply.textures) {
      document.documentElement.style.setProperty('--shelf-texture', `url(${themeToApply.textures.shelf || ''})`);
      document.documentElement.style.setProperty('--bg-texture', `url(${themeToApply.textures.background || ''})`);
    }
  }, [activeTheme]);
  
  // Custom theme handling
  const allThemes = useMemo(() => {
    const extendedThemes = { ...themes };
    
    // Only add custom theme to the list if currently using it
    if (activeTheme === 'custom') {
      const customTheme = {
        name: "Custom Theme",
        variables: {},
        textures: {
          shelf: "",
          background: ""
        }
      };
      
      return {
        ...extendedThemes,
        custom: customTheme
      };
    }
    
    return extendedThemes;
  }, [activeTheme]);
  
  return {
    activeTheme: activeTheme as ThemeName,
    setActiveTheme,
    themes: allThemes,
    availableThemes: Object.keys(themes) as ThemeName[]
  };
}
