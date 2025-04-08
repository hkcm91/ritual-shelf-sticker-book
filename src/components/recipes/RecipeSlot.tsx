
import React, { useState } from 'react';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import SlotControls from '../SlotControls';
import DeleteDialog from '../DeleteDialog';
import EmptySlot from '../EmptySlot';
import { useBookshelfStore } from '@/store/bookshelfStore';
import ContextMenuWrapper from '../ContextMenuWrapper';
import RecipeCard from './RecipeCard';
import { useBookSlot } from '@/hooks/useBookSlot';

type RecipeSlotProps = {
  position: number;
};

const RecipeSlot: React.FC<RecipeSlotProps> = ({ position }) => {
  const [slotType, setSlotType] = useState<"book" | "sticker" | "recipe">("recipe");
  const { activeTheme } = useBookshelfStore();
  
  const {
    book: recipe,
    fileInputRef,
    scale,
    position2D,
    rotation,
    handleFileChange,
    handleClick,
    handleDragOver,
    handleDrop,
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    handleDeleteSticker,
    showDeleteDialog,
    setShowDeleteDialog,
    isAltDrag
  } = useBookSlot({ 
    position, 
    slotType: "recipe" 
  });

  // Check if we should use realistic styling
  const useRealisticStyle = activeTheme === 'default' || activeTheme === 'custom';
  
  return (
    <>
      <div 
        className={`recipe-slot relative h-[220px] w-[150px] mx-1 rounded-sm
          ${!recipe ? 'hover:bg-amber-50/10' : 'hover:border hover:border-amber-500/30'}
          ${useRealisticStyle ? 'realistic-recipe-slot' : ''}
          transition-colors duration-200 cursor-pointer`}
        data-position={position}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          boxShadow: useRealisticStyle && !recipe ? 'inset 0 0 20px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {recipe ? (
          <ContextMenuWrapper
            book={recipe}
            handleRotate={handleRotate}
            handleResetTransform={handleResetTransform}
            setShowDeleteDialog={setShowDeleteDialog}
          >
            <Popover>
              <PopoverTrigger asChild>
                <RecipeCard recipe={recipe} />
              </PopoverTrigger>
              <SlotControls 
                onShowDeleteDialog={() => setShowDeleteDialog(true)}
                scale={scale}
                onScaleChange={handleScaleChange}
                onRotate={handleRotate}
                onResetTransform={handleResetTransform}
              />
            </Popover>
          </ContextMenuWrapper>
        ) : (
          <EmptySlot 
            fileInputRef={fileInputRef} 
            onFileSelect={handleFileChange} 
            slotType="recipe"
            onClick={handleClick}
            position={position}
          />
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSticker}
        title="Delete Recipe?"
        description="This action cannot be undone."
      />
    </>
  );
};

export default RecipeSlot;
