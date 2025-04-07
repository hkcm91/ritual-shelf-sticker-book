
import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { BooksSlice } from '../booksSlice';
import { 
  saveShelvesToStorage, 
  getBooksInLastRow
} from '../utils/shelfUtils';
import { 
  restoreHiddenBooksForRows, 
  hideLastRowBooks,
  maintainBookPositionsOnRowChange
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
      console.log("addRow called, activeShelfId:", activeShelfId);
      console.log("shelves data:", shelves);
      
      if (!activeShelfId) {
        console.error("Cannot add row: No active shelf");
        return;
      }
      
      const shelf = shelves[activeShelfId];
      if (!shelf) {
        console.error(`Cannot add row: Active shelf not found "${activeShelfId}"`);
        console.error("Available shelves:", Object.keys(shelves));
        
        // If we have shelves but the active one isn't found, select the first available
        if (Object.keys(shelves).length > 0) {
          const firstShelfId = Object.keys(shelves)[0];
          console.log(`Using first available shelf: ${firstShelfId}`);
          
          // Update active shelf ID and continue with this shelf
          set({ activeShelfId: firstShelfId });
          
          // Re-attempt with the new shelf
          setTimeout(() => get().addRow(), 0);
          return;
        }
        return;
      }
      
      console.log(`Increasing rows from ${shelf.rows} to ${shelf.rows + 1}`);
      
      // Restore hidden books from previous row removals that can now be visible
      let updatedBooks = restoreHiddenBooksForRows(activeShelfId, shelf, books);
      
      // Ensure books maintain their positions with the new row count
      updatedBooks = maintainBookPositionsOnRowChange(activeShelfId, shelf.columns, updatedBooks);
      
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [activeShelfId]: {
            ...shelf,
            rows: shelf.rows + 1
          }
        };
        
        // Save to localStorage directly as well (in addition to the storage service)
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
      console.log("removeRow called, activeShelfId:", activeShelfId);
      console.log("shelves data:", shelves);
      
      if (!activeShelfId) {
        console.error("Cannot remove row: No active shelf");
        return;
      }
      
      const shelf = shelves[activeShelfId];
      if (!shelf) {
        console.error(`Cannot remove row: Active shelf not found "${activeShelfId}"`);
        console.error("Available shelves:", Object.keys(shelves));
        
        // If we have shelves but the active one isn't found, select the first available
        if (Object.keys(shelves).length > 0) {
          const firstShelfId = Object.keys(shelves)[0];
          console.log(`Using first available shelf: ${firstShelfId}`);
          
          // Update active shelf ID and continue with this shelf
          set({ activeShelfId: firstShelfId });
          
          // Re-attempt with the new shelf
          setTimeout(() => get().removeRow(), 0);
          return;
        }
        return;
      }
      
      if (shelf.rows <= 1) {
        console.error("Cannot remove row: Already at minimum rows");
        return;
      }
      
      console.log(`Decreasing rows from ${shelf.rows} to ${shelf.rows - 1}`);
      
      // Find books in the last row - but we won't delete them
      const booksInLastRow = getBooksInLastRow(activeShelfId, shelf, books);
      console.log("Books in last row:", booksInLastRow);
      
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
