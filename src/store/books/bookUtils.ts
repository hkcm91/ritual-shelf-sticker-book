import { BookData } from '../types';
import { storageService } from '../../services/storage/storageService';
import { toast } from 'sonner';

/**
 * Saves books to storage with optional compression for images
 */
export const saveBooksToStorage = async (
  books: Record<string, BookData>,
  bookId?: string,
  needsCompression = false
): Promise<boolean> => {
  try {
    // Try to save to storage with compression for book covers if needed
    const success = await storageService.setItem('books', books, {
      compress: needsCompression,
      quality: 0.7,
      maxWidth: 600,
      maxHeight: 900
    });
    
    if (success) {
      console.log(`Book ${bookId || 'collection'} successfully saved to storage`);
      return true;
    } else {
      // Storage error, but we'll keep the state update so user can see their book
      console.warn(`Storage issue when saving book ${bookId || 'collection'}`);
      setTimeout(() => {
        toast.warning("Storage is getting full. Your book was added but may not be saved permanently. Consider removing unused items.");
      }, 100);
      return false;
    }
  } catch (error) {
    console.error('Error saving books to storage:', error);
    return false;
  }
};

/**
 * Determines if a book cover needs compression
 */
export const needsCompression = (bookData: Omit<BookData, 'id'>): boolean => {
  return !bookData.isSticker && 
    typeof bookData.coverURL === 'string' && 
    bookData.coverURL.startsWith('data:image/');
};

/**
 * Gets a book by its position in a shelf
 */
export const findBookByPosition = (
  position: number,
  shelfId: string,
  books: Record<string, BookData>
): BookData | undefined => {
  // Find the book with the specified position on the specified shelf
  const foundBook = Object.values(books).find(
    (book: BookData) => book.position === position && book.shelfId === shelfId
  );
  
  if (foundBook) {
    console.log(`Found book at position ${position} on shelf ${shelfId}:`, 
      foundBook.id, foundBook.title);
  } else {
    console.log(`No book found at position ${position} on shelf ${shelfId}`);
  }
  
  return foundBook;
};
