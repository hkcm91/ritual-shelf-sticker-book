
import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { BooksSlice } from '../books/booksSlice';
import { RowOperationsSlice, createRowOperationsSlice } from './rowOperationsSlice';
import { ColumnOperationsSlice, createColumnOperationsSlice } from './columnOperationsSlice';

// Extended interface combining row and column operations
export interface ShelfLayoutSlice extends RowOperationsSlice, ColumnOperationsSlice {}

/**
 * Creates the shelf layout slice that combines row and column operations
 */
export const createShelfLayoutSlice: StateCreator<
  { shelves: Record<string, ShelfData>; activeShelfId: string } & BooksSlice & ShelfLayoutSlice,
  [],
  [],
  ShelfLayoutSlice
> = (set, get, store) => {
  return {
    ...createRowOperationsSlice(set, get, store),
    ...createColumnOperationsSlice(set, get, store)
  };
};
