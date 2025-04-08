
import React from 'react';
import { Button } from "@/components/ui/button";
import { Columns, Info } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ColumnControls: React.FC = () => {
  const {
    addColumn,
    removeColumn,
    activeShelfId,
    shelves,
  } = useBookshelfStore();
  
  const activeShelf = activeShelfId ? shelves[activeShelfId] : null;
  
  const handleAddColumn = () => {
    if (activeShelfId) {
      console.log("Adding column for shelf:", activeShelfId);
      addColumn();
    } else {
      toast.error("No active shelf selected");
    }
  };
  
  const handleRemoveColumn = () => {
    if (activeShelfId && activeShelf && activeShelf.columns > 1) {
      console.log("Removing column for shelf:", activeShelfId);
      removeColumn();
    } else if (!activeShelfId) {
      toast.error("No active shelf selected");
    } else if (activeShelf && activeShelf.columns <= 1) {
      toast.error("Cannot remove the last column");
    }
  };
  
  // Check if at maximum columns limit
  const isAtMaxColumns = activeShelf && activeShelf.columns >= 12;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-amber-200 flex items-center gap-2">
        <Columns className="h-4 w-4 text-amber-300" />
        Shelf Columns
      </h3>
      <p className="text-xs text-amber-200/70 mb-2">
        Add or remove vertical columns of book slots on your bookshelf
      </p>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemoveColumn}
                disabled={!activeShelf || activeShelf.columns <= 1}
                className="px-2 bg-amber-900/30 border-amber-700/30 text-amber-100 hover:bg-amber-800/40 hover:text-amber-50 disabled:opacity-50"
                aria-label="Remove column"
              >
                -
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-800/50 text-amber-100">
              <p>Remove a column{activeShelf?.columns <= 1 ? " (minimum reached)" : ""}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-950/30 border border-amber-700/20">
          <span className="font-medium text-amber-100">{activeShelf ? activeShelf.columns : 0} Columns</span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddColumn}
                disabled={isAtMaxColumns}
                className="px-2 bg-amber-900/30 border-amber-700/30 text-amber-100 hover:bg-amber-800/40 hover:text-amber-50 disabled:opacity-50"
                aria-label="Add column"
              >
                +
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-800/50 text-amber-100">
              <p>Add a column{isAtMaxColumns ? " (maximum reached)" : ""}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {activeShelf && (
        <div className="flex items-start mt-1 text-xs text-amber-200/60 gap-1.5">
          <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <p>
            Columns determine your shelf's horizontal capacity. 
            {activeShelf.columns > 1 
              ? ` Removing a column will hide books in the last column but won't delete them.` 
              : ` You need at least one column.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ColumnControls;
