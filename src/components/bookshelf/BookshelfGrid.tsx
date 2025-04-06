
import React from 'react';
import { useBookshelfStore } from '../../store/bookshelfStore';
import CustomizationPanel from './CustomizationPanel';
import ShelfRow from './ShelfRow';
import { useBookshelfCustomization } from '../../hooks/useBookshelfCustomization';

const BookshelfGrid: React.FC = () => {
  const { activeShelfId, shelves, zoomLevel } = useBookshelfStore();
  const activeShelf = shelves[activeShelfId];
  
  // Use the customization hook
  const {
    customization,
    setCustomization,
    saveCustomization,
    resetCustomization,
    handleFileChange,
    handleImageUrl
  } = useBookshelfCustomization(activeShelfId);
  
  if (!activeShelf) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          No shelf selected. Create a new shelf to get started.
        </p>
      </div>
    );
  }
  
  const { rows, columns } = activeShelf;
  
  // Generate grid rows
  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < rows; row++) {
      grid.push(
        <ShelfRow
          key={`row-${row}`}
          rowIndex={row}
          columns={columns}
          shelfBgColor={customization.shelfBgColor}
          shelfBgImage={customization.shelfBgImage}
          shelfOpacity={customization.shelfOpacity}
        />
      );
    }
    
    return grid;
  };
  
  return (
    <div 
      className="bookshelf-wrapper p-4 md:p-8 overflow-auto max-w-full w-full"
    >
      <div 
        className="bookshelf-container relative flex flex-col items-center rounded-md p-6 shadow-lg max-w-full mx-auto transform-gpu"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          width: 'max-content',
          backgroundColor: customization.containerBgColor,
          opacity: customization.containerOpacity,
          backgroundImage: customization.containerBgImage ? 
            `url(${customization.containerBgImage})` : 
            'url(/lovable-uploads/b613332c-c1a6-46ce-bd9f-6643f75a811a.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <CustomizationPanel
          customization={customization}
          setCustomization={setCustomization}
          activeShelfId={activeShelfId}
          saveCustomization={saveCustomization}
          resetCustomization={resetCustomization}
          handleFileChange={handleFileChange}
          handleImageUrl={handleImageUrl}
        />
        {renderGrid()}
      </div>
    </div>
  );
};

export default BookshelfGrid;
