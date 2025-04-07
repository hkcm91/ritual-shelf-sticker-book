import { BookData, ShelfData } from '../types';

/**
 * Restores books that were hidden due to row removal
 */
export const restoreHiddenBooksForRows = (
  activeShelfId: string,
  shelf: ShelfData,
  books: Record<string, BookData>
): Record<string, BookData> => {
  const updatedBooks = { ...books };
  
  // Find and restore any hidden books that were in rows that are now visible again
  Object.keys(updatedBooks).forEach(bookId => {
    const book = updatedBooks[bookId];
    if (book.shelfId === activeShelfId && book.hidden && book.originalPosition !== undefined) {
      const originalRow = Math.floor(book.originalPosition / shelf.columns);
      // If the original row will now be visible with the new row count
      if (originalRow < shelf.rows + 1) {
        // Restore the book to its original position
        updatedBooks[bookId] = {
          ...book,
          position: book.originalPosition,
          hidden: false,
          // Keep originalPosition in case we need to hide it again
        };
      }
    }
  });
  
  return updatedBooks;
};

/**
 * Hides books in the last row
 */
export const hideLastRowBooks = (
  activeShelfId: string,
  shelf: ShelfData,
  books: Record<string, BookData>,
  booksInLastRow: string[]
): Record<string, BookData> => {
  const updatedBooks = { ...books };
  
  // Mark books in the last row as invisible - don't delete them
  booksInLastRow.forEach(bookId => {
    updatedBooks[bookId] = {
      ...updatedBooks[bookId],
      // Store the original position if not already stored
      originalPosition: updatedBooks[bookId].originalPosition || updatedBooks[bookId].position,
      // Mark as hidden but keep in storage
      hidden: true
    };
  });
  
  return updatedBooks;
};

/**
 * Ensures books maintain their positions when rows change
 * This preserves the row and column placement when possible
 */
export const maintainBookPositionsOnRowChange = (
  activeShelfId: string,
  oldColumns: number,
  books: Record<string, BookData>
): Record<string, BookData> => {
  // We don't need to recalculate positions when adding/removing rows
  // Books stay at their same relative position
  return books;
};
