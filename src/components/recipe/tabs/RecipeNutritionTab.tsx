
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface RecipeNutritionTabProps {
  form: UseFormReturn<any>;
}

const RecipeNutritionTab: React.FC<RecipeNutritionTabProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-amber-800 font-medium text-lg">Nutrition Information</h3>
      <p className="text-amber-700/70 text-sm">
        Add nutritional information for this recipe if available.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-amber-700">Calories</FormLabel>
              <FormControl>
                <Input placeholder="kcal" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="protein"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-amber-700">Protein</FormLabel>
              <FormControl>
                <Input placeholder="g" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="carbs"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-amber-700">Carbohydrates</FormLabel>
              <FormControl>
                <Input placeholder="g" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fat"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-amber-700">Fat</FormLabel>
              <FormControl>
                <Input placeholder="g" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RecipeNutritionTab;
