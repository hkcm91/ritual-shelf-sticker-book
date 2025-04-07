
/**
 * Recommended Color Palettes
 * 
 * A collection of color palettes that can be used with the theme generator.
 * Use these as starting points for creating your own themes.
 */

import { ColorPalette } from './themeGenerator';

export const colorPalettes: Record<string, ColorPalette> = {
  // Warm Palettes
  amber: {
    primary: '#D97706',
    secondary: '#F59E0B',
    background: '#FEF3C7',
    text: '#422006',
    shelfWood: '#92400E',
  },
  terracotta: {
    primary: '#9D4E36',
    secondary: '#C07A68',
    background: '#F5EBE7',
    text: '#3D1E15',
    shelfWood: '#7D3E2B',
  },
  
  // Cool Palettes
  slate: {
    primary: '#475569',
    secondary: '#64748B',
    background: '#F1F5F9',
    text: '#1E293B',
    shelfWood: '#334155',
  },
  emerald: {
    primary: '#047857',
    secondary: '#10B981',
    background: '#ECFDF5',
    text: '#064E3B',
    shelfWood: '#065F46',
  },
  
  // Neutral Palettes
  stone: {
    primary: '#78716C',
    secondary: '#A8A29E',
    background: '#F5F5F4',
    text: '#44403C',
    shelfWood: '#57534E',
  },
  graphite: {
    primary: '#4B5563',
    secondary: '#6B7280',
    background: '#F3F4F6',
    text: '#1F2937',
    shelfWood: '#374151',
  },
  
  // Vibrant Palettes
  violet: {
    primary: '#7C3AED',
    secondary: '#8B5CF6',
    background: '#F5F3FF',
    text: '#4C1D95',
    shelfWood: '#6D28D9',
  },
  crimson: {
    primary: '#BE123C',
    secondary: '#E11D48',
    background: '#FFF1F2',
    text: '#881337',
    shelfWood: '#9F1239',
  },
  
  // Dark Palettes
  midnight: {
    primary: '#1E293B',
    secondary: '#334155',
    background: '#0F172A',
    text: '#F1F5F9',
    shelfWood: '#0F172A',
    headerBg: '#0F172A',
    headerText: '#F1F5F9',
  },
  espresso: {
    primary: '#44403C',
    secondary: '#57534E',
    background: '#292524',
    text: '#F5F5F4',
    shelfWood: '#44403C',
    headerBg: '#292524',
    headerText: '#F5F5F4',
  },
};

/**
 * Example usage:
 * 
 * import { generateThemeFromPalette } from './themeGenerator';
 * import { colorPalettes } from './colorPalettes';
 * 
 * const myTheme = generateThemeFromPalette(
 *   'Slate Theme',
 *   colorPalettes.slate,
 *   {
 *     shelf: '/textures/my-theme/wood.jpg',
 *     background: '/textures/my-theme/pattern.jpg'
 *   }
 * );
 */
