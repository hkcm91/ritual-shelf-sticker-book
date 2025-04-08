
import React from 'react';
import { ShelfData } from '@/store/types';

interface LibraryNameSectionProps {
  libraryName: string;
  setLibraryName: (name: string) => void;
  getThemeColors: () => string;
}

const LibraryNameSection: React.FC<LibraryNameSectionProps> = ({
  libraryName,
  setLibraryName,
  getThemeColors
}) => {
  return (
    <div className="popup-section bg-amber-950/20 p-5 rounded-lg border border-amber-800/30">
      <h3 className="popup-section-title text-lg font-semibold mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${getThemeColors()} inline-block`}></span>
        Basic Details
      </h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="library-name" className="block text-sm font-medium text-amber-200 mb-1">
            Library Name
          </label>
          <input
            type="text"
            id="library-name"
            value={libraryName}
            onChange={(e) => setLibraryName(e.target.value)}
            className="w-full px-4 py-2.5 bg-amber-950/30 border border-amber-700/30 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition-all duration-300"
            placeholder="Enter a name for your library"
          />
        </div>
      </div>
    </div>
  );
};

export default LibraryNameSection;
