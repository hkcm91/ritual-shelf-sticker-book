
import React from 'react';
import { ShelfData } from '@/store/types';
import { RowsControl, ColumnsControl, InfoSection } from './display-options';

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

  return (
    <div className="popup-section bg-amber-950/20 p-5 rounded-lg border border-amber-800/30">
      <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${getThemeColors()} inline-block`}></span>
        Display Options
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RowsControl 
          currentLibrary={currentLibrary}
          onRowsChange={onRowsChange}
          minRows={MIN_ROWS}
          maxRows={MAX_ROWS}
        />
        
        <ColumnsControl 
          currentLibrary={currentLibrary}
          onColumnsChange={onColumnsChange}
          minColumns={MIN_COLUMNS}
          maxColumns={MAX_COLUMNS}
        />
      </div>
      
      <InfoSection />
    </div>
  );
};

export default DisplayOptionsSection;
