
import { useCallback } from 'react';
import { useBookshelfStore, BookData } from '../../store/bookshelfStore';
import useTransformControls from '../useTransformControls';
import useStickerDrag from '../useStickerDrag';

interface UseSlotStickerManagementProps {
  book?: BookData;
  position: number;
  activeShelfId: string;
  onBookDelete?: (bookId: string) => void;
  setShowDeleteDialog: (show: boolean) => void;
}

const useSlotStickerManagement = ({
  book,
  position,
  activeShelfId,
  onBookDelete,
  setShowDeleteDialog
}: UseSlotStickerManagementProps) => {
  const { deleteBook } = useBookshelfStore();

  // Handle sticker operations
  const handleDeleteSticker = useCallback(() => {
    if (book) {
      if (onBookDelete) {
        onBookDelete(book.id);
      } else {
        deleteBook(book.id);
        toast.success('Item deleted successfully');
      }
      setShowDeleteDialog(false);
    }
  }, [book, deleteBook, onBookDelete, setShowDeleteDialog]);

  // Setup transform controls for stickers
  const {
    scale, 
    position2D, 
    rotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    setPosition2D
  } = useTransformControls({
    activeShelfId,
    position,
    initialScale: 1,
    initialPosition: { x: 0, y: 0 },
    initialRotation: 0
  });

  // Setup sticker drag functionality
  const {
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    handleStickerMouseDown
  } = useStickerDrag({
    position,
    bookId: book?.id,
    initialPosition: position2D,
    setPosition2D
  });

  // Empty stub handlers for mouse events (actual implementation in useStickerDrag)
  const handleStickerMouseMove = useCallback((e: React.MouseEvent) => {
    // This is intentionally empty - implementation handled in useStickerDrag
  }, []);

  const handleStickerMouseUp = useCallback((e: React.MouseEvent) => {
    // This is intentionally empty - implementation handled in useStickerDrag
  }, []);

  return {
    handleDeleteSticker,
    scale,
    position2D,
    rotation,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    isAltDrag,
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp
  };
};

// Import toast at the top
import { toast } from 'sonner';

export default useSlotStickerManagement;
