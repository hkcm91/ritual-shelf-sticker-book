
import { ShelfData } from '@/store/types';

export const getThemeColors = (currentLibrary: ShelfData | null): string => {
  if (!currentLibrary) return 'text-purple-300';
  
  switch(currentLibrary.type) {
    case 'book': return 'text-amber-300';
    case 'notebook': return 'text-emerald-300';
    case 'recipe': return 'text-rose-300';
    case 'music': return 'text-purple-300';
    default: return 'text-amber-300';
  }
};

export const getButtonGradient = (currentLibrary: ShelfData | null): string => {
  if (!currentLibrary) return 'from-purple-600 to-indigo-800';
  
  switch(currentLibrary.type) {
    case 'book': return 'from-amber-600 to-amber-800';
    case 'notebook': return 'from-emerald-600 to-emerald-800';
    case 'recipe': return 'from-rose-600 to-rose-800';
    case 'music': return 'from-purple-600 to-indigo-800';
    default: return 'from-amber-600 to-amber-800';
  }
};
