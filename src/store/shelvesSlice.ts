import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { ShelfData } from './types';
import { BooksSlice } from './booksSlice';
import { saveShelvesToStorage, saveActiveShelfToStorage } from './utils/shelfUtils';
import { ShelfStylesSlice, createShelfStylesSlice } from './slices/shelfStylesSlice';
import { ShelfLayoutSlice, createShelfLayoutSlice } from './slices/shelfLayoutSlice';

export interface ShelvesSlice {
  shelves: Record<string, ShelfData>;
  activeShelfId: string;
  addShelf: (shelfData: Omit<ShelfData, 'id'>) => string;
  updateShelf: (id: string, data: Partial<Omit<ShelfData, 'id'>>) => void;
  deleteShelf: (id: string) => void;
  setActiveShelf: (id: string) => void;
  switchShelf: (id: string) => void;
}

// Extend ShelvesSlice with layout and styles slices
export type CompleteShelvesSlice = ShelvesSlice & ShelfLayoutSlice & ShelfStylesSlice;

export const createShelvesSlice: StateCreator<
  CompleteShelvesSlice & BooksSlice,
  [],
  [],
  CompleteShelvesSlice
> = (set, get, store) => {
  // Initialize with default or stored state
  const initialShelves = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem('ritual-bookshelf-shelves') || '{}') : {};
  const initialActiveShelf = typeof window !== 'undefined' ? 
    localStorage.getItem('ritual-bookshelf-active-shelf') || '' : '';

  // Create the core shelves slice
  const coreSlice: ShelvesSlice = {
    shelves: initialShelves,
    activeShelfId: initialActiveShelf,
    
    addShelf: (shelfData) => {
      const id = uuidv4();
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [id]: { ...shelfData, id }
        };
        
        // Save to localStorage
        saveShelvesToStorage(updatedShelves);
        saveActiveShelfToStorage(id);
        
        return {
          shelves: updatedShelves,
          activeShelfId: id
        };
      });
      return id;
    },
    
    updateShelf: (id, data) => {
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [id]: { ...state.shelves[id], ...data }
        };
        
        // Save to localStorage
        saveShelvesToStorage(updatedShelves);
        
        return { shelves: updatedShelves };
      });
    },
    
    deleteShelf: (id) => {
      set((state) => {
        if (Object.keys(state.shelves).length <= 1) return state;
        
        const { [id]: removed, ...remainingShelves } = state.shelves;
        
        // Delete books on this shelf
        const updatedBooks = { ...state.books };
        Object.keys(updatedBooks).forEach(bookId => {
          if (updatedBooks[bookId].shelfId === id) {
            delete updatedBooks[bookId];
          }
        });
        
        // Set new active shelf
        const newActiveId = Object.keys(remainingShelves)[0];
        
        // Save to localStorage
        saveShelvesToStorage(remainingShelves);
        localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
        saveActiveShelfToStorage(newActiveId);
        
        return { 
          shelves: remainingShelves,
          books: updatedBooks,
          activeShelfId: newActiveId
        };
      });
    },
    
    setActiveShelf: (id) => {
      set({ activeShelfId: id });
      saveActiveShelfToStorage(id);
    },
    
    switchShelf: (id) => {
      set({ activeShelfId: id });
      saveActiveShelfToStorage(id);
    }
  };
  
  // Combine with layout and styles slices
  return {
    ...coreSlice,
    ...createShelfLayoutSlice(set, get, store),
    ...createShelfStylesSlice(set, get, store)
  };
};
