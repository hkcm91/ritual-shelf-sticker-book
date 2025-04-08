
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

/**
 * Converts an image from one format to another
 */
export const convertImageFormat = async (
  dataUrl: string,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality = 0.9
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert to the target format
      const convertedDataUrl = canvas.toDataURL(
        `image/${targetFormat}`,
        quality
      );
      
      resolve(convertedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image for format conversion'));
    };
    
    img.src = dataUrl;
  });
};

/**
 * Calculates the file size of a data URL in kilobytes
 */
export const calculateDataUrlSize = (dataUrl: string): number => {
  // Remove the data URL prefix to get the base64 string
  const base64 = dataUrl.split(',')[1];
  // Calculate size in bytes: (base64 length * 3/4) to account for base64 overhead
  const sizeInBytes = (base64.length * 3) / 4;
  // Convert to kilobytes
  return sizeInBytes / 1024;
};

/**
 * Crops an image to a specified aspect ratio
 */
export const cropImageToAspectRatio = async (
  dataUrl: string,
  aspectRatio: number, // width/height
  options: {
    quality?: number;
  } = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const quality = options.quality || 0.9;
      
      // Calculate dimensions to crop to the desired aspect ratio
      let cropWidth = img.width;
      let cropHeight = img.height;
      
      if (cropWidth / cropHeight > aspectRatio) {
        // Image is wider than target aspect ratio
        cropWidth = cropHeight * aspectRatio;
      } else {
        // Image is taller than target aspect ratio
        cropHeight = cropWidth / aspectRatio;
      }
      
      // Calculate center positioning
      const offsetX = (img.width - cropWidth) / 2;
      const offsetY = (img.height - cropHeight) / 2;
      
      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the cropped region
      ctx.drawImage(
        img,
        offsetX, offsetY, cropWidth, cropHeight, // Source rectangle
        0, 0, cropWidth, cropHeight // Destination rectangle
      );
      
      // Get the original format
      const format = dataUrl.split(';')[0].split('/')[1];
      
      // Convert to data URL
      const croppedDataUrl = canvas.toDataURL(
        `image/${format}`,
        quality
      );
      
      resolve(croppedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image for cropping'));
    };
    
    img.src = dataUrl;
  });
};
