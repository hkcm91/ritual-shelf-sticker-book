
export interface SlotStyle {
  addButtonBg: string;
  addButtonColor: string;
  addButtonHoverBg: string;
  toggleInactiveColor: string;
  toggleActiveColor: string;
  toggleBorderColor: string;
  emptyHoverBg: string;
}

export interface HeaderStyle {
  background: string;
  backgroundImage: string;
  textColor: string;
}

export interface ElementStyleActions {
  updateSlotSetting: (
    property: keyof SlotStyle,
    value: string
  ) => void;
  
  updateHeaderSetting: (
    property: keyof HeaderStyle,
    value: string
  ) => void;
}
