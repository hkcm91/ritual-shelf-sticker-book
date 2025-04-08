
import React from 'react';

interface RecipeTabNavigationProps {
  activeTab: 'details' | 'ingredients' | 'steps';
  setActiveTab: (tab: 'details' | 'ingredients' | 'steps') => void;
}

const RecipeTabNavigation: React.FC<RecipeTabNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="flex justify-center border-t border-amber-200 pt-4 mt-4">
      <div className="flex gap-1 bg-amber-100/50 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
            ${activeTab === 'details' ? 'bg-amber-400/80 text-amber-900 font-medium' : 'text-amber-800 hover:bg-amber-100'}`}
        >
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-xs">1</span>
          <span>Details</span>
        </button>
        
        <button
          type="button"
          onClick={() => setActiveTab('ingredients')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
            ${activeTab === 'ingredients' ? 'bg-amber-400/80 text-amber-900 font-medium' : 'text-amber-800 hover:bg-amber-100'}`}
        >
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-xs">2</span>
          <span>Ingredients</span>
        </button>
        
        <button
          type="button"
          onClick={() => setActiveTab('steps')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
            ${activeTab === 'steps' ? 'bg-amber-400/80 text-amber-900 font-medium' : 'text-amber-800 hover:bg-amber-100'}`}
        >
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-xs">3</span>
          <span>Preparation</span>
        </button>
      </div>
    </div>
  );
};

export default RecipeTabNavigation;
