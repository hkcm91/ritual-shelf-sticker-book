
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary 
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Something went wrong!</h1>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md" 
              onClick={() => window.location.href = '/'}
            >
              Go Home
            </button>
          </div>
        </div>
      }
    >
      <Outlet />
      <Toaster />
      <SonnerToaster position="top-center" expand={true} richColors />
    </ErrorBoundary>
  );
}

export default App;
