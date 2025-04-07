
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { ZoomIn, ZoomOut, Minimize } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ZoomControls: React.FC = () => {
  const { zoomLevel, adjustZoomLevel, setZoomLevel } = useBookshelfStore();
  
  const handleZoomIn = () => adjustZoomLevel(0.1);
  const handleZoomOut = () => adjustZoomLevel(-0.1);
  const handleReset = () => setZoomLevel(1);
  
  return (
    <div className="zoom-controls">
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
            <p>Zoom Out</p>
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
            <p>Reset Zoom (Current: {Math.round(zoomLevel * 100)}%)</p>
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
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ZoomControls;
