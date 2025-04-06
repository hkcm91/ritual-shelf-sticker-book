
import React from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const ShelfControls: React.FC = () => {
  const { 
    activeShelfId,
    addRow, 
    removeRow, 
    addColumn, 
    removeColumn, 
    setZoom,
    zoomLevel
  } = useBookshelfStore();
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoomLevel + 0.25, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoomLevel - 0.25, 0.5));
  };
  
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  if (!activeShelfId) return null;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 bg-white/90 rounded-md p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={addRow}
              className="h-8 w-8 text-gray-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Row</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={removeRow}
              className="h-8 w-8 text-gray-700"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove Row</TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex gap-1 bg-white/90 rounded-md p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={addColumn}
              className="h-8 w-8 text-gray-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Column</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={removeColumn}
              className="h-8 w-8 text-gray-700"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove Column</TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex gap-1 bg-white/90 rounded-md p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleZoomOut}
              className="h-8 w-8 text-gray-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleResetZoom}
              className="h-8 w-8 text-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Zoom</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleZoomIn}
              className="h-8 w-8 text-gray-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ShelfControls;
