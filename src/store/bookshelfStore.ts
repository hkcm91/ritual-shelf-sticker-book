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
  
  activeTheme: defaultCustomization.activeTheme,
  setActiveTheme: defaultCustomization.setActiveTheme,
  page: defaultCustomization.page,
  container: defaultCustomization.container,
  shelfStyling: defaultCustomization.shelfStyling,
  slots: defaultCustomization.slots,
  header: defaultCustomization.header,
  ui: defaultCustomization.ui,
  
  openCustomizationModal: () => set((state) => ({ 
    ui: { ...state.ui, isCustomizationModalOpen: true } 
  })),
  
  closeCustomizationModal: () => set((state) => ({ 
    ui: { ...state.ui, isCustomizationModalOpen: false } 
  })),
  
  updatePageBackground: (color: string) => set((state) => ({ 
    page: { ...state.page, background: color } 
  })),
  
  updatePageBackgroundImage: (url: string) => set((state) => ({ 
    page: { ...state.page, backgroundImage: url } 
  })),
  
  updatePageSetting: (
    property: 'backgroundSize' | 'backgroundRepeat' | 'backgroundPosition' | 'backgroundAttachment',
    value: string
  ) => set((state) => ({
    page: { ...state.page, [property]: value }
  })),
  
  updateContainerBackground: (color: string) => set((state) => ({ 
    container: { ...state.container, background: color } 
  })),
  
  updateContainerBackgroundImage: (url: string) => set((state) => ({ 
    container: { ...state.container, backgroundImage: url } 
  })),
  
  updateContainerOpacity: (opacity: number) => set((state) => ({ 
    container: { ...state.container, opacity } 
  })),
  
  updateContainerBorder: (property, value) => set((state) => ({ 
    container: { ...state.container, [property]: value } 
  })),
  
  updateContainerPadding: (padding: number) => set((state) => ({ 
    container: { ...state.container, padding } 
  })),
  
  updateShelfThickness: (thickness: number) => set((state) => ({
    shelfStyling: { ...state.shelfStyling, thickness }
  })),
  
  updateShelfColor: (color: string) => set((state) => ({
    shelfStyling: { ...state.shelfStyling, color }
  })),
  
  updateShelfBackgroundImage: (url: string) => set((state) => ({
    shelfStyling: { ...state.shelfStyling, backgroundImage: url }
  })),
  
  updateShelfOpacity: (opacity: number) => set((state) => ({
    shelfStyling: { ...state.shelfStyling, opacity }
  })),
  
  toggleDividers: (enabled: boolean) => set((state) => ({
    shelfStyling: { 
      ...state.shelfStyling, 
      dividers: { ...state.shelfStyling.dividers, enabled } 
    }
  })),
  
  updateDividersSetting: (property, value) => set((state) => ({
    shelfStyling: { 
      ...state.shelfStyling, 
      dividers: { ...state.shelfStyling.dividers, [property]: value } 
    }
  })),
  
  updateSlotSetting: (property, value) => set((state) => ({ 
    slots: { ...state.slots, [property]: value } 
  })),
  
  updateHeaderSetting: (property, value) => set((state) => ({ 
    header: { ...state.header, [property]: value } 
  })),
  
  saveCustomization: () => {
    try {
      const state = get();
      localStorage.setItem('bookshelf-customization', JSON.stringify({
        page: state.page, 
        container: state.container, 
        shelfStyling: state.shelfStyling, 
        slots: state.slots, 
        header: state.header,
        activeTheme: state.activeTheme
      }));
      
      toast.success('Customization settings saved');
    } catch (error) {
      console.error('Failed to save customization:', error);
      toast.error('Failed to save customization settings');
    }
  },
  
  loadCustomization: () => {
    try {
      const savedCustomization = localStorage.getItem('bookshelf-customization');
      const savedTheme = localStorage.getItem('bookshelf-active-theme');
      
      if (savedCustomization) {
        const parsed = JSON.parse(savedCustomization);
        set(parsed);
      }
      
      if (savedTheme) {
        set({ activeTheme: savedTheme });
      }
      
    } catch (error) {
      console.error('Failed to load customization:', error);
      toast.error('Failed to load saved customization settings');
    }
  },
  
  resetCustomization: () => {
    set({
      page: defaultCustomization.page,
      container: defaultCustomization.container,
      shelfStyling: defaultCustomization.shelfStyling,
      slots: defaultCustomization.slots,
      header: defaultCustomization.header,
      activeTheme: 'default'
    });
    
    localStorage.removeItem('bookshelf-customization');
    localStorage.removeItem('bookshelf-active-theme');
    
    toast.success('Customization settings reset to defaults');
  },
  
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
