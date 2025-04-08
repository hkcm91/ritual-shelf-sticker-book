import React, { useState, useEffect } from 'react';
import { X, Link, Upload, Plus, Save, Loader2, ChevronRight, ChevronDown, Clock, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopupWindow } from '@/components/ui/popup-window';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RecipeUrlImport from './RecipeUrlImport';
import IngredientsList from './IngredientsList';
import PreparationSteps from './PreparationSteps';
import RecipeImageUpload from './RecipeImageUpload';
import RecipeMetadata from './RecipeMetadata';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: number;
  shelfId: string;
}

const recipeSchema = z.object({
  title: z.string().min(1, { message: "Recipe name is required" }),
  description: z.string().optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  servings: z.string().optional(),
  ingredients: z.array(z.object({
    id: z.string(),
    text: z.string(),
    quantity: z.string().optional(),
    unit: z.string().optional(),
  })),
  steps: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })),
  notes: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.string().length(0)),
  tags: z.array(z.string()).optional(),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, position, shelfId }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'steps'>('details');
  const [isImporting, setIsImporting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const { addBook } = useBookshelfStore();
  
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      description: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      ingredients: [],
      steps: [],
      notes: '',
      sourceUrl: '',
      tags: [],
    },
  });
  
  const onSubmit = (data: RecipeFormValues) => {
    try {
      const recipeId = uuidv4();
      
      const recipeBook = {
        id: recipeId,
        title: data.title,
        author: 'Recipe Library',
        coverURL: coverImage || 'https://images.unsplash.com/photo-1588635655481-e1cc7a5e39ab?q=80&w=500',
        position: position,
        shelfId: shelfId,
        isSticker: false,
        metadata: {
          recipeType: true,
          description: data.description,
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          servings: data.servings,
          ingredients: data.ingredients,
          steps: data.steps,
          notes: data.notes,
          sourceUrl: data.sourceUrl,
          tags: data.tags,
          createdAt: new Date().toISOString(),
        }
      };
      
      addBook(recipeBook);
      
      toast.success("Recipe added successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("Failed to create recipe");
    }
  };
  
  const handleImportSuccess = (recipeData: any) => {
    setIsImporting(false);
    
    form.setValue('title', recipeData.title || '');
    form.setValue('description', recipeData.description || '');
    form.setValue('prepTime', recipeData.prepTime || '');
    form.setValue('cookTime', recipeData.cookTime || '');
    form.setValue('servings', recipeData.servings || '');
    
    if (recipeData.ingredients?.length) {
      const formattedIngredients = recipeData.ingredients.map((ing: string) => ({
        id: uuidv4(),
        text: ing,
      }));
      form.setValue('ingredients', formattedIngredients);
    }
    
    if (recipeData.steps?.length) {
      const formattedSteps = recipeData.steps.map((step: string) => ({
        id: uuidv4(),
        text: step,
      }));
      form.setValue('steps', formattedSteps);
    }
    
    if (recipeData.notes) {
      form.setValue('notes', recipeData.notes);
    }
    
    if (recipeData.sourceUrl) {
      form.setValue('sourceUrl', recipeData.sourceUrl);
    }
    
    if (recipeData.image) {
      setCoverImage(recipeData.image);
    }
    
    toast.success("Recipe imported successfully!");
  };
  
  const TabButton = ({ name, label, icon }: { name: 'details' | 'ingredients' | 'steps'; label: string; icon: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => setActiveTab(name)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md transition-colors
        ${activeTab === name 
          ? 'bg-amber-100 text-amber-900 font-medium' 
          : 'text-amber-700 hover:bg-amber-50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
  
  const footerContent = (
    <div className="flex justify-between w-full">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
        className="border-amber-300/50 text-amber-700 hover:bg-amber-50/50"
      >
        Cancel
      </Button>
      
      <div className="flex gap-2">
        {activeTab !== 'details' && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveTab(activeTab === 'ingredients' ? 'details' : 'ingredients')}
            className="text-amber-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        
        {activeTab !== 'steps' ? (
          <Button
            type="button"
            onClick={() => setActiveTab(activeTab === 'details' ? 'ingredients' : 'steps')}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="submit"
            form="recipe-form"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Recipe
          </Button>
        )}
      </div>
    </div>
  );
  
  return (
    <PopupWindow
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-amber-800">
          <img 
            src="/icons/recipe-book.svg" 
            alt="Recipe" 
            className="h-6 w-6" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span>{form.watch('title') || 'New Recipe'}</span>
        </div>
      }
      footer={footerContent}
      size="xl"
      className="recipe-modal"
      contentClassName="recipe-content"
    >
      <Form {...form}>
        <form id="recipe-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[300px]"
            >
              {activeTab === 'details' && (
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
                        onImportSuccess={handleImportSuccess}
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
              )}
              
              {activeTab === 'ingredients' && (
                <IngredientsList form={form} />
              )}
              
              {activeTab === 'steps' && (
                <PreparationSteps form={form} />
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center pt-4 border-t border-amber-100">
            <div className="flex rounded-lg bg-amber-50/80 p-1">
              <TabButton name="details" label="Details" icon={<span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 text-xs">1</span>} />
              <TabButton name="ingredients" label="Ingredients" icon={<span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 text-xs">2</span>} />
              <TabButton name="steps" label="Preparation" icon={<span className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-200 text-amber-800 text-xs">3</span>} />
            </div>
          </div>
        </form>
      </Form>
    </PopupWindow>
  );
};

export default RecipeModal;
