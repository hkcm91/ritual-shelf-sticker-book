
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import PreparationSteps from '../PreparationSteps';

interface RecipePreparationTabProps {
  form: UseFormReturn<any>;
}

const RecipePreparationTab: React.FC<RecipePreparationTabProps> = ({ form }) => {
  return <PreparationSteps form={form} />;
};

export default RecipePreparationTab;
