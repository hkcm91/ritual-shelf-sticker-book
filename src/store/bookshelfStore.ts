
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookData = {
  id: string;
  title: string;
  author: string;
  series?: string;
  coverURL: string;
  progress: number;
  rating: number;
  characters?: string;
  plot?: string;
  shelfId: string;
  position: number;
};

export type Shelf = {
  id: string;
  name: string;
  rows: number;
  columns: number;
};

type BookshelfState = {
  books: Record<string, BookData>;
  shelves: Record<string, Shelf>;
  activeShelfId: string;
  activeBookId: string | null;
  zoomLevel: number;
  isModalOpen: boolean;
  getDraggedBook: () => BookData | null;
  setDraggedBook: (id: string | null) => void;
  
  // Books actions
  addBook: (book: Omit<BookData, 'id'>) => string;
  updateBook: (id: string, data: Partial<BookData>) => void;
  deleteBook: (id: string) => void;
  moveBook: (id: string, newPosition: number) => void;
  
  // Shelf actions
  addShelf: (name: string) => string;
  updateShelf: (id: string, data: Partial<Shelf>) => void;
  deleteShelf: (id: string) => void;
  switchShelf: (id: string) => void;
  addRow: () => void;
  removeRow: () => void;
  addColumn: () => void;
  removeColumn: () => void;
  
  // Modal
  openModal: (bookId: string | null) => void;
  closeModal: () => void;
  
  // Zoom
  setZoom: (level: number) => void;
};

export const useBookshelfStore = create<BookshelfState>()(
  persist(
    (set, get) => {
      // Helper to generate IDs
      const generateId = () => Math.random().toString(36).substring(2, 9);
      let draggedBookId: string | null = null;
      
      return {
        books: {},
        shelves: {},
        activeShelfId: '',
        activeBookId: null,
        zoomLevel: 1,
        isModalOpen: false,
        
        getDraggedBook: () => {
          if (!draggedBookId) return null;
          return get().books[draggedBookId] || null;
        },
        
        setDraggedBook: (id) => {
          draggedBookId = id;
        },
        
        // Books actions
        addBook: (bookData) => {
          const id = generateId();
          const { activeShelfId, books } = get();
          
          // Find next available position
          const shelfBooks = Object.values(books).filter(b => b.shelfId === activeShelfId);
          const maxPosition = shelfBooks.length > 0 
            ? Math.max(...shelfBooks.map(b => b.position)) 
            : -1;
          const newPosition = maxPosition + 1;
          
          const newBook = {
            ...bookData,
            id,
            position: newPosition,
            shelfId: activeShelfId,
          };
          
          set((state) => ({
            books: {
              ...state.books,
              [id]: newBook,
            },
          }));
          
          return id;
        },
        
        updateBook: (id, data) => {
          set((state) => ({
            books: {
              ...state.books,
              [id]: {
                ...state.books[id],
                ...data,
              },
            },
          }));
        },
        
        deleteBook: (id) => {
          set((state) => {
            const { [id]: deletedBook, ...remainingBooks } = state.books;
            return { books: remainingBooks };
          });
        },
        
        moveBook: (id, newPosition) => {
          const { books, activeShelfId } = get();
          const book = books[id];
          
          if (!book) return;
          
          // Update the moved book's position
          set((state) => ({
            books: {
              ...state.books,
              [id]: {
                ...book,
                position: newPosition,
              },
            },
          }));
        },
        
        // Shelf actions
        addShelf: (name) => {
          const id = generateId();
          const newShelf: Shelf = {
            id,
            name,
            rows: 3,
            columns: 6,
          };
          
          set((state) => ({
            shelves: {
              ...state.shelves,
              [id]: newShelf,
            },
            activeShelfId: id,
          }));
          
          return id;
        },
        
        updateShelf: (id, data) => {
          set((state) => ({
            shelves: {
              ...state.shelves,
              [id]: {
                ...state.shelves[id],
                ...data,
              },
            },
          }));
        },
        
        deleteShelf: (id) => {
          set((state) => {
            const { [id]: deletedShelf, ...remainingShelves } = state.shelves;
            
            // If deleting the active shelf, switch to another shelf
            let nextActiveId = state.activeShelfId;
            if (id === state.activeShelfId) {
              const shelfIds = Object.keys(remainingShelves);
              nextActiveId = shelfIds.length > 0 ? shelfIds[0] : '';
            }
            
            // Also delete books in this shelf
            const updatedBooks = { ...state.books };
            Object.keys(updatedBooks).forEach(bookId => {
              if (updatedBooks[bookId].shelfId === id) {
                delete updatedBooks[bookId];
              }
            });
            
            return { 
              shelves: remainingShelves,
              activeShelfId: nextActiveId,
              books: updatedBooks
            };
          });
        },
        
        switchShelf: (id) => {
          set({ activeShelfId: id });
        },
        
        addRow: () => {
          const { activeShelfId, shelves } = get();
          const shelf = shelves[activeShelfId];
          
          if (shelf) {
            set((state) => ({
              shelves: {
                ...state.shelves,
                [activeShelfId]: {
                  ...shelf,
                  rows: shelf.rows + 1,
                },
              },
            }));
          }
        },
        
        removeRow: () => {
          const { activeShelfId, shelves } = get();
          const shelf = shelves[activeShelfId];
          
          if (shelf && shelf.rows > 1) {
            set((state) => ({
              shelves: {
                ...state.shelves,
                [activeShelfId]: {
                  ...shelf,
                  rows: shelf.rows - 1,
                },
              },
            }));
          }
        },
        
        addColumn: () => {
          const { activeShelfId, shelves } = get();
          const shelf = shelves[activeShelfId];
          
          if (shelf) {
            set((state) => ({
              shelves: {
                ...state.shelves,
                [activeShelfId]: {
                  ...shelf,
                  columns: shelf.columns + 1,
                },
              },
            }));
          }
        },
        
        removeColumn: () => {
          const { activeShelfId, shelves } = get();
          const shelf = shelves[activeShelfId];
          
          if (shelf && shelf.columns > 1) {
            set((state) => ({
              shelves: {
                ...state.shelves,
                [activeShelfId]: {
                  ...shelf,
                  columns: shelf.columns - 1,
                },
              },
            }));
          }
        },
        
        // Modal
        openModal: (bookId) => {
          set({ isModalOpen: true, activeBookId: bookId });
        },
        
        closeModal: () => {
          set({ isModalOpen: false, activeBookId: null });
        },
        
        // Zoom
        setZoom: (level) => {
          set({ zoomLevel: level });
        },
      };
    },
    {
      name: 'ritual-bookshelf-storage',
    }
  )
);

// Initialize a default shelf if none exists
export const initializeDefaultShelf = () => {
  const { shelves, addShelf } = useBookshelfStore.getState();
  
  if (Object.keys(shelves).length === 0) {
    const id = addShelf('My First Shelf');
    useBookshelfStore.setState({ activeShelfId: id });
    return id;
  }
  
  return Object.keys(shelves)[0];
};
