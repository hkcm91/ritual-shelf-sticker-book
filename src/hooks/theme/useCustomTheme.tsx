
import { useMemo } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { Theme } from '@/themes/types';

/**
 * Hook to manage custom theme state
 */
export function useCustomTheme() {
  const { page, container, shelfStyling, activeTheme } = useBookshelfStore();
  
  // Determine if the current state is a custom theme or matches a predefined theme
  const isCustomTheme = useMemo(() => {
    if (!activeTheme || activeTheme !== 'custom') {
      return false;
    }
    
    // The user has explicitly set a custom theme
    return true;
  }, [activeTheme]);
  
  // Get current custom theme definition
  const currentCustomTheme: Theme = useMemo(() => ({
    name: "Custom Theme",
    variables: {
      '--page-bg': page?.background || '#f5f5f5',
      '--container-bg': container?.background || '#8B5A2B',
      '--shelf-color': shelfStyling?.color || '#8B5A2B',
      '--divider-color': shelfStyling?.dividers?.color || '#714621',
      '--divider-thickness': `${shelfStyling?.dividers?.thickness || 10}px`,
      '--divider-opacity': `${shelfStyling?.dividers?.opacity || 1}`,
      '--divider-orientation': shelfStyling?.dividers?.orientation || 'vertical',
    },
    textures: {
      shelf: shelfStyling?.backgroundImage || '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
      background: page?.backgroundImage || '',
    }
  }), [page, container, shelfStyling]);
  
  return {
    isCustomTheme,
    currentCustomTheme
  };
}
