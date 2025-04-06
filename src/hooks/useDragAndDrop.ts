
import { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';
import { useStickerDrag } from './useStickerDrag';

type UseDragAndDropProps = {
  position: number;
  setPosition2D: (value: { x: number, y: number }) => void;
  book: any;
  slotType?: "book" | "sticker";
};

export const useDragAndDrop = ({
  position,
  setPosition2D,
  book,
  slotType = "book"
}: UseDragAndDropProps) => {
  const { activeShelfId, updateBook, getDraggedBook, addBook, openModal } = useBookshelfStore();
  const [slotDimensions, setSlotDimensions] = useState({ width: 150, height: 220 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  
  // Use the sticker drag hook
  const { 
    isDragging, 
    setIsDragging,
    dragStart, 
    setDragStart,
    handleStickerMouseDown 
  } = useStickerDrag({
    position,
    book,
    initialPosition,
    setPosition2D,
    slotDimensions
  });
  
  // Update slot dimensions when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      // Use standard slot dimensions as a fallback
      const slot = document.querySelector(`.book-slot[data-position="${position}"]`);
      if (slot) {
        const { width, height } = slot.getBoundingClientRect();
        setSlotDimensions({ width, height });
      } else {
        setSlotDimensions({ width: 150, height: 220 });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [position]);
  
  // Update initial position when position2D changes
  useEffect(() => {
    if (!isDragging) {
      setInitialPosition(currentPosition => ({
        x: currentPosition.x,
        y: currentPosition.y
      }));
    }
  }, [isDragging]);
  
  // Helper function for sticker mouse move
  const handleStickerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // This is now handled in the useStickerDrag hook
  };
  
  // Helper function for sticker mouse up
  const handleStickerMouseUp = () => {
    // This is now handled in the useStickerDrag hook
  };
  
  // Handle drag over to allow drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handle drop to place a book into this slot
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const draggedBook = getDraggedBook();
    
    // First check if there are files being dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            const newBookId = addBook({
              title: '',
              author: '',
              coverURL: event.target.result,
              progress: 0,
              rating: 0,
              position,
              shelfId: activeShelfId,
              isSticker: slotType === "sticker"
            });
            
            if (slotType === "book") {
              openModal(newBookId);
            } else {
              toast.success('Sticker added successfully');
            }
          }
        };
        reader.readAsDataURL(file);
        return;
      } else if (file.type === 'application/json' && slotType === "sticker") {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            try {
              // Check if it's a valid Lottie JSON
              const lottieData = JSON.parse(event.target.result);
              if (lottieData && (lottieData.v !== undefined || lottieData.animations)) {
                const newBookId = addBook({
                  title: file.name.replace('.json', ''),
                  author: 'Lottie Animation',
                  coverURL: event.target.result,
                  progress: 0,
                  rating: 0,
                  position,
                  shelfId: activeShelfId,
                  isSticker: true
                });
                
                if (newBookId) {
                  toast.success('Lottie animation added successfully');
                }
              } else {
                toast.error('Invalid Lottie animation format');
              }
            } catch (e) {
              toast.error('Failed to parse JSON file');
            }
          }
        };
        reader.readAsText(file);
        return;
      } else if (slotType === "book" && !file.type.startsWith('image/')) {
        toast.error('Only image files are supported for books');
        return;
      } else if (slotType === "sticker" && !file.type.startsWith('image/') && file.type !== 'application/json') {
        toast.error('Only image or Lottie JSON files are supported for stickers');
        return;
      }
    }
    
    // If there's no file being dropped, check for book drag
    if (!draggedBook || book) return; // Only allow dropping onto empty slots
    
    // Update the draggedBook with the new position
    updateBook(draggedBook.id, {
      position: position,
      shelfId: activeShelfId
    });
    
    toast.success('Book moved successfully');
  };

  return {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDrop,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart
  };
};
