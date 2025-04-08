
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopupWindow } from '@/components/ui/popup-window';
import { Form } from '@/components/ui/form';
import { useBookshelfStore } from '@/store/bookshelfStore';
import RecipeModalFooter from './RecipeModalFooter';
import { RecipeDetailsTab, RecipeIngredientsTab, RecipePreparationTab, RecipeTabNavigation } from './tabs';
import { useRecipeForm } from '@/hooks/useRecipeForm';
import RecipeModalHeader from './RecipeModalHeader';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: number;
  shelfId: string;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, position, shelfId }) => {
  const { 
    form, 
    activeTab, 
    setActiveTab, 
    isImporting, 
    setIsImporting,
    coverImage, 
    setCoverImage, 
    onSubmit, 
    handleImportSuccess 
  } = useRecipeForm(position, shelfId, onClose);
  
  // Don't render anything if not open, to prevent React hooks errors
  if (!isOpen) return null;
  
  return (
    <PopupWindow
      isOpen={isOpen}
      onClose={onClose}
      title={<RecipeModalHeader title={form.watch('title')} />}
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
