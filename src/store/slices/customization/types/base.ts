
// Base customization state interfaces
export interface UIState {
  isCustomizationModalOpen: boolean;
  linkDividerToShelfColor: boolean;
}

export interface UIActions {
  openCustomizationModal: () => void;
  closeCustomizationModal: () => void;
  setLinkDividerToShelfColor: (linked: boolean) => void;
}

// Type for customization slice creation functions
export type CustomizationSliceCreator = (
  set: <T extends Object>(
    partial: T | ((state: any) => T),
    replace?: boolean | undefined
  ) => void,
  get: () => any,
  api: any
) => any;
