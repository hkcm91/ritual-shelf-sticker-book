
import { CustomizationSliceCreator } from './types';

export const createHeaderSlice: CustomizationSliceCreator = (set) => ({
  // Header settings
  updateHeaderSetting: (
    property: 'background' | 'backgroundImage' | 'textColor',
    value: string
  ) => set((state) => ({ 
    header: { ...state.header, [property]: value } 
  })),
});
