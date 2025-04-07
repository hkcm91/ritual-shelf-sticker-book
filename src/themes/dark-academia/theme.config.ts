
import { Theme } from '../types';

const darkAcademia: Theme = {
  name: 'Dark Academia',
  variables: {
    // Page
    '--page-bg': '#2a2a2a',
    '--page-bg-image': 'none',
    
    // Container
    '--container-bg': '#352011',
    '--container-bg-image': 'none',
    '--container-opacity': '1',
    '--container-border-width': '0px',
    '--container-border-style': 'solid',
    '--container-border-color': '#222',
    '--container-border-radius': '8px',
    '--container-padding': '16px',
    
    // Shelves
    '--shelf-thickness': '22px',
    '--shelf-color': '#3a2c1f',
    '--shelf-bg-image': 'none',
    '--shelf-opacity': '1',
    
    // Dividers
    '--divider-thickness': '10px',
    '--divider-color': '#271911',
    '--divider-opacity': '1',
    
    // Slots
    '--add-button-bg': 'rgba(30, 30, 30, 0.8)',
    '--add-button-color': '#eee',
    '--add-button-hover-bg': '#444',
    '--toggle-inactive-color': 'rgba(50, 50, 50, 0.7)',
    '--toggle-active-color': 'rgba(180, 180, 180, 0.9)',
    '--toggle-border-color': 'rgba(60, 60, 60, 0.7)',
    '--empty-hover-bg': 'rgba(30, 30, 30, 0.2)',
    
    // Header
    '--header-bg': '#352011',
    '--header-bg-image': 'none',
    '--header-text-color': '#eee',
  },
  textures: {
    shelf: '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png',
    background: '/textures/dark-academia/books.jpg',
  }
};

export default darkAcademia;
