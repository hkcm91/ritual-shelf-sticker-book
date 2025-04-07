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
      // Log the input book data
      console.log('Zustand addBook action received:', {
        ...bookData,
        coverURL: bookData.coverURL ? `${bookData.coverURL.substring(0, 100)}... (length: ${bookData.coverURL.length})` : 'missing'
      });
      
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
      
      // Create the new book object with ID
      const newBook = { ...bookData, id, position };
      console.log('New book object created:', {
        id,
        position,
        hasCoverURL: !!newBook.coverURL,
        coverURLLength: newBook.coverURL ? newBook.coverURL.length : 0,
        coverURLSample: newBook.coverURL ? `${newBook.coverURL.substring(0, 100)}...` : 'undefined'
      });
      
      // Determine if this is a book cover that needs compression
      const needsCompression = !bookData.isSticker && 
        typeof bookData.coverURL === 'string' && 
        bookData.coverURL.startsWith('data:image/');
      
      set((state) => {
        const updatedBooks = {
          ...state.books,
          [id]: newBook
        };
        
        // Debug the stored book object
        console.log('Book being stored in state:', {
          id,
          title: newBook.title,
          hasCoverURL: !!newBook.coverURL,
          coverURLLength: newBook.coverURL ? newBook.coverURL.length : 0
        });
        
        // Try to save to storage with compression for book covers
        storageService.setItem('books', updatedBooks, {
          compress: needsCompression,
          quality: 0.7,
          maxWidth: 600,
          maxHeight: 900
        }).then(success => {
          if (success) {
            console.log(`Book ${id} successfully saved to storage`);
          } else {
            // Storage error, but we'll keep the state update so user can see their book
            console.warn(`Storage issue when saving book ${id}`);
            setTimeout(() => {
              toast.warning("Storage is getting full. Your book was added but may not be saved permanently. Consider removing unused items.");
            }, 100);
          }
        });
        
        return { books: updatedBooks };
      });
      
      // Final verification after state update
      const storedBook = get().books[id];
      console.log('Verification - Book in store after update:', {
        id,
        exists: !!storedBook,
        hasCoverURL: storedBook ? !!storedBook.coverURL : false,
        coverURLLength: storedBook && storedBook.coverURL ? storedBook.coverURL.length : 0
      });
      
      return id;
    },
    
    updateBook: (id, data) => {
      console.log('Zustand updateBook action received:', {
        id,
        dataKeys: Object.keys(data),
        hasCoverURL: data.coverURL ? true : false,
        coverURLLength: data.coverURL ? data.coverURL.length : 0
      });
      
      set((state) => {
        // First check if the book exists
        if (!state.books[id]) {
          console.error(`Cannot update book ${id} - not found in store`);
          return { books: state.books };
        }
        
        const updatedBook = { ...state.books[id], ...data };
        const updatedBooks = {
          ...state.books,
          [id]: updatedBook
        };
        
        console.log('Book after update:', {
          id,
          hasCoverURL: !!updatedBook.coverURL,
          coverURLLength: updatedBook.coverURL ? updatedBook.coverURL.length : 0
        });
        
        // Save to storage
        storageService.setItem('books', updatedBooks).then(success => {
          if (success) {
            console.log(`Book ${id} successfully updated in storage`);
          } else {
            console.warn(`Storage issue when updating book ${id}`);
            setTimeout(() => {
              toast.warning("Failed to save all changes. Your storage may be full.");
            }, 100);
          }
        });
        
        return { books: updatedBooks };
      });
      
      // Verification after update
      const updatedBook = get().books[id];
      console.log('Verification - Book in store after update:', {
        id,
        exists: !!updatedBook,
        hasCoverURL: updatedBook ? !!updatedBook.coverURL : false,
        coverURLLength: updatedBook && updatedBook.coverURL ? updatedBook.coverURL.length : 0
      });
    },
    
    deleteBook: (id) => {
      set((state) => {
        const { [id]: removed, ...remaining } = state.books;
        
        // Save to storage
        storageService.setItem('books', remaining);
        
        return { books: remaining };
      });
    },

    getBookByPosition: (position: number, shelfId?: string) => {
      // Access the global state safely with proper typing
      const state = store.getState();
      const books = state.books;
      // Get activeShelfId from state
      const currentShelfId = shelfId || (state as any).activeShelfId;
      
      // Find the book with the specified position on the specified shelf
      return Object.values(books).find(
        (book: BookData) => book.position === position && book.shelfId === currentShelfId
      );
    }
  };
};
