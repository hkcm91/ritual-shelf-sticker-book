
import React from 'react';
import { Rows3, Info } from 'lucide-react';
import { ShelfData } from '@/store/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RowsControlProps {
  currentLibrary: ShelfData | null;
  onRowsChange: (rows: number) => void;
  minRows: number;
  maxRows: number;
}

const RowsControl: React.FC<RowsControlProps> = ({
  currentLibrary,
  onRowsChange,
  minRows,
  maxRows
}) => {
  const handleRowsDecrease = () => {
    if (currentLibrary && currentLibrary.rows > minRows) {
      onRowsChange(currentLibrary.rows - 1);
    }
  };

  const handleRowsIncrease = () => {
    if (currentLibrary && currentLibrary.rows < maxRows) {
      onRowsChange(currentLibrary.rows + 1);
    }
  };

  // Check if at limits
  const isAtMaxRows = currentLibrary && currentLibrary.rows >= maxRows;
  const isAtMinRows = currentLibrary && currentLibrary.rows <= minRows;

  return (
    <div className="flex flex-col">
      <label htmlFor="rows" className="flex items-center gap-2 text-sm font-medium text-amber-200 mb-2">
        <Rows3 className="h-4 w-4" /> Rows
      </label>
      <div className="flex rounded-md overflow-hidden border border-amber-700/30">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRowsDecrease}
                disabled={!currentLibrary || isAtMinRows}
              >
                −
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-800/50 text-amber-100">
              <p>Decrease rows{isAtMinRows ? " (minimum reached)" : ""}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <input
          type="number"
          id="rows"
          min={minRows}
          max={maxRows}
          value={currentLibrary?.rows || 2}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= minRows && value <= maxRows) {
              onRowsChange(value);
            }
          }}
          className="w-full px-3 py-2.5 bg-amber-950/30 text-center text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-600/50"
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRowsIncrease}
                disabled={!currentLibrary || isAtMaxRows}
              >
                +
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-800/50 text-amber-100">
              <p>Increase rows{isAtMaxRows ? " (maximum reached)" : ""}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-start mt-2 text-xs text-amber-200/60 gap-1.5">
        <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
        <p>Rows determine shelf's vertical capacity ({minRows}-{maxRows})</p>
      </div>
    </div>
  );
};

export default RowsControl;
