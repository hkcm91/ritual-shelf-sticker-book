
import React, { useRef } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import Book from './Book';

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
    setDraggedBook 
  } = useBookshelfStore();
  
  // Find if there's a book in this position on the active shelf
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
        
        // Open modal to edit the new book's details
        openModal(newBookId);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Handle file drop
    if (e.dataTransfer.files.length > 0 && !book) {
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
            });
            
            openModal(newBookId);
          }
        };
        reader.readAsDataURL(file);
      }
      return;
    }
    
    // Handle book drop
    const draggedBook = getDraggedBook();
    if (draggedBook && !book) {
      const { updateBook } = useBookshelfStore.getState();
      updateBook(draggedBook.id, { position });
      setDraggedBook(null);
    }
  };
  
  return (
    <div 
      className={`book-slot ${!book ? 'empty' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {book ? (
        <Book data={book} />
      ) : (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      )}
    </div>
  );
};

export default BookSlot;
