
import { toast } from 'sonner';
import { CustomizationState } from '@/store/slices/customization/types';
import { setCssVariable } from './utils';

/**
 * Applies a custom theme based on user-configured settings
 */
export function applyCustomTheme(
  page: CustomizationState['page'],
  container: CustomizationState['container'],
  shelfStyling: CustomizationState['shelfStyling'],
  header: CustomizationState['header']
): void {
  try {
    // 1. Set page background variables
    if (page) {
      setCssVariable('--page-bg', page.background);
      
      // Handle page background image
      if (page.backgroundImage) {
        document.documentElement.style.backgroundImage = `url(${page.backgroundImage})`;
        document.documentElement.style.backgroundSize = page.backgroundSize || 'cover';
        document.documentElement.style.backgroundRepeat = page.backgroundRepeat || 'no-repeat';
        document.documentElement.style.backgroundPosition = page.backgroundPosition || 'center';
        document.documentElement.style.backgroundAttachment = page.backgroundAttachment || 'fixed';
      } else {
        document.documentElement.style.backgroundImage = 'none';
      }
    }
    
    // 2. Set container variables
    if (container) {
      setCssVariable('--container-bg', container.background);
      
      // Handle container background image
      if (container.backgroundImage) {
        setCssVariable('--container-bg-image', `url(${container.backgroundImage})`);
      } else {
        setCssVariable('--container-bg-image', 'none');
      }
      
      // Handle container border styles
      if (container.borderColor) {
        setCssVariable('--container-border-color', container.borderColor);
      }
      
      if (container.borderWidth !== undefined) {
        setCssVariable('--container-border-width', `${container.borderWidth}px`);
      }
      
      if (container.borderRadius !== undefined) {
        setCssVariable('--container-border-radius', `${container.borderRadius}px`);
      }
      
      if (container.borderStyle) {
        setCssVariable('--container-border-style', container.borderStyle);
      }
      
      // Container opacity
      if (container.opacity !== undefined) {
        setCssVariable('--container-opacity', container.opacity.toString());
      }
      
      // Container padding
      if (container.padding !== undefined) {
        setCssVariable('--container-padding', `${container.padding}px`);
      }
    }
    
    // 3. Set shelf styling variables
    if (shelfStyling) {
      // Shelf color and texture
      setCssVariable('--shelf-color', shelfStyling.color);
      
      if (shelfStyling.backgroundImage) {
        setCssVariable('--shelf-texture', `url(${shelfStyling.backgroundImage})`);
      } else {
        setCssVariable('--shelf-texture', 'none');
      }
      
      // Shelf dimensions
      if (shelfStyling.thickness !== undefined) {
        setCssVariable('--shelf-thickness', `${shelfStyling.thickness}px`);
      }
      
      if (shelfStyling.opacity !== undefined) {
        setCssVariable('--shelf-opacity', shelfStyling.opacity.toString());
      }
      
      // Shelf dividers
      if (shelfStyling.dividers) {
        const { enabled, thickness, color, opacity } = shelfStyling.dividers;
        
        setCssVariable('--dividers-visible', enabled ? 'block' : 'none');
        setCssVariable('--divider-thickness', `${thickness}px`);
        setCssVariable('--divider-color', color);
        
        // Fixed this line - removed the backgroundImage reference which doesn't exist
        if (opacity !== undefined) {
          setCssVariable('--divider-opacity', opacity.toString());
        }
      }
    }
    
    // 4. Set header variables
    if (header) {
      setCssVariable('--header-bg', header.background);
      setCssVariable('--header-text', header.textColor);
      
      if (header.backgroundImage) {
        setCssVariable('--header-bg-image', `url(${header.backgroundImage})`);
      } else {
        setCssVariable('--header-bg-image', 'none');
      }
    }
  } catch (error) {
    console.error('Error applying custom theme:', error);
    toast.error('Some custom styles could not be applied');
  }
}
