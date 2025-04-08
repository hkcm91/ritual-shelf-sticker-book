
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import PreparationSteps from '../PreparationSteps';

interface RecipePreparationTabProps {
  form: UseFormReturn<any>;
}

const RecipePreparationTab: React.FC<RecipePreparationTabProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-amber-800 font-medium text-lg">Preparation Steps</h3>
      <p className="text-amber-700/70 text-sm">
        List the steps to prepare this recipe in sequential order. Be clear and concise.
      </p>
      <PreparationSteps form={form} />
    </div>
  );
};

export default RecipePreparationTab;
