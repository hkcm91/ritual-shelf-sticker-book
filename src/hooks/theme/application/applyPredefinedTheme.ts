
import { toast } from 'sonner';
import { Theme } from '@/themes/types';
import { applyThemeVariables } from './applyThemeVariables';
import { applyThemeTextures } from './applyThemeTextures';
import { applyHeaderTheme } from './applyHeaderTheme';

/**
 * Applies a predefined theme configuration
 */
export function applyPredefinedTheme(theme: Theme): void {
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
    console.error('Error applying predefined theme:', error);
    toast.error('Error applying theme');
  }
}
