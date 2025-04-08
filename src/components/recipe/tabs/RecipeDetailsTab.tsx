
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import RecipeUrlImport from '../RecipeUrlImport';
import RecipeImageUpload from '../RecipeImageUpload';
import RecipeMetadata from '../RecipeMetadata';

interface RecipeDetailsTabProps {
  form: UseFormReturn<any>;
  coverImage: string | null;
  setCoverImage: (value: string | null) => void;
  isImporting: boolean;
  setIsImporting: (value: boolean) => void;
  onImportSuccess: (data: any) => void;
}

const RecipeDetailsTab: React.FC<RecipeDetailsTabProps> = ({
  form,
  coverImage,
  setCoverImage,
  isImporting,
  setIsImporting,
  onImportSuccess
}) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="w-full md:w-2/3 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-amber-700">Recipe Name</FormLabel>
                <FormControl>
                  <Input placeholder="Grandma's Apple Pie" className="text-lg" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-amber-700">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A brief description of this delicious recipe..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <RecipeUrlImport 
            onStartImport={() => setIsImporting(true)}
            onImportSuccess={onImportSuccess}
            onImportError={() => {
              setIsImporting(false);
              toast.error("Failed to import recipe");
            }}
            isImporting={isImporting}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <RecipeImageUpload
            value={coverImage}
            onChange={setCoverImage}
          />
          
          <RecipeMetadata form={form} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsTab;
