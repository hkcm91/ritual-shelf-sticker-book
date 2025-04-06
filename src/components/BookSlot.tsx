
import React from 'react';
import Book from './Book';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import SlotControls from './SlotControls';
import DeleteDialog from './DeleteDialog';
import StickerContent from './StickerContent';
import EmptySlot from './EmptySlot';
import { useBookSlot } from '../hooks/useBookSlot';

type BookSlotProps = {
  position: number;
};

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
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
    handleDeleteSticker
  } = useBookSlot({ position });

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
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleStickerMouseMove}
        onMouseUp={handleStickerMouseUp}
      >
        {book ? (
          renderBookContent()
        ) : (
          <EmptySlot fileInputRef={fileInputRef} />
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
