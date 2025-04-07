
import { StateCreator } from 'zustand';
import { BookshelfState } from '../../../bookshelfStore';
import { ThemeName } from '@/themes';

// Update the type for slice creators to match the change in index.ts
export type CustomizationSliceCreator = StateCreator<
  BookshelfState,
  [],
  [],
  Partial<BookshelfState>
>;

// Type for slice actions only
export type CustomizationActionSlice = Partial<BookshelfState>;

// Base interface for UI state
export interface UIState {
  isCustomizationModalOpen: boolean;
}

// UI Actions
export interface UIActions {
  openCustomizationModal: () => void;
  closeCustomizationModal: () => void;
}
