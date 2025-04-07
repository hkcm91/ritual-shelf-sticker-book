
import { Theme } from '../types';

const customTheme: Theme = {
  name: 'Custom Theme',
  variables: {
    // These are just placeholders as the custom theme will use the current customization values
    '--page-bg': '#f5f5f5',
    '--page-bg-image': 'none',
    '--page-text-color': '#333333',
    '--container-bg': '#8B5A2B',
    '--header-bg': 'rgba(65, 49, 37, 0.75)',
    '--header-text-color': '#ffffff',
  },
  textures: {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: '',
  }
};

export default customTheme;
