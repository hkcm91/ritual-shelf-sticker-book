
import { Theme } from '../types';
import { generateThemeFromPalette } from '../utils/themeGenerator';

const pastelDreamTheme: Theme = generateThemeFromPalette(
  'Pastel Dream',
  {
    primary: '#FFB6C1',       // Soft pink
    secondary: '#FFFACD',     // Light yellow
    background: '#F0FFF0',    // Mint cream
    text: '#333333',          // Dark text for contrast
    shelfWood: '#AEC6CF',     // Soft blue for shelves
    headerBg: 'rgba(255, 182, 193, 0.7)', // Semi-transparent pink
    headerText: '#333333'     // Dark text for header
  },
  {
    shelf: '/lovable-uploads/5289c8fc-cbfe-46bd-8e23-908a12ecf6a6.png', // Using the blue image
    background: '/lovable-uploads/664a07c6-74e6-4067-90bf-91c30f73f2b1.png' // Using the middle image
  }
);

export default pastelDreamTheme;
