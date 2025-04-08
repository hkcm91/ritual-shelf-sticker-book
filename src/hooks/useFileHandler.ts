
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useFileInput } from './useFileInput';
import { useFileValidation } from './useFileValidation';
import { useLottieFileHandler } from './useLottieFileHandler';
import { useBookCreation } from './useBookCreation';
import { useBookshelfStore } from '../store/bookshelfStore';
import { storageService } from '../services/storage/storageService';
import { useImageProcessing } from './useImageProcessing';

export interface UseFileHandlerProps {
  position: number;
  slotType?: "book" | "sticker";
  onFileSelect?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  compressionSettings?: {
    quality: number;
    maxWidth: number;
    maxHeight: number;
    sizeThreshold: number;  // Size in KB to trigger compression
  };
}

export const useFileHandler = ({
  position,
  slotType = "book",
  onFileSelect,
  acceptedFileTypes = [],
  maxFileSize = 5 * 1024 * 1024,  // 5MB default
  compressionSettings = {
    quality: 0.7,
    maxWidth: 600,
    maxHeight: 900,
    sizeThreshold: 200  // 200KB
  }
}: UseFileHandlerProps) => {
  const { fileInputRef, handleClick, clearFileInput } = useFileInput({ onFileSelect });
  const { validateFile } = useFileValidation({ slotType, acceptedFileTypes, maxFileSize });
  const { processImageFile } = useImageProcessing({ compressionOptions: compressionSettings });
  const { processLottieFile } = useLottieFileHandler({
    onError: (error) => toast.error(error.message)
  });
  const { createBookOrSticker } = useBookCreation({ position });
  
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log(`Handling file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    // Call external onFileSelect handler if provided
    if (onFileSelect) {
      onFileSelect(file);
    }
    
    // Check storage usage
    const stats = storageService.getUsageStats();
    if (stats.percent > 80) {
      toast.warning(`Storage is ${stats.percent}% full. Consider removing unused items.`);
    }
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      clearFileInput();
      return;
    }
    
    try {
      let fileContent: string;
      let isSticker = slotType === "sticker";
      
      // Process file based on type
      if (file.type.startsWith('image/')) {
        fileContent = await processImageFile(file);
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        if (slotType !== "sticker") {
          toast.error('JSON files are only supported for stickers');
          clearFileInput();
          return;
        }
        fileContent = await processLottieFile(file);
        isSticker = true;
      } else {
        toast.error('Unsupported file type');
        clearFileInput();
        return;
      }
      
      // Add book or sticker to the store
      createBookOrSticker(fileContent, file.name, isSticker);
    } catch (error) {
      console.error(`Error adding ${slotType}:`, error);
      toast.error('Failed to save file. Please try again with a different file.');
    } finally {
      clearFileInput();
    }
  }, [
    onFileSelect, 
    validateFile, 
    clearFileInput, 
    processImageFile, 
    processLottieFile, 
    createBookOrSticker,
    slotType
  ]);

  return {
    fileInputRef,
    handleFileChange,
    handleClick,
    clearFileInput
  };
};

export default useFileHandler;
