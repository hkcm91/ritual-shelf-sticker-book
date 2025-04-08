
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

const ZoomControls: React.FC = () => {
  const { zoomLevel, adjustZoomLevel, setZoomLevel } = useBookshelfStore();
  const isMobile = useIsMobile();
  
  const handleZoomIn = () => adjustZoomLevel(0.1);
  const handleZoomOut = () => adjustZoomLevel(-0.1);
  const handleReset = () => setZoomLevel(1);
  
  return (
    <div className={`zoom-controls ${isMobile ? 'mobile' : ''}`}>
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
            <p>Zoom Out (Alt+Scroll Down)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleReset}
              className="bg-white/90 hover:bg-white text-gray-700 flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span className={`${isMobile ? 'hidden' : 'hidden sm:inline-block text-xs'}`}>
                {Math.round(zoomLevel * 100)}%
              </span>
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
            <p>Zoom In (Alt+Scroll Up)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ZoomControls;
