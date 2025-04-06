
/**
 * Authentication Service Types
 */

// Authentication configuration interface
export interface AuthConfig {
  apiKey?: string;
  authDomain?: string;
  redirectUri?: string;
}

// User profile interface
export interface UserProfile {
  id: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  createdAt: number;
  lastLoginAt: number;
}

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Authentication service interface
export interface IAuthService {
  init(config: AuthConfig): boolean;
  isReady(): boolean;
  signInWithEmailPassword(email: string, password: string): Promise<UserProfile | null>;
  signUpWithEmailPassword(email: string, password: string): Promise<UserProfile | null>;
  signOut(): Promise<boolean>;
  getAuthState(): AuthState;
  subscribeToAuthChanges(listener: (authState: AuthState) => void): () => void;
}
