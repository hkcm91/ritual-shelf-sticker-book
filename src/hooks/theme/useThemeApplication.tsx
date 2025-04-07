
import { useEffect, useCallback } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes from '@/themes';
import { ThemeName } from '@/themes';
import { toast } from 'sonner';

/**
 * Hook to apply the active theme to the DOM
 */
export function useThemeApplication() {
  const { activeTheme, page, container, shelfStyling } = useBookshelfStore();

  // Apply theme whenever activeTheme changes - avoiding dependency on the whole store state
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
            document.documentElement.style.setProperty(
              '--shelf-texture', 
              `url(${themeToApply.textures.shelf || '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png'})`
            );
            
            if (themeToApply.textures.background) {
              document.documentElement.style.setProperty(
                '--page-bg-image', 
                `url(${themeToApply.textures.background})`
              );
            } else {
              document.documentElement.style.setProperty('--page-bg-image', 'none');
            }
            
            // Set divider background image to match shelf texture
            document.documentElement.style.setProperty(
              '--divider-bg-image', 
              `url(${themeToApply.textures.shelf || '/lovable-uploads/7a437784-0910-4719-b52b-6564c3004ebe.png'})`
            );
          } catch (textureError) {
            console.error('Error applying theme textures:', textureError);
          }
        }
        
        // IMPORTANT: Removed the automatic divider setting to prevent infinite loops
        // We'll let the theme action handle this instead
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
  }, [activeTheme, page, container, shelfStyling]);

  // Apply theme once when component mounts and when dependencies change
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return { applyTheme };
}
