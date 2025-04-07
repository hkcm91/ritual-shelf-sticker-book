
import { StateCreator } from 'zustand';

export interface UISlice {
  isModalOpen: boolean;
  activeBookId: string | null;
  draggedBook: string | null;
  zoomLevel: number;
  isBookSearchOpen: boolean;
  isCustomizationModalOpen: boolean;
  openModal: (bookId: string) => void;
  closeModal: () => void;
  setDraggedBook: (bookId: string | null) => void;
  getDraggedBook: () => any | null; // Using 'any' here since it references the BookData type from another slice
  setZoom: (level: number) => void;
  setBookSearchOpen: (isOpen: boolean) => void;
  openCustomizationModal: () => void;
  closeCustomizationModal: () => void;
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
  isBookSearchOpen: false,
  isCustomizationModalOpen: false,
  
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
  },
  
  setBookSearchOpen: (isOpen) => {
    set({ isBookSearchOpen: isOpen });
  },
  
  openCustomizationModal: () => {
    set({ isCustomizationModalOpen: true });
  },
  
  closeCustomizationModal: () => {
    set({ isCustomizationModalOpen: false });
  }
});
