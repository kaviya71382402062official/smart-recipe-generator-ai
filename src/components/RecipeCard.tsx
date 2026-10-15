import React from 'react';
import { Clock, Flame, Heart, Sparkles, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onAddMissingToShoppingList: (ingredients: string[], recipeTitle: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
  onAddMissingToShoppingList,
}) => {
  const matchScore = recipe.matchScore ?? 0;
  const missingCount = recipe.missingCount ?? 0;
  const missingIngredients = recipe.missingIngredients ?? [];

  // Match score color badge
  const getBadgeStyle = () => {
    if (matchScore === 100 || missingCount === 0) {
      return {
        bg: 'bg-emerald-600 text-white',
        text: '100% Ready to Cook',
      };
    }
    if (matchScore >= 70) {
      return {
        bg: 'bg-amber-600 text-white',
        text: `${matchScore}% Match (${missingCount} missing)`,
      };
    }
    return {
      bg: 'bg-stone-700 text-white',
      text: `${matchScore}% Match (${missingCount} missing)`,
    };
  };

  const badge = getBadgeStyle();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Recipe Image & Top Overlay Badges */}
      <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Match Score Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 ${badge.bg}`}>
            {missingCount === 0 ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {badge.text}
          </span>
          {recipe.source === 'ai' && (
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-purple-600 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Crafted
            </span>
          )}
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-red-600 shadow-sm transition-all"
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Bottom tags on image: Cuisine & Time */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
              {recipe.cuisine} • {recipe.mealType}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{recipe.totalTimeMinutes}m</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onSelectRecipe(recipe)}
              className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer line-clamp-1"
            >
              {recipe.title}
            </h3>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
              recipe.difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : recipe.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {recipe.difficulty}
            </span>
          </div>

          <p className="text-xs text-stone-700 mt-1 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {/* Ingredient matching status breakdown */}
          <div className="mt-3.5 pt-3 border-t border-stone-100">
            <div className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Ingredients Match</span>
              <span className="text-stone-700 lowercase font-normal">
                {recipe.ingredients.filter((i) => i.isAvailable).length}/{recipe.ingredients.length} available
              </span>
            </div>

            {/* List of ingredients with check or cross */}
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.slice(0, 5).map((ing, i) => (
                <span
                  key={i}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                    ing.isAvailable
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {ing.isAvailable ? (
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  ) : (
                    <span className="text-stone-400">✖</span>
                  )}
                  <span>{ing.name}</span>
                </span>
              ))}
              {recipe.ingredients.length > 5 && (
                <span className="text-[10px] text-stone-700 self-center px-1">
                  +{recipe.ingredients.length - 5} more
                </span>
              )}
            </div>

            {/* Missing items warning & prompt */}
            {missingIngredients.length > 0 && (
              <div className="mt-2.5 p-2 bg-amber-50/80 rounded-lg border border-amber-200/70 flex items-center justify-between text-[11px]">
                <div className="text-amber-900 truncate mr-2">
                  <span className="font-semibold text-amber-800">Missing: </span>
                  <span className="text-stone-700">{missingIngredients.slice(0, 2).join(', ')}</span>
                  {missingIngredients.length > 2 && ` +${missingIngredients.length - 2}`}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddMissingToShoppingList(missingIngredients, recipe.title);
                  }}
                  className="shrink-0 text-amber-800 hover:text-amber-950 font-bold hover:underline"
                >
                  + Add to List
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nutritional Overview & Action Button */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="grid grid-cols-4 gap-1 text-center py-1.5 mb-3 bg-stone-50 rounded-xl">
            <div>
              <div className="text-[10px] text-stone-700 uppercase font-medium">Cal</div>
              <div className="text-xs font-bold text-stone-800">{recipe.nutrition.calories}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-700 uppercase font-medium">Protein</div>
              <div className="text-xs font-bold text-stone-800">{recipe.nutrition.protein}g</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-700 uppercase font-medium">Carbs</div>
              <div className="text-xs font-bold text-stone-800">{recipe.nutrition.carbs}g</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-700 uppercase font-medium">Fat</div>
              <div className="text-xs font-bold text-stone-800">{recipe.nutrition.fat}g</div>
            </div>
          </div>

          <button
            onClick={() => onSelectRecipe(recipe)}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>View Recipe & Instructions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
