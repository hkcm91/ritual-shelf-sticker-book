
import { Theme } from '../types';

const defaultTheme: Theme = {
  name: 'Default',
  variables: {
    // Page
    '--page-bg': '#f5f5f5',
    '--page-bg-image': 'none',
    
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
    '--divider-thickness': '8px',
    '--divider-color': '#714621',
    '--divider-opacity': '1',
    
    // Slots
    '--add-button-bg': 'rgba(255, 255, 255, 0.9)',
    '--add-button-color': '#555555',
    '--add-button-hover-bg': '#ffffff',
    '--toggle-inactive-color': 'rgba(200, 200, 200, 0.5)',
    '--toggle-active-color': 'rgba(80, 80, 80, 0.9)',
    '--toggle-border-color': 'rgba(180, 180, 180, 0.7)',
    '--empty-hover-bg': 'rgba(255, 255, 255, 0.1)',
    
    // Header
    '--header-bg': '#8B5A2B',
    '--header-bg-image': 'none',
    '--header-text-color': '#ffffff',
  },
  textures: {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: '',
  }
};

export default defaultTheme;
