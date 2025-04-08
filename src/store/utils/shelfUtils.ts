
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
    if (book.shelfId === activeShelfId && !book.hidden) {
      const currentRow = Math.floor(book.position / oldColumns);
      const currentCol = book.position % oldColumns;
      
      // Make sure the book isn't in a column that would be out of bounds
      const newCol = Math.min(currentCol, newColumns - 1);
      updatedPositions[bookId] = currentRow * newColumns + newCol;
    }
  });
  
  return updatedPositions;
};

/**
 * Validate if the shelf size is within allowed limits
 */
export const validateShelfSize = (
  rows: number, 
  columns: number
): { valid: boolean; message?: string } => {
  const MIN_ROWS = 1;
  const MAX_ROWS = 10;
  const MIN_COLUMNS = 1;
  const MAX_COLUMNS = 12;
  
  if (rows < MIN_ROWS) {
    return { 
      valid: false, 
      message: `Shelf must have at least ${MIN_ROWS} row` 
    };
  }
  
  if (rows > MAX_ROWS) {
    return { 
      valid: false, 
      message: `Shelf cannot have more than ${MAX_ROWS} rows` 
    };
  }
  
  if (columns < MIN_COLUMNS) {
    return { 
      valid: false, 
      message: `Shelf must have at least ${MIN_COLUMNS} column` 
    };
  }
  
  if (columns > MAX_COLUMNS) {
    return { 
      valid: false, 
      message: `Shelf cannot have more than ${MAX_COLUMNS} columns` 
    };
  }
  
  return { valid: true };
};

/**
 * Check if there are any books that would be orphaned by a size change
 */
export const checkForOrphanedBooks = (
  shelfId: string,
  currentRows: number,
  currentColumns: number,
  newRows: number,
  newColumns: number,
  books: BooksSlice['books']
): { orphanedBooks: number; maxPosition: number } => {
  let orphanedBooks = 0;
  let maxPosition = -1;
  
  const currentCapacity = currentRows * currentColumns;
  const newCapacity = newRows * newColumns;
  
  Object.values(books).forEach(book => {
    if (book.shelfId === shelfId && !book.hidden) {
      if (book.position >= newCapacity) {
        orphanedBooks++;
      }
      if (book.position > maxPosition) {
        maxPosition = book.position;
      }
    }
  });
  
  return { orphanedBooks, maxPosition };
};

/**
 * Gets the estimated storage usage statistics
 */
export const getStorageStats = () => {
  return storageService.getUsageStats();
};
