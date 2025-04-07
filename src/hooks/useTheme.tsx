
import { useEffect } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes, { ThemeName } from '@/themes';

export const useTheme = () => {
  const activeTheme = useBookshelfStore((state) => state.activeTheme) as ThemeName || 'default';
  const setActiveTheme = useBookshelfStore((state) => state.setActiveTheme);
  
  // Apply theme CSS variables
  useEffect(() => {
    if (!activeTheme) return;
    
    const theme = themes[activeTheme] || themes.default;
    
    // Apply CSS variables to root
    Object.entries(theme.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    
    // Set theme class on body
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');
    document.body.classList.add(`theme-${activeTheme}`);
    
  }, [activeTheme]);
  
  return {
    activeTheme,
    setActiveTheme,
    themes,
    availableThemes: Object.keys(themes) as ThemeName[]
  };
};
