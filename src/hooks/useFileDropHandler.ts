
import { useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';
import { useFileValidation } from './useFileValidation';

export interface UseFileDropHandlerProps {
  position: number;
  onDrop?: (file: File) => void;
  slotType?: "book" | "sticker" | "recipe";
  acceptedFileTypes?: string[];
}

export const useFileDropHandler = ({
  position,
  onDrop,
  slotType = "book",
  acceptedFileTypes = []
}: UseFileDropHandlerProps) => {
  const { activeShelfId, addBook, openModal } = useBookshelfStore();
  const { validateFileType } = useFileValidation({ slotType, acceptedFileTypes });
  
  const handleImageFileDrop = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const isSticker = slotType === "sticker";
        const isRecipe = slotType === "recipe";
        
        const newBookId = addBook({
          title: isSticker || isRecipe ? file.name.replace(/\.[^/.]+$/, "") : '',
          author: isSticker ? 'Sticker' : isRecipe ? 'Recipe' : '',
          coverURL: event.target.result,
          progress: 0,
          rating: 0,
          position,
          shelfId: activeShelfId,
          isSticker,
          isRecipe
        });
        
        if (slotType === "book") {
          openModal(newBookId);
        } else if (slotType === "recipe") {
          toast.success('Recipe added successfully');
        } else {
          toast.success('Sticker added successfully');
        }
      }
    };
    reader.readAsDataURL(file);
  }, [addBook, activeShelfId, openModal, position, slotType]);
  
  const handleLottieFileDrop = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        try {
          // Check if it's a valid Lottie JSON
          const lottieData = JSON.parse(event.target.result);
          if (lottieData && (lottieData.v !== undefined || lottieData.animations)) {
            const newBookId = addBook({
              title: file.name.replace('.json', ''),
              author: 'Lottie Animation',
              coverURL: event.target.result,
              progress: 0,
              rating: 0,
              position,
              shelfId: activeShelfId,
              isSticker: true,
              isRecipe: false
            });
            
            if (newBookId) {
              toast.success('Lottie animation added successfully');
            }
          } else {
            toast.error('Invalid Lottie animation format');
          }
        } catch (e) {
          toast.error('Failed to parse JSON file');
        }
      }
    };
    reader.readAsText(file);
  }, [addBook, activeShelfId, position]);
  
  const handleFileDrop = useCallback((file: File) => {
    // Validate file type
    if (!validateFileType(file)) {
      let supportedTypes = acceptedFileTypes.length > 0 
        ? acceptedFileTypes.join(', ') 
        : (slotType === "book" || slotType === "recipe" ? 'image files' : 'image or JSON files');
      
      toast.error(`Only ${supportedTypes} are supported for ${slotType}s`);
      return;
    }
    
    // Pass to custom drop handler if provided
    if (onDrop) {
      onDrop(file);
      return;
    }
    
    // Default handling of dropped files
    if (file.type.startsWith('image/')) {
      handleImageFileDrop(file);
    } else if ((file.type === 'application/json' || file.name.endsWith('.json')) && slotType === "sticker") {
      handleLottieFileDrop(file);
    }
  }, [validateFileType, onDrop, slotType, acceptedFileTypes, handleImageFileDrop, handleLottieFileDrop]);
  
  return {
    handleFileDrop,
    validateFileType
  };
};

export default useFileDropHandler;
