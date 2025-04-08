
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

export const recipeSchema = z.object({
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

export type RecipeFormValues = z.infer<typeof recipeSchema>;

export const useRecipeForm = (position: number, shelfId: string, onClose: () => void) => {
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

  return {
    form,
    activeTab,
    setActiveTab,
    isImporting,
    setIsImporting,
    coverImage,
    setCoverImage,
    onSubmit,
    handleImportSuccess
  };
};
