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
  
  // Update slot dimensions when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      // Standard slot dimensions, could be made dynamic
      setSlotDimensions({ width: 150, height: 220 });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Sticker drag management
  const handleStickerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!book?.isSticker) return;
    
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleStickerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !book?.isSticker) return;
    
    e.stopPropagation();
    // Calculate new position with expanded boundaries to allow full slot movement
    const stickerWidth = book.width || slotDimensions.width / 2; // Estimated width
    const stickerHeight = book.height || slotDimensions.height / 2; // Estimated height
    
    // Calculate maximum boundaries to keep sticker fully visible
    const maxX = slotDimensions.width / 2 - stickerWidth / 2;
    const maxY = slotDimensions.height / 2 - stickerHeight / 2;
    
    // Calculate new position with boundary constraints
    const newX = Math.max(-maxX, Math.min(maxX, e.clientX - dragStart.x));
    const newY = Math.max(-maxY, Math.min(maxY, e.clientY - dragStart.y));
    
    setPosition2D({
      x: newX,
      y: newY
    });
  };
  
  const handleStickerMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
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
        // Calculate maximum boundaries to keep sticker fully visible
        const stickerWidth = book?.width || slotDimensions.width / 2;
        const stickerHeight = book?.height || slotDimensions.height / 2;
        
        const maxX = slotDimensions.width / 2 - stickerWidth / 2;
        const maxY = slotDimensions.height / 2 - stickerHeight / 2;
        
        // Calculate new position with boundary constraints
        const newX = Math.max(-maxX, Math.min(maxX, e.clientX - dragStart.x));
        const newY = Math.max(-maxY, Math.min(maxY, e.clientY - dragStart.y));
        
        setPosition2D({
          x: newX,
          y: newY
        });
        
        // Update drag start for next movement calculation
        setDragStart({
          x: e.clientX,
          y: e.clientY
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
  }, [isDragging, dragStart, setPosition2D, setIsDragging, book, slotDimensions]);

  return {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDrop
  };
};
