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
      const { activeShelfId, shelves, books } = get();
      if (!activeShelfId) return;
      
      const shelf = shelves[activeShelfId];
      
      // Check for hidden books from previous row removals that can now be restored
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
      
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [activeShelfId]: {
            ...shelf,
            rows: shelf.rows + 1
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
          originalPosition: updatedBooks[bookId].originalPosition || updatedBooks[bookId].position,
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
      
      // We'll now restore hidden books and keep all visible books in their current positions
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
