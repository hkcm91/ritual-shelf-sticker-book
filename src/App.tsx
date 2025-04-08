
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import LibraryPage from './pages/LibraryPage';
import WidgetLauncher from './pages/WidgetLauncher';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/widgets" element={<WidgetLauncher />} />
          <Route path="/library/:libraryId" element={<LibraryPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster />
        <SonnerToaster position="top-center" expand={true} richColors />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
