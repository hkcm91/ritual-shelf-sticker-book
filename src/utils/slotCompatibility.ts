
import { SlotType, SlotCompatibility } from '../store/types';

// Define which slot types are compatible with each library type
export const SLOT_COMPATIBILITY: SlotCompatibility = {
  book: ['book', 'sticker'], // Book libraries accept book and sticker slots
  notebook: ['notebook', 'sticker'], // Notebook libraries accept notebook and sticker slots
  recipe: ['recipe', 'sticker'], // Recipe libraries accept recipe and sticker slots
  music: ['music', 'sticker'] // Music libraries accept music and sticker slots
};

/**
 * Checks if a slot type is compatible with a library type
 */
export const isSlotCompatibleWithLibrary = (
  slotType: SlotType,
  libraryType: 'book' | 'notebook' | 'recipe' | 'music' = 'book'
): boolean => {
  return SLOT_COMPATIBILITY[libraryType].includes(slotType);
};

/**
 * Gets the allowed slot types for a specific library type
 */
export const getAllowedSlotTypes = (
  libraryType: 'book' | 'notebook' | 'recipe' | 'music' = 'book'
): SlotType[] => {
  return SLOT_COMPATIBILITY[libraryType];
};

/**
 * Gets the first compatible slot type for a library
 * (used as default when switching library types)
 */
export const getDefaultSlotType = (
  libraryType: 'book' | 'notebook' | 'recipe' | 'music' = 'book'
): SlotType => {
  return SLOT_COMPATIBILITY[libraryType][0];
};
