
import React, { useState, useEffect } from 'react';
import DeleteDialog from './DeleteDialog';
import EmptySlot from './EmptySlot';
import { useBookSlot } from '../hooks/useBookSlot';
import SlotTypeToggle from './SlotTypeToggle';
import { BookContent, SlotContainer } from './bookslot';
import { toast } from 'sonner';

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

  // Log slot rendering info
  useEffect(() => {
    console.log(`BookSlot ${position} rendering. Has book:`, !!book);
    if (book) {
      console.log(`BookSlot ${position} book data:`, {
        id: book.id,
        title: book.title,
        isSticker: book.isSticker,
        hasCoverURL: !!book.coverURL
      });
    }
  }, [position, book]);

  // Handle type toggle without triggering file input
  const handleTypeToggle = (value: string) => {
    if (value) {
      setSlotType(value as "book" | "sticker");
      console.log(`Slot ${position} type changed to:`, value);
    }
  };

  // Special handler for the empty slot click
  const handleEmptySlotClick = () => {
    if (!book) {
      console.log(`Empty slot ${position} clicked`);
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
        {/* Debugging log */}
        {console.log(`Slot ${position} rendering content ${book ? 'BookContent' : 'EmptySlot'}`)}
        
        {/* Render book content or empty slot */}
        {book ? (
          <div className="w-full h-full" style={{ display: 'block' }}>
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
          </div>
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
        {!book && (
          <SlotTypeToggle 
            slotType={slotType} 
            handleTypeToggle={handleTypeToggle}
            isVisible={true} 
          />
        )}
      </SlotContainer>
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          handleDeleteSticker();
          toast.success("Item deleted successfully");
        }}
        title="Delete Item?"
        description="This action cannot be undone."
      />
    </>
  );
};

export default BookSlot;
