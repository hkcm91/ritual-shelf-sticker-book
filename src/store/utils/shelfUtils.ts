import { ShelfData } from '../types';
import { BooksSlice } from '../books/booksSlice';
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
 * Gets books that would be affected by removing a row
 */
export const getBooksInLastRow = (
  activeShelfId: string, 
  shelf: ShelfData, 
  books: BooksSlice['books']
): string[] => {
  // Calculate which positions will be removed
  const lastRowPositions = [];
  for (let i = 0; i < shelf.columns; i++) {
    lastRowPositions.push((shelf.rows - 1) * shelf.columns + i);
  }
  
  // Find books in the last row
  return Object.keys(books).filter(bookId => {
    const book = books[bookId];
    return book.shelfId === activeShelfId && lastRowPositions.includes(book.position);
  });
};

/**
 * Gets books that would be affected by removing a column
 */
export const getBooksInLastColumn = (
  activeShelfId: string, 
  shelf: ShelfData, 
  books: BooksSlice['books']
): string[] => {
  // Find books in the last column of each row
  const lastColumnPositions = [];
  for (let row = 0; row < shelf.rows; row++) {
    lastColumnPositions.push(row * shelf.columns + (shelf.columns - 1));
  }
  
  // Find books in the last column
  return Object.keys(books).filter(bookId => {
    const book = books[bookId];
    return book.shelfId === activeShelfId && lastColumnPositions.includes(book.position);
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
