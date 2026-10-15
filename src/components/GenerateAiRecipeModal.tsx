import React, { useState } from 'react';
import { X, Sparkles, ChefHat, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface GenerateAiRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: string[];
  onRecipesGenerated: (recipes: Recipe[]) => void;
}

export const GenerateAiRecipeModal: React.FC<GenerateAiRecipeModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onRecipesGenerated,
}) => {
  const [mealType, setMealType] = useState('Dinner');
  const [cuisine, setCuisine] = useState('Any');
  const [maxTime, setMaxTime] = useState<number>(30);
  const [difficulty, setDifficulty] = useState('Easy');
  const [dietary, setDietary] = useState<string[]>([]);
  const [servings, setServings] = useState<number>(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleGenerate = async () => {
    if (availableIngredients.length === 0) {
      setError('Please add at least one ingredient to your kitchen first!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-ai-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: availableIngredients,
          dietaryPreferences: dietary,
          mealType,
          cuisine,
          maxTime,
          difficulty,
          servings,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipes');
      }

      if (data.recipes && data.recipes.length > 0) {
        onRecipesGenerated(data.recipes);
        onClose();
      } else {
        setError('No recipes were returned. Please try with different settings or ingredients.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI Chef service.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Custom AI Recipe Generator</h3>
              <p className="text-xs text-stone-700">Powered by Gemini 3.8 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ingredients Summary */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
            Using Available Ingredients ({availableIngredients.length})
          </div>
          <div className="text-xs text-stone-700 font-medium line-clamp-2">
            {availableIngredients.length > 0
              ? availableIngredients.join(', ')
              : 'No ingredients added yet! Add some first.'}
          </div>
        </div>

        {/* Form Controls */}
        <div className="mt-4 space-y-3.5">
          {/* Meal Type & Cuisine */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 outline-none focus:border-amber-500 font-medium"
              >
                <option value="Any">Any Meal</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Cuisine Style</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 outline-none focus:border-amber-500 font-medium"
              >
                <option value="Any">Any Cuisine</option>
                <option value="Asian">Asian / Wok</option>
                <option value="Italian">Italian / Pasta</option>
                <option value="Mexican">Mexican / Fiesta</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Indian">Indian / Spiced</option>
                <option value="American">American / Comfort</option>
              </select>
            </div>
          </div>

          {/* Max Cook Time & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Max Cooking Time</label>
              <select
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 outline-none focus:border-amber-500 font-medium"
              >
                <option value={15}>Quick (≤ 15 mins)</option>
                <option value={30}>Medium (≤ 30 mins)</option>
                <option value={45}>Generous (≤ 45 mins)</option>
                <option value={60}>Slow Simmer (≤ 60 mins)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Servings</label>
              <select
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 outline-none focus:border-amber-500 font-medium"
              >
                <option value={1}>1 Person</option>
                <option value={2}>2 People</option>
                <option value={4}>4 People (Family)</option>
              </select>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Dietary Constraints</label>
            <div className="flex flex-wrap gap-1.5">
              {['Vegetarian', 'Vegan', 'High Protein', 'Low Carb', 'Gluten Free', 'Dairy Free'].map((item) => {
                const isSelected = dietary.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDietary(item)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                      isSelected
                        ? 'bg-amber-700 text-white shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || availableIngredients.length === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                <span>Crafting Bespoke Recipes...</span>
              </>
            ) : (
              <>
                <ChefHat className="w-4 h-4" />
                <span>Generate Recipes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
