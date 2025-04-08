
import { useCallback } from 'react';
import { compressImage } from '../utils/imageUtils';

export interface CompressionSettings {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  sizeThreshold: number;  // Size in KB to trigger compression
}

export interface UseFileCompressionProps {
  compressionSettings?: CompressionSettings;
}

export const useFileCompression = ({
  compressionSettings = {
    quality: 0.7,
    maxWidth: 600,
    maxHeight: 900,
    sizeThreshold: 200  // 200KB
  }
}: UseFileCompressionProps) => {
  
  const compressImageFile = useCallback(async (file: File, imageData: string): Promise<string> => {
    // Only compress if over threshold size
    if (file.size > compressionSettings.sizeThreshold * 1024) {
      try {
        const compressedData = await compressImage(imageData, {
          quality: compressionSettings.quality,
          maxWidth: compressionSettings.maxWidth,
          maxHeight: compressionSettings.maxHeight
        });
        console.log(`Image compressed successfully`);
        return compressedData;
      } catch (err) {
        console.warn(`Failed to compress image:`, err);
        // Continue with original image if compression fails
        return imageData;
      }
    }
    
    // Return original if below threshold
    return imageData;
  }, [compressionSettings]);
  
  return {
    compressImageFile
  };
};

export default useFileCompression;
