
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import IngredientsList from '../IngredientsList';

interface RecipeIngredientsTabProps {
  form: UseFormReturn<any>;
}

const RecipeIngredientsTab: React.FC<RecipeIngredientsTabProps> = ({ form }) => {
  return <IngredientsList form={form} />;
};

export default RecipeIngredientsTab;
