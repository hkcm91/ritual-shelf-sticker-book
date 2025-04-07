
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
> = (set, get) => ({
  isModalOpen: false,
  activeBookId: null,
  draggedBook: null,
  zoomLevel: 1,
  isBookSearchOpen: false,
  isCustomizationModalOpen: false,
  
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
    set({ isCustomizationModalOpen: true });
    console.log("[UISlice] Opening customization modal - AFTER:", get().isCustomizationModalOpen);
  },
  
  closeCustomizationModal: () => {
    console.log("[UISlice] Closing customization modal - BEFORE:", get().isCustomizationModalOpen);
    set({ isCustomizationModalOpen: false });
    console.log("[UISlice] Closing customization modal - AFTER:", get().isCustomizationModalOpen);
  }
});
