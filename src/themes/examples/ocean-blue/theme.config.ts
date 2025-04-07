
import { Theme } from '../../types';
import { generateThemeFromPalette } from '../../utils/themeGenerator';

/**
 * Example theme using the theme generator
 */
const oceanBlueTheme: Theme = generateThemeFromPalette(
  'Ocean Blue',
  {
    primary: '#2A6B8F',       // Deep blue
    secondary: '#3D8EB9',     // Medium blue
    background: '#E6F4F1',    // Light blue-gray
    text: '#333333',          // Dark text for contrast
    shelfWood: '#8B5A2B',     // Warm wood tone
    headerBg: '#1E4F6A',      // Darker blue for header
    headerText: '#ffffff'     // White text for header
  },
  {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: ''  // No background texture for this theme
  }
);

export default oceanBlueTheme;
