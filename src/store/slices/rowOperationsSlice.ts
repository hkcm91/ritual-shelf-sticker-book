
import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { BooksSlice } from '../booksSlice';
import { 
  saveShelvesToStorage, 
  getBooksInLastRow,
  validateShelfSize,
  checkForOrphanedBooks
} from '../utils/shelfUtils';
import { 
  restoreHiddenBooksForRows, 
  hideLastRowBooks,
  maintainBookPositionsOnRowChange
} from '../utils/rowOperations';
import { toast } from 'sonner';

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
      
      if (!activeShelfId || !shelves[activeShelfId]) {
        console.error("Cannot add row: No active shelf found");
        toast.error("Cannot add row: No active shelf found");
        return;
      }
      
      const shelf = shelves[activeShelfId];
      const newRows = shelf.rows + 1;
      
      // Validate the new shelf size
      const validation = validateShelfSize(newRows, shelf.columns);
      if (!validation.valid) {
        console.error(validation.message);
        toast.error(validation.message || "Invalid shelf size");
        return;
      }
      
      console.log(`Increasing rows from ${shelf.rows} to ${newRows}`);
      
      // Restore hidden books from previous row removals that can now be visible
      let updatedBooks = restoreHiddenBooksForRows(activeShelfId, shelf, books);
      
      // Ensure books maintain their positions with the new row count
      updatedBooks = maintainBookPositionsOnRowChange(activeShelfId, shelf.columns, updatedBooks);
      
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [activeShelfId]: {
            ...shelf,
            rows: newRows
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
      
      toast.success(`Row added successfully! Now ${newRows} rows`);
    },
    
    removeRow: () => {
      const { activeShelfId, shelves, books } = get();
      console.log("removeRow called, activeShelfId:", activeShelfId);
      
      if (!activeShelfId || !shelves[activeShelfId]) {
        console.error("Cannot remove row: No active shelf found");
        toast.error("Cannot remove row: No active shelf found");
        return;
      }
      
      const shelf = shelves[activeShelfId];
      if (shelf.rows <= 1) {
        console.error("Cannot remove row: Already at minimum rows");
        toast.error("Cannot remove row: Already at minimum rows");
        return;
      }
      
      const newRows = shelf.rows - 1;
      console.log(`Decreasing rows from ${shelf.rows} to ${newRows}`);
      
      // Check if there will be orphaned books in the last row
      const { orphanedBooks } = checkForOrphanedBooks(
        activeShelfId, 
        shelf.rows, 
        shelf.columns,
        newRows,
        shelf.columns,
        books
      );
      
      if (orphanedBooks > 0) {
        console.log(`There are ${orphanedBooks} books in the last row that will be hidden`);
      }
      
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
            rows: newRows
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
      if (booksInLastRow.length > 0) {
        toast.success(`Row removed. ${booksInLastRow.length} books have been hidden and saved.`);
      } else {
        toast.success(`Row removed successfully! Now ${newRows} rows`);
      }
    }
  };
};
