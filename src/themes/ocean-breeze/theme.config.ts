
import { Theme } from '../types';

const oceanBreezeTheme: Theme = {
  id: 'ocean-breeze',
  name: 'Ocean Breeze',
  description: 'A refreshing seaside theme with blues and navy accents.',
  variables: {
    // Page
    '--page-bg': '#e6f2f5',
    '--page-bg-image': 'none',
    '--page-text-color': '#2d3e4f',
    
    // Container
    '--container-bg': '#4682b4',
    '--container-bg-image': 'none',
    '--container-opacity': '1',
    '--container-border-width': '4px',
    '--container-border-style': 'solid',
    '--container-border-color': '#2d3e4f',
    '--container-border-radius': '8px',
    '--container-padding': '16px',
    
    // Shelves
    '--shelf-thickness': '22px',
    '--shelf-color': '#2d3e4f',
    '--shelf-bg-image': 'none',
    '--shelf-opacity': '1',
    
    // Dividers
    '--divider-thickness': '8px',
    '--divider-color': '#2d3e4f',
    '--divider-opacity': '0.9',
    
    // Slots
    '--slot-add-button-bg': 'rgba(230, 242, 245, 0.9)',
    '--slot-add-button-color': '#2d3e4f',
    '--slot-add-button-hover-bg': '#e6f2f5',
    '--slot-toggle-inactive-color': 'rgba(45, 62, 79, 0.5)',
    '--slot-toggle-active-color': 'rgba(45, 62, 79, 0.9)',
    '--slot-toggle-border-color': 'rgba(45, 62, 79, 0.7)',
    '--slot-empty-hover-bg': 'rgba(45, 62, 79, 0.1)',
    
    // Header
    '--header-bg': '#2d3e4f',
    '--header-bg-image': 'none',
    '--header-text-color': '#e6f2f5',
    '--header-hover-bg': 'rgba(70, 130, 180, 0.2)',
  },
  textures: {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: '',
  }
};

export default oceanBreezeTheme;
