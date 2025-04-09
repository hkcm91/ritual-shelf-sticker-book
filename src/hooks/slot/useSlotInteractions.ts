
import { useCallback } from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import { SlotType } from '@/store/types';

interface UseSlotInteractionsProps {
  position: number;
  slotType: SlotType;
  triggerFileInput: () => void;
}

const useSlotInteractions = ({
  position,
  slotType,
  triggerFileInput
}: UseSlotInteractionsProps) => {
  const { openModal } = useBookshelfStore();
  
  // Handle clicking on empty slot
  const handleClick = useCallback(() => {
    console.log(`[useSlotInteractions] handleClick called for slotType: ${slotType} at position ${position}`);
    
    if (slotType === 'book') {
      // For book slots, open the book modal with null ID to create a new book
      console.log(`[useSlotInteractions] Opening book modal`);
      openModal(null);
    } else if (slotType === 'recipe') {
      // Recipe slots are handled directly in EmptySlot component
      console.log(`[useSlotInteractions] Recipe slots are handled in EmptySlot`);
    } else if (slotType === 'sticker') {
      // For sticker slots, trigger the file input
      console.log(`[useSlotInteractions] Triggering file input for sticker`);
      triggerFileInput();
    } else {
      // For other types, trigger the file input
      console.log(`[useSlotInteractions] Triggering file input for ${slotType}`);
      triggerFileInput();
    }
  }, [slotType, position, openModal, triggerFileInput]);

  return {
    handleClick
  };
};

export default useSlotInteractions;
