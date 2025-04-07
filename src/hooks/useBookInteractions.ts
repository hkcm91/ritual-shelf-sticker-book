
import { useBookshelfStore } from '../store/bookshelfStore';

export const useBookInteractions = (bookId: string) => {
  const { openModal, setDraggedBook } = useBookshelfStore();
  
  const handleDragStart = (e: React.DragEvent) => {
    console.log("Drag started for book:", bookId);
    e.dataTransfer.setData('bookId', bookId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedBook(bookId);
  };
  
  const handleDragEnd = () => {
    console.log("Drag ended for book:", bookId);
    setDraggedBook(null);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    console.log("Book clicked:", bookId);
    e.stopPropagation();
    openModal(bookId);
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleClick
  };
};
