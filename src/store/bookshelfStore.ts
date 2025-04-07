
import { create } from 'zustand';
import { toast } from 'sonner';
import { BooksSlice, createBooksSlice } from './booksSlice';
import { CompleteShelvesSlice, createShelvesSlice } from './shelvesSlice';
import { UISlice, createUISlice } from './uiSlice';
import { CustomizationState, createCustomizationSlice, defaultCustomization } from './slices/customization';
import { BookData, ShelfData } from './types';

export type BookshelfState = BooksSlice & CompleteShelvesSlice & UISlice & CustomizationState & {
  findEmptyPosition: (shelfId: string) => number;
};

export const useBookshelfStore = create<BookshelfState>()((set, get, api) => ({
  ...createBooksSlice(set, get, api),
  ...createShelvesSlice(set, get, api),
  ...createUISlice(set, get, api),
  ...createCustomizationSlice(set, get, api),
  
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
}));

export type { BookData, ShelfData } from './types';

export const initializeDefaultShelf = () => {
  const { shelves, addShelf } = useBookshelfStore.getState();
  const shelvesData = shelves as Record<string, ShelfData>;
  
  if (Object.keys(shelvesData).length === 0) {
    const defaultShelfId = addShelf({
      name: 'My First Shelf',
      rows: 2,
      columns: 4
    });
    return defaultShelfId;
  }
  
  return null;
};
