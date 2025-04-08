
import { useCallback, useState } from 'react';

interface NavigationState {
  history: { x: number; y: number; scale: number }[];
  currentIndex: number;
}

interface NavigationOptions {
  maxHistoryLength?: number;
}

export function useDirectionalNavigation(options: NavigationOptions = {}) {
  const { maxHistoryLength = 50 } = options;
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    history: [{ x: 0, y: 0, scale: 1 }], // Start with default position
    currentIndex: 0
  });
  
  // Flag to track if we can go back or forward
  const canGoBack = navigationState.currentIndex > 0;
  const canGoForward = navigationState.currentIndex < navigationState.history.length - 1;
  
  // Add a new position to history
  const addToHistory = useCallback((position: { x: number; y: number; scale: number }) => {
    setNavigationState(prev => {
      // Don't add if position is the same as current
      const currentPos = prev.history[prev.currentIndex];
      if (
        Math.abs(currentPos.x - position.x) < 1 && 
        Math.abs(currentPos.y - position.y) < 1 && 
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
        currentIndex: newHistory.length - 1
      };
    });
  }, [maxHistoryLength]);
  
  // Go back in history
  const goBack = useCallback(() => {
    if (!canGoBack) return false;
    
    setNavigationState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex - 1
    }));
    
    return true;
  }, [canGoBack]);
  
  // Go forward in history
  const goForward = useCallback(() => {
    if (!canGoForward) return false;
    
    setNavigationState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1
    }));
    
    return true;
  }, [canGoForward]);
  
  // Get current position
  const getCurrentPosition = useCallback(() => {
    return navigationState.history[navigationState.currentIndex];
  }, [navigationState]);
  
  return {
    addToHistory,
    goBack,
    goForward,
    getCurrentPosition,
    canGoBack,
    canGoForward
  };
}
