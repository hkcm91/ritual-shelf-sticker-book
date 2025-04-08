
import React, { useRef } from 'react';
import { useZoomPan } from '@/hooks/gestures/useZoomPan';
import '@/styles/gestures/zoom-pan.css';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
  maxScale = 2,
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scale, resetTransform, setTransform } = useZoomPan(containerRef, {
    minScale,
    maxScale,
    transformOrigin: 'top center',
  });
  
  const handleZoomIn = () => {
    setTransform({ scale: scale + 0.1 });
  };
  
  const handleZoomOut = () => {
    setTransform({ scale: scale - 0.1 });
  };
  
  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className={`zoom-pan-container ${className}`}
        aria-label="Zoomable content area"
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
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default ZoomPanContainer;
