
import { StateCreator } from 'zustand';
import { toast } from 'sonner';
import { ShelfData } from '../types';
import { saveShelvesToStorage } from '../utils/shelfUtils';

export interface ShelfStylesSlice {
  setShelfBackground: (id: string, backgroundImage: string) => void;
  setShelfTexture: (id: string, textureImage: string) => void;
  resetShelfStyle: (id: string) => void;
}

export const createShelfStylesSlice: StateCreator<
  { shelves: Record<string, ShelfData> } & ShelfStylesSlice,
  [],
  [],
  ShelfStylesSlice
> = (set) => {
  return {
    setShelfBackground: (id, backgroundImage) => {
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [id]: { 
            ...state.shelves[id], 
            backgroundImage 
          }
        };
        
        // Save to localStorage
        saveShelvesToStorage(updatedShelves);
        
        return { shelves: updatedShelves };
      });
      
      toast.success('Background updated');
    },
    
    setShelfTexture: (id, textureImage) => {
      set((state) => {
        const updatedShelves = {
          ...state.shelves,
          [id]: { 
            ...state.shelves[id], 
            textureImage 
          }
        };
        
        // Save to localStorage
        saveShelvesToStorage(updatedShelves);
        
        return { shelves: updatedShelves };
      });
      
      toast.success('Shelf texture updated');
    },
    
    resetShelfStyle: (id) => {
      set((state) => {
        const { 
          backgroundImage, 
          backgroundColor, 
          backgroundOpacity, 
          textureImage, 
          shelfColor, 
          shelfOpacity, 
          ...restShelfData 
        } = state.shelves[id];
        
        const updatedShelves = {
          ...state.shelves,
          [id]: restShelfData
        };
        
        // Save to localStorage
        saveShelvesToStorage(updatedShelves);
        
        return { shelves: updatedShelves };
      });
      
      toast.success('Shelf style reset to default');
    }
  };
};
