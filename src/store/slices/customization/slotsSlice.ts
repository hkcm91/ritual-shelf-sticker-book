
import { CustomizationSliceCreator } from './types';

export const createSlotsSlice: CustomizationSliceCreator = (set) => ({
  // Slots settings
  updateSlotSetting: (
    property: 'addButtonBg' | 'addButtonColor' | 'addButtonHoverBg' | 
              'toggleInactiveColor' | 'toggleActiveColor' | 'toggleBorderColor' | 
              'emptyHoverBg',
    value: string
  ) => set((state) => ({ 
    slots: { ...state.slots, [property]: value } 
  })),
});
