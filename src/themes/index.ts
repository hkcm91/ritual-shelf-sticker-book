
import defaultTheme from './default/theme.config';
import darkAcademia from './dark-academia/theme.config';
import cozyCottage from './cozy-cottage/theme.config';
import modernLibrary from './modern-library/theme.config';
import { Theme } from './types';

export const themes = {
  'default': defaultTheme,
  'dark-academia': darkAcademia,
  'cozy-cottage': cozyCottage,
  'modern-library': modernLibrary,
};

// Add 'custom' to ThemeName type
export type ThemeName = keyof typeof themes | 'custom';
export type { Theme };

export default themes;
