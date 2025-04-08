
import React from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import RecipeSlot from './RecipeSlot';
import { ShelfData } from '@/store/types';

const RecipeGrid: React.FC = () => {
  const { activeShelfId, shelves } = useBookshelfStore();
  
  // Get the current shelf data to access rows and columns
  const currentShelf = activeShelfId ? shelves[activeShelfId] as ShelfData : null;
  
  if (!currentShelf) {
    return (
      <div className="p-8 text-center text-amber-200/70">
        No recipe library selected. Please select or create a recipe library.
      </div>
    );
  }
  
  const columnsPerRow = currentShelf.columns || 4;
  const rowsPerShelf = currentShelf.rows || 2;
  
  // Generate grid with proper layout
  const renderRecipeGrid = () => {
    const slots = [];
    const totalSlots = columnsPerRow * rowsPerShelf;
    
    for (let i = 0; i < totalSlots; i++) {
      slots.push(<RecipeSlot key={`recipe-slot-${i}`} position={i} />);
    }
    
    return slots;
  };
  
  return (
    <div className="recipe-grid">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {renderRecipeGrid()}
      </div>
    </div>
  );
};

export default RecipeGrid;
