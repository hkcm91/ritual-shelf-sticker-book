
import { useBookshelfStore } from '../store/bookshelfStore';

export const useBookInteractions = (bookId: string) => {
  const { openModal, setDraggedBook } = useBookshelfStore();
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('bookId', bookId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedBook(bookId);
  };
  
  const handleDragEnd = () => {
    setDraggedBook(null);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(bookId);
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleClick
  };
};
