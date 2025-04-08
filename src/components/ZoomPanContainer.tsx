
import React, { useRef, useEffect } from 'react';
import { useZoomPan } from '@/hooks/gestures/useZoomPan';
import { useDirectionalNavigation } from '@/hooks/gestures/useDirectionalNavigation';
import '@/styles/gestures/zoom-pan.css';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ZoomPanContainerProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
  showControls?: boolean;
}

const ZoomPanContainer: React.FC<ZoomPanContainerProps> = ({
  children,
  className = '',
  minScale = 0.25,
  maxScale = 3,
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize zoom and pan functionality
  const { scale, translateX, translateY, resetTransform, setTransform } = useZoomPan(containerRef, {
    minScale,
    maxScale,
    transformOrigin: 'top left',
  });
  
  // Initialize navigation history
  const { 
    addToHistory, 
    goBack, 
    goForward, 
    getCurrentPosition,
    canGoBack,
    canGoForward
  } = useDirectionalNavigation();
  
  // Record position changes to history
  useEffect(() => {
    const timer = setTimeout(() => {
      addToHistory({ x: translateX, y: translateY, scale });
    }, 500); // Debounce to avoid too many history entries
    
    return () => clearTimeout(timer);
  }, [addToHistory, scale, translateX, translateY]);
  
  const handleZoomIn = () => {
    setTransform({ scale: scale + 0.1 });
  };
  
  const handleZoomOut = () => {
    setTransform({ scale: scale - 0.1 });
  };
  
  const handleGoBack = () => {
    if (canGoBack) {
      goBack();
      const position = getCurrentPosition();
      setTransform(position);
    }
  };
  
  const handleGoForward = () => {
    if (canGoForward) {
      goForward();
      const position = getCurrentPosition();
      setTransform(position);
    }
  };
  
  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className={`zoom-pan-container ${className}`}
        aria-label="Zoomable content area"
        tabIndex={0}
      >
        {children}
      </div>
      
      {showControls && (
        <div className="zoom-controls fixed bottom-4 right-4 flex gap-2 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleGoBack}
                  disabled={!canGoBack}
                  className="text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleZoomOut}
                  className="text-gray-700"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out (Alt+Scroll Down or -)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={resetTransform}
                  className="text-gray-700 flex items-center gap-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline-block text-xs">
                    {Math.round(scale * 100)}%
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset Zoom (Key: 0)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleZoomIn}
                  className="text-gray-700"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In (Alt+Scroll Up or +)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleGoForward}
                  disabled={!canGoForward}
                  className="text-gray-700"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go Forward</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {/* Alt key hint for zoom feature */}
      <div className="alt-key-hint">
        Hold Alt + Scroll to Zoom
      </div>
    </div>
  );
};

export default ZoomPanContainer;
