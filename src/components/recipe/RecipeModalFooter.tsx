
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface RecipeModalFooterProps {
  activeTab: 'details' | 'ingredients' | 'steps';
  setActiveTab: (tab: 'details' | 'ingredients' | 'steps') => void;
  onClose: () => void;
}

const RecipeModalFooter: React.FC<RecipeModalFooterProps> = ({
  activeTab,
  setActiveTab,
  onClose,
}) => {
  return (
    <div className="flex justify-between w-full">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
        className="border-amber-300/50 text-amber-700 hover:bg-amber-50/50"
      >
        Cancel
      </Button>
      
      <div className="flex gap-2">
        {activeTab !== 'details' && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveTab(activeTab === 'ingredients' ? 'details' : 'ingredients')}
            className="text-amber-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        
        {activeTab !== 'steps' ? (
          <Button
            type="button"
            onClick={() => setActiveTab(activeTab === 'details' ? 'ingredients' : 'steps')}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="submit"
            form="recipe-form"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Recipe
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeModalFooter;
