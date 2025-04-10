import { BookData, ShelfData } from '../types';

/**
 * Restores books that were hidden due to column removal
 */
export const restoreHiddenBooksForColumns = (
  activeShelfId: string,
  shelf: ShelfData,
  newColumns: number,
  books: Record<string, BookData>
): Record<string, BookData> => {
  const updatedBooks = { ...books };
  
  // Check for hidden books from previous column removals that can now be restored
  Object.keys(updatedBooks).forEach(bookId => {
    const book = updatedBooks[bookId];
    if (book.shelfId === activeShelfId && book.hidden && book.originalPosition !== undefined) {
      const originalRow = Math.floor(book.originalPosition / shelf.columns);
      const originalCol = book.originalPosition % shelf.columns;
      
      // Only restore if the book's original row is still visible and the column is now visible
      if (originalRow < shelf.rows && originalCol < newColumns) {
        // Restore the book to its original position
        updatedBooks[bookId] = {
          ...book,
          position: book.originalPosition,
          hidden: false,
          // Keep originalPosition for future reference
        };
      }
    }
  });
  
  return updatedBooks;
};

/**
 * Hides books in the last column
 */
export const hideLastColumnBooks = (
  activeShelfId: string,
  books: Record<string, BookData>,
  booksInLastColumn: string[]
): Record<string, BookData> => {
  const updatedBooks = { ...books };
  
  // Mark books in the last column as hidden
  booksInLastColumn.forEach(bookId => {
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
 * Ensures books maintain their visual positions when column count changes
 * This requires recalculating positions to maintain the same row and column visually
 */
export const maintainBookPositionsOnColumnChange = (
  activeShelfId: string,
  oldColumns: number,
  newColumns: number,
  books: Record<string, BookData>
): Record<string, BookData> => {
  const updatedBooks = { ...books };
  
  // We need to recalculate positions when columns change to maintain visual positions
  Object.keys(updatedBooks).forEach(bookId => {
    const book = updatedBooks[bookId];
    
    if (book.shelfId === activeShelfId && !book.hidden) {
      // Calculate current row and column
      const currentRow = Math.floor(book.position / oldColumns);
      const currentCol = book.position % oldColumns;
      
      // If the column is less than the new column count, we can keep it in place
      if (currentCol < newColumns) {
        // Calculate new position based on current row and column
        const newPosition = (currentRow * newColumns) + currentCol;
        updatedBooks[bookId] = {
          ...book,
          // Update position but preserve the original position if it exists
          position: newPosition,
          originalPosition: book.originalPosition || book.position
        };
      }
    }
  });
  
  return updatedBooks;
};
