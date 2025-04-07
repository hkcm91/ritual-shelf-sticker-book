
import { defaultCustomization } from './types';
import { createUISlice } from './uiSlice';
import { createPageSlice } from './pageSlice';
import { createContainerSlice } from './containerSlice';
import { createShelvesSlice } from './shelvesSlice';
import { createSlotsSlice } from './slotsSlice';
import { createHeaderSlice } from './headerSlice';
import { createStorageSlice } from './storageSlice';
import { StateCreator } from 'zustand';
import { BookshelfState } from '../../bookshelfStore';

// Export the default customization for use in the main store
export { defaultCustomization } from './types';

// Correct the type signature to return only the CustomizationState part
export const createCustomizationSlice: StateCreator<
  BookshelfState,
  [],
  [],
  Partial<BookshelfState>
> = (set, get, api) => {
  // Start with the base customization state to ensure all required properties are present
  const baseState = {
    ...defaultCustomization,
  };
  
  // Combine with all actions from individual slices
  return {
    ...baseState,
    ...createUISlice(set, get, api),
    ...createPageSlice(set, get, api),
    ...createContainerSlice(set, get, api),
    ...createShelvesSlice(set, get, api),
    ...createSlotsSlice(set, get, api),
    ...createHeaderSlice(set, get, api),
    ...createStorageSlice(set, get, api)
  };
};

// Export types
export type { CustomizationState, ShelfStyling } from './types';
