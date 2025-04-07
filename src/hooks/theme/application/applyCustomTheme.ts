
import { CustomizationState } from '@/store/slices/customization/types';
import { calculateColorBrightness } from './utils';

/**
 * Applies custom theme settings from the store state
 */
export function applyCustomTheme(
  page?: CustomizationState['page'], 
  container?: CustomizationState['container'],
  shelfStyling?: CustomizationState['shelfStyling'],
  header?: CustomizationState['header']
): void {
  try {
    // Apply Page settings
    applyPageSettings(page);
    
    // Apply Container settings
    applyContainerSettings(container);
    
    // Apply Shelf settings
    applyShelfSettings(shelfStyling);
    
    // Apply Header settings
    applyHeaderSettings(header);
    
  } catch (customThemeError) {
    console.error('Error applying custom theme:', customThemeError);
  }
}

function applyPageSettings(page?: CustomizationState['page']): void {
  if (!page) return;
  
  // Page background
  document.documentElement.style.setProperty('--page-bg', page.background || '#f5f5f5');
  document.documentElement.style.setProperty(
    '--page-bg-image', 
    page.backgroundImage ? `url(${page.backgroundImage})` : 'none'
  );
  document.documentElement.style.setProperty('--page-bg-size', page.backgroundSize || 'cover');
  document.documentElement.style.setProperty('--page-bg-repeat', page.backgroundRepeat || 'no-repeat');
  document.documentElement.style.setProperty('--page-bg-position', page.backgroundPosition || 'center');
  document.documentElement.style.setProperty('--page-bg-attachment', page.backgroundAttachment || 'fixed');
  
  // Auto-set text color based on background brightness for contrast
  const bgColor = page.background || '#f5f5f5';
  if (bgColor.match(/#[0-9a-f]{6}/i)) {
    const brightness = calculateColorBrightness(bgColor);
    document.documentElement.style.setProperty('--page-text-color', brightness > 125 ? '#333333' : '#f0f0f0');
  }
}

function applyContainerSettings(container?: CustomizationState['container']): void {
  if (!container) return;
  
  document.documentElement.style.setProperty('--container-bg', container.background || '#8B5A2B');
  document.documentElement.style.setProperty(
    '--container-bg-image', 
    container.backgroundImage ? `url(${container.backgroundImage})` : 'none'
  );
  document.documentElement.style.setProperty('--container-opacity', `${container.opacity || 1}`);
  document.documentElement.style.setProperty('--container-border-width', `${container.borderWidth || 0}px`);
  document.documentElement.style.setProperty('--container-border-style', container.borderStyle || 'solid');
  document.documentElement.style.setProperty('--container-border-color', container.borderColor || '#e0e0e0');
  document.documentElement.style.setProperty('--container-border-radius', `${container.borderRadius || 8}px`);
  document.documentElement.style.setProperty('--container-padding', `${container.padding || 16}px`);
}

function applyShelfSettings(shelfStyling?: CustomizationState['shelfStyling']): void {
  if (!shelfStyling) return;
  
  // Shelves
  document.documentElement.style.setProperty('--shelf-thickness', `${shelfStyling.thickness || 20}px`);
  document.documentElement.style.setProperty('--shelf-color', shelfStyling.color || '#8B5A2B');
  document.documentElement.style.setProperty(
    '--shelf-bg-image', 
    shelfStyling.backgroundImage ? `url(${shelfStyling.backgroundImage})` : 'none'
  );
  document.documentElement.style.setProperty('--shelf-opacity', `${shelfStyling.opacity || 1}`);
  
  // Set shelf texture for use in other elements
  document.documentElement.style.setProperty(
    '--shelf-texture', 
    shelfStyling.backgroundImage ? `url(${shelfStyling.backgroundImage})` : `url(/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png)`
  );
  
  // Apply divider settings
  applyDividerSettings(shelfStyling.dividers);
}

function applyDividerSettings(dividers?: CustomizationState['shelfStyling']['dividers']): void {
  if (!dividers) return;
  
  // Add visibility variable for preview
  document.documentElement.style.setProperty(
    '--dividers-visible', 
    dividers.enabled ? 'flex' : 'none'
  );
  
  document.documentElement.style.setProperty('--divider-thickness', `${dividers.thickness || 10}px`);
  document.documentElement.style.setProperty('--divider-color', dividers.color || '#714621');
  document.documentElement.style.setProperty('--divider-opacity', `${dividers.opacity || 1}`);
  document.documentElement.style.setProperty('--divider-orientation', dividers.orientation || 'vertical');
  document.documentElement.style.setProperty(
    '--divider-bg-image', 
    dividers.backgroundImage ? `url(${dividers.backgroundImage})` : `url(/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png)`
  );
}

function applyHeaderSettings(header?: CustomizationState['header']): void {
  if (!header) return;
  
  document.documentElement.style.setProperty('--header-bg', header.background || 'rgba(65, 49, 37, 0.75)');
  document.documentElement.style.setProperty(
    '--header-bg-image', 
    header.backgroundImage ? `url(${header.backgroundImage})` : 'none'
  );
  document.documentElement.style.setProperty('--header-text-color', header.textColor || '#ffffff');
  
  // Auto-set hover background based on text color for better contrast
  const textColor = header.textColor || '#ffffff';
  if (textColor.match(/#[0-9a-f]{6}/i)) {
    const brightness = calculateColorBrightness(textColor);
    document.documentElement.style.setProperty(
      '--header-hover-bg', 
      brightness > 125 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
    );
  }
}
