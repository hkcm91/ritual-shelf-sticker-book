
// This file is kept but simplified as we've moved to CSS transform-based zooming
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
    // Calculate new zoom level
    const newZoom = Math.max(0.25, Math.min(2, state.zoomLevel + delta));
    return { zoomLevel: newZoom };
  }),
  
  setZoomLevel: (level) => set(() => ({ 
    zoomLevel: Math.max(0.25, Math.min(2, level)) 
  })),
});
