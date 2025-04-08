
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import IngredientsList from '../IngredientsList';

interface RecipeIngredientsTabProps {
  form: UseFormReturn<any>;
}

const RecipeIngredientsTab: React.FC<RecipeIngredientsTabProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-amber-800 font-medium text-lg">Recipe Ingredients</h3>
      <p className="text-amber-700/70 text-sm">
        Add all ingredients needed for this recipe. Be specific with measurements and preparation notes.
      </p>
      <IngredientsList form={form} />
    </div>
  );
};

export default RecipeIngredientsTab;
