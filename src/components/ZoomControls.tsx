
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { ZoomIn, ZoomOut, Minimize } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ZoomControls: React.FC = () => {
  const { zoomLevel, adjustZoomLevel, setZoomLevel } = useBookshelfStore();
  
  // Handle keyboard shortcuts for zooming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle when not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.ctrlKey && e.key === '=') {
        e.preventDefault();
        adjustZoomLevel(0.1);
      } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        adjustZoomLevel(-0.1);
      } else if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        setZoomLevel(1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adjustZoomLevel, setZoomLevel]);
  
  const handleZoomIn = () => adjustZoomLevel(0.1);
  const handleZoomOut = () => adjustZoomLevel(-0.1);
  const handleReset = () => setZoomLevel(1);
  
  return (
    <div className="zoom-controls flex space-x-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomOut}
              className="bg-white/90 hover:bg-white text-gray-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out (Ctrl+-)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleReset}
              className="bg-white/90 hover:bg-white text-gray-700"
            >
              <Minimize className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Zoom {Math.round(zoomLevel * 100)}% (Ctrl+0)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomIn}
              className="bg-white/90 hover:bg-white text-gray-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In (Ctrl+=)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ZoomControls;
