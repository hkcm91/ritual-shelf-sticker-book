
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { BookData } from './types';

export interface BooksSlice {
  books: Record<string, BookData>;
  addBook: (bookData: Omit<BookData, 'id'>) => string;
  updateBook: (id: string, data: Partial<Omit<BookData, 'id'>>) => void;
  deleteBook: (id: string) => void;
}

type BookshelfInitialState = {
  books: Record<string, BookData>;
  shelves: any;
  activeShelfId: string;
};

export const createBooksSlice: StateCreator<
  BooksSlice & { findEmptyPosition: (shelfId: string) => number },
  [],
  [],
  BooksSlice
> = (set, get, _) => {
  // Initialize with default or stored state
  const initialBooks = typeof window !== 'undefined' ?
    JSON.parse(localStorage.getItem('ritual-bookshelf-books') || '{}') : {};

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
      
      set((state) => {
        const updatedBooks = {
          ...state.books,
          [id]: { ...bookData, id, position }
        };
        
        // Save to localStorage
        localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
        
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
        
        // Save to localStorage
        localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
        
        return { books: updatedBooks };
      });
    },
    
    deleteBook: (id) => {
      set((state) => {
        const { [id]: removed, ...remaining } = state.books;
        
        // Save to localStorage
        localStorage.setItem('ritual-bookshelf-books', JSON.stringify(remaining));
        
        return { books: remaining };
      });
    }
  };
};
