
import React, { useCallback } from 'react';
import { applyThemeVariables } from './applyThemeVariables';
import { applyThemeTextures } from './applyThemeTextures';
import { applyHeaderTheme } from './applyHeaderTheme';
import { Theme } from '@/themes/types';
import { toast } from 'sonner';

export interface ThemeApplierProps {
  theme: Theme;
  children?: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const ThemeVariablesApplier: React.FC<ThemeApplierProps> = ({ 
  theme, 
  children,
  onSuccess,
  onError
}) => {
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
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Error applying theme');
      
      // Call error callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [theme, onSuccess, onError]);

  // Apply theme when component mounts or theme changes
  React.useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return <>{children}</>;
};

export default ThemeVariablesApplier;
