
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
import { 
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { RotateCcw, RotateCw, RefreshCw, Trash2 } from "lucide-react";
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

  // Handle type toggle without triggering file input
  const handleTypeToggle = (value: string) => {
    if (value) {
      setSlotType(value as "book" | "sticker");
    }
  };

  // Special handler for the empty slot click, separate from toggle clicks
  const handleEmptySlotClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent other handlers from firing
    e.stopPropagation();
    
    if (!book) {
      handleClick();
    }
  };
  
  // Safe delete handler with error boundary
  const safeDeleteHandler = () => {
    try {
      handleDeleteSticker();
    } catch (error) {
      console.error("Error deleting sticker:", error);
      toast.error("Failed to delete the item. Please try again.");
      // Force close the delete dialog in case of error
      setShowDeleteDialog(false);
    }
  };

  // Render book content based on type
  const renderBookContent = () => {
    if (!book) return null;
    
    if (book.isSticker) {
      return (
        <ContextMenu>
          <ContextMenuTrigger>
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
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            <ContextMenuItem onClick={() => handleRotate('ccw')}>
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Rotate Left</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleRotate('cw')}>
              <RotateCw className="mr-2 h-4 w-4" />
              <span>Rotate Right</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleResetTransform}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Reset</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
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
        
        {/* Always show toggle group, whether slot is empty or filled */}
        <div className="absolute bottom-1 left-0 right-0 z-10 flex justify-center"
            onClick={(e) => e.stopPropagation()}>
          <ToggleGroup 
            type="single" 
            value={slotType} 
            onValueChange={handleTypeToggle}
            className="flex space-x-1 pointer-events-auto"
          >
            <ToggleGroupItem 
              value="book" 
              aria-label="Book Slot" 
              className="slot-toggle-dot"
            >
              <span className="sr-only">Book</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="sticker" 
              aria-label="Sticker Slot" 
              className="slot-toggle-dot"
            >
              <span className="sr-only">Sticker</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={safeDeleteHandler}
        title="Delete Item?"
        description="This action cannot be undone."
      />
    </>
  );
};

export default BookSlot;
