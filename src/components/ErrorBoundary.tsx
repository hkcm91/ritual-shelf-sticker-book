
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches JavaScript errors in its child component tree
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error(`Error in ${this.props.componentName || 'component'}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleReset = (): void => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null });
    
    // Call the optional onReset prop
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-medium">Something went wrong</h3>
          </div>
          
          <p className="text-sm mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={this.handleReset}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> 
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
