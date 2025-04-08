
import React from 'react';
import { Clock, Users } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface RecipeMetadataProps {
  form: UseFormReturn<any>;
}

const RecipeMetadata: React.FC<RecipeMetadataProps> = ({ form }) => {
  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-sm font-medium text-amber-700">Recipe Information</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="prepTime"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <FormLabel className="text-amber-700 text-xs">Prep Time (min)</FormLabel>
              </div>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="15" 
                  className="border-amber-200 focus-visible:ring-amber-500" 
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cookTime"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <FormLabel className="text-amber-700 text-xs">Cook Time (min)</FormLabel>
              </div>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="25" 
                  className="border-amber-200 focus-visible:ring-amber-500" 
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="servings"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="h-3.5 w-3.5 text-amber-500" />
              <FormLabel className="text-amber-700 text-xs">Servings</FormLabel>
            </div>
            <FormControl>
              <Input 
                type="text" 
                placeholder="4" 
                className="border-amber-200 focus-visible:ring-amber-500" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="sourceUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-amber-700 text-xs">Source URL (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://..." 
                className="border-amber-200 focus-visible:ring-amber-500" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default RecipeMetadata;
