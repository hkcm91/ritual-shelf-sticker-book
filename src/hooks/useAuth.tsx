
import { useState, useEffect } from 'react';
import { userAuthService, AuthState } from '../services/auth';

/**
 * Hook for accessing authentication state and methods in components
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(userAuthService.getAuthState());
  
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = userAuthService.subscribeToAuthChanges((newState) => {
      setAuthState(newState);
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Authentication methods
  const signIn = (email: string, password: string) => {
    return userAuthService.signInWithEmailPassword(email, password);
  };
  
  const signUp = (email: string, password: string) => {
    return userAuthService.signUpWithEmailPassword(email, password);
  };
  
  const signOut = () => {
    return userAuthService.signOut();
  };
  
  // Return auth state and methods
  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    signIn,
    signUp,
    signOut
  };
};
