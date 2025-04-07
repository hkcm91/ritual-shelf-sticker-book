
import { useState, useRef, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { useDragAndDrop } from './useDragAndDrop';
import { useFileHandler } from './useFileHandler';
import { useTransformControls } from './useTransformControls';
import { BookData } from '../store/bookshelfStore';

type UseBookSlotProps = {
  position: number;
  slotType: "book" | "sticker";
};

export const useBookSlot = ({ position, slotType }: UseBookSlotProps) => {
  const { activeShelfId, getBookByPosition, deleteBook } = useBookshelfStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAltDrag, setIsAltDrag] = useState(false);
  
  // Log hook initialization
  useEffect(() => {
    console.log(`useBookSlot initialized for position ${position}, slotType: ${slotType}`);
    console.log(`Current activeShelfId: ${activeShelfId}`);
  }, [position, slotType, activeShelfId]);
  
  // Get book from store by position, explicitly passing the activeShelfId
  const book = getBookByPosition(position, activeShelfId);
  
  // Log for debugging
  useEffect(() => {
    console.log(`Slot ${position}: Book present: ${!!book}`, book ? `ID: ${book.id}` : '');
    if (book) {
      console.log(`Book details for slot ${position}:`, {
        id: book.id,
        title: book.title || 'No title',
        author: book.author || 'No author',
        hasCoverURL: !!book.coverURL,
        coverURLLength: book.coverURL ? book.coverURL.length : 0,
        coverURLValue: book.coverURL,
        isSticker: !!book.isSticker
      });
    }
  }, [book, position]);
  
  // For stickers, keep track of 2D position, scale, rotation
  const [position2D, setPosition2D] = useState({ x: 0, y: 0 });
  const { scale, rotation, handleScaleChange, handleRotate, handleResetTransform } = useTransformControls({ 
    activeShelfId, // Pass the required activeShelfId argument here
    position 
  });
  
  // Handle file input for empty slots
  const { fileInputRef, handleFileChange, handleClick } = useFileHandler({ position, slotType });
  
  // For drag and drop functionality
  const { 
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDrop,
    isDragging,
    setIsDragging,
  } = useDragAndDrop({
    position,
    setPosition2D,
    book: book as BookData,
    slotType
  });
  
  // Alt key detection for special drag operations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltDrag(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltDrag(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Handler for deleting a book or sticker
  const handleDeleteSticker = () => {
    if (book) {
      console.log(`Deleting book/sticker with ID: ${book.id}`);
      deleteBook(book.id);
      setShowDeleteDialog(false);
    }
  };
  
  return {
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
  };
};
