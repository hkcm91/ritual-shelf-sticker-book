import React, { useState, useEffect, useRef } from 'react';
import Book from './Book';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import SlotControls from './SlotControls';
import DeleteDialog from './DeleteDialog';
import StickerContent from './StickerContent';
import EmptySlot from './EmptySlot';
import { useBookSlot } from '../hooks/useBookSlot';
import SlotTypeToggle from './SlotTypeToggle';
import ContextMenuWrapper from './ContextMenuWrapper';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { SlotType } from '@/store/types';
import { getDefaultSlotType, isSlotCompatibleWithLibrary } from '@/utils/slotCompatibility';
import useTransformControls from '@/hooks/useTransformControls';
import useStickerDrag from '@/hooks/useStickerDrag';

type BookSlotProps = {
  position: number;
};

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
  const { activeShelfId, shelves, activeTheme } = useBookshelfStore();
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
  
  // Use the book slot hook for basic slot functionality
  const {
    book,
    showDeleteDialog,
    setShowDeleteDialog,
    handleClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDeleteSticker,
    isDragOver,
    fileInputRef,
    handleFileChange
  } = useBookSlot({ 
    position, 
    slotType,
    onFileSelect: (file) => {
      console.log("[BookSlot] File selected:", file.name);
      // File handler logic here if needed
    }
  });

  // Use transform controls hook for sticker manipulation (only if needed)
  const {
    scale, 
    position2D, 
    rotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    setPosition2D
  } = useTransformControls({
    activeShelfId,
    position,
    initialScale: 1,
    initialPosition: { x: 0, y: 0 },
    initialRotation: 0
  });

  // Use sticker drag hook for sticker manipulation (only if needed)
  const {
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    handleStickerMouseDown
  } = useStickerDrag({
    position,
    bookId: book?.id,
    initialPosition: position2D,
    setPosition2D
  });

  // Handler for sticker mouse events that we need to pass to the component
  const handleStickerMouseMove = (e: React.MouseEvent) => {
    // This is intentionally left empty - the actual implementation is in the useStickerDrag hook
    // We're providing this as a pass-through for the component API
  };

  const handleStickerMouseUp = (e: React.MouseEvent) => {
    // This is intentionally left empty - the actual implementation is in the useStickerDrag hook
    // We're providing this as a pass-through for the component API
  };

  // Handle type toggle without triggering file input
  const handleTypeToggle = (value: string) => {
    // For now, only allow book and sticker to keep current UI
    if (value === 'book' || value === 'sticker') {
      setSlotType(value as SlotType);
    }
  };

  // Special handler for the empty slot click, separate from toggle clicks
  const handleEmptySlotClick = () => {
    if (!book) {
      handleClick();
    }
  };
  
  // Check if we should use realistic styling
  const useRealisticStyle = activeTheme === 'default' || activeTheme === 'custom';
  
  console.log("[BookSlot] Rendering slot at position:", position, "with book:", book?.id || "none");
  
  return (
    <>
      <div 
        className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm
          ${!book ? 'empty hover:bg-gray-50/10' : 'hover:border hover:border-primary/30'}
          ${isDragOver ? 'drag-over' : ''}
          ${useRealisticStyle ? 'realistic-book-slot' : ''}
          transition-colors duration-200 cursor-pointer`}
        data-position={position}
        data-slot-type={slotType}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          boxShadow: useRealisticStyle && !book ? 'inset 0 0 20px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {book ? (
          book.isSticker ? (
            <ContextMenuWrapper
              book={book}
              handleRotate={handleRotate}
              handleResetTransform={handleResetTransform}
              setShowDeleteDialog={setShowDeleteDialog}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <StickerContent 
                    book={book}
                    scale={scale}
                    position2D={position2D}
                    rotation={rotation}
                    zIndex={10}
                    handleStickerMouseDown={handleStickerMouseDown}
                    isAltDrag={isAltDrag}
                  />
                </PopoverTrigger>
                <SlotControls 
                  scale={scale}
                  onScaleChange={handleScaleChange}
                  onRotate={handleRotate}
                  onResetTransform={handleResetTransform}
                  onShowDeleteDialog={() => setShowDeleteDialog(true)}
                  isLottie={typeof book.coverURL === 'string' && book.coverURL.startsWith('{')}
                />
              </Popover>
            </ContextMenuWrapper>
          ) : (
            <Book data={book} />
          )
        ) : (
          <EmptySlot 
            fileInputRef={fileInputRef} 
            onFileSelect={handleFileChange} 
            slotType={slotType}
            onClick={handleEmptySlotClick}
            position={position}
          />
        )}
        
        {/* Only show toggle group when slot is empty */}
        <SlotTypeToggle 
          slotType={slotType} 
          handleTypeToggle={handleTypeToggle}
          isVisible={!book} 
        />
      </div>
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSticker}
        title="Delete Item?"
        description="This action cannot be undone."
      />
    </>
  );
};

export default BookSlot;
