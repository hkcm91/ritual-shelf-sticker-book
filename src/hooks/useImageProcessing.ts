
import { useCallback } from 'react';
import { compressImage } from '../utils/imageUtils';
import { toast } from 'sonner';

export interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
}

export interface CompressionOptions {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  sizeThreshold: number; // Size in KB to trigger compression
}

export interface UseImageProcessingProps {
  compressionOptions?: CompressionOptions;
  resizeOptions?: ResizeOptions;
}

export const useImageProcessing = ({
  compressionOptions = {
    quality: 0.7,
    maxWidth: 600, 
    maxHeight: 900,
    sizeThreshold: 200 // 200KB
  },
  resizeOptions = {
    maxWidth: 1200,
    maxHeight: 1800,
    quality: 0.9
  }
}: UseImageProcessingProps = {}) => {
  
  // Convert image file to data URL
  const fileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  }, []);
  
  // Compress an image file based on compression options
  const compressImageFile = useCallback(async (file: File, imageData?: string): Promise<string> => {
    try {
      // If image data wasn't provided, read it from the file
      const dataUrl = imageData || await fileToDataUrl(file);
      
      // Only compress if over threshold size
      if (file.size > compressionOptions.sizeThreshold * 1024) {
        try {
          const compressedData = await compressImage(dataUrl, {
            quality: compressionOptions.quality,
            maxWidth: compressionOptions.maxWidth,
            maxHeight: compressionOptions.maxHeight
          });
          console.log(`Image compressed successfully`);
          return compressedData;
        } catch (err) {
          console.warn(`Failed to compress image:`, err);
          // Continue with original image if compression fails
          return dataUrl;
        }
      }
      
      // Return original if below threshold
      return dataUrl;
    } catch (error) {
      console.error('Error in compressImageFile:', error);
      throw error;
    }
  }, [compressionOptions, fileToDataUrl]);
  
  // Resize an image without necessarily compressing it (for consistent display)
  const resizeImage = useCallback(async (dataUrl: string): Promise<string> => {
    try {
      return await compressImage(dataUrl, {
        quality: resizeOptions.quality ?? 0.9,
        maxWidth: resizeOptions.maxWidth,
        maxHeight: resizeOptions.maxHeight
      });
    } catch (error) {
      console.error('Error resizing image:', error);
      toast.error('Failed to resize image');
      return dataUrl; // Return original on error
    }
  }, [resizeOptions]);
  
  // Process image file with auto-detection of needs (resize/compress)
  const processImageFile = useCallback(async (file: File, options?: {
    forceCompress?: boolean;
    forceResize?: boolean;
  }): Promise<string> => {
    try {
      const dataUrl = await fileToDataUrl(file);
      
      // Determine if we need compression, resizing, or both
      const needsCompression = options?.forceCompress || 
        file.size > compressionOptions.sizeThreshold * 1024;
      
      if (needsCompression) {
        return await compressImageFile(file, dataUrl);
      }
      
      if (options?.forceResize) {
        return await resizeImage(dataUrl);
      }
      
      return dataUrl;
    } catch (error) {
      console.error('Error processing image file:', error);
      throw error;
    }
  }, [fileToDataUrl, compressImageFile, resizeImage, compressionOptions]);
  
  return {
    fileToDataUrl,
    compressImageFile,
    resizeImage,
    processImageFile
  };
};

export default useImageProcessing;
