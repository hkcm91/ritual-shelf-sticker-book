
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
      
      // Find books in the last row
      const booksToRemove = getBooksInLastRow(activeShelfId, shelf, books);
      
      // Remove books in the last row
      const updatedBooks = { ...books };
      booksToRemove.forEach(bookId => {
        delete updatedBooks[bookId];
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
      
      // Find books in the last column
      const booksToRemove = getBooksInLastColumn(activeShelfId, shelf, books);
      
      // Remove books in the last column and recalculate positions for remaining
      const updatedBooks = { ...books };
      
      // First remove books in the last column
      booksToRemove.forEach(bookId => {
        delete updatedBooks[bookId];
      });
      
      // Update positions for remaining books
      const remainingBooks = Object.keys(updatedBooks)
        .filter(bookId => updatedBooks[bookId].shelfId === activeShelfId);
      
      remainingBooks.forEach(bookId => {
        const book = updatedBooks[bookId];
        const currentRow = Math.floor(book.position / shelf.columns);
        const currentCol = book.position % shelf.columns;
        updatedBooks[bookId] = {
          ...book,
          position: currentRow * newColumns + currentCol
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
