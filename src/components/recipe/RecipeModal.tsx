
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopupWindow } from '@/components/ui/popup-window';
import { Form } from '@/components/ui/form';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RecipeModalFooter from './RecipeModalFooter';
import { RecipeDetailsTab, RecipeIngredientsTab, RecipePreparationTab, RecipeTabNavigation } from './tabs';

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
  
  // Don't render anything if not open, to prevent React hooks errors
  if (!isOpen) return null;
  
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
      footer={
        <RecipeModalFooter 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onClose={onClose} 
        />
      }
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
                <RecipeDetailsTab 
                  form={form} 
                  coverImage={coverImage} 
                  setCoverImage={setCoverImage}
                  isImporting={isImporting}
                  setIsImporting={setIsImporting}
                  onImportSuccess={handleImportSuccess}
                />
              )}
              
              {activeTab === 'ingredients' && (
                <RecipeIngredientsTab form={form} />
              )}
              
              {activeTab === 'steps' && (
                <RecipePreparationTab form={form} />
              )}
            </motion.div>
          </AnimatePresence>
          
          <RecipeTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </form>
      </Form>
    </PopupWindow>
  );
};

export default RecipeModal;
