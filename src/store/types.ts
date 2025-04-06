
import { z } from 'zod';

// Types
export type BookData = {
  id: string;
  title: string;
  author: string;
  coverURL: string;
  series?: string;
  progress: number;
  rating: number;
  position: number;
  shelfId: string;
  characters?: string;
  plot?: string;
  notes?: string;
  quizzes?: {question: string, answer: string}[];
  isSticker?: boolean;
  opacity?: number;
  hidden?: boolean;
  originalPosition?: number;
};

export type ShelfData = {
  id: string;
  name: string;
  rows: number;
  columns: number;
  backgroundColor?: string;
  backgroundOpacity?: number;
  backgroundImage?: string;
  textureImage?: string;
  shelfColor?: string;
  shelfOpacity?: number;
};

export type StickerScale = number;
export type StickerRotation = number;

// Validation schemas can be added here if needed
