
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
      const quality = options.quality || 0.7;
      const maxWidth = options.maxWidth || 800;
      const maxHeight = options.maxHeight || 1200;
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get the original image format from data URL
      const format = dataUrl.split(';')[0].split('/')[1];
      
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
