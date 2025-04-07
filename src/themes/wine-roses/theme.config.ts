
import { Theme } from '../types';
import { generateThemeFromPalette } from '../utils/themeGenerator';

const wineRosesTheme: Theme = generateThemeFromPalette(
  'Wine & Roses',
  {
    primary: '#a83052',       // Deep wine red
    secondary: '#e2a193',     // Rose pink
    background: '#f5e8e4',    // Soft beige
    text: '#3c1518',          // Dark burgundy text
    shelfWood: '#8c2f39',     // Burgundy wood
    headerBg: 'rgba(60, 21, 24, 0.8)', // Semi-transparent dark burgundy
    headerText: '#f5e8e4'     // Light text for header
  },
  {
    shelf: '/lovable-uploads/748eee1a-17a8-48c7-a36f-fce286e8d8e2.png', // Using the first image
    background: ''  // No background texture
  }
);

// Override some specific values
wineRosesTheme.variables['--container-bg'] = '#a83052';
wineRosesTheme.variables['--container-border-color'] = '#3c1518';
wineRosesTheme.variables['--shelf-color'] = '#8c2f39';
wineRosesTheme.variables['--divider-color'] = '#5e1621';

export default wineRosesTheme;
