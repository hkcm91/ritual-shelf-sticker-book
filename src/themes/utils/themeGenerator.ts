
/**
 * Theme Generator Utility
 * 
 * This utility helps create theme configurations from a base color palette.
 * It can be used to quickly generate new themes with consistent color schemes.
 */

import { Theme } from '../types';

export interface ColorPalette {
  primary: string;       // Main color
  secondary: string;     // Secondary/accent color  
  background: string;    // Page background
  text: string;          // Main text color
  shelfWood: string;     // Shelf color
  headerBg?: string;     // Header background (defaults to primary)
  headerText?: string;   // Header text (defaults to contrasting color)
}

/**
 * Creates a theme configuration from a color palette
 */
export const generateThemeFromPalette = (
  name: string,
  palette: ColorPalette,
  textures?: {
    shelf?: string;
    background?: string;
  }
): Theme => {
  // Use provided header colors or derive from primary
  const headerBg = palette.headerBg || palette.primary;
  const headerText = palette.headerText || getContrastingColor(headerBg);
  
  return {
    name,
    variables: {
      // Page
      '--page-bg': palette.background,
      '--page-bg-image': textures?.background ? 'url' : 'none',
      '--page-text-color': palette.text,
      
      // Container
      '--container-bg': palette.primary,
      '--container-bg-image': 'none',
      '--container-opacity': '1',
      '--container-border-width': '0px',
      '--container-border-style': 'solid',
      '--container-border-color': darkenColor(palette.primary, 15),
      '--container-border-radius': '8px',
      '--container-padding': '16px',
      
      // Shelves
      '--shelf-thickness': '20px',
      '--shelf-color': palette.shelfWood,
      '--shelf-bg-image': 'none',
      '--shelf-opacity': '1',
      
      // Dividers
      '--divider-thickness': '6px',
      '--divider-color': darkenColor(palette.shelfWood, 10),
      '--divider-opacity': '0.8',
      
      // Slots
      '--slot-add-button-bg': 'rgba(255, 255, 255, 0.9)',
      '--slot-add-button-color': '#555555',
      '--slot-add-button-hover-bg': '#ffffff',
      '--slot-toggle-inactive-color': 'rgba(200, 200, 200, 0.5)',
      '--slot-toggle-active-color': 'rgba(80, 80, 80, 0.9)',
      '--slot-toggle-border-color': 'rgba(180, 180, 180, 0.7)',
      '--slot-empty-hover-bg': 'rgba(255, 255, 255, 0.1)',
      
      // Header
      '--header-bg': headerBg,
      '--header-bg-image': 'none',
      '--header-text-color': headerText,
      '--header-hover-bg': isLightColor(headerBg) ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
    },
    textures: {
      shelf: textures?.shelf || '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
      background: textures?.background || '',
    }
  };
};

/**
 * Determines if a color is light or dark
 */
export const isLightColor = (color: string): boolean => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125;
};

/**
 * Gets a contrasting color (black or white) based on background
 */
export const getContrastingColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#333333' : '#ffffff';
};

/**
 * Darkens a hex color by a percentage
 */
export const darkenColor = (hex: string, percent: number): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Darken
  const factor = 1 - percent / 100;
  const newR = Math.floor(r * factor);
  const newG = Math.floor(g * factor);
  const newB = Math.floor(b * factor);
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

/**
 * Example usage:
 * 
 * const myTheme = generateThemeFromPalette(
 *   'Ocean Blue',
 *   {
 *     primary: '#2A6B8F',
 *     secondary: '#3D8EB9',
 *     background: '#E6F4F1',
 *     text: '#333333',
 *     shelfWood: '#8B5A2B'
 *   },
 *   {
 *     shelf: '/textures/my-theme/wood.jpg',
 *     background: '/textures/my-theme/pattern.jpg'
 *   }
 * );
 */
