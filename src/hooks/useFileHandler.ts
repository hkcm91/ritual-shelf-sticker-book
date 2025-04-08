
import { useRef, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';
import { compressImage } from '../utils/imageUtils';

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

export interface FileHandlerResult {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleClick: () => void;
  clearFileInput: () => void;
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
}: UseFileHandlerProps): FileHandlerResult => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeShelfId, addBook, openModal } = useBookshelfStore();
  
  const clearFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  const validateFileType = useCallback((file: File): boolean => {
    if (acceptedFileTypes.length === 0) {
      // Default validations based on slot type
      if (slotType === "book") {
        return file.type.startsWith('image/');
      } else if (slotType === "sticker") {
        return file.type.startsWith('image/') || 
               file.type === 'application/json' || 
               file.name.endsWith('.json');
      }
      return true;
    }
    
    // Custom validation based on provided acceptedFileTypes
    return acceptedFileTypes.some(type => {
      if (type.includes('*')) {
        // Handle wildcards like 'image/*'
        const prefix = type.split('/')[0];
        return file.type.startsWith(`${prefix}/`);
      }
      return file.type === type || (type === '.json' && file.name.endsWith('.json'));
    });
  }, [acceptedFileTypes, slotType]);
  
  const validateFileSize = useCallback((file: File): boolean => {
    return file.size <= maxFileSize;
  }, [maxFileSize]);
  
  const handleLottieFile = useCallback(async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (typeof event.target?.result === 'string') {
            const jsonContent = event.target.result;
            
            // Check if it's valid JSON and a Lottie file
            try {
              const lottieData = JSON.parse(jsonContent);
              if (lottieData && (lottieData.v !== undefined || lottieData.animations)) {
                resolve(jsonContent);
              } else {
                reject(new Error('Invalid Lottie animation format'));
              }
            } catch (e) {
              reject(new Error('Failed to parse JSON file'));
            }
          } else {
            reject(new Error('Failed to read file'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }, []);
  
  const handleImageFile = useCallback(async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (typeof event.target?.result === 'string') {
            let imageData = event.target.result;
            
            // Only compress if over threshold size
            if (file.size > compressionSettings.sizeThreshold * 1024) {
              try {
                imageData = await compressImage(imageData, {
                  quality: compressionSettings.quality,
                  maxWidth: compressionSettings.maxWidth,
                  maxHeight: compressionSettings.maxHeight
                });
                console.log(`Image compressed successfully for ${slotType}`);
              } catch (err) {
                console.warn(`Failed to compress ${slotType} image:`, err);
                // Continue with original image
              }
            }
            
            resolve(imageData);
          } else {
            reject(new Error('Failed to read file'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  }, [compressionSettings, slotType]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log(`Handling file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    
    // Call external onFileSelect handler if provided
    if (onFileSelect) {
      onFileSelect(file);
    }
    
    // Validate file type
    if (!validateFileType(file)) {
      let supportedTypes = '';
      if (slotType === "book") {
        supportedTypes = 'image files';
      } else if (slotType === "sticker") {
        supportedTypes = 'image files or Lottie JSON files';
      } else {
        supportedTypes = acceptedFileTypes.join(', ');
      }
      
      toast.error(`Unsupported file type. Please use ${supportedTypes}`);
      clearFileInput();
      return;
    }
    
    // Validate file size
    if (!validateFileSize(file)) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB`);
      clearFileInput();
      return;
    }
    
    try {
      let fileContent: string;
      let isSticker = slotType === "sticker";
      
      // Process file based on type
      if (file.type.startsWith('image/')) {
        fileContent = await handleImageFile(file);
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        if (slotType !== "sticker") {
          toast.error('JSON files are only supported for stickers');
          clearFileInput();
          return;
        }
        fileContent = await handleLottieFile(file);
        isSticker = true;
      } else {
        toast.error('Unsupported file type');
        clearFileInput();
        return;
      }
      
      // Add book or sticker to the store
      const newBookId = addBook({
        title: isSticker ? file.name.replace(/\.[^/.]+$/, "") : '',
        author: isSticker ? 'Sticker' : '',
        coverURL: fileContent,
        progress: 0,
        rating: 0,
        position,
        shelfId: activeShelfId,
        isSticker
      });
      
      if (newBookId) {
        if (isSticker) {
          toast.success('Sticker added successfully');
        } else {
          // Open modal for book editing
          openModal(newBookId);
        }
      } else {
        toast.error(`Failed to add ${isSticker ? 'sticker' : 'book'}`);
      }
    } catch (error) {
      console.error(`Error adding ${slotType}:`, error);
      toast.error('Failed to save to localStorage. Try using smaller files or clearing some space.');
    } finally {
      clearFileInput();
    }
  }, [
    slotType, 
    onFileSelect, 
    validateFileType, 
    validateFileSize, 
    handleImageFile, 
    handleLottieFile, 
    clearFileInput, 
    addBook, 
    activeShelfId, 
    openModal, 
    acceptedFileTypes, 
    position
  ]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleFileChange,
    handleClick,
    clearFileInput
  };
};

export default useFileHandler;
