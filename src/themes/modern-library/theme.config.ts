
import { Theme } from '../types';

const modernLibrary: Theme = {
  name: 'Modern Library',
  variables: {
    // Page
    '--page-bg': '#f0f2f5',
    '--page-bg-image': 'none',
    
    // Container
    '--container-bg': '#3d4e68',
    '--container-bg-image': 'none',
    '--container-opacity': '1',
    '--container-border-width': '0px',
    '--container-border-style': 'solid',
    '--container-border-color': '#2c3b52',
    '--container-border-radius': '12px',
    '--container-padding': '20px',
    
    // Shelves
    '--shelf-thickness': '22px',
    '--shelf-color': '#2c3b52',
    '--shelf-bg-image': 'none',
    '--shelf-opacity': '1',
    
    // Dividers
    '--divider-thickness': '3px',
    '--divider-color': '#1f2937',
    
    // Slots
    '--add-button-bg': 'rgba(240, 240, 240, 0.9)',
    '--add-button-color': '#3d4e68',
    '--add-button-hover-bg': '#ffffff',
    '--toggle-inactive-color': 'rgba(220, 220, 220, 0.6)',
    '--toggle-active-color': 'rgba(200, 200, 200, 0.9)',
    '--toggle-border-color': 'rgba(180, 180, 180, 0.8)',
    '--empty-hover-bg': 'rgba(255, 255, 255, 0.15)',
    
    // Header
    '--header-bg': '#3d4e68',
    '--header-bg-image': 'none',
    '--header-text-color': '#ffffff',
  },
  textures: {
    shelf: '/textures/modern-library/wood.jpg',
    background: '/textures/modern-library/pattern.jpg',
  }
};

export default modernLibrary;
