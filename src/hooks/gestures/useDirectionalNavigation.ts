
import { useCallback, useState } from 'react';

interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  history: { x: number; y: number; scale: number }[];
  currentIndex: number;
}

interface NavigationOptions {
  maxHistoryLength?: number;
}

export function useDirectionalNavigation(options: NavigationOptions = {}) {
  const { maxHistoryLength = 20 } = options;
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    canGoBack: false,
    canGoForward: false,
    history: [{ x: 0, y: 0, scale: 1 }], // Start with default position
    currentIndex: 0
  });
  
  // Add a new position to history
  const addToHistory = useCallback((position: { x: number; y: number; scale: number }) => {
    setNavigationState(prev => {
      // Don't add if position is the same as current
      const currentPos = prev.history[prev.currentIndex];
      if (
        Math.abs(currentPos.x - position.x) < 0.5 && 
        Math.abs(currentPos.y - position.y) < 0.5 && 
        Math.abs(currentPos.scale - position.scale) < 0.01
      ) {
        return prev;
      }
      
      // Create new history array by removing any forward history and adding new position
      const newHistory = [
        ...prev.history.slice(0, prev.currentIndex + 1),
        position
      ].slice(-maxHistoryLength); // Limit history length
      
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
        canGoBack: newHistory.length > 1,
        canGoForward: false
      };
    });
  }, [maxHistoryLength]);
  
  // Go back in history
  const goBack = useCallback(() => {
    setNavigationState(prev => {
      if (!prev.canGoBack) return prev;
      
      const newIndex = prev.currentIndex - 1;
      return {
        ...prev,
        currentIndex: newIndex,
        canGoBack: newIndex > 0,
        canGoForward: true
      };
    });
  }, []);
  
  // Go forward in history
  const goForward = useCallback(() => {
    setNavigationState(prev => {
      if (!prev.canGoForward) return prev;
      
      const newIndex = prev.currentIndex + 1;
      return {
        ...prev,
        currentIndex: newIndex,
        canGoBack: true,
        canGoForward: newIndex < prev.history.length - 1
      };
    });
  }, []);
  
  // Get current position
  const getCurrentPosition = useCallback(() => {
    return navigationState.history[navigationState.currentIndex];
  }, [navigationState]);
  
  return {
    addToHistory,
    goBack,
    goForward,
    getCurrentPosition,
    canGoBack: navigationState.canGoBack,
    canGoForward: navigationState.canGoForward
  };
}
