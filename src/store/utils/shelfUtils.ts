import { ShelfData } from '../types';
import { BooksSlice } from '../booksSlice';
import { storageService } from '../../services/storage/storageService';

/**
 * Updates shelf data in storage
 */
export const saveShelvesToStorage = (shelves: Record<string, ShelfData>): Promise<boolean> => {
  return storageService.setItem('shelves', shelves);
};

/**
 * Updates active shelf ID in storage
 */
export const saveActiveShelfToStorage = (id: string): Promise<boolean> => {
  return storageService.setItem('active-shelf', id);
};

/**
 * Finds books in the last row of a shelf
 */
export const getBooksInLastRow = (
  shelfId: string,
  shelf: import('../types').ShelfData,
  books: Record<string, import('../types').BookData>
): string[] => {
  const { rows, columns } = shelf;
  const lastRowStart = (rows - 1) * columns;
  
  return Object.keys(books).filter(bookId => {
    const book = books[bookId];
    return book.shelfId === shelfId && 
           !book.hidden &&
           book.position >= lastRowStart;
  });
};

/**
 * Finds books in the last column of a shelf
 */
export const getBooksInLastColumn = (
  shelfId: string,
  shelf: import('../types').ShelfData,
  books: Record<string, import('../types').BookData>
): string[] => {
  const { columns } = shelf;
  const lastColumnIndex = columns - 1;
  
  return Object.keys(books).filter(bookId => {
    const book = books[bookId];
    return book.shelfId === shelfId && 
           !book.hidden &&
           book.position % columns === lastColumnIndex;
  });
};

/**
 * Recalculates book positions when column count changes
 */
export const recalculateBookPositions = (
  activeShelfId: string,
  oldColumns: number,
  newColumns: number,
  books: BooksSlice['books']
): Record<string, number> => {
  const updatedPositions: Record<string, number> = {};
  
  Object.keys(books).forEach(bookId => {
    const book = books[bookId];
    if (book.shelfId === activeShelfId) {
      const currentRow = Math.floor(book.position / oldColumns);
      const currentCol = book.position % oldColumns;
      updatedPositions[bookId] = currentRow * newColumns + currentCol;
    }
  });
  
  return updatedPositions;
};

/**
 * Gets the estimated storage usage statistics
 */
export const getStorageStats = () => {
  return storageService.getUsageStats();
};
