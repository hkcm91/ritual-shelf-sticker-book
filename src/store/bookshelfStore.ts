
import { create } from 'zustand';
import { toast } from 'sonner';
import { BooksSlice, createBooksSlice } from './booksSlice';
import { CompleteShelvesSlice, createShelvesSlice } from './shelvesSlice';
import { UISlice, createUISlice } from './uiSlice';
import { CustomizationState, createCustomizationSlice, defaultCustomization } from './slices/customization';
import { ZoomSlice, createZoomSlice } from './slices/zoomSlice';
import { BookData, ShelfData } from './types';

export type BookshelfState = BooksSlice & CompleteShelvesSlice & UISlice & CustomizationState & ZoomSlice & {
  findEmptyPosition: (shelfId: string) => number;
  initializeDefaultShelf: () => string | null;
};

export const useBookshelfStore = create<BookshelfState>()((set, get, api) => {
  // Make sure we include all required properties from all slices
  return {
    // Core functionality
    findEmptyPosition: (shelfId: string) => {
      const { books, shelves } = get();
      const shelvesData = shelves as Record<string, ShelfData>;
      const shelf = shelvesData[shelfId];
      if (!shelf) return -1;
      
      const maxPositions = shelf.rows * shelf.columns;
      const occupiedPositions = new Set(
        Object.values(books)
          .filter(book => book.shelfId === shelfId)
          .map(book => book.position)
      );
      
      for (let i = 0; i < maxPositions; i++) {
        if (!occupiedPositions.has(i)) {
          return i;
        }
      }
      
      return -1;
    },
    
    initializeDefaultShelf: () => {
      const { shelves, addShelf, setActiveShelf } = get();
      const shelvesData = shelves as Record<string, ShelfData>;
      
      console.log("initializeDefaultShelf called, current shelves:", shelvesData);
      
      if (Object.keys(shelvesData).length === 0) {
        const defaultShelfId = addShelf({
          name: 'My First Shelf',
          rows: 2,
          columns: 4
        });
        
        console.log("Default shelf created:", defaultShelfId);
        
        // Ensure the active shelf is set
        setActiveShelf(defaultShelfId);
        
        return defaultShelfId;
      } else if (get().activeShelfId && !shelvesData[get().activeShelfId]) {
        // If active shelf ID exists but doesn't match any shelf, set to first available
        const firstShelfId = Object.keys(shelvesData)[0];
        console.log("Setting active shelf to first available:", firstShelfId);
        setActiveShelf(firstShelfId);
        return firstShelfId;
      }
      
      return get().activeShelfId || null;
    },

    // Include all necessary slices ensuring required properties are included
    ...defaultCustomization, // Add default values for all required properties
    ...createBooksSlice(set, get, api),
    ...createShelvesSlice(set, get, api),
    ...createUISlice(set, get, api),
    ...createCustomizationSlice(set, get, api),
    ...createZoomSlice(set, get, api),
  };
});

export type { BookData, ShelfData } from './types';

export const initializeDefaultShelf = () => {
  return useBookshelfStore.getState().initializeDefaultShelf();
};
