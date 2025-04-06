
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
    setDraggedBook 
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
  
  return (
    <div 
      className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm border-2 border-dashed 
        border-gray-300 transition-colors duration-200 ${!book ? 'empty hover:border-primary/50 cursor-pointer' : 'border-transparent'}`}
      onClick={handleClick}
    >
      {book ? (
        <Book data={book} />
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="text-4xl">+</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 text-sm text-center text-primary font-medium">
            <span>Click to add book</span>
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
