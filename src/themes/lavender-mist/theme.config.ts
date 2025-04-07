
import { Theme } from '../types';

const lavenderMistTheme: Theme = {
  name: 'Lavender Mist',
  variables: {
    // Page
    '--page-bg': '#f5e8f2',
    '--page-bg-image': 'none',
    '--page-text-color': '#432659',
    
    // Container
    '--container-bg': '#a5749d',
    '--container-bg-image': 'none',
    '--container-opacity': '1',
    '--container-border-width': '4px',
    '--container-border-style': 'solid',
    '--container-border-color': '#432659',
    '--container-border-radius': '8px',
    '--container-padding': '16px',
    
    // Shelves
    '--shelf-thickness': '22px',
    '--shelf-color': '#432659',
    '--shelf-bg-image': 'none',
    '--shelf-opacity': '1',
    
    // Dividers
    '--divider-thickness': '8px',
    '--divider-color': '#432659',
    '--divider-opacity': '0.9',
    
    // Slots
    '--slot-add-button-bg': 'rgba(245, 232, 242, 0.9)',
    '--slot-add-button-color': '#432659',
    '--slot-add-button-hover-bg': '#f5e8f2',
    '--slot-toggle-inactive-color': 'rgba(67, 38, 89, 0.5)',
    '--slot-toggle-active-color': 'rgba(67, 38, 89, 0.9)',
    '--slot-toggle-border-color': 'rgba(67, 38, 89, 0.7)',
    '--slot-empty-hover-bg': 'rgba(67, 38, 89, 0.1)',
    
    // Header
    '--header-bg': '#432659',
    '--header-bg-image': 'none',
    '--header-text-color': '#f5e8f2',
    '--header-hover-bg': 'rgba(165, 116, 157, 0.2)',
  },
  textures: {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: '',
  }
};

export default lavenderMistTheme;
