
import { CustomizationSliceCreator } from './types';
import { createStorageActions } from './storage/storageActions';
import { createThemeActions } from './storage/themeActions';

export const createStorageSlice: CustomizationSliceCreator = (set, get, api) => {
  // Combine all actions from individual slices
  return {
    ...createThemeActions(set, get, api),
    ...createStorageActions(set, get, api)
  };
};
