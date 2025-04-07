
import { toast } from 'sonner';
import { Theme } from '@/themes/types';

/**
 * Applies CSS variables from a theme to the document root
 */
export function applyThemeVariables(theme: Theme): void {
  try {
    Object.entries(theme.variables || {}).forEach(([key, value]) => {
      if (key && value) {
        document.documentElement.style.setProperty(key, value as string);
      }
    });
  } catch (varError) {
    console.error('Error applying theme variables:', varError);
    toast.error('Some theme styles could not be applied');
  }
}
