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
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!book) {
      e.currentTarget.classList.add('bg-primary/10', 'border-primary');
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-primary/10', 'border-primary');
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    if (!book) {
      e.currentTarget.classList.add('bg-primary/10', 'border-primary');
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary/10', 'border-primary');
    
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
    
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData && !book) {
        const bookData = JSON.parse(jsonData);
        if (bookData.searchBook) {
          const newBookId = addBook({
            title: bookData.title || '',
            author: bookData.author || '',
            coverURL: bookData.coverURL || '',
            progress: 0,
            rating: 0,
            position,
            shelfId: activeShelfId,
          });
          
          toast.success(`"${bookData.title}" added to shelf!`);
          return;
        }
      }
    } catch (error) {
      console.error('Error processing drag data', error);
      toast.error('Failed to add book from search');
    }
    
    const draggedBook = getDraggedBook();
    if (draggedBook && !book) {
      const { updateBook } = useBookshelfStore.getState();
      updateBook(draggedBook.id, { position });
      setDraggedBook(null);
    }
  };
  
  return (
    <div 
      className={`book-slot relative h-[220px] w-[150px] mx-1 rounded-sm border-2 border-dashed 
        border-gray-300 transition-colors duration-200 ${!book ? 'empty hover:border-primary/50' : 'border-transparent'}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {book ? (
        <Book data={book} />
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="text-4xl">+</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-sm text-center text-primary font-medium pointer-events-none">
            <span>Drop book here</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </>
      )}
    </div>
  );
};

export default BookSlot;
