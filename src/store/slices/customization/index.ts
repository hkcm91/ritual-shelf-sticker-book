
import { defaultCustomization } from './types';
import { createUISlice } from './uiSlice';
import { createPageSlice } from './pageSlice';
import { createContainerSlice } from './containerSlice';
import { createShelvesSlice } from './shelvesSlice';
import { createSlotsSlice } from './slotsSlice';
import { createHeaderSlice } from './headerSlice';
import { createStorageSlice } from './storageSlice';
import { CustomizationSliceCreator, CustomizationState } from './types';

export const createCustomizationSlice: CustomizationSliceCreator = (set, get, api) => {
  // Combine all slices with default values, ensuring all required properties are present
  return {
    // Default state values first (these are all the required properties)
    ...defaultCustomization,
    
    // Then add all actions from individual slices
    ...createUISlice(set, get, api),
    ...createPageSlice(set, get, api),
    ...createContainerSlice(set, get, api),
    ...createShelvesSlice(set, get, api),
    ...createSlotsSlice(set, get, api),
    ...createHeaderSlice(set, get, api),
    ...createStorageSlice(set, get, api)
  } as CustomizationState; // Assert this is a complete CustomizationState
};

// Export types
export type { CustomizationState, ShelfStyling } from './types';
