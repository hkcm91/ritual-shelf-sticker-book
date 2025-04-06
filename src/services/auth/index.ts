
/**
 * Authentication Service Entry Point
 * 
 * This file exports the main auth service and types for use throughout the application.
 */

import { authService } from './authService';
export { authService };

// Re-export types
export type { AuthConfig, UserProfile, AuthState } from './types';

// For backward compatibility with existing code
export const userAuthService = authService;
