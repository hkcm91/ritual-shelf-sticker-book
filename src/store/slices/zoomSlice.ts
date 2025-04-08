
/**
 * @file zoomSlice.ts
 * 
 * IMPORTANT: This file contains core zoom functionality that is essential
 * for the bookshelf interface. Do not modify these functions unless absolutely
 * necessary, as they may break the zoom experience across the application.
 * 
 * Last verified working: 2025-04-08
 */

import { StateCreator } from 'zustand';
import { BookshelfState } from '../bookshelfStore';

export interface ZoomSlice {
  zoomLevel: number;
  adjustZoomLevel: (delta: number) => void;
  setZoomLevel: (level: number) => void;
}

// Zoom boundaries - do not modify these constants
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;

/**
 * Creates the zoom slice for the bookshelf store
 * 
 * @protected - This function creates essential zoom functionality
 * and should not be modified without thorough testing
 */
export const createZoomSlice: StateCreator<
  BookshelfState,
  [],
  [],
  ZoomSlice
> = (set) => ({
  // Initial zoom level - defaults to 1 (100%)
  zoomLevel: 1,
  
  /**
   * Adjusts the zoom level by the specified delta
   * 
   * @param delta - The amount to adjust the zoom level by
   * @protected - Do not modify this function
   */
  adjustZoomLevel: (delta) => set((state) => {
    // Calculate new zoom level with boundary constraints
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.zoomLevel + delta));
    console.log("[ZoomSlice] Adjusting zoom from", state.zoomLevel, "to", newZoom);
    return { zoomLevel: newZoom };
  }),
  
  /**
   * Sets the zoom level to a specific value
   * 
   * @param level - The new zoom level to set
   * @protected - Do not modify this function
   */
  setZoomLevel: (level) => set(() => {
    // Ensure zoom level is within boundaries
    const constrainedLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
    console.log("[ZoomSlice] Setting zoom level to", constrainedLevel);
    return { zoomLevel: constrainedLevel };
  }),
});

// Export a debug helper for zoom functionality
export const debugZoomState = (state: Pick<ZoomSlice, 'zoomLevel'>) => {
  console.log("[ZoomDebug] Current zoom level:", state.zoomLevel);
  console.log("[ZoomDebug] Min zoom:", MIN_ZOOM);
  console.log("[ZoomDebug] Max zoom:", MAX_ZOOM);
  return true;
};
