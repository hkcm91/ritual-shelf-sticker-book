import { useState, useEffect } from 'react';
import { SlotType } from '@/store/types';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { getDefaultSlotType, isSlotCompatibleWithLibrary } from '@/utils/slotCompatibility';

export const useSlotType = () => {
  const { activeShelfId, shelves } = useBookshelfStore();
  const [slotType, setSlotType] = useState<SlotType>("book");
  
  // Get current library type
  const libraryType = activeShelfId && shelves[activeShelfId] ? 
    shelves[activeShelfId].type || 'book' : 
    'book';
    
  // Update slot type when library type changes
  useEffect(() => {
    // If current slot type is not compatible with library, reset to default
    if (!isSlotCompatibleWithLibrary(slotType, libraryType)) {
      setSlotType(getDefaultSlotType(libraryType));
    }
  }, [libraryType, slotType]);

  // Handle type toggle without triggering file input
  const handleTypeToggle = (value: string) => {
    // For now, only allow book and sticker to keep current UI
    if (value === 'book' || value === 'sticker') {
      setSlotType(value as SlotType);
    }
  };

  return {
    slotType,
    setSlotType,
    handleTypeToggle,
    libraryType
  };
};

export default useSlotType;
