
import React, { useState } from 'react';
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

type BookSlotProps = {
  position: number;
};

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
  const [slotType, setSlotType] = useState<"book" | "sticker">("book");
  const { activeTheme, updateBook } = useBookshelfStore();
  
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
  
  // Handling z-index changes
  const handleZIndexChange = (direction: 'up' | 'down') => {
    if (!book) return;
    
    const currentZIndex = book.zIndex || 1;
    const newZIndex = direction === 'up' ? currentZIndex + 1 : Math.max(1, currentZIndex - 1);
    
    updateBook(book.id, {
      ...book,
      zIndex: newZIndex
    });
  };
  
  // Check if we should use realistic styling
  const useRealisticStyle = activeTheme === 'default' || activeTheme === 'custom';
  
  // Render book content based on type
  const renderBookContent = () => {
    if (!book) return null;
    
    if (book.isSticker) {
      return (
        <ContextMenuWrapper
          book={book}
          handleRotate={handleRotate}
          handleResetTransform={handleResetTransform}
          setShowDeleteDialog={setShowDeleteDialog}
          handleZIndexChange={handleZIndexChange}
        >
          <Popover>
            <PopoverTrigger asChild>
              <StickerContent 
                book={book}
                scale={scale}
                position2D={position2D}
                rotation={rotation}
                zIndex={book.zIndex || 1}
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
              zIndex={book.zIndex || 1}
              onZIndexChange={handleZIndexChange}
              isLottie={typeof book.coverURL === 'string' && book.coverURL.startsWith('{')}
            />
          </Popover>
        </ContextMenuWrapper>
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
          ${useRealisticStyle ? 'realistic-book-slot' : ''}
          transition-colors duration-200 cursor-pointer`}
        data-position={position}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleStickerMouseMove}
        onMouseUp={handleStickerMouseUp}
        style={{
          boxShadow: useRealisticStyle && !book ? 'inset 0 0 20px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {book ? (
          renderBookContent()
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
