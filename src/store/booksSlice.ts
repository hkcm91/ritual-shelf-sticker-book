
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { BookData } from './types';
import { storageService } from '../services/storage/storageService';

export interface BooksSlice {
  books: Record<string, BookData>;
  addBook: (bookData: Omit<BookData, 'id'>) => string;
  updateBook: (id: string, data: Partial<Omit<BookData, 'id'>>) => void;
  deleteBook: (id: string) => void;
}

export const createBooksSlice: StateCreator<
  BooksSlice & { findEmptyPosition: (shelfId: string) => number },
  [],
  [],
  BooksSlice
> = (set, get, store) => {
  // Initialize with default or stored state
  const initialBooks = storageService.getItem<Record<string, BookData>>('books') || {};

  return {
    books: initialBooks,
    
    addBook: (bookData) => {
      const id = uuidv4();
      const { findEmptyPosition } = get();
      
      // If position is -1, find an empty slot
      const position = bookData.position === -1 ? 
        findEmptyPosition(bookData.shelfId) : 
        bookData.position;
      
      if (position === -1) {
        // No empty slots found
        toast.error("No empty slots on this shelf!");
        return "";
      }
      
      // Determine if this is a book cover that needs compression
      const needsCompression = !bookData.isSticker && 
        !bookData.isRecipe && 
        typeof bookData.coverURL === 'string' && 
        bookData.coverURL.startsWith('data:image/');
      
      set((state) => {
        const updatedBooks = {
          ...state.books,
          [id]: { ...bookData, id, position }
        };
        
        // Try to save to storage with compression for book covers
        storageService.setItem('books', updatedBooks, {
          compress: needsCompression,
          quality: 0.7,
          maxWidth: 600,
          maxHeight: 900
        }).then(success => {
          if (!success) {
            // Storage error, but we'll keep the state update so user can see their book
            setTimeout(() => {
              toast.warning("Storage is getting full. Your book was added but may not be saved permanently. Consider removing unused items.");
            }, 100);
          }
        });
        
        return { books: updatedBooks };
      });
      return id;
    },
    
    updateBook: (id, data) => {
      set((state) => {
        const updatedBooks = {
          ...state.books,
          [id]: { ...state.books[id], ...data }
        };
        
        // Save to storage
        storageService.setItem('books', updatedBooks).then(success => {
          if (!success) {
            setTimeout(() => {
              toast.warning("Failed to save all changes. Your storage may be full.");
            }, 100);
          }
        });
        
        return { books: updatedBooks };
      });
    },
    
    deleteBook: (id) => {
      set((state) => {
        const { [id]: removed, ...remaining } = state.books;
        
        // Save to storage
        storageService.setItem('books', remaining);
        
        return { books: remaining };
      });
    }
  };
};
