
import { StateCreator } from 'zustand';
import { BookshelfState } from '../bookshelfStore';

export interface ZoomSlice {
  zoomLevel: number;
  adjustZoomLevel: (delta: number) => void;
  setZoomLevel: (level: number) => void;
}

export const createZoomSlice: StateCreator<
  BookshelfState,
  [],
  [],
  ZoomSlice
> = (set) => ({
  zoomLevel: 1,
  
  adjustZoomLevel: (delta) => set((state) => {
    // Calculate new zoom level with smoother steps
    const newZoom = Math.round((state.zoomLevel + delta) * 100) / 100;
    // Clamp zoom between 0.25 and 2
    return { zoomLevel: Math.max(0.25, Math.min(2, newZoom)) };
  }),
  
  setZoomLevel: (level) => set(() => ({ 
    zoomLevel: Math.max(0.25, Math.min(2, level)) 
  })),
});
