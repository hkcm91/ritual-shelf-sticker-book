
import { StateCreator } from 'zustand';
import { BookData } from '../types';
import { storageService } from '../../services/storage/storageService';
import { addBookAction, updateBookAction } from './bookActions';
import { saveBooksToStorage, needsCompression, findBookByPosition } from './bookUtils';

export interface BooksSlice {
  books: Record<string, BookData>;
  addBook: (bookData: Omit<BookData, 'id'>) => string;
  updateBook: (id: string, data: Partial<Omit<BookData, 'id'>>) => void;
  deleteBook: (id: string) => void;
  getBookByPosition: (position: number, shelfId?: string) => BookData | undefined;
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
      const result = addBookAction(bookData, get().books, get().findEmptyPosition);
      
      if (!result) return "";
      const { id, newBook } = result;
      
      // Determine if this is a book cover that needs compression
      const shouldCompress = needsCompression(bookData);
      
      set((state) => {
        const updatedBooks = {
          ...state.books,
          [id]: newBook
        };
        
        // Debug the stored book object
        console.log('Book being stored in state:', {
          id,
          title: newBook.title,
          isSticker: newBook.isSticker,
          hidden: newBook.hidden,
          hasCoverURL: !!newBook.coverURL,
          coverURLLength: newBook.coverURL ? newBook.coverURL.length : 0
        });
        
        // Save to storage with compression if needed
        saveBooksToStorage(updatedBooks, id, shouldCompress);
        
        return { books: updatedBooks };
      });
      
      // Final verification after state update
      const storedBook = get().books[id];
      console.log('Verification - Book in store after update:', {
        id,
        exists: !!storedBook,
        isSticker: storedBook ? storedBook.isSticker : 'unknown',
        hidden: storedBook ? storedBook.hidden : 'unknown',
        hasCoverURL: storedBook ? !!storedBook.coverURL : false,
        coverURLLength: storedBook && storedBook.coverURL ? storedBook.coverURL.length : 0
      });
      
      return id;
    },
    
    updateBook: (id, data) => {
      const updatedBook = updateBookAction(id, data, get().books);
      
      if (!updatedBook) return;
      
      set((state) => {
        const updatedBooks = {
          ...state.books,
          [id]: updatedBook
        };
        
        // Save to storage
        saveBooksToStorage(updatedBooks, id);
        
        return { books: updatedBooks };
      });
      
      // Verification after update
      const bookAfterUpdate = get().books[id];
      console.log('Verification - Book in store after update:', {
        id,
        exists: !!bookAfterUpdate,
        hasCoverURL: bookAfterUpdate ? !!bookAfterUpdate.coverURL : false,
        coverURLLength: bookAfterUpdate && bookAfterUpdate.coverURL ? bookAfterUpdate.coverURL.length : 0
      });
    },
    
    deleteBook: (id) => {
      set((state) => {
        const { [id]: removed, ...remaining } = state.books;
        
        // Save to storage
        saveBooksToStorage(remaining);
        
        return { books: remaining };
      });
    },

    getBookByPosition: (position: number, shelfId?: string) => {
      // Access the global state safely with proper typing
      const state = store.getState();
      const books = state.books;
      // Get activeShelfId from state
      const currentShelfId = shelfId || (state as any).activeShelfId;
      
      if (!currentShelfId) {
        console.warn('No shelf ID provided to getBookByPosition');
        return undefined;
      }
      
      return findBookByPosition(position, currentShelfId, books);
    }
  };
};
