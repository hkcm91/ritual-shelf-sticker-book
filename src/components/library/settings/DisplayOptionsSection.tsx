
import React from 'react';
import { Rows3, Columns3, Lightbulb, Info } from 'lucide-react';
import { ShelfData } from '@/store/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DisplayOptionsSectionProps {
  currentLibrary: ShelfData | null;
  onRowsChange: (rows: number) => void;
  onColumnsChange: (columns: number) => void;
  getThemeColors: () => string;
}

const DisplayOptionsSection: React.FC<DisplayOptionsSectionProps> = ({
  currentLibrary,
  onRowsChange,
  onColumnsChange,
  getThemeColors
}) => {
  // Constants for min/max rows and columns
  const MIN_ROWS = 1;
  const MAX_ROWS = 10;
  const MIN_COLUMNS = 1;
  const MAX_COLUMNS = 12;

  const handleRowsDecrease = () => {
    if (currentLibrary && currentLibrary.rows > MIN_ROWS) {
      onRowsChange(currentLibrary.rows - 1);
    }
  };

  const handleRowsIncrease = () => {
    if (currentLibrary && currentLibrary.rows < MAX_ROWS) {
      onRowsChange(currentLibrary.rows + 1);
    }
  };

  const handleColumnsDecrease = () => {
    if (currentLibrary && currentLibrary.columns > MIN_COLUMNS) {
      onColumnsChange(currentLibrary.columns - 1);
    }
  };

  const handleColumnsIncrease = () => {
    if (currentLibrary && currentLibrary.columns < MAX_COLUMNS) {
      onColumnsChange(currentLibrary.columns + 1);
    }
  };

  // Check if at maximum rows/columns limit
  const isAtMaxRows = currentLibrary && currentLibrary.rows >= MAX_ROWS;
  const isAtMaxColumns = currentLibrary && currentLibrary.columns >= MAX_COLUMNS;
  const isAtMinRows = currentLibrary && currentLibrary.rows <= MIN_ROWS;
  const isAtMinColumns = currentLibrary && currentLibrary.columns <= MIN_COLUMNS;

  return (
    <div className="popup-section bg-amber-950/20 p-5 rounded-lg border border-amber-800/30">
      <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${getThemeColors()} inline-block`}></span>
        Display Options
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              min={MIN_ROWS}
              max={MAX_ROWS}
              value={currentLibrary?.rows || 2}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= MIN_ROWS && value <= MAX_ROWS) {
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
            <p>Rows determine shelf's vertical capacity ({MIN_ROWS}-{MAX_ROWS})</p>
          </div>
        </div>
        
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
              min={MIN_COLUMNS}
              max={MAX_COLUMNS}
              value={currentLibrary?.columns || 4}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= MIN_COLUMNS && value <= MAX_COLUMNS) {
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
            <p>Columns determine shelf's horizontal capacity ({MIN_COLUMNS}-{MAX_COLUMNS})</p>
          </div>
        </div>
      </div>
      
      <div className="mt-5 p-3 bg-amber-900/20 rounded-lg border border-amber-800/20 flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/80 space-y-2">
          <p>
            Adjust rows and columns to customize the size of your bookshelf. Books in removed rows or columns will be hidden but not deleted.
          </p>
          <p>
            <strong>Tip:</strong> For mobile-friendly bookshelves, use fewer columns (4-6) and more rows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayOptionsSection;
