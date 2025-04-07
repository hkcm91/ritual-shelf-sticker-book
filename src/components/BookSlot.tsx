
import React, { useState } from 'react';
import DeleteDialog from './DeleteDialog';
import EmptySlot from './EmptySlot';
import { useBookSlot } from '../hooks/useBookSlot';
import SlotTypeToggle from './SlotTypeToggle';
import { BookContent, SlotContainer } from './bookslot';

type BookSlotProps = {
  position: number;
};

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
  const [slotType, setSlotType] = useState<"book" | "sticker">("book");
  
  const {
    book,
    fileInputRef,
    scale,
    position2D,
    rotation,
    showDeleteDialog,
    setShowDeleteDialog,
    handleFileChange,
    handleClick,
    handleDragOver,
    handleDrop,
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    handleDeleteSticker,
    isAltDrag
  } = useBookSlot({ position, slotType });

  // Handle type toggle without triggering file input
  const handleTypeToggle = (value: string) => {
    if (value) {
      setSlotType(value as "book" | "sticker");
    }
  };

  // Special handler for the empty slot click
  const handleEmptySlotClick = () => {
    if (!book) {
      handleClick();
    }
  };
  
  return (
    <>
      <SlotContainer
        position={position}
        hasBook={!!book}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleMouseMove={handleStickerMouseMove}
        handleMouseUp={handleStickerMouseUp}
      >
        {/* Render book content or empty slot */}
        {book ? (
          <BookContent
            book={book}
            scale={scale}
            position2D={position2D}
            rotation={rotation}
            handleStickerMouseDown={handleStickerMouseDown}
            handleRotate={handleRotate}
            handleResetTransform={handleResetTransform}
            handleScaleChange={handleScaleChange}
            setShowDeleteDialog={setShowDeleteDialog}
            isAltDrag={isAltDrag}
          />
        ) : (
          <EmptySlot 
            fileInputRef={fileInputRef} 
            onFileSelect={handleFileChange} 
            slotType={slotType}
            onClick={handleEmptySlotClick}
            position={position}
          />
        )}
        
        {/* Always show toggle group when slot is empty */}
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
};

export default BookSlot;
