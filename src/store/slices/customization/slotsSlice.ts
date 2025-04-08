
import { CustomizationSliceCreator } from './types';

export const createSlotsSlice: CustomizationSliceCreator = (set) => ({
  // Slots settings
  updateSlotSetting: (
    property: 'addButtonBg' | 'addButtonColor' | 'addButtonHoverBg' | 
              'toggleInactiveColor' | 'toggleActiveColor' | 'toggleBorderColor' | 
              'emptyHoverBg' | 'bookSlotColor' | 'notebookSlotColor' | 
              'recipeSlotColor' | 'musicSlotColor' | 'stickerSlotColor',
    value: string
  ) => set((state) => ({ 
    slots: { ...state.slots, [property]: value } 
  })),
  
  // Helper to set all slot types at once
  updateAllSlotSettings: (settings: {
    addButtonBg?: string;
    addButtonColor?: string;
    addButtonHoverBg?: string;
    toggleInactiveColor?: string;
    toggleActiveColor?: string;
    toggleBorderColor?: string;
    emptyHoverBg?: string;
    bookSlotColor?: string;
    notebookSlotColor?: string;
    recipeSlotColor?: string;
    musicSlotColor?: string;
    stickerSlotColor?: string;
  }) => set((state) => ({
    slots: { ...state.slots, ...settings }
  })),
});
