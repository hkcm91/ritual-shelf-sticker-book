
import { CustomizationSliceCreator, CustomizationActionSlice } from './types';

export const createUISlice: CustomizationSliceCreator = (set) => ({
  // UI actions
  openCustomizationModal: () => set((state) => ({ 
    ui: { ...state.ui, isCustomizationModalOpen: true } 
  })),
  
  closeCustomizationModal: () => set((state) => ({ 
    ui: { ...state.ui, isCustomizationModalOpen: false } 
  })),
});
