
import { CustomizationSliceCreator } from './types';

export const createContainerSlice: CustomizationSliceCreator = (set) => ({
  // Container settings
  updateContainerBackground: (color: string) => set((state) => ({ 
    container: { ...state.container, background: color } 
  })),
  
  updateContainerBackgroundImage: (url: string) => set((state) => ({ 
    container: { ...state.container, backgroundImage: url } 
  })),
  
  updateContainerOpacity: (opacity: number) => set((state) => ({ 
    container: { ...state.container, opacity } 
  })),
  
  updateContainerBorder: (property: 'borderWidth' | 'borderStyle' | 'borderColor' | 'borderRadius', value: any) => 
    set((state) => ({ 
      container: { ...state.container, [property]: value } 
    })),
  
  updateContainerPadding: (padding: number) => set((state) => ({ 
    container: { ...state.container, padding } 
  })),
});
