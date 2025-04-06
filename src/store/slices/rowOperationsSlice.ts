
import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { BooksSlice } from '../booksSlice';
import { 
  saveShelvesToStorage, 
  getBooksInLastRow
} from '../utils/shelfUtils';
import { 
  restoreHiddenBooksForRows, 
  hideLastRowBooks 
} from '../utils/rowOperations';

export interface RowOperationsSlice {
  addRow: () => void;
  removeRow: () => void;
}

export const createRowOperationsSlice: StateCreator<
  { shelves: Record<string, ShelfData>; activeShelfId: string } & BooksSlice & RowOperationsSlice,
  [],
  [],
  RowOperationsSlice
> = (set, get) => {
  return {
    addRow: () => {
      const { activeShelfId, shelves, books } = get();
      if (!activeShelfId) return;
      
      const shelf = shelves[activeShelfId];
      
      // Restore hidden books from previous row removals that can now be visible
      const updatedBooks = restoreHiddenBooksForRows(activeShelfId, shelf, books);
      
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
      
      // Hide books in the last row but preserve them
      const updatedBooks = hideLastRowBooks(activeShelfId, shelf, books, booksInLastRow);
      
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
    }
  };
};
