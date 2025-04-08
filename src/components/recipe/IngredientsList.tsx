
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, X, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

interface IngredientsListProps {
  form: UseFormReturn<any>;
}

const IngredientsList: React.FC<IngredientsListProps> = ({ form }) => {
  const ingredients = form.watch('ingredients') || [];
  
  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients') || [];
    form.setValue('ingredients', [
      ...currentIngredients,
      { id: uuidv4(), text: '', quantity: '', unit: '' }
    ]);
  };
  
  const removeIngredient = (index: number) => {
    const currentIngredients = [...form.getValues('ingredients')];
    currentIngredients.splice(index, 1);
    form.setValue('ingredients', currentIngredients);
  };
  
  const updateIngredient = (index: number, field: string, value: string) => {
    const currentIngredients = [...form.getValues('ingredients')];
    currentIngredients[index] = { ...currentIngredients[index], [field]: value };
    form.setValue('ingredients', currentIngredients);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-amber-800">Ingredients</h3>
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={addIngredient}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Ingredient
        </Button>
      </div>
      
      {ingredients.length === 0 ? (
        <div className="bg-amber-50 rounded-lg p-6 text-center">
          <p className="text-amber-600">No ingredients added yet.</p>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={addIngredient}
            className="mt-2 text-green-600 border-green-200 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add First Ingredient
          </Button>
        </div>
      ) : (
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
          {ingredients.map((ingredient: any, index: number) => (
            <div 
              key={ingredient.id} 
              className="flex items-center gap-2 p-3 rounded-md bg-white border border-amber-100 transition-all hover:border-amber-200 group"
            >
              <div className="flex-1 grid grid-cols-12 gap-2">
                <Input
                  className="col-span-2 border-amber-200 focus-visible:ring-amber-500"
                  placeholder="Qty"
                  value={ingredient.quantity || ''}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                />
                <Input
                  className="col-span-2 border-amber-200 focus-visible:ring-amber-500"
                  placeholder="Unit"
                  value={ingredient.unit || ''}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                />
                <Input
                  className="col-span-8 border-amber-200 focus-visible:ring-amber-500"
                  placeholder="Ingredient name"
                  value={ingredient.text}
                  onChange={(e) => updateIngredient(index, 'text', e.target.value)}
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-amber-50/50 p-3 rounded-md mt-4 border border-dashed border-amber-200">
        <p className="text-sm text-amber-700">
          <strong>Tip:</strong> For quicker entry, you can simply type full ingredients like "2 cups flour" in the ingredient name field.
        </p>
      </div>
    </div>
  );
};

export default IngredientsList;
