
import { CustomizationSliceCreator } from './types';

export const createShelvesSlice: CustomizationSliceCreator = (set) => ({
  // Shelf settings
  updateShelfThickness: (thickness: number) => set((state) => ({
    shelfStyling: { ...state.shelfStyling, thickness }
  })),
  
  updateShelfColor: (color: string) => set((state) => {
    const newState = {
      shelfStyling: { ...state.shelfStyling, color }
    };
    
    // Auto-update divider color if they are linked
    if (state.shelfStyling.dividers.enabled && 
        state.ui.linkDividerToShelfColor) {
      newState.shelfStyling.dividers = {
        ...state.shelfStyling.dividers,
        color: color
      };
    }
    
    return newState;
  }),
  
  updateShelfBackgroundImage: (url: string) => set((state) => ({
    shelfStyling: { ...state.shelfStyling, backgroundImage: url }
  })),
  
  updateShelfOpacity: (opacity: number) => set((state) => ({
    shelfStyling: { ...state.shelfStyling, opacity }
  })),
  
  // Divider settings
  toggleDividers: (enabled: boolean) => set((state) => {
    // When enabling dividers, set defaults that look good
    const dividers = enabled ? {
      ...state.shelfStyling.dividers,
      enabled,
      // If this is the first time enabling, use good defaults
      thickness: state.shelfStyling.dividers.thickness || 6,
      color: state.shelfStyling.dividers.color || state.shelfStyling.color,
      opacity: state.shelfStyling.dividers.opacity || 0.8,
      height: state.shelfStyling.dividers.height || 200
    } : { ...state.shelfStyling.dividers, enabled };
    
    return {
      shelfStyling: { 
        ...state.shelfStyling, 
        dividers 
      },
      // When enabling, also turn on linking by default
      ui: enabled ? { ...state.ui, linkDividerToShelfColor: true } : state.ui
    };
  }),
  
  updateDividersSetting: (property: 'booksPerSection' | 'booksPerRow' | 'thickness' | 'color' | 'orientation' | 'opacity' | 'height', value: any) => set((state) => ({
    shelfStyling: { 
      ...state.shelfStyling, 
      dividers: { ...state.shelfStyling.dividers, [property]: value } 
    }
  })),
  
  // Helper function to update all divider settings at once
  updateAllDividerSettings: (settings: {
    enabled?: boolean;
    booksPerSection?: number;
    booksPerRow?: number;
    thickness?: number;
    color?: string;
    opacity?: number;
    orientation?: 'vertical' | 'horizontal' | 'both';
    height?: number;
  }) => set((state) => ({
    shelfStyling: {
      ...state.shelfStyling,
      dividers: { 
        ...state.shelfStyling.dividers,
        ...settings
      }
    }
  })),
});
