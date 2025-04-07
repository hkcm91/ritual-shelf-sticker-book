
import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { BooksSlice } from '../booksSlice';
import { 
  saveShelvesToStorage, 
  getBooksInLastColumn
} from '../utils/shelfUtils';
import { 
  restoreHiddenBooksForColumns, 
  hideLastColumnBooks,
  maintainBookPositionsOnColumnChange
} from '../utils/columnOperations';

export interface ColumnOperationsSlice {
  addColumn: () => void;
  removeColumn: () => void;
}

export const createColumnOperationsSlice: StateCreator<
  { shelves: Record<string, ShelfData>; activeShelfId: string } & BooksSlice & ColumnOperationsSlice,
  [],
  [],
  ColumnOperationsSlice
> = (set, get) => {
  return {
    addColumn: () => {
      const { activeShelfId, shelves, books } = get();
      console.log("addColumn called, activeShelfId:", activeShelfId);
      console.log("shelves data:", shelves);
      
      if (!activeShelfId) {
        console.error("Cannot add column: No active shelf");
        return;
      }
      
      const shelf = shelves[activeShelfId];
      if (!shelf) {
        console.error(`Cannot add column: Active shelf not found "${activeShelfId}"`);
        console.error("Available shelves:", Object.keys(shelves));
        
        // If we have shelves but the active one isn't found, select the first available
        if (Object.keys(shelves).length > 0) {
          const firstShelfId = Object.keys(shelves)[0];
          console.log(`Using first available shelf: ${firstShelfId}`);
          
          // Update active shelf ID and continue with this shelf
          set({ activeShelfId: firstShelfId });
          
          // Re-attempt with the new shelf
          setTimeout(() => get().addColumn(), 0);
          return;
        }
        return;
      }
      
      const newColumns = shelf.columns + 1;
      console.log(`Increasing columns from ${shelf.columns} to ${newColumns}`);
      
      // Restore hidden books from previous column removals that can now be visible
      let updatedBooks = restoreHiddenBooksForColumns(activeShelfId, shelf, newColumns, books);
      
      // Ensure books maintain their positions with the new column count
      updatedBooks = maintainBookPositionsOnColumnChange(activeShelfId, shelf.columns, newColumns, updatedBooks);
      
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [activeShelfId]: {
            ...shelf,
            columns: newColumns
          }
        };
        
        // Save to localStorage
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
      console.log("removeColumn called, activeShelfId:", activeShelfId);
      console.log("shelves data:", shelves);
      
      if (!activeShelfId) {
        console.error("Cannot remove column: No active shelf");
        return;
      }
      
      const shelf = shelves[activeShelfId];
      if (!shelf) {
        console.error(`Cannot remove column: Active shelf not found "${activeShelfId}"`);
        console.error("Available shelves:", Object.keys(shelves));
        
        // If we have shelves but the active one isn't found, select the first available
        if (Object.keys(shelves).length > 0) {
          const firstShelfId = Object.keys(shelves)[0];
          console.log(`Using first available shelf: ${firstShelfId}`);
          
          // Update active shelf ID and continue with this shelf
          set({ activeShelfId: firstShelfId });
          
          // Re-attempt with the new shelf
          setTimeout(() => get().removeColumn(), 0);
          return;
        }
        return;
      }
      
      if (shelf.columns <= 1) {
        console.error("Cannot remove column: Already at minimum columns");
        return;
      }
      
      const newColumns = shelf.columns - 1;
      console.log(`Decreasing columns from ${shelf.columns} to ${newColumns}`);
      
      // Find books in the last column - but we won't delete them
      const booksInLastColumn = getBooksInLastColumn(activeShelfId, shelf, books);
      console.log("Books in last column:", booksInLastColumn);
      
      // Hide books in the last column but preserve them
      const updatedBooks = hideLastColumnBooks(activeShelfId, books, booksInLastColumn);
      
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
