
/**
 * Compresses an image data URL to reduce its size
 */
export const compressImage = async (
  dataUrl: string,
  options: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Use provided options or defaults
      const quality = options.quality || 0.6; // Default to more aggressive compression
      const maxWidth = options.maxWidth || 600;
      const maxHeight = options.maxHeight || 900;
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      // More aggressive downscaling if original is very large
      let scaleFactor = 1;
      if (width > maxWidth*1.5 || height > maxHeight*1.5) {
        scaleFactor = 0.6; // Reduce size more aggressively for large images
      }
      
      if (width > maxWidth) {
        height = (height * maxWidth * scaleFactor) / width;
        width = maxWidth * scaleFactor;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight * scaleFactor) / height;
        height = maxHeight * scaleFactor;
      }
      
      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      
      // Draw and compress
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try to determine optimal format - prefer webp for better compression
      let format = 'jpeg'; // Default to jpeg for better compression vs png
      
      // If browser supports webp, use it for even better compression
      const isWebPSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      if (isWebPSupported) {
        format = 'webp';
      }
      
      // Convert to compressed data URL
      const compressedDataUrl = canvas.toDataURL(
        `image/${format}`,
        quality
      );
      
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image for compression'));
    };
    
    img.src = dataUrl;
  });
};
