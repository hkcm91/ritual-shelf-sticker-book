
import defaultTheme from './default/theme.config';
import darkAcademia from './dark-academia/theme.config';
import cozyCottage from './cozy-cottage/theme.config';

export const themes = {
  'default': defaultTheme,
  'dark-academia': darkAcademia,
  'cozy-cottage': cozyCottage,
};

export type ThemeName = keyof typeof themes | 'custom';
export type Theme = typeof defaultTheme;

export default themes;
