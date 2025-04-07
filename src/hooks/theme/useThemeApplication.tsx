
import { useEffect, useCallback } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes from '@/themes';
import { toast } from 'sonner';

/**
 * Hook to apply the active theme to the DOM
 */
export function useThemeApplication() {
  const { activeTheme, page, container, shelfStyling, header } = useBookshelfStore();

  // Apply theme whenever activeTheme changes or any of the theme settings change
  // This is key for live updates in the preview
  const applyTheme = useCallback(() => {
    if (!activeTheme) {
      console.warn('No active theme set, using default');
      return;
    }
    
    try {
      console.log('Applying theme:', activeTheme);
      
      // Fix for type safety
      let themeToApply = themes.default; // Default fallback
      
      if (activeTheme !== 'custom' && activeTheme in themes) {
        const themeKey = activeTheme as keyof typeof themes;
        themeToApply = themes[themeKey];
        
        // Apply CSS variables to root with additional error checking
        try {
          Object.entries(themeToApply.variables || {}).forEach(([key, value]) => {
            if (key && value) {
              document.documentElement.style.setProperty(key, value as string);
            }
          });
        } catch (varError) {
          console.error('Error applying theme variables:', varError);
          toast.error('Some theme styles could not be applied');
        }
        
        // Apply textures for backgrounds if available
        if (themeToApply.textures) {
          try {
            // Apply shelf texture
            if (themeToApply.textures.shelf) {
              document.documentElement.style.setProperty(
                '--shelf-texture', 
                `url(${themeToApply.textures.shelf})`
              );
              document.documentElement.style.setProperty(
                '--divider-bg-image', 
                `url(${themeToApply.textures.shelf})`
              );
            }
            
            // Apply background texture/image
            if (themeToApply.textures.background) {
              document.documentElement.style.setProperty(
                '--page-bg-image', 
                `url(${themeToApply.textures.background})`
              );
            } else {
              document.documentElement.style.setProperty('--page-bg-image', 'none');
            }
          } catch (textureError) {
            console.error('Error applying theme textures:', textureError);
          }
        }
      } else if (activeTheme === 'custom') {
        // For custom theme, we apply the current state values directly
        try {
          if (page) {
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
              const r = parseInt(bgColor.slice(1, 3), 16);
              const g = parseInt(bgColor.slice(3, 5), 16);
              const b = parseInt(bgColor.slice(5, 7), 16);
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              document.documentElement.style.setProperty('--page-text-color', brightness > 125 ? '#333333' : '#f0f0f0');
            }
          }
          
          if (container) {
            // Container
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
          
          if (shelfStyling) {
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
            
            // Dividers - ensure consistent styling
            if (shelfStyling.dividers) {
              // Add visibility variable for preview
              document.documentElement.style.setProperty(
                '--dividers-visible', 
                shelfStyling.dividers.enabled ? 'flex' : 'none'
              );
              
              document.documentElement.style.setProperty('--divider-thickness', `${shelfStyling.dividers.thickness || 10}px`);
              document.documentElement.style.setProperty('--divider-color', shelfStyling.dividers.color || '#714621');
              document.documentElement.style.setProperty('--divider-opacity', `${shelfStyling.dividers.opacity || 1}`);
              document.documentElement.style.setProperty('--divider-orientation', shelfStyling.dividers.orientation || 'vertical');
              document.documentElement.style.setProperty(
                '--divider-bg-image', 
                shelfStyling.backgroundImage ? `url(${shelfStyling.backgroundImage})` : `url(/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png)`
              );
            }
          }
          
          if (header) {
            // Header
            document.documentElement.style.setProperty('--header-bg', header.background || '#8B5A2B');
            document.documentElement.style.setProperty(
              '--header-bg-image', 
              header.backgroundImage ? `url(${header.backgroundImage})` : 'none'
            );
            document.documentElement.style.setProperty('--header-text-color', header.textColor || '#ffffff');
            
            // Auto-set hover background based on text color for better contrast
            const textColor = header.textColor || '#ffffff';
            if (textColor.match(/#[0-9a-f]{6}/i)) {
              const r = parseInt(textColor.slice(1, 3), 16);
              const g = parseInt(textColor.slice(3, 5), 16);
              const b = parseInt(textColor.slice(5, 7), 16);
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              document.documentElement.style.setProperty(
                '--header-hover-bg', 
                brightness > 125 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
              );
            }
          }
        } catch (customThemeError) {
          console.error('Error applying custom theme:', customThemeError);
          toast.error('Custom theme could not be fully applied');
        }
      } else {
        console.warn(`Unknown theme: ${activeTheme}, falling back to default`);
      }
      
      console.log('Theme applied successfully');
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Error applying theme, using default');
    }
  }, [activeTheme, page, container, shelfStyling, header]);

  // Apply theme once when component mounts and when dependencies change
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return { applyTheme };
}
