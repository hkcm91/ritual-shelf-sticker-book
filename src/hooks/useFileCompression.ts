
import { useCallback } from 'react';
import { useImageProcessing } from './useImageProcessing';

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
  
  const { compressImageFile } = useImageProcessing({
    compressionOptions: compressionSettings
  });
  
  return {
    compressImageFile
  };
};

export default useFileCompression;
