
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
    console.log("[UISlice] Opening customization modal - State before update:", JSON.stringify(get(), null, 2));
    set((state) => {
      console.log("[UISlice] Inside set function, current state:", state.isCustomizationModalOpen);
      const newState = { isCustomizationModalOpen: true };
      console.log("[UISlice] New state to apply:", newState);
      return newState;
    });
    console.log("[UISlice] Opening customization modal - AFTER:", get().isCustomizationModalOpen);
    console.log("[UISlice] Full state after update:", JSON.stringify(get(), null, 2));
  },
  
  closeCustomizationModal: () => {
    console.log("[UISlice] Closing customization modal - BEFORE:", get().isCustomizationModalOpen);
    console.log("[UISlice] Closing customization modal - State before update:", JSON.stringify(get(), null, 2));
    set((state) => {
      console.log("[UISlice] Inside close function, current state:", state.isCustomizationModalOpen);
      const newState = { isCustomizationModalOpen: false };
      console.log("[UISlice] New state to apply:", newState);
      return newState;
    });
    console.log("[UISlice] Closing customization modal - AFTER:", get().isCustomizationModalOpen);
    console.log("[UISlice] Full state after update:", JSON.stringify(get(), null, 2));
  }
});
