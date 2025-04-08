
import React from 'react';

interface RecipeTabNavigationProps {
  activeTab: 'details' | 'ingredients' | 'steps';
  setActiveTab: (tab: 'details' | 'ingredients' | 'steps') => void;
}

const RecipeTabNavigation: React.FC<RecipeTabNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const TabButton = ({ 
    name, 
    label, 
    icon 
  }: { 
    name: 'details' | 'ingredients' | 'steps'; 
    label: string; 
    icon: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={() => setActiveTab(name)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md transition-colors
        ${activeTab === name 
          ? 'bg-amber-100 text-amber-900 font-medium' 
          : 'text-amber-700 hover:bg-amber-50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex justify-center pt-4 border-t border-amber-100">
      <div className="flex rounded-lg bg-amber-50/80 p-1">
        <TabButton 
          name="details" 
          label="Details" 
          icon={<span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 text-xs">1</span>} 
        />
        <TabButton 
          name="ingredients" 
          label="Ingredients" 
          icon={<span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 text-xs">2</span>} 
        />
        <TabButton 
          name="steps" 
          label="Preparation" 
          icon={<span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 text-xs">3</span>} 
        />
      </div>
    </div>
  );
};

export default RecipeTabNavigation;
