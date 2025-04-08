
import React from 'react';
import { Button } from "@/components/ui/button";
import { Rows3, Info } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RowControls: React.FC = () => {
  const {
    addRow,
    removeRow,
    activeShelfId,
    shelves,
  } = useBookshelfStore();
  
  const activeShelf = activeShelfId ? shelves[activeShelfId] : null;
  
  const handleAddRow = () => {
    if (activeShelfId) {
      console.log("Adding row for shelf:", activeShelfId);
      addRow();
    } else {
      toast.error("No active shelf selected");
    }
  };
  
  const handleRemoveRow = () => {
    if (activeShelfId && activeShelf && activeShelf.rows > 1) {
      console.log("Removing row for shelf:", activeShelfId);
      removeRow();
    } else if (!activeShelfId) {
      toast.error("No active shelf selected");
    } else if (activeShelf && activeShelf.rows <= 1) {
      toast.error("Cannot remove the last row");
    }
  };
  
  // Check if at maximum rows limit
  const isAtMaxRows = activeShelf && activeShelf.rows >= 10;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-amber-200 flex items-center gap-2">
        <Rows3 className="h-4 w-4 text-amber-300" />
        Shelf Rows
      </h3>
      <p className="text-xs text-amber-200/70 mb-2">
        Add or remove horizontal rows of book slots on your bookshelf
      </p>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemoveRow}
                disabled={!activeShelf || activeShelf.rows <= 1}
                className="px-2 bg-amber-900/30 border-amber-700/30 text-amber-100 hover:bg-amber-800/40 hover:text-amber-50 disabled:opacity-50"
                aria-label="Remove row"
              >
                -
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-800/50 text-amber-100">
              <p>Remove a row{activeShelf?.rows <= 1 ? " (minimum reached)" : ""}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-950/30 border border-amber-700/20">
          <span className="font-medium text-amber-100">{activeShelf ? activeShelf.rows : 0} Rows</span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddRow}
                disabled={isAtMaxRows}
                className="px-2 bg-amber-900/30 border-amber-700/30 text-amber-100 hover:bg-amber-800/40 hover:text-amber-50 disabled:opacity-50"
                aria-label="Add row"
              >
                +
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-800/50 text-amber-100">
              <p>Add a row{isAtMaxRows ? " (maximum reached)" : ""}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {activeShelf && (
        <div className="flex items-start mt-1 text-xs text-amber-200/60 gap-1.5">
          <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <p>
            Rows determine your shelf's vertical capacity. 
            {activeShelf.rows > 1 
              ? ` Removing a row will hide books in the last row but won't delete them.` 
              : ` You need at least one row.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default RowControls;
