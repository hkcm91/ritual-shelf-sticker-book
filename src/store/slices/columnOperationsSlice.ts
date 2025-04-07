import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { getBooksInLastColumn, recalculateBookPositions } from '../utils/shelfUtils';
import { BooksSlice } from '../books/booksSlice';
import { toast } from 'sonner';

export interface ColumnOperationsSlice {
  addColumn: (shelfId: string) => void;
  removeColumn: (shelfId: string) => void;
}

/**
 * Creates the column operations slice
 */
export const createColumnOperationsSlice: StateCreator<
  { shelves: Record<string, ShelfData>; activeShelfId: string } & BooksSlice,
  [],
  [],
  ColumnOperationsSlice
> = (set, get) => ({
  addColumn: (shelfId: string) => {
    set((state) => {
      const shelf = state.shelves[shelfId];
      if (!shelf) return state;
      
      const newColumns = shelf.columns + 1;
      if (newColumns > 10) {
        toast.error("Maximum 10 columns allowed");
        return state;
      }
      
      // Recalculate book positions
      const updatedPositions = recalculateBookPositions(
        shelfId,
        shelf.columns,
        newColumns,
        state.books
      );
      
      // Update books with new positions
      const updatedBooks = { ...state.books };
      Object.keys(updatedPositions).forEach(bookId => {
        updatedBooks[bookId] = {
          ...updatedBooks[bookId],
          position: updatedPositions[bookId]
        };
      });
      
      const updatedShelves = {
        ...state.shelves,
        [shelfId]: { ...shelf, columns: newColumns }
      };
      
      return {
        shelves: updatedShelves,
        books: updatedBooks
      };
    });
  },
  
  removeColumn: (shelfId: string) => {
    set((state) => {
      const shelf = state.shelves[shelfId];
      if (!shelf) return state;
      
      if (shelf.columns <= 1) {
        toast.error("Cannot have less than 1 column");
        return state;
      }
      
      // Get books in the last column
      const booksToRemove = getBooksInLastColumn(shelfId, shelf, state.books);
      
      // Remove books in the last column
      const updatedBooks = { ...state.books };
      booksToRemove.forEach(bookId => {
        delete updatedBooks[bookId];
      });
      
      // Recalculate book positions
      const newColumns = shelf.columns - 1;
      const updatedPositions = recalculateBookPositions(
        shelfId,
        shelf.columns,
        newColumns,
        state.books
      );
      
      // Update books with new positions
      Object.keys(updatedPositions).forEach(bookId => {
        updatedBooks[bookId] = {
          ...updatedBooks[bookId],
          position: updatedPositions[bookId]
        };
      });
      
      const updatedShelves = {
        ...state.shelves,
        [shelfId]: { ...shelf, columns: newColumns }
      };
      
      return {
        shelves: updatedShelves,
        books: updatedBooks
      };
    });
  }
});
