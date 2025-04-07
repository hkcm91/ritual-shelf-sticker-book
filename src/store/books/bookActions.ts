
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { BookData } from '../types';
import { storageService } from '../../services/storage/storageService';

/**
 * Adds a new book to the store
 */
export const addBookAction = (
  bookData: Omit<BookData, 'id'>,
  books: Record<string, BookData>,
  findEmptyPosition: (shelfId: string) => number
): { id: string; newBook: BookData } | null => {
  // Log the input book data
  console.log('Zustand addBook action received:', {
    ...bookData,
    coverURL: bookData.coverURL ? `${bookData.coverURL.substring(0, 100)}... (length: ${bookData.coverURL.length})` : 'missing'
  });
  
  const id = uuidv4();
  
  // If position is -1, find an empty slot
  const position = bookData.position === -1 ? 
    findEmptyPosition(bookData.shelfId) : 
    bookData.position;
  
  if (position === -1) {
    // No empty slots found
    toast.error("No empty slots on this shelf!");
    return null;
  }
  
  // Create the new book object with ID and ensure isSticker is defined
  const newBook = { 
    ...bookData, 
    id, 
    position,
    isSticker: bookData.isSticker || false,
    hidden: false // Explicitly set hidden to false
  };
  
  console.log('New book object created:', {
    id,
    position,
    isSticker: newBook.isSticker,
    hidden: newBook.hidden,
    hasCoverURL: !!newBook.coverURL,
    coverURLLength: newBook.coverURL ? newBook.coverURL.length : 0,
    coverURLSample: newBook.coverURL ? `${newBook.coverURL.substring(0, 100)}...` : 'undefined'
  });
  
  return { id, newBook };
};

/**
 * Updates an existing book in the store
 */
export const updateBookAction = (
  id: string,
  data: Partial<Omit<BookData, 'id'>>,
  books: Record<string, BookData>
): BookData | null => {
  console.log('Zustand updateBook action received:', {
    id,
    dataKeys: Object.keys(data),
    hasCoverURL: data.coverURL ? true : false,
    coverURLLength: data.coverURL ? data.coverURL.length : 0
  });
  
  // First check if the book exists
  if (!books[id]) {
    console.error(`Cannot update book ${id} - not found in store`);
    return null;
  }
  
  const updatedBook = { ...books[id], ...data };
  
  console.log('Book after update:', {
    id,
    hasCoverURL: !!updatedBook.coverURL,
    coverURLLength: updatedBook.coverURL ? updatedBook.coverURL.length : 0
  });
  
  return updatedBook;
};
