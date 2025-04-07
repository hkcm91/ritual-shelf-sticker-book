import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { getBooksInLastRow, recalculateBookPositions } from '../utils/shelfUtils';
import { BooksSlice } from '../books/booksSlice';
import { toast } from 'sonner';

export interface RowOperationsSlice {
  addRow: (shelfId: string) => void;
  removeRow: (shelfId: string) => void;
}

/**
 * Creates the row operations slice
 */
export const createRowOperationsSlice: StateCreator<
  { shelves: Record<string, ShelfData>; activeShelfId: string } & BooksSlice,
  [],
  [],
  RowOperationsSlice
> = (set, get) => ({
  addRow: (shelfId) => {
    set((state) => {
      const shelf = state.shelves[shelfId];
      if (!shelf) return state;
      
      const newRows = Math.min(shelf.rows + 1, 5); // Max 5 rows
      
      return {
        shelves: {
          ...state.shelves,
          [shelfId]: { ...shelf, rows: newRows }
        }
      };
    });
  },
  
  removeRow: (shelfId) => {
    set((state) => {
      const shelf = state.shelves[shelfId];
      if (!shelf) return state;
      
      if (shelf.rows <= 1) {
        toast.error("Shelves must have at least one row");
        return state;
      }
      
      // Get books in the last row
      const booksToRemove = getBooksInLastRow(shelfId, shelf, state.books);
      
      // Remove those books
      const updatedBooks = { ...state.books };
      booksToRemove.forEach(bookId => delete updatedBooks[bookId]);
      
      const newRows = shelf.rows - 1;
      
      return {
        shelves: {
          ...state.shelves,
          [shelfId]: { ...shelf, rows: newRows }
        },
        books: updatedBooks
      };
    });
  }
});
