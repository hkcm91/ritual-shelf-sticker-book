
import { Theme } from '../types';
import { generateThemeFromPalette } from '../utils/themeGenerator';

const forestGradientTheme: Theme = generateThemeFromPalette(
  'Forest Gradient',
  {
    primary: '#355e3b',       // Medium forest green
    secondary: '#87a878',     // Sage green
    background: '#f0f7da',    // Light yellow-green
    text: '#0d2818',          // Dark forest green text
    shelfWood: '#2e4600',     // Dark olive wood
    headerBg: 'rgba(13, 40, 24, 0.85)', // Semi-transparent dark green
    headerText: '#f0f7da'     // Light text for header
  },
  {
    shelf: '/lovable-uploads/5289c8fc-cbfe-46bd-8e23-908a12ecf6a6.png', // Using the green image
    background: ''  // No background texture
  }
);

// Override some specific values for better visual harmony
forestGradientTheme.variables['--container-bg'] = '#355e3b';
forestGradientTheme.variables['--container-border-color'] = '#0d2818';
forestGradientTheme.variables['--shelf-color'] = '#2e4600';
forestGradientTheme.variables['--divider-color'] = '#1e3200';
forestGradientTheme.variables['--page-bg'] = '#f0f7da';

export default forestGradientTheme;
