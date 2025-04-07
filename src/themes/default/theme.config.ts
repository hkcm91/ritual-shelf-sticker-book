
import { Theme } from '../types';

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default',
  description: 'The classic wooden bookshelf theme with natural wood tones.',
  variables: {
    // Page
    '--page-bg': '#f5f5f5',
    '--page-bg-image': 'none',
    '--page-text-color': '#333333',
    
    // Container
    '--container-bg': '#8B5A2B',
    '--container-bg-image': 'none',
    '--container-opacity': '1',
    '--container-border-width': '0px',
    '--container-border-style': 'solid',
    '--container-border-color': '#e0e0e0',
    '--container-border-radius': '8px',
    '--container-padding': '16px',
    
    // Shelves
    '--shelf-thickness': '20px',
    '--shelf-color': '#714621',
    '--shelf-bg-image': 'none',
    '--shelf-opacity': '1',
    
    // Dividers - match with shelf color for consistency
    '--divider-thickness': '6px',
    '--divider-color': '#714621',
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
    '--header-bg': '#8B5A2B',
    '--header-bg-image': 'none',
    '--header-text-color': '#ffffff',
    '--header-hover-bg': 'rgba(255, 255, 255, 0.1)',
  },
  textures: {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: '',
  }
};

export default defaultTheme;
