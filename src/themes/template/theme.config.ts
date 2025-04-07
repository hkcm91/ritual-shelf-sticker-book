
import { Theme } from '../types';

/**
 * THEME TEMPLATE
 * 
 * Use this template to create your own custom themes.
 * 1. Copy this file to a new directory under src/themes/your-theme-name/
 * 2. Update the values below to match your desired style
 * 3. Import and add your theme to src/themes/index.ts
 */

const templateTheme: Theme = {
  id: 'template',
  name: 'Your Theme Name',
  description: 'A brief description of your theme and its features.',
  variables: {
    // Page (background and text)
    '--page-bg': '#f5f5f5',             // Main background color
    '--page-bg-image': 'none',          // Background image URL or 'none'
    '--page-text-color': '#333333',     // Text color that contrasts with --page-bg
    
    // Container (bookshelf body)
    '--container-bg': '#8B5A2B',        // Bookshelf background color
    '--container-bg-image': 'none',     // Container background image URL or 'none'
    '--container-opacity': '1',         // Container opacity (0-1)
    '--container-border-width': '0px',  // Border width
    '--container-border-style': 'solid', // Border style
    '--container-border-color': '#e0e0e0', // Border color
    '--container-border-radius': '8px', // Border radius
    '--container-padding': '16px',      // Container padding
    
    // Shelves
    '--shelf-thickness': '20px',        // Shelf height/thickness 
    '--shelf-color': '#714621',         // Shelf color
    '--shelf-bg-image': 'none',         // Shelf background image or 'none'
    '--shelf-opacity': '1',             // Shelf opacity (0-1)
    
    // Dividers (between books)
    '--divider-thickness': '6px',       // Divider width
    '--divider-color': '#714621',       // Divider color (often matches shelf)
    '--divider-opacity': '0.8',         // Divider opacity (0-1)
    '--divider-orientation': 'vertical', // 'vertical' or 'horizontal'
    
    // Slots
    '--slot-add-button-bg': 'rgba(255, 255, 255, 0.9)',       // Add button background
    '--slot-add-button-color': '#555555',                     // Add button text color
    '--slot-add-button-hover-bg': '#ffffff',                  // Add button hover background
    '--slot-toggle-inactive-color': 'rgba(200, 200, 200, 0.5)', // Toggle inactive state
    '--slot-toggle-active-color': 'rgba(80, 80, 80, 0.9)',    // Toggle active state
    '--slot-toggle-border-color': 'rgba(180, 180, 180, 0.7)', // Toggle border
    '--slot-empty-hover-bg': 'rgba(255, 255, 255, 0.1)',      // Empty slot hover effect
    
    // Header
    '--header-bg': '#8B5A2B',           // Header background color (often matches container)
    '--header-bg-image': 'none',        // Header background image or 'none'
    '--header-text-color': '#ffffff',   // Header text color
    '--header-hover-bg': 'rgba(255, 255, 255, 0.1)', // Header hover background
  },
  textures: {
    shelf: '/textures/template/wood.jpg',  // Path to shelf texture image
    background: '',                      // Path to background texture image (optional)
  }
};

export default templateTheme;
