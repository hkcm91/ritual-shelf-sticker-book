
import React from 'react';
import { Rows3, Columns3, Lightbulb } from 'lucide-react';
import { ShelfData } from '@/store/types';

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
  return (
    <div className="popup-section bg-amber-950/20 p-5 rounded-lg border border-amber-800/30">
      <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${getThemeColors()} inline-block`}></span>
        Display Options
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="rows" className="flex items-center gap-2 text-sm font-medium text-amber-200 mb-2">
            <Rows3 className="h-4 w-4" /> Rows
          </label>
          <div className="flex rounded-md overflow-hidden border border-amber-700/30">
            <button 
              className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
              onClick={() => {
                const currentRows = currentLibrary?.rows || 2;
                if (currentRows > 1) {
                  onRowsChange(currentRows - 1);
                }
              }}
            >
              −
            </button>
            <input
              type="number"
              id="rows"
              min={1}
              max={5}
              value={currentLibrary?.rows || 2}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 5) {
                  onRowsChange(value);
                }
              }}
              className="w-full px-3 py-2.5 bg-amber-950/30 text-center text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-600/50"
            />
            <button 
              className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
              onClick={() => {
                const currentRows = currentLibrary?.rows || 2;
                if (currentRows < 5) {
                  onRowsChange(currentRows + 1);
                }
              }}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="columns" className="flex items-center gap-2 text-sm font-medium text-amber-200 mb-2">
            <Columns3 className="h-4 w-4" /> Columns
          </label>
          <div className="flex rounded-md overflow-hidden border border-amber-700/30">
            <button 
              className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
              onClick={() => {
                const currentColumns = currentLibrary?.columns || 4;
                if (currentColumns > 1) {
                  onColumnsChange(currentColumns - 1);
                }
              }}
            >
              −
            </button>
            <input
              type="number"
              id="columns"
              min={1}
              max={8}
              value={currentLibrary?.columns || 4}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 8) {
                  onColumnsChange(value);
                }
              }}
              className="w-full px-3 py-2.5 bg-amber-950/30 text-center text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-600/50"
            />
            <button 
              className="px-3.5 py-2.5 bg-amber-900/40 text-amber-100 hover:bg-amber-800/40 transition-colors"
              onClick={() => {
                const currentColumns = currentLibrary?.columns || 4;
                if (currentColumns < 8) {
                  onColumnsChange(currentColumns + 1);
                }
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-5 p-3 bg-amber-900/20 rounded-lg border border-amber-800/20 flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/80">
          Adjust rows and columns to customize the size of your bookshelf. More rows give you vertical space,
          while more columns expand horizontally. Find the perfect balance for your collection!
        </p>
      </div>
    </div>
  );
};

export default DisplayOptionsSection;
