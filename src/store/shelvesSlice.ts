
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { ShelfData } from './types';
import { BooksSlice } from './booksSlice';

export interface ShelvesSlice {
  shelves: Record<string, ShelfData>;
  activeShelfId: string;
  addShelf: (shelfData: Omit<ShelfData, 'id'>) => string;
  updateShelf: (id: string, data: Partial<Omit<ShelfData, 'id'>>) => void;
  deleteShelf: (id: string) => void;
  setActiveShelf: (id: string) => void;
  switchShelf: (id: string) => void;
  addRow: () => void;
  removeRow: () => void;
  addColumn: () => void;
  removeColumn: () => void;
  setShelfBackground: (id: string, backgroundImage: string) => void;
  setShelfTexture: (id: string, textureImage: string) => void;
  resetShelfStyle: (id: string) => void;
}

export const createShelvesSlice: StateCreator<
  ShelvesSlice & BooksSlice,
  [],
  [],
  ShelvesSlice
> = (set, get) => ({
  shelves: {},
  activeShelfId: '',
  
  addShelf: (shelfData) => {
    const id = uuidv4();
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [id]: { ...shelfData, id }
      };
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      localStorage.setItem('ritual-bookshelf-active-shelf', id);
      
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
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      
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
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(remainingShelves));
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      localStorage.setItem('ritual-bookshelf-active-shelf', newActiveId);
      
      return { 
        shelves: remainingShelves,
        books: updatedBooks,
        activeShelfId: newActiveId
      };
    });
  },
  
  setActiveShelf: (id) => {
    set({ activeShelfId: id });
    localStorage.setItem('ritual-bookshelf-active-shelf', id);
  },
  
  switchShelf: (id) => {
    set({ activeShelfId: id });
    localStorage.setItem('ritual-bookshelf-active-shelf', id);
  },
  
  addRow: () => {
    const { activeShelfId, shelves } = get();
    if (!activeShelfId) return;
    
    const shelf = shelves[activeShelfId];
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [activeShelfId]: {
          ...shelf,
          rows: shelf.rows + 1
        }
      };
      
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      
      return { shelves: updatedShelves };
    });
  },
  
  removeRow: () => {
    const { activeShelfId, shelves, books } = get();
    if (!activeShelfId) return;
    
    const shelf = shelves[activeShelfId];
    if (shelf.rows <= 1) return;
    
    // Calculate which positions will be removed
    const lastRowPositions = [];
    for (let i = 0; i < shelf.columns; i++) {
      lastRowPositions.push((shelf.rows - 1) * shelf.columns + i);
    }
    
    // Check and remove books in the last row
    const updatedBooks = { ...books };
    Object.keys(updatedBooks).forEach(bookId => {
      const book = updatedBooks[bookId];
      if (book.shelfId === activeShelfId && lastRowPositions.includes(book.position)) {
        delete updatedBooks[bookId];
      }
    });
    
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [activeShelfId]: {
          ...shelf,
          rows: shelf.rows - 1
        }
      };
      
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      
      return {
        shelves: updatedShelves,
        books: updatedBooks
      };
    });
  },
  
  addColumn: () => {
    const { activeShelfId, shelves, books } = get();
    if (!activeShelfId) return;
    
    const shelf = shelves[activeShelfId];
    const newColumns = shelf.columns + 1;
    
    // Adjust book positions for the new column layout
    const updatedBooks = { ...books };
    Object.keys(updatedBooks).forEach(bookId => {
      const book = updatedBooks[bookId];
      if (book.shelfId === activeShelfId) {
        const currentRow = Math.floor(book.position / shelf.columns);
        const currentCol = book.position % shelf.columns;
        const newPosition = currentRow * newColumns + currentCol;
        updatedBooks[bookId] = { ...book, position: newPosition };
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
      
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      
      return {
        shelves: updatedShelves,
        books: updatedBooks
      };
    });
  },
  
  removeColumn: () => {
    const { activeShelfId, shelves, books } = get();
    if (!activeShelfId) return;
    
    const shelf = shelves[activeShelfId];
    if (shelf.columns <= 1) return;
    
    const newColumns = shelf.columns - 1;
    
    // Find books in the last column of each row
    const lastColumnPositions = [];
    for (let row = 0; row < shelf.rows; row++) {
      lastColumnPositions.push(row * shelf.columns + (shelf.columns - 1));
    }
    
    // Remove books in the last column and adjust positions for remaining
    const updatedBooks = { ...books };
    Object.keys(updatedBooks).forEach(bookId => {
      const book = updatedBooks[bookId];
      if (book.shelfId === activeShelfId) {
        if (lastColumnPositions.includes(book.position)) {
          delete updatedBooks[bookId];
        } else {
          const currentRow = Math.floor(book.position / shelf.columns);
          const currentCol = book.position % shelf.columns;
          const newPosition = currentRow * newColumns + currentCol;
          updatedBooks[bookId] = { ...book, position: newPosition };
        }
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
      
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      
      return {
        shelves: updatedShelves,
        books: updatedBooks
      };
    });
  },
  
  setShelfBackground: (id, backgroundImage) => {
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [id]: { 
          ...state.shelves[id], 
          backgroundImage 
        }
      };
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      
      return { shelves: updatedShelves };
    });
    
    toast.success('Background updated');
  },
  
  setShelfTexture: (id, textureImage) => {
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [id]: { 
          ...state.shelves[id], 
          textureImage 
        }
      };
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      
      return { shelves: updatedShelves };
    });
    
    toast.success('Shelf texture updated');
  },
  
  resetShelfStyle: (id) => {
    set((state) => {
      const { 
        backgroundImage, 
        backgroundColor, 
        backgroundOpacity, 
        textureImage, 
        shelfColor, 
        shelfOpacity, 
        ...restShelfData 
      } = state.shelves[id];
      
      const updatedShelves = {
        ...state.shelves,
        [id]: restShelfData
      };
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      
      return { shelves: updatedShelves };
    });
    
    toast.success('Shelf style reset to default');
  }
});
