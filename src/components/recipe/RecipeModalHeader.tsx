
import React from 'react';

interface RecipeModalHeaderProps {
  title: string;
}

const RecipeModalHeader: React.FC<RecipeModalHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 text-amber-800">
      <img 
        src="/icons/recipe-book.svg" 
        alt="Recipe" 
        className="h-6 w-6" 
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <span>{title || 'New Recipe'}</span>
    </div>
  );
};

export default RecipeModalHeader;
