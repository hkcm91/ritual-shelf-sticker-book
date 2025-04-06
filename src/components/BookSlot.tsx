
import React, { useState } from 'react';
import Book from './Book';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import SlotControls from './SlotControls';
import DeleteDialog from './DeleteDialog';
import StickerContent from './StickerContent';
import EmptySlot from './EmptySlot';
import { useBookSlot } from '../hooks/useBookSlot';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BookOpen, Sticker } from "lucide-react";

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

  // Special handler for the empty slot click, separate from toggle clicks
  const handleEmptySlotClick = () => {
    if (!book) {
      handleClick();
    }
  };

  // Render book content based on type
  const renderBookContent = () => {
    if (!book) return null;
    
    if (book.isSticker) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <StickerContent 
              book={book}
              scale={scale}
              position2D={position2D}
              rotation={rotation}
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
      );
    } else {
      return <Book data={book} />;
    }
  };
  
  return (
    <>
      <div 
        className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm
          ${!book ? 'hover:bg-gray-50/10' : 'hover:border hover:border-primary/30'}
          transition-colors duration-200 cursor-pointer`}
        data-position={position} // Add data attribute for position
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleStickerMouseMove}
        onMouseUp={handleStickerMouseUp}
      >
        {!book && (
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-center py-1"
               onClick={(e) => e.stopPropagation()}>
            <ToggleGroup 
              type="single" 
              value={slotType} 
              onValueChange={handleTypeToggle}
              className="pointer-events-auto"
            >
              <ToggleGroupItem value="book" aria-label="Book Slot" className="h-6 w-6 p-0">
                <BookOpen className="h-3 w-3" />
              </ToggleGroupItem>
              <ToggleGroupItem value="sticker" aria-label="Sticker Slot" className="h-6 w-6 p-0">
                <Sticker className="h-3 w-3" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
        
        {book ? (
          renderBookContent()
        ) : (
          <EmptySlot 
            fileInputRef={fileInputRef} 
            onFileSelect={handleFileChange} 
            slotType={slotType}
            onClick={handleEmptySlotClick}
          />
        )}
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
