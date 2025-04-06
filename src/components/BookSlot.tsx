
import React, { useRef } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import Book from './Book';
import { toast } from 'sonner';

type BookSlotProps = {
  position: number;
};

const BookSlot: React.FC<BookSlotProps> = ({ position }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    books, 
    activeShelfId, 
    addBook, 
    openModal, 
    getDraggedBook, 
    setDraggedBook,
    updateBook
  } = useBookshelfStore();
  
  const book = Object.values(books).find(
    (book) => book.shelfId === activeShelfId && book.position === position
  );
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
        });
        
        openModal(newBookId);
      }
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClick = () => {
    if (!book) {
      fileInputRef.current?.click();
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
    
    if (!draggedBook || book) return; // Only allow dropping onto empty slots
    
    // Update the draggedBook with the new position
    updateBook(draggedBook.id, {
      position: position,
      shelfId: activeShelfId
    });
    
    toast.success('Book moved successfully');
  };
  
  return (
    <div 
      className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm 
        ${!book ? 'hover:border border-dashed border-gray-300/40 hover:bg-gray-50/10' : ''}
        transition-colors duration-200 cursor-pointer`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {book ? (
        <Book data={book} />
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl text-gray-300/20">+</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};

export default BookSlot;
