import { useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { SlotType } from '@/store/types';

export interface UseDropValidationProps {
  allowedSlotTypes?: SlotType[];
}

const useDropValidation = ({ 
  allowedSlotTypes = ['book', 'sticker'] 
}: UseDropValidationProps = {}) => {
  const { books } = useBookshelfStore();

  // Check if an item can be dropped at a position
  const canDropAtPosition = useCallback((
    itemId: string, 
    position: number, 
    shelfId: string,
    allowSwap = true
  ) => {
    // Get the item being dragged
    const draggedItem = books[itemId];
    if (!draggedItem) return false;
    
    // Check if there's an item at the target position
    const existingItem = Object.values(books).find(
      book => book.position === position && book.shelfId === shelfId && !book.isSticker
    );
    
    // If position is empty, always allow drop
    if (!existingItem) return true;
    
    // Don't allow dropping on itself
    if (existingItem.id === itemId) return false;
    
    // If swapping is not allowed, only allow dropping on empty positions
    if (!allowSwap) return false;
    
    // Otherwise, allow swap
    return true;
  }, [books]);
  
  // Validate if a drop is allowed based on slot type
  const isDropAllowedByType = useCallback((
    itemId: string,
    targetSlotType: SlotType
  ) => {
    // Check if target slot type is allowed
    if (!allowedSlotTypes.includes(targetSlotType)) {
      return false;
    }
    
    // Get the item being dragged
    const draggedItem = books[itemId];
    if (!draggedItem) return false;
    
    // Simple validation based on item/slot compatibility
    // This could be expanded with more complex logic
    if (draggedItem.isSticker && targetSlotType !== 'sticker') {
      return false;
    }
    
    return true;
  }, [books, allowedSlotTypes]);
  
  return {
    canDropAtPosition,
    isDropAllowedByType
  };
};

export default useDropValidation;
