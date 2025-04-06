
import React from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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
    <div className="flex flex-wrap gap-2 p-3 bg-white/70 backdrop-blur-sm shadow rounded-md">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={addRow}
          className="flex gap-1 items-center"
        >
          <Plus className="h-4 w-4" />
          Row
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={removeRow}
          className="flex gap-1 items-center"
        >
          <Minus className="h-4 w-4" />
          Row
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={addColumn}
          className="flex gap-1 items-center"
        >
          <Plus className="h-4 w-4" />
          Column
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={removeColumn}
          className="flex gap-1 items-center"
        >
          <Minus className="h-4 w-4" />
          Column
        </Button>
      </div>
      
      <div className="flex gap-2 ml-auto">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleResetZoom}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ShelfControls;
