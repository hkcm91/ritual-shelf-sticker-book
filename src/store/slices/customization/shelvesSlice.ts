
import { CustomizationSliceCreator } from './types';

export const createShelvesSlice: CustomizationSliceCreator = (set) => ({
  // Shelf settings
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
  
  // Divider settings
  toggleDividers: (enabled: boolean) => set((state) => ({
    shelfStyling: { 
      ...state.shelfStyling, 
      dividers: { ...state.shelfStyling.dividers, enabled } 
    }
  })),
  
  updateDividersSetting: (property: 'booksPerSection' | 'booksPerRow' | 'thickness' | 'color' | 'orientation' | 'opacity', value: any) => set((state) => ({
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
