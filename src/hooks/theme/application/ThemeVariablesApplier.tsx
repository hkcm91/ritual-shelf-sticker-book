
import React, { useCallback } from 'react';
import { applyThemeVariables } from './applyThemeVariables';
import { applyThemeTextures } from './applyThemeTextures';
import { applyHeaderTheme } from './applyHeaderTheme';
import { Theme } from '@/themes/types';
import { toast } from 'sonner';

export const ThemeVariablesApplier: React.FC<{
  theme: Theme;
  children?: React.ReactNode;
}> = ({ theme, children }) => {
  const applyTheme = useCallback(() => {
    try {
      // Apply CSS variables
      applyThemeVariables(theme);
      
      // Apply textures if available
      if (theme.textures) {
        applyThemeTextures(theme.textures);
      }
      
      // Apply header styles if specified
      if (theme.header) {
        applyHeaderTheme(theme.header);
      }
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Error applying theme');
    }
  }, [theme]);

  // Apply theme when component mounts or theme changes
  React.useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return <>{children}</>;
};
