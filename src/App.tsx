
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

// Create a function component to use React hooks properly
const App = () => {
  // Create QueryClient instance inside the component
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                <p className="text-gray-600 mb-6">
                  The application encountered an error. This might be due to a state update loop.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Reload Application
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    <Home className="mr-2 h-4 w-4" /> Return to Home
                  </Button>
                </div>
              </div>
            </div>
          }
          onReset={() => window.location.reload()}
        >
          <Toaster />
          <Sonner />
          <Outlet />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
