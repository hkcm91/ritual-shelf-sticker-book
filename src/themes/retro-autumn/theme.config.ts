
import { Theme } from '../types';

const retroAutumnTheme: Theme = {
  id: 'retro-autumn',
  name: 'Retro Autumn',
  description: 'A nostalgic autumn theme with warm oranges and deep browns.',
  variables: {
    // Page
    '--page-bg': '#f5eed6',
    '--page-bg-image': 'none',
    '--page-text-color': '#3c2323',
    
    // Container
    '--container-bg': '#e85d3f',
    '--container-bg-image': 'none',
    '--container-opacity': '1',
    '--container-border-width': '4px',
    '--container-border-style': 'solid',
    '--container-border-color': '#3c2323',
    '--container-border-radius': '8px',
    '--container-padding': '16px',
    
    // Shelves
    '--shelf-thickness': '22px',
    '--shelf-color': '#3c2323',
    '--shelf-bg-image': 'none',
    '--shelf-opacity': '1',
    
    // Dividers
    '--divider-thickness': '8px',
    '--divider-color': '#3c2323',
    '--divider-opacity': '0.9',
    
    // Slots
    '--slot-add-button-bg': 'rgba(245, 238, 214, 0.9)',
    '--slot-add-button-color': '#3c2323',
    '--slot-add-button-hover-bg': '#f5eed6',
    '--slot-toggle-inactive-color': 'rgba(60, 35, 35, 0.5)',
    '--slot-toggle-active-color': 'rgba(60, 35, 35, 0.9)',
    '--slot-toggle-border-color': 'rgba(60, 35, 35, 0.7)',
    '--slot-empty-hover-bg': 'rgba(60, 35, 35, 0.1)',
    
    // Header
    '--header-bg': '#3c2323',
    '--header-bg-image': 'none',
    '--header-text-color': '#f5eed6',
    '--header-hover-bg': 'rgba(232, 93, 63, 0.2)',
  },
  textures: {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: '',
  }
};

export default retroAutumnTheme;
