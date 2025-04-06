import { useState, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';

type UseDragAndDropProps = {
  position: number;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  dragStart: { x: number, y: number };
  setDragStart: (value: { x: number, y: number }) => void;
  setPosition2D: (value: { x: number, y: number }) => void;
  book: any;
  slotType?: "book" | "sticker";
};

export const useDragAndDrop = ({
  position,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  setPosition2D,
  book,
  slotType = "book"
}: UseDragAndDropProps) => {
  const { activeShelfId, updateBook, getDraggedBook, addBook, openModal } = useBookshelfStore();
  const [slotDimensions, setSlotDimensions] = useState({ width: 150, height: 220 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  
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
  
  // Sticker drag management
  const handleStickerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!book?.isSticker) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    
    // Store the initial position for accurate movement calculation
    setInitialPosition(currentPosition => ({
      x: currentPosition.x,
      y: currentPosition.y
    }));
  };
  
  const handleStickerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !book?.isSticker) return;
    
    e.stopPropagation();
    
    // Calculate movement deltas
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Calculate new position
    const newX = initialPosition.x + deltaX;
    const newY = initialPosition.y + deltaY;
    
    // Calculate sticker's effective dimensions (with scale)
    const stickerScale = book.scale || 1;
    const stickerWidth = slotDimensions.width * 0.8 * stickerScale; // 80% of slot width
    const stickerHeight = slotDimensions.height * 0.8 * stickerScale; // 80% of slot height
    
    // Calculate boundaries to keep sticker visible within the slot
    const maxX = slotDimensions.width/2 - stickerWidth/4;
    const maxY = slotDimensions.height/2 - stickerHeight/4;
    const minX = -maxX;
    const minY = -maxY;
    
    // Clamp the position within boundaries
    const clampedX = Math.max(minX, Math.min(maxX, newX));
    const clampedY = Math.max(minY, Math.min(maxY, newY));
    
    setPosition2D({
      x: clampedX,
      y: clampedY
    });
  };
  
  const handleStickerMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // Save the position to local storage
      // This is handled by the useTransformControls hook
    }
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
  
  // Document-level event handlers for drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        // Calculate movement deltas
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        // Calculate new position
        const newX = initialPosition.x + deltaX;
        const newY = initialPosition.y + deltaY;
        
        // Calculate boundaries based on sticker and slot dimensions
        const stickerScale = book?.scale || 1;
        const stickerWidth = slotDimensions.width * 0.8 * stickerScale;
        const stickerHeight = slotDimensions.height * 0.8 * stickerScale;
        
        const maxX = slotDimensions.width/2 - stickerWidth/4;
        const maxY = slotDimensions.height/2 - stickerHeight/4;
        const minX = -maxX;
        const minY = -maxY;
        
        // Clamp the position within boundaries
        const clampedX = Math.max(minX, Math.min(maxX, newX));
        const clampedY = Math.max(minY, Math.min(maxY, newY));
        
        setPosition2D({
          x: clampedX,
          y: clampedY
        });
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, setPosition2D, setIsDragging, book, slotDimensions, initialPosition]);

  return {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDrop
  };
};
