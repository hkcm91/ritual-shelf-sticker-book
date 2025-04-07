
// Define shelf styling interfaces
export interface ShelfStyling {
  thickness: number;
  color: string;
  backgroundImage?: string;
  opacity: number;
  dividers: ShelfDividers;
}

export interface ShelfDividers {
  enabled: boolean;
  booksPerSection: number;
  booksPerRow: number;
  thickness: number;
  color: string;
  opacity?: number;
  orientation: 'vertical' | 'horizontal' | 'both';
}

export interface ShelfStylingActions {
  updateShelfThickness: (thickness: number) => void;
  updateShelfColor: (color: string) => void;
  updateShelfBackgroundImage: (url: string) => void;
  updateShelfOpacity: (opacity: number) => void;
  toggleDividers: (enabled: boolean) => void;
  updateDividersSetting: (
    property: 'booksPerSection' | 'booksPerRow' | 'thickness' | 'color' | 'orientation' | 'opacity',
    value: any
  ) => void;
  updateAllDividerSettings: (settings: Partial<ShelfDividers>) => void;
}
