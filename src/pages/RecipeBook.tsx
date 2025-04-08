
import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import RecipeGrid from '../components/recipes/RecipeGrid';
import { Utensils, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateLibraryDialog } from '@/components/libraries/CreateLibraryDialog';

const RecipeBook: React.FC = () => {
  const { shelves, activeShelfId, setActiveShelf } = useBookshelfStore();
  const [isCreateLibraryOpen, setIsCreateLibraryOpen] = React.useState(false);
  
  // Find recipe libraries
  const recipeLibraries = Object.values(shelves)
    .filter(shelf => shelf.type === 'recipe');
  
  // Set active shelf to first recipe library if none selected
  useEffect(() => {
    if (recipeLibraries.length > 0 && 
        (!activeShelfId || !shelves[activeShelfId] || shelves[activeShelfId].type !== 'recipe')) {
      setActiveShelf(recipeLibraries[0].id);
    }
  }, [recipeLibraries, activeShelfId, shelves, setActiveShelf]);
  
  const currentShelf = activeShelfId ? shelves[activeShelfId] : null;
  const showEmptyState = recipeLibraries.length === 0;
  
  const handleCreateRecipeLibrary = () => {
    setIsCreateLibraryOpen(true);
  };
  
  const handleSelectLibrary = (shelfId: string) => {
    setActiveShelf(shelfId);
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--page-bg, #f5f5f5)',
        backgroundImage: 'var(--page-bg-image, none)',
        backgroundSize: 'var(--page-bg-size, cover)',
        backgroundRepeat: 'var(--page-bg-repeat, no-repeat)',
        backgroundPosition: 'var(--page-bg-position, center)',
        backgroundAttachment: 'var(--page-bg-attachment, fixed)',
        color: 'var(--page-text-color, #333333)'
      }}
    >
      <Header />
      
      <div className="flex-grow w-full overflow-auto">
        {showEmptyState ? (
          <div className="max-w-3xl mx-auto mt-16 p-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-amber-100/20 mb-6">
              <Utensils className="h-12 w-12 text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Create Your Recipe Library</h1>
            <p className="text-lg mb-8 max-w-xl mx-auto text-amber-100/80">
              Start your culinary journey by creating a recipe library to organize all your favorite recipes.
            </p>
            <Button 
              size="lg" 
              onClick={handleCreateRecipeLibrary}
              className="bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Recipe Library
            </Button>
          </div>
        ) : (
          <>
            <div className="px-8 py-4 border-b border-amber-800/20 bg-amber-950/10">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{currentShelf?.name || 'Recipe Collection'}</h1>
                  <p className="text-amber-100/70 text-sm mt-1">
                    {currentShelf?.type === 'recipe' ? 'Recipe Library' : 'Cookbook Collection'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {recipeLibraries.length > 1 && (
                    <select 
                      value={activeShelfId} 
                      onChange={(e) => handleSelectLibrary(e.target.value)}
                      className="bg-amber-950/30 border border-amber-800/30 rounded-md px-3 py-1.5 text-amber-100"
                    >
                      {recipeLibraries.map(shelf => (
                        <option key={shelf.id} value={shelf.id}>{shelf.name}</option>
                      ))}
                    </select>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleCreateRecipeLibrary}
                    className="border-amber-700/30 text-amber-200 hover:bg-amber-900/30"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Recipe Library
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto p-8">
              <RecipeGrid />
            </div>
          </>
        )}
      </div>
      
      {/* Create Library Dialog */}
      <CreateLibraryDialog 
        open={isCreateLibraryOpen}
        onOpenChange={setIsCreateLibraryOpen}
      />
    </div>
  );
};

export default RecipeBook;
