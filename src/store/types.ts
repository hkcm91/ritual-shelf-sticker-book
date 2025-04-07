
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
  // Add missing properties that are causing TypeScript errors
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
  backgroundImage?: string;
  textureImage?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  shelfColor?: string;
  shelfOpacity?: number;
}
