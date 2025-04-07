
import defaultTheme from './default/theme.config';
import darkAcademia from './dark-academia/theme.config';
import cozyCottage from './cozy-cottage/theme.config';
import modernLibrary from './modern-library/theme.config';
import pastelDreamTheme from './pastel-dream/theme.config';
import wineRosesTheme from './wine-roses/theme.config';
import forestGradientTheme from './forest-gradient/theme.config';
import customTheme from './custom/theme.config';
import retroAutumnTheme from './retro-autumn/theme.config';
import oceanBreezeTheme from './ocean-breeze/theme.config';
import lavenderMistTheme from './lavender-mist/theme.config';
import sunriseHorizonTheme from './sunrise-horizon/theme.config';
import navyGoldTheme from './navy-gold/theme.config';
import tealTerraTheme from './teal-terra/theme.config';
import { Theme } from './types';

export const themes = {
  'default': defaultTheme,
  'dark-academia': darkAcademia,
  'cozy-cottage': cozyCottage,
  'modern-library': modernLibrary,
  'pastel-dream': pastelDreamTheme,
  'wine-roses': wineRosesTheme,
  'forest-gradient': forestGradientTheme,
  'retro-autumn': retroAutumnTheme,
  'ocean-breeze': oceanBreezeTheme,
  'lavender-mist': lavenderMistTheme,
  'sunrise-horizon': sunriseHorizonTheme,
  'navy-gold': navyGoldTheme,
  'teal-terra': tealTerraTheme,
  'custom': customTheme,
};

// Add 'custom' to ThemeName type
export type ThemeName = keyof typeof themes | 'custom';
export type { Theme };

export default themes;
