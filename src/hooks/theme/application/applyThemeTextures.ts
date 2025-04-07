
/**
 * Applies textures from a theme to the document root
 */
export function applyThemeTextures(textures: Record<string, string | undefined>): void {
  try {
    // Apply shelf texture
    if (textures.shelf) {
      document.documentElement.style.setProperty(
        '--shelf-texture', 
        `url(${textures.shelf})`
      );
      document.documentElement.style.setProperty(
        '--divider-bg-image', 
        `url(${textures.shelf})`
      );
    }
    
    // Apply background texture/image
    if (textures.background) {
      document.documentElement.style.setProperty(
        '--page-bg-image', 
        `url(${textures.background})`
      );
    } else {
      document.documentElement.style.setProperty('--page-bg-image', 'none');
    }
    
    // Apply header texture if available
    if (textures.header) {
      document.documentElement.style.setProperty(
        '--header-bg-image', 
        `url(${textures.header})`
      );
    } else {
      document.documentElement.style.setProperty('--header-bg-image', 'none');
    }
  } catch (textureError) {
    console.error('Error applying theme textures:', textureError);
  }
}
