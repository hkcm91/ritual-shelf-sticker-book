
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
    const themeKey = activeTheme as keyof typeof themes;
    const theme = (themes[themeKey] || themes.default);
    
    // Apply CSS variables to root
    Object.entries(theme.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value as string);
    });
    
    // Apply textures for backgrounds if available
    if (theme.textures) {
      document.documentElement.style.setProperty('--shelf-texture', `url(${theme.textures.shelf || ''})`);
      document.documentElement.style.setProperty('--bg-texture', `url(${theme.textures.background || ''})`);
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
