
import { useEffect } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes, { ThemeName } from '@/themes';

export const useTheme = () => {
  const activeTheme = useBookshelfStore((state) => state.activeTheme) as ThemeName || 'default';
  const setActiveTheme = useBookshelfStore((state) => state.setActiveTheme);
  const container = useBookshelfStore((state) => state.container);
  const page = useBookshelfStore((state) => state.page);
  const shelfStyling = useBookshelfStore((state) => state.shelfStyling);
  
  // Apply CSS variables based on store values
  useEffect(() => {
    // Update CSS variables based on store values
    if (container && page && shelfStyling) {
      // Page
      document.documentElement.style.setProperty('--page-bg', page.background);
      document.documentElement.style.setProperty('--page-bg-image', page.backgroundImage ? `url(${page.backgroundImage})` : 'none');
      
      // Container
      document.documentElement.style.setProperty('--container-bg', container.background);
      document.documentElement.style.setProperty('--container-bg-image', container.backgroundImage ? `url(${container.backgroundImage})` : 'none');
      document.documentElement.style.setProperty('--container-opacity', container.opacity.toString());
      document.documentElement.style.setProperty('--container-border-width', `${container.borderWidth}px`);
      document.documentElement.style.setProperty('--container-border-style', container.borderStyle);
      document.documentElement.style.setProperty('--container-border-color', container.borderColor);
      document.documentElement.style.setProperty('--container-border-radius', `${container.borderRadius}px`);
      document.documentElement.style.setProperty('--container-padding', `${container.padding}px`);
      
      // Shelf
      document.documentElement.style.setProperty('--shelf-thickness', `${shelfStyling.thickness}px`);
      document.documentElement.style.setProperty('--shelf-color', shelfStyling.color);
      document.documentElement.style.setProperty('--shelf-bg-image', shelfStyling.backgroundImage ? `url(${shelfStyling.backgroundImage})` : 'none');
      document.documentElement.style.setProperty('--shelf-opacity', shelfStyling.opacity.toString());
    }
  }, [container, page, shelfStyling]);
  
  // Apply theme CSS variables from theme files
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
