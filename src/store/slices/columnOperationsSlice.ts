
import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { BooksSlice } from '../booksSlice';
import { 
  saveShelvesToStorage, 
  getBooksInLastColumn,
  recalculateBookPositions,
  validateShelfSize,
  checkForOrphanedBooks
} from '../utils/shelfUtils';
import { 
  restoreHiddenBooksForColumns, 
  hideLastColumnBooks,
  maintainBookPositionsOnColumnChange
} from '../utils/columnOperations';
import { toast } from 'sonner';

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
      
      if (!activeShelfId || !shelves[activeShelfId]) {
        console.error("Cannot add column: No active shelf found");
        toast.error("Cannot add column: No active shelf found");
        return;
      }
      
      const shelf = shelves[activeShelfId];
      const newColumns = shelf.columns + 1;
      
      // Validate the new shelf size
      const validation = validateShelfSize(shelf.rows, newColumns);
      if (!validation.valid) {
        console.error(validation.message);
        toast.error(validation.message || "Invalid shelf size");
        return;
      }
      
      console.log(`Increasing columns from ${shelf.columns} to ${newColumns}`);
      
      // Restore hidden books from previous column removals that can now be visible
      let updatedBooks = restoreHiddenBooksForColumns(activeShelfId, shelf, newColumns, books);
      
      // Recalculate positions for all visible books
      const updatedPositions = recalculateBookPositions(
        activeShelfId, 
        shelf.columns, 
        newColumns, 
        updatedBooks
      );
      
      // Apply the new positions to books
      Object.keys(updatedPositions).forEach(bookId => {
        if (updatedBooks[bookId]) {
          updatedBooks[bookId] = {
            ...updatedBooks[bookId],
            position: updatedPositions[bookId]
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
        
        // Save to localStorage
        saveShelvesToStorage(updatedShelves);
        localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
        
        return {
          shelves: updatedShelves,
          books: updatedBooks
        };
      });
      
      toast.success(`Column added successfully! Now ${newColumns} columns`);
    },
    
    removeColumn: () => {
      const { activeShelfId, shelves, books } = get();
      console.log("removeColumn called, activeShelfId:", activeShelfId);
      
      if (!activeShelfId || !shelves[activeShelfId]) {
        console.error("Cannot remove column: No active shelf found");
        toast.error("Cannot remove column: No active shelf found");
        return;
      }
      
      const shelf = shelves[activeShelfId];
      if (shelf.columns <= 1) {
        console.error("Cannot remove column: Already at minimum columns");
        toast.error("Cannot remove column: Already at minimum columns");
        return;
      }
      
      const newColumns = shelf.columns - 1;
      console.log(`Decreasing columns from ${shelf.columns} to ${newColumns}`);
      
      // Check if there will be orphaned books in the last column
      const { orphanedBooks } = checkForOrphanedBooks(
        activeShelfId, 
        shelf.rows, 
        shelf.columns,
        shelf.rows,
        newColumns,
        books
      );
      
      if (orphanedBooks > 0) {
        console.log(`There are ${orphanedBooks} books in the last column that will be hidden`);
      }
      
      // Find books in the last column - but we won't delete them
      const booksInLastColumn = getBooksInLastColumn(activeShelfId, shelf, books);
      console.log("Books in last column:", booksInLastColumn);
      
      // Hide books in the last column but preserve them
      let updatedBooks = hideLastColumnBooks(activeShelfId, books, booksInLastColumn);
      
      // Recalculate positions for remaining visible books
      const updatedPositions = recalculateBookPositions(
        activeShelfId, 
        shelf.columns, 
        newColumns, 
        updatedBooks
      );
      
      // Apply the new positions to books
      Object.keys(updatedPositions).forEach(bookId => {
        if (updatedBooks[bookId]) {
          updatedBooks[bookId] = {
            ...updatedBooks[bookId],
            position: updatedPositions[bookId]
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
      
      // Show different toast messages based on whether books were hidden
      if (booksInLastColumn.length > 0) {
        toast.success(`Column removed. ${booksInLastColumn.length} books have been hidden and saved.`);
      } else {
        toast.success(`Column removed successfully! Now ${newColumns} columns`);
      }
    }
  };
};
