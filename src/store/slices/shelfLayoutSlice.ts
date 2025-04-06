import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { BooksSlice } from '../booksSlice';
import { 
  saveShelvesToStorage, 
  getBooksInLastRow, 
  getBooksInLastColumn,
  recalculateBookPositions
} from '../utils/shelfUtils';

export interface ShelfLayoutSlice {
  addRow: () => void;
  removeRow: () => void;
  addColumn: () => void;
  removeColumn: () => void;
}

export const createShelfLayoutSlice: StateCreator<
  { shelves: Record<string, ShelfData>; activeShelfId: string } & BooksSlice & ShelfLayoutSlice,
  [],
  [],
  ShelfLayoutSlice
> = (set, get) => {
  return {
    addRow: () => {
      const { activeShelfId, shelves } = get();
      if (!activeShelfId) return;
      
      const shelf = shelves[activeShelfId];
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [activeShelfId]: {
            ...shelf,
            rows: shelf.rows + 1
          }
        };
        
        saveShelvesToStorage(updatedShelves);
        
        return { shelves: updatedShelves };
      });
    },
    
    removeRow: () => {
      const { activeShelfId, shelves, books } = get();
      if (!activeShelfId) return;
      
      const shelf = shelves[activeShelfId];
      if (shelf.rows <= 1) return;
      
      // Find books in the last row - but we won't delete them
      const booksInLastRow = getBooksInLastRow(activeShelfId, shelf, books);
      
      // Just mark books in the last row as invisible - don't delete them
      const updatedBooks = { ...books };
      booksInLastRow.forEach(bookId => {
        updatedBooks[bookId] = {
          ...updatedBooks[bookId],
          // Store the original position in a field so we can restore it later if needed
          originalPosition: updatedBooks[bookId].position,
          // Mark as hidden but keep in storage
          hidden: true
        };
      });
      
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [activeShelfId]: {
            ...shelf,
            rows: shelf.rows - 1
          }
        };
        
        saveShelvesToStorage(updatedShelves);
        localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
        
        return {
          shelves: updatedShelves,
          books: updatedBooks
        };
      });
    },
    
    addColumn: () => {
      const { activeShelfId, shelves, books } = get();
      if (!activeShelfId) return;
      
      const shelf = shelves[activeShelfId];
      const newColumns = shelf.columns + 1;
      
      // Recalculate book positions for the new column layout
      const updatedPositions = recalculateBookPositions(
        activeShelfId,
        shelf.columns,
        newColumns,
        books
      );
      
      // Apply new positions to books
      const updatedBooks = { ...books };
      Object.keys(updatedPositions).forEach(bookId => {
        updatedBooks[bookId] = { 
          ...updatedBooks[bookId], 
          position: updatedPositions[bookId] 
        };
      });
      
      // Check for hidden books that might become visible again
      Object.keys(updatedBooks).forEach(bookId => {
        const book = updatedBooks[bookId];
        if (book.shelfId === activeShelfId && book.hidden) {
          // Calculate if this book would now be visible in the new layout
          const originalRow = Math.floor(book.originalPosition / shelf.columns);
          if (originalRow < shelf.rows) {
            // This book can be visible again
            delete updatedBooks[bookId].hidden;
            // Calculate new position based on original position
            const originalCol = book.originalPosition % shelf.columns;
            if (originalCol < newColumns) {
              updatedBooks[bookId].position = originalRow * newColumns + originalCol;
            }
          }
        }
      });
      
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [activeShelfId]: {
            ...shelf,
            columns: newColumns
          }
        };
        
        saveShelvesToStorage(updatedShelves);
        localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
        
        return {
          shelves: updatedShelves,
          books: updatedBooks
        };
      });
    },
    
    removeColumn: () => {
      const { activeShelfId, shelves, books } = get();
      if (!activeShelfId) return;
      
      const shelf = shelves[activeShelfId];
      if (shelf.columns <= 1) return;
      
      const newColumns = shelf.columns - 1;
      
      // Find books in the last column - but we won't delete them
      const booksInLastColumn = getBooksInLastColumn(activeShelfId, shelf, books);
      
      // Mark books in last column as hidden but preserve them
      const updatedBooks = { ...books };
      
      // First mark books in the last column as hidden
      booksInLastColumn.forEach(bookId => {
        updatedBooks[bookId] = {
          ...updatedBooks[bookId],
          // Store the original position
          originalPosition: updatedBooks[bookId].position,
          // Mark as hidden but keep in storage
          hidden: true
        };
      });
      
      // Update positions for remaining visible books
      const remainingVisibleBooks = Object.keys(updatedBooks)
        .filter(bookId => 
          updatedBooks[bookId].shelfId === activeShelfId && 
          !updatedBooks[bookId].hidden &&
          !booksInLastColumn.includes(bookId)
        );
      
      remainingVisibleBooks.forEach(bookId => {
        const book = updatedBooks[bookId];
        const currentRow = Math.floor(book.position / shelf.columns);
        const currentCol = book.position % shelf.columns;
        
        // Only reposition if the column is valid in the new layout
        if (currentCol < newColumns) {
          updatedBooks[bookId] = {
            ...book,
            position: currentRow * newColumns + currentCol
          };
        }
      });
      
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [activeShelfId]: {
            ...shelf,
            columns: newColumns
          }
        };
        
        saveShelvesToStorage(updatedShelves);
        localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
        
        return {
          shelves: updatedShelves,
          books: updatedBooks
        };
      });
    }
  };
};
