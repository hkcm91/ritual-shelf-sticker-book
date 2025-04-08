import { StateCreator } from 'zustand';
import { useRef } from 'react';

export interface UISlice {
  isModalOpen: boolean;
  activeBookId: string | null;
  draggedBook: string | null;
  zoomLevel: number;
  isBookSearchOpen: boolean;
  isCustomizationModalOpen: boolean;
  scrollPositionRef: { current: { x: number; y: number } };
  openModal: (bookId: string) => void;
  closeModal: () => void;
  setDraggedBook: (bookId: string | null) => void;
  getDraggedBook: () => any | null; // Using 'any' here since it references the BookData type from another slice
  setZoom: (level: number) => void;
  setBookSearchOpen: (isOpen: boolean) => void;
  openCustomizationModal: () => void;
  closeCustomizationModal: () => void;
}

// Create a stable reference object outside of the store
// This prevents recreating the ref on each render
const stableScrollPositionRef = { current: { x: 0, y: 0 } };

export const createUISlice: StateCreator<
  UISlice & { books: Record<string, any> },
  [],
  [],
  UISlice
> = (set, get) => ({
  isModalOpen: false,
  activeBookId: null,
  draggedBook: null,
  zoomLevel: 1,
  isBookSearchOpen: false,
  isCustomizationModalOpen: false,
  scrollPositionRef: stableScrollPositionRef,
  
  openModal: (bookId) => {
    console.log("[UISlice] Opening book modal with ID:", bookId);
    set({ isModalOpen: true, activeBookId: bookId });
  },
  
  closeModal: () => {
    console.log("[UISlice] Closing book modal");
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
    console.log("[UISlice] Setting book search open state:", isOpen);
    set({ isBookSearchOpen: isOpen });
  },
  
  openCustomizationModal: () => {
    console.log("[UISlice] Opening customization modal - BEFORE:", get().isCustomizationModalOpen);
    set((state) => {
      console.log("[UISlice] Setting customization modal to TRUE");
      return { isCustomizationModalOpen: true };
    });
    console.log("[UISlice] Opening customization modal - AFTER:", get().isCustomizationModalOpen);
  },
  
  closeCustomizationModal: () => {
    console.log("[UISlice] Closing customization modal - BEFORE:", get().isCustomizationModalOpen);
    set((state) => {
      console.log("[UISlice] Setting customization modal to FALSE");
      return { isCustomizationModalOpen: false };
    });
    console.log("[UISlice] Closing customization modal - AFTER:", get().isCustomizationModalOpen);
  }
});
