
import { Theme } from '../types';

const cozyCottage: Theme = {
  name: 'Cozy Cottage',
  variables: {
    // Page
    '--page-bg': '#faf6ed',
    '--page-bg-image': 'none',
    
    // Container
    '--container-bg': '#cca779',
    '--container-bg-image': 'none',
    '--container-opacity': '1',
    '--container-border-width': '0px',
    '--container-border-style': 'solid',
    '--container-border-color': '#bb9466',
    '--container-border-radius': '8px',
    '--container-padding': '16px',
    
    // Shelves
    '--shelf-thickness': '20px',
    '--shelf-color': '#bb9466',
    '--shelf-bg-image': 'none',
    '--shelf-opacity': '1',
    
    // Dividers
    '--divider-thickness': '8px',
    '--divider-color': '#a38055',
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
    '--header-bg': '#cca779',
    '--header-bg-image': 'none',
    '--header-text-color': '#4a3921',
  },
  textures: {
    shelf: '/textures/cozy-cottage/wood.jpg',
    background: '/textures/cozy-cottage/pattern.jpg',
  }
};

export default cozyCottage;
