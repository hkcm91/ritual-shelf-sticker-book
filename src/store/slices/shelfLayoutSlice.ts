
import { StateCreator } from 'zustand';
import { ShelfData } from '../types';
import { BooksSlice } from '../booksSlice';
import { RowOperationsSlice, createRowOperationsSlice } from './rowOperationsSlice';
import { ColumnOperationsSlice, createColumnOperationsSlice } from './columnOperationsSlice';

export interface ShelfLayoutSlice extends RowOperationsSlice, ColumnOperationsSlice {}

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
