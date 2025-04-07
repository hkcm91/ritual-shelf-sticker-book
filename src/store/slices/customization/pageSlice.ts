
import { CustomizationSliceCreator } from './types';

export const createPageSlice: CustomizationSliceCreator = (set) => ({
  // Page settings
  updatePageBackground: (color: string) => set((state) => ({ 
    page: { ...state.page, background: color } 
  })),
  
  updatePageBackgroundImage: (url: string) => set((state) => ({ 
    page: { ...state.page, backgroundImage: url } 
  })),
});
