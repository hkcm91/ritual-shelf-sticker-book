
import { useState, useEffect, useCallback } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { toast } from 'sonner';
import { useStickerDrag } from './useStickerDrag';

export interface UseDragAndDropProps {
  position: number;
  setPosition2D: (value: { x: number, y: number }) => void;
  book: any;
  slotType?: "book" | "sticker";
  onDrop?: (file: File) => void;
  onBookDrop?: (bookId: string, position: number) => void;
  acceptedFileTypes?: string[];
}

export interface DragAndDropResult {
  handleStickerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleStickerMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleStickerMouseUp: () => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  dragStart: { x: number, y: number };
  setDragStart: (value: { x: number, y: number }) => void;
  isAltDrag?: boolean;
}

export const useDragAndDrop = ({
  position,
  setPosition2D,
  book,
  slotType = "book",
  onDrop,
  onBookDrop,
  acceptedFileTypes = []
}: UseDragAndDropProps): DragAndDropResult => {
  const { activeShelfId, updateBook, getDraggedBook, addBook, openModal } = useBookshelfStore();
  const [slotDimensions, setSlotDimensions] = useState({ width: 150, height: 220 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  
  // Use the sticker drag hook
  const { 
    isDragging, 
    setIsDragging,
    dragStart, 
    setDragStart,
    handleStickerMouseDown,
    isAltDrag 
  } = useStickerDrag({
    position,
    bookId: book?.id,
    initialPosition,
    setPosition2D,
    defaultContainerSize: slotDimensions
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
  const handleStickerMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // This is now handled in the useStickerDrag hook
  }, []);
  
  // Helper function for sticker mouse up
  const handleStickerMouseUp = useCallback(() => {
    // This is now handled in the useStickerDrag hook
  }, []);
  
  // Validate file types
  const validateFileType = useCallback((file: File): boolean => {
    // No restrictions
    if (acceptedFileTypes.length === 0) {
      if (slotType === "book") {
        return file.type.startsWith('image/');
      } else if (slotType === "sticker") {
        return file.type.startsWith('image/') || 
               file.type === 'application/json' || 
               file.name.endsWith('.json');
      }
      return true;
    }
    
    // Custom validation
    return acceptedFileTypes.some(type => {
      if (type.includes('*')) {
        const prefix = type.split('/')[0];
        return file.type.startsWith(`${prefix}/`);
      }
      return file.type === type || (type === '.json' && file.name.endsWith('.json'));
    });
  }, [acceptedFileTypes, slotType]);
  
  // Handle drag over to allow drop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle drop to place a book into this slot
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const draggedBook = getDraggedBook();
    
    // First check if there are files being dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      if (!validateFileType(file)) {
        let supportedTypes = acceptedFileTypes.length > 0 
          ? acceptedFileTypes.join(', ') 
          : (slotType === "book" ? 'image files' : 'image or JSON files');
        
        toast.error(`Only ${supportedTypes} are supported for ${slotType}s`);
        return;
      }
      
      // Pass to custom drop handler if provided
      if (onDrop) {
        onDrop(file);
        return;
      }
      
      // Default handling of dropped files
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
      }
    }
    
    // If there's no file being dropped, check for book drag
    if (!draggedBook || book) return; // Only allow dropping onto empty slots
    
    // Custom book drop handler
    if (onBookDrop) {
      onBookDrop(draggedBook.id, position);
      return;
    }
    
    // Default handling of dropped books
    updateBook(draggedBook.id, {
      position: position,
      shelfId: activeShelfId
    });
    
    toast.success('Book moved successfully');
  }, [
    getDraggedBook, 
    book, 
    validateFileType, 
    onDrop, 
    onBookDrop, 
    slotType, 
    addBook, 
    position, 
    activeShelfId, 
    openModal, 
    updateBook,
    acceptedFileTypes
  ]);

  return {
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDrop,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag
  };
};

export default useDragAndDrop;
