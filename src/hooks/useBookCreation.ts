
import { useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';

export interface UseBookCreationProps {
  position: number;
}

export const useBookCreation = ({ position }: UseBookCreationProps) => {
  const { activeShelfId, addBook, openModal } = useBookshelfStore();
  
  const createBookOrSticker = useCallback((
    fileContent: string,
    fileName: string,
    isSticker: boolean,
    isRecipe: boolean = false
  ) => {
    const newBookId = addBook({
      title: isSticker || isRecipe ? fileName.replace(/\.[^/.]+$/, "") : '',
      author: isSticker ? 'Sticker' : isRecipe ? 'Recipe' : '',
      coverURL: fileContent,
      progress: 0,
      rating: 0,
      position,
      shelfId: activeShelfId,
      isSticker,
      isRecipe
    });
    
    if (newBookId) {
      if (isSticker) {
        toast.success('Sticker added successfully');
      } else if (isRecipe) {
        toast.success('Recipe added successfully');
      } else {
        // Open modal for book editing
        openModal(newBookId);
      }
      return newBookId;
    } else {
      toast.error(`Failed to add ${isRecipe ? 'recipe' : isSticker ? 'sticker' : 'book'}`);
      return null;
    }
  }, [addBook, activeShelfId, openModal, position]);

  return {
    createBookOrSticker
  };
};

export default useBookCreation;
