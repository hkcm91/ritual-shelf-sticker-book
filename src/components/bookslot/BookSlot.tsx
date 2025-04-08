
import React from 'react';
import Book from '../Book';
import DeleteDialog from '../DeleteDialog';
import EmptySlot from '../EmptySlot';
import SlotTypeToggle from '../SlotTypeToggle';
import { useBookSlot } from '../../hooks/useBookSlot';
import { useBookshelfStore } from '@/store/bookshelfStore';
import StickerSlotContent from './StickerSlotContent';
import SlotContainer from './SlotContainer';
import useSlotType from './useSlotType';

type BookSlotProps = {
  position: number;
};

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
  const { activeTheme } = useBookshelfStore();
  const { slotType, handleTypeToggle } = useSlotType();
  
  // Use the book slot hook with all its properties
  const {
    // Core slot properties
    book,
    showDeleteDialog,
    setShowDeleteDialog,
    handleClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDeleteSticker,
    isDragOver,
    
    // File handling
    fileInputRef,
    handleFileChange,
    
    // Transform controls
    scale,
    position2D,
    rotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    
    // Sticker drag
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp
  } = useBookSlot({ 
    position, 
    slotType,
    onFileSelect: (file) => {
      console.log("[BookSlot] File selected:", file.name);
      // File handler logic here if needed
    }
  });

  // Special handler for the empty slot click, separate from toggle clicks
  const handleEmptySlotClick = () => {
    if (!book) {
      handleClick();
    }
  };
  
  // Check if we should use realistic styling
  const useRealisticStyle = activeTheme === 'default' || activeTheme === 'custom';
  
  return (
    <>
      <SlotContainer
        position={position}
        slotType={slotType}
        isDragOver={isDragOver}
        useRealisticStyle={useRealisticStyle}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
      >
        {renderSlotContent()}
        
        {/* Only show toggle group when slot is empty */}
        <SlotTypeToggle 
          slotType={slotType} 
          handleTypeToggle={handleTypeToggle}
          isVisible={!book} 
        />
      </SlotContainer>
      
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

  // Helper function to render the appropriate content for the slot
  function renderSlotContent() {
    if (!book) {
      return (
        <EmptySlot 
          fileInputRef={fileInputRef} 
          onFileSelect={handleFileChange} 
          slotType={slotType}
          onClick={handleEmptySlotClick}
          position={position}
        />
      );
    }
    
    return book.isSticker ? (
      <StickerSlotContent
        book={book}
        scale={scale}
        position2D={position2D}
        rotation={rotation}
        isAltDrag={isAltDrag}
        handleStickerMouseDown={handleStickerMouseDown}
        handleRotate={handleRotate}
        handleScaleChange={handleScaleChange}
        handleResetTransform={handleResetTransform}
        setShowDeleteDialog={setShowDeleteDialog}
      />
    ) : (
      <Book data={book} />
    );
  }
};

export default BookSlot;
