
import { StateCreator } from 'zustand';

export interface UISlice {
  isModalOpen: boolean;
  activeBookId: string | null;
  draggedBook: string | null;
  zoomLevel: number;
  openModal: (bookId: string) => void;
  closeModal: () => void;
  setDraggedBook: (bookId: string | null) => void;
  getDraggedBook: () => any | null; // Using 'any' here since it references the BookData type from another slice
  setZoom: (level: number) => void;
}

export const createUISlice: StateCreator<
  UISlice & { books: Record<string, any> },
  [],
  [],
  UISlice
> = (set, get, store) => ({
  isModalOpen: false,
  activeBookId: null,
  draggedBook: null,
  zoomLevel: 1,
  
  openModal: (bookId) => {
    set({ isModalOpen: true, activeBookId: bookId });
  },
  
  closeModal: () => {
    set({ isModalOpen: false, activeBookId: null });
  },
  
  setDraggedBook: (bookId) => {
    set({ draggedBook: bookId });
  },
  
  getDraggedBook: () => {
    const { draggedBook, books } = get();
    return draggedBook ? books[draggedBook] : null;
  },
  
  setZoom: (level) => {
    set({ zoomLevel: level });
  }
});
