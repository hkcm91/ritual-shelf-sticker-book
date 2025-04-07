
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
      if (!activeShelfId) return;
      
      const shelf = shelves[activeShelfId];
      const newColumns = shelf.columns + 1;
      
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
