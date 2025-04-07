
import { CustomizationSliceCreator } from './types';

export const createUISlice: CustomizationSliceCreator = (set) => ({
  // UI actions
  openCustomizationModal: () => set((state) => ({ 
    ui: { ...state.ui, isCustomizationModalOpen: true } 
  })),
  
  closeCustomizationModal: () => set((state) => ({ 
    ui: { ...state.ui, isCustomizationModalOpen: false } 
  })),
  
  setLinkDividerToShelfColor: (linked: boolean) => set((state) => {
    const newState = { 
      ui: { ...state.ui, linkDividerToShelfColor: linked } 
    };
    
    // When linking is enabled, update divider color to match shelf color
    if (linked) {
      newState.shelfStyling = {
        ...state.shelfStyling,
        dividers: {
          ...state.shelfStyling.dividers,
          color: state.shelfStyling.color
        }
      };
    }
    
    return newState;
  }),
});
