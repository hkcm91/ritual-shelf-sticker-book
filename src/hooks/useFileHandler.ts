
import { useRef, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { useBookCreation } from './useBookCreation';
import { toast } from 'sonner';

export interface UseFileHandlerProps {
  position: number;
  slotType: "book" | "sticker" | "recipe";
  onFileSelect?: (file: File) => void;
}

export const useFileHandler = ({
  position,
  slotType,
  onFileSelect
}: UseFileHandlerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createBookOrSticker } = useBookCreation({ position });
  
  // Handle file input change
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    
    if (file) {
      if (onFileSelect) {
        onFileSelect(file);
        return;
      }
      
      // Handle based on file type
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            // Create book or sticker based on the slot type
            const isSticker = slotType === 'sticker';
            createBookOrSticker(result, file.name, isSticker);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(`Unsupported file type: ${file.type}`);
      }
    }
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect, createBookOrSticker, slotType, position]);
  
  // Trigger file input click
  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  
  return {
    fileInputRef,
    handleFileChange,
    handleClick
  };
};

export default useFileHandler;
