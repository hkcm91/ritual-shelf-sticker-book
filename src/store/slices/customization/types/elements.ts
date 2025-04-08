
export interface SlotStyle {
  addButtonBg: string;
  addButtonColor: string;
  addButtonHoverBg: string;
  toggleInactiveColor: string;
  toggleActiveColor: string;
  toggleBorderColor: string;
  emptyHoverBg: string;
  bookSlotColor?: string;
  notebookSlotColor?: string;
  recipeSlotColor?: string;
  musicSlotColor?: string;
  stickerSlotColor?: string;
}

export interface HeaderStyle {
  background: string;
  backgroundImage: string;
  textColor: string;
}

export interface ElementStyleActions {
  updateSlotSetting: (
    property: 'addButtonBg' | 'addButtonColor' | 'addButtonHoverBg' | 
              'toggleInactiveColor' | 'toggleActiveColor' | 'toggleBorderColor' | 
              'emptyHoverBg' | 'bookSlotColor' | 'notebookSlotColor' | 
              'recipeSlotColor' | 'musicSlotColor' | 'stickerSlotColor',
    value: string
  ) => void;
  
  updateHeaderSetting: (
    property: 'background' | 'backgroundImage' | 'textColor',
    value: string
  ) => void;
}
