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
 * Instead of recalculating positions, we preserve the books' original arrangement
 */
export const maintainBookPositionsOnColumnChange = (
  activeShelfId: string,
  oldColumns: number,
  newColumns: number,
  books: Record<string, BookData>
): Record<string, BookData> => {
  const updatedBooks = { ...books };
  
  // Keep track of books that need to be hidden with the new column count
  const booksToHide: string[] = [];
  
  // Preserve visual positions
  Object.keys(updatedBooks).forEach(bookId => {
    const book = updatedBooks[bookId];
    
    if (book.shelfId === activeShelfId && !book.hidden) {
      // Calculate current row and column
      const currentRow = Math.floor(book.position / oldColumns);
      const currentCol = book.position % oldColumns;
      
      // If the column is now out of bounds, hide it
      if (currentCol >= newColumns) {
        // Store original position and hide
        booksToHide.push(bookId);
      } else {
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
  
  // Hide books that are now out of bounds
  booksToHide.forEach(bookId => {
    updatedBooks[bookId] = {
      ...updatedBooks[bookId],
      // Store the original position
      originalPosition: updatedBooks[bookId].originalPosition || updatedBooks[bookId].position,
      // Mark as hidden but keep in storage
      hidden: true
    };
  });
  
  return updatedBooks;
};
