
import React from 'react';
import { Columns3, Info } from 'lucide-react';
import { ShelfData } from '@/store/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColumnsControlProps {
  currentLibrary: ShelfData | null;
  onColumnsChange: (columns: number) => void;
  minColumns: number;
  maxColumns: number;
}

const ColumnsControl: React.FC<ColumnsControlProps> = ({
  currentLibrary,
  onColumnsChange,
  minColumns,
  maxColumns
}) => {
  const handleColumnsDecrease = () => {
    if (currentLibrary && currentLibrary.columns > minColumns) {
      onColumnsChange(currentLibrary.columns - 1);
    }
  };

  const handleColumnsIncrease = () => {
    if (currentLibrary && currentLibrary.columns < maxColumns) {
      onColumnsChange(currentLibrary.columns + 1);
    }
  };

  // Check if at limits
  const isAtMaxColumns = currentLibrary && currentLibrary.columns >= maxColumns;
  const isAtMinColumns = currentLibrary && currentLibrary.columns <= minColumns;

  return (
    <div className="flex flex-col">
      <label htmlFor="columns" className="flex items-center gap-2 text-sm font-medium text-amber-200 mb-2">
        <Columns3 className="h-4 w-4" /> Columns
      </label>
      <div className="flex rounded-md overflow-hidden border border-amber-700/30">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleColumnsDecrease}
                disabled={!currentLibrary || isAtMinColumns}
              >
                −
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-800/50 text-amber-100">
              <p>Decrease columns{isAtMinColumns ? " (minimum reached)" : ""}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <input
          type="number"
          id="columns"
          min={minColumns}
          max={maxColumns}
          value={currentLibrary?.columns || 4}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= minColumns && value <= maxColumns) {
              onColumnsChange(value);
            }
          }}
          className="w-full px-3 py-2.5 bg-amber-950/30 text-center text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-600/50"
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleColumnsIncrease}
                disabled={!currentLibrary || isAtMaxColumns}
              >
                +
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-800/50 text-amber-100">
              <p>Increase columns{isAtMaxColumns ? " (maximum reached)" : ""}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-start mt-2 text-xs text-amber-200/60 gap-1.5">
        <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
        <p>Columns determine shelf's horizontal capacity ({minColumns}-{maxColumns})</p>
      </div>
    </div>
  );
};

export default ColumnsControl;
