
import { Theme } from '@/themes/types';

/**
 * Applies header styles from a theme
 */
export function applyHeaderTheme(header: Theme['header']): void {
  if (!header) return;
  
  try {
    if (header.background) {
      document.documentElement.style.setProperty('--header-bg', header.background);
    }
    if (header.textColor) {
      document.documentElement.style.setProperty('--header-text-color', header.textColor);
    }
    
    // Calculate hover background based on text color
    const textColor = header.textColor || '#ffffff';
    if (textColor.match(/#[0-9a-f]{6}/i)) {
      const brightness = calculateColorBrightness(textColor);
      document.documentElement.style.setProperty(
        '--header-hover-bg', 
        brightness > 125 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
      );
    }
  } catch (headerError) {
    console.error('Error applying header theme:', headerError);
  }
}

/**
 * Calculates the brightness of a hex color
 */
function calculateColorBrightness(hexColor: string): number {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}
