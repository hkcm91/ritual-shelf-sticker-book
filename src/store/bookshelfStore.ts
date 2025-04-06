
import { create } from 'zustand';
import { toast } from 'sonner';
import { BooksSlice, createBooksSlice } from './booksSlice';
import { ShelvesSlice, createShelvesSlice } from './shelvesSlice';
import { UISlice, createUISlice } from './uiSlice';

// Define the complete store type
export type BookshelfState = BooksSlice & ShelvesSlice & UISlice & {
  findEmptyPosition: (shelfId: string) => number;
};

// Load saved data from localStorage
const loadInitialState = () => {
  try {
    const savedBooks = localStorage.getItem('ritual-bookshelf-books');
    const savedShelves = localStorage.getItem('ritual-bookshelf-shelves');
    const savedActiveShelf = localStorage.getItem('ritual-bookshelf-active-shelf');
    
    return {
      books: savedBooks ? JSON.parse(savedBooks) : {},
      shelves: savedShelves ? JSON.parse(savedShelves) : {},
      activeShelfId: savedActiveShelf || '',
    };
  } catch (error) {
    console.error('Error loading saved state', error);
    return {
      books: {},
      shelves: {},
      activeShelfId: '',
    };
  }
};

const initialState = loadInitialState();

// Create and export the store with all slices
export const useBookshelfStore = create<BookshelfState>((set, get) => ({
  ...createBooksSlice(set, get),
  ...createShelvesSlice(set, get),
  ...createUISlice(set, get),
  
  // Set initial state
  books: initialState.books,
  shelves: initialState.shelves,
  activeShelfId: initialState.activeShelfId,
  
  // Utility function to find empty position
  findEmptyPosition: (shelfId: string) => {
    const { books, shelves } = get();
    const shelf = shelves[shelfId];
    if (!shelf) return -1;
    
    const maxPositions = shelf.rows * shelf.columns;
    const occupiedPositions = new Set(
      Object.values(books)
        .filter(book => book.shelfId === shelfId)
        .map(book => book.position)
    );
    
    // Find the first available position
    for (let i = 0; i < maxPositions; i++) {
      if (!occupiedPositions.has(i)) {
        return i;
      }
    }
    
    return -1; // No positions available
  },
}));

// Re-export types properly
export type { BookData, ShelfData } from './types';

// Helper to initialize a default shelf if none exists
export const initializeDefaultShelf = () => {
  const { shelves, addShelf } = useBookshelfStore.getState();
  
  if (Object.keys(shelves).length === 0) {
    const defaultShelfId = addShelf({
      name: 'My First Shelf',
      rows: 2,
      columns: 4
    });
    return defaultShelfId;
  }
  
  return null;
};
