
import { Theme } from '../types';

const navyGoldTheme: Theme = {
  name: 'Navy & Gold',
  variables: {
    // Page
    '--page-bg': '#f5f5f5',
    '--page-bg-image': 'none',
    '--page-text-color': '#002171',
    
    // Container
    '--container-bg': '#ffc107',
    '--container-bg-image': 'none',
    '--container-opacity': '1',
    '--container-border-width': '4px',
    '--container-border-style': 'solid',
    '--container-border-color': '#002171',
    '--container-border-radius': '8px',
    '--container-padding': '16px',
    
    // Shelves
    '--shelf-thickness': '22px',
    '--shelf-color': '#002171',
    '--shelf-bg-image': 'none',
    '--shelf-opacity': '1',
    
    // Dividers
    '--divider-thickness': '8px',
    '--divider-color': '#002171',
    '--divider-opacity': '0.9',
    
    // Slots
    '--slot-add-button-bg': 'rgba(245, 245, 245, 0.9)',
    '--slot-add-button-color': '#002171',
    '--slot-add-button-hover-bg': '#f5f5f5',
    '--slot-toggle-inactive-color': 'rgba(0, 33, 113, 0.5)',
    '--slot-toggle-active-color': 'rgba(0, 33, 113, 0.9)',
    '--slot-toggle-border-color': 'rgba(0, 33, 113, 0.7)',
    '--slot-empty-hover-bg': 'rgba(0, 33, 113, 0.1)',
    
    // Header
    '--header-bg': '#002171',
    '--header-bg-image': 'none',
    '--header-text-color': '#f5f5f5',
    '--header-hover-bg': 'rgba(255, 193, 7, 0.2)',
  },
  textures: {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: '',
  }
};

export default navyGoldTheme;
