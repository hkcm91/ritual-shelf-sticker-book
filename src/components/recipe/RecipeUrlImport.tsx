
import React, { useState } from 'react';
import { Link, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RecipeUrlImportProps {
  onStartImport: () => void;
  onImportSuccess: (data: any) => void;
  onImportError: () => void;
  isImporting: boolean;
}

const RecipeUrlImport: React.FC<RecipeUrlImportProps> = ({
  onStartImport,
  onImportSuccess,
  onImportError,
  isImporting
}) => {
  const [url, setUrl] = useState('');

  const handleImport = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      onStartImport();
      
      // For now, we'll simulate recipe extraction with dummy data
      // In a real implementation, this would call a backend API
      setTimeout(() => {
        const mockRecipeData = {
          title: "Chocolate Chip Cookies",
          description: "Classic homemade chocolate chip cookies - soft, chewy, and absolutely delicious!",
          prepTime: "15",
          cookTime: "10",
          servings: "24",
          ingredients: [
            "2 1/4 cups all-purpose flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "1 cup (2 sticks) butter, softened",
            "3/4 cup granulated sugar",
            "3/4 cup packed brown sugar",
            "1 teaspoon vanilla extract",
            "2 large eggs",
            "2 cups semi-sweet chocolate chips"
          ],
          steps: [
            "Preheat oven to 375° F.",
            "Combine flour, baking soda and salt in small bowl.",
            "Beat butter, granulated sugar, brown sugar and vanilla extract in large mixer bowl until creamy.",
            "Add eggs, one at a time, beating well after each addition.",
            "Gradually beat in flour mixture.",
            "Stir in chocolate chips.",
            "Drop by rounded tablespoon onto ungreased baking sheets.",
            "Bake for 9 to 11 minutes or until golden brown.",
            "Cool on baking sheets for 2 minutes; remove to wire racks to cool completely."
          ],
          notes: "Store in airtight container at room temperature for up to 5 days.",
          sourceUrl: url,
          image: "https://images.unsplash.com/photo-1499636136210-6598fdd9cd6d?auto=format&fit=crop&w=600&q=80"
        };
        
        onImportSuccess(mockRecipeData);
      }, 2000);
    } catch (error) {
      console.error("Error importing recipe:", error);
      onImportError();
    }
  };

  return (
    <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/50 mt-4">
      <h3 className="text-amber-800 font-medium mb-2 flex items-center gap-2">
        <Link className="h-4 w-4" />
        Import from Website
      </h3>
      
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://example.com/recipe/chocolate-chip-cookies"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border-amber-200 focus-visible:ring-amber-500"
          disabled={isImporting}
        />
        
        <Button
          onClick={handleImport}
          disabled={isImporting || !url.trim()}
          className="whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-white"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            "Import Recipe"
          )}
        </Button>
      </div>
      
      <p className="text-xs text-amber-700/70 mt-2">
        Paste a recipe URL to automatically import ingredients, instructions, and more.
      </p>
    </div>
  );
};

export default RecipeUrlImport;
