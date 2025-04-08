
export interface BookData {
  id: string;
  title: string;
  author: string;
  coverURL: string | undefined;
  notes?: string;
  position: number;
  shelfId: string;
  isSticker?: boolean;
  position2D?: { x: number; y: number };
  scale?: number;
  rotation?: number;
  date?: string;
  color?: string;
  zIndex?: number;
  hidden?: boolean;
  originalPosition?: number;
  progress?: number;
  series?: string;
  rating?: number;
  characters?: string[];
  plot?: string;
  quizzes?: any[]; // Consider using a more specific type if available
}

export interface ShelfData {
  id: string;
  name: string;
  rows: number;
  columns: number;
  type?: 'book' | 'notebook' | 'recipe' | 'music';
  backgroundImage?: string;
  textureImage?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  shelfColor?: string;
  shelfOpacity?: number;
}

export type SlotType = 'book' | 'sticker' | 'recipe' | 'music' | 'notebook';

export interface SlotCompatibility {
  book: SlotType[];
  notebook: SlotType[];
  recipe: SlotType[];
  music: SlotType[];
}
