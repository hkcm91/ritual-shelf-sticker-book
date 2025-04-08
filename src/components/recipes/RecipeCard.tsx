
import React from 'react';
import { BookData } from '@/store/types';
import { Utensils, Clock, Users } from 'lucide-react';

interface RecipeCardProps {
  recipe: BookData;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe-card w-full h-full relative overflow-hidden rounded-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
      {/* Recipe Cover/Image */}
      <div 
        className="recipe-cover absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: recipe.coverURL ? `url(${recipe.coverURL})` : 'none',
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Recipe Info Overlay */}
      <div className="recipe-info absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-950/70 to-transparent p-3 flex flex-col justify-end">
        <h3 className="recipe-title text-amber-100 font-bold text-sm line-clamp-2 mb-1">
          {recipe.title || 'Untitled Recipe'}
        </h3>
        
        {recipe.author && (
          <p className="recipe-author text-amber-200/80 text-xs mb-2">by {recipe.author}</p>
        )}
        
        <div className="recipe-details flex flex-wrap gap-2 mt-auto">
          {recipe.cookingTime && (
            <div className="recipe-time flex items-center gap-1 bg-amber-900/60 rounded-full px-2 py-0.5">
              <Clock className="h-3 w-3 text-amber-300" />
              <span className="text-amber-100 text-xs">{recipe.cookingTime}</span>
            </div>
          )}
          
          {recipe.servings && (
            <div className="recipe-servings flex items-center gap-1 bg-amber-900/60 rounded-full px-2 py-0.5">
              <Users className="h-3 w-3 text-amber-300" />
              <span className="text-amber-100 text-xs">{recipe.servings} servings</span>
            </div>
          )}
          
          {recipe.difficulty && (
            <div className="recipe-difficulty flex items-center gap-1 bg-amber-900/60 rounded-full px-2 py-0.5">
              <Utensils className="h-3 w-3 text-amber-300" />
              <span className="text-amber-100 text-xs capitalize">{recipe.difficulty}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
