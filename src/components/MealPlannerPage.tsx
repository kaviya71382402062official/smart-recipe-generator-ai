import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Clock,
  Flame,
  Check,
  X,
  ArrowRight,
  ChefHat,
  RotateCcw,
} from 'lucide-react';
import { DayOfWeek, MealSlot, PlannedMeal, Recipe } from '../types/recipe';

interface MealPlannerPageProps {
  allRecipes: Recipe[];
  onAddIngredientsToShoppingList: (ingredients: string[], recipeTitle: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onOpenShoppingList: () => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const MEAL_SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const MealPlannerPage: React.FC<MealPlannerPageProps> = ({
  allRecipes,
  onAddIngredientsToShoppingList,
  onSelectRecipe,
  onOpenShoppingList,
}) => {
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_meal_plan');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Seed sensible defaults from allRecipes
    const defaultBreakfast = allRecipes.find((r) => r.mealType === 'Breakfast') || allRecipes[0];
    const defaultDinner = allRecipes.find((r) => r.mealType === 'Dinner') || allRecipes[1];
    const defaultLunch = allRecipes.find((r) => r.mealType === 'Lunch') || allRecipes[2];

    return [
      {
        id: 'plan-1',
        day: 'Monday',
        slot: 'Breakfast',
        recipeId: defaultBreakfast.id,
        recipeTitle: defaultBreakfast.title,
        servings: 2,
        imageUrl: defaultBreakfast.imageUrl,
        cookTimeMinutes: defaultBreakfast.totalTimeMinutes,
        calories: defaultBreakfast.nutrition.calories,
        cuisine: defaultBreakfast.cuisine,
        ingredients: defaultBreakfast.ingredients.map((i) => ({ name: i.name, amount: i.amount })),
      },
      {
        id: 'plan-2',
        day: 'Monday',
        slot: 'Dinner',
        recipeId: defaultDinner.id,
        recipeTitle: defaultDinner.title,
        servings: 2,
        imageUrl: defaultDinner.imageUrl,
        cookTimeMinutes: defaultDinner.totalTimeMinutes,
        calories: defaultDinner.nutrition.calories,
        cuisine: defaultDinner.cuisine,
        ingredients: defaultDinner.ingredients.map((i) => ({ name: i.name, amount: i.amount })),
      },
      {
        id: 'plan-3',
        day: 'Wednesday',
        slot: 'Lunch',
        recipeId: defaultLunch.id,
        recipeTitle: defaultLunch.title,
        servings: 2,
        imageUrl: defaultLunch.imageUrl,
        cookTimeMinutes: defaultLunch.totalTimeMinutes,
        calories: defaultLunch.nutrition.calories,
        cuisine: defaultLunch.cuisine,
        ingredients: defaultLunch.ingredients.map((i) => ({ name: i.name, amount: i.amount })),
      },
    ];
  });

  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');
  const [selectRecipeModal, setSelectRecipeModal] = useState<{
    day: DayOfWeek;
    slot: MealSlot;
  } | null>(null);

  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('smart_recipe_meal_plan', JSON.stringify(plannedMeals));
    } catch (e) {
      console.error(e);
    }
  }, [plannedMeals]);

  const handleAddMeal = (recipe: Recipe) => {
    if (!selectRecipeModal) return;
    const newMeal: PlannedMeal = {
      id: `plan-${Date.now()}`,
      day: selectRecipeModal.day,
      slot: selectRecipeModal.slot,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      servings: recipe.servings,
      imageUrl: recipe.imageUrl,
      cookTimeMinutes: recipe.totalTimeMinutes,
      calories: recipe.nutrition.calories,
      cuisine: recipe.cuisine,
      ingredients: recipe.ingredients.map((i) => ({ name: i.name, amount: i.amount })),
    };

    // Replace if slot already has meal or append
    setPlannedMeals((prev) => [
      ...prev.filter(
        (m) => !(m.day === selectRecipeModal.day && m.slot === selectRecipeModal.slot)
      ),
      newMeal,
    ]);
    setSelectRecipeModal(null);
  };

  const handleRemoveMeal = (id: string) => {
    setPlannedMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearWeek = () => {
    if (confirm('Clear all scheduled meals for the week?')) {
      setPlannedMeals([]);
    }
  };

  // Generate shopping list from whole week
  const handleExportAllToShoppingList = () => {
    if (plannedMeals.length === 0) return;
    let totalItems = 0;
    plannedMeals.forEach((meal) => {
      const targetRecipe = allRecipes.find((r) => r.id === meal.recipeId);
      if (targetRecipe) {
        const ingredientsToBuy = targetRecipe.ingredients
          .filter((i) => !i.isStaple)
          .map((i) => i.name);
        onAddIngredientsToShoppingList(ingredientsToBuy, targetRecipe.title);
        totalItems += ingredientsToBuy.length;
      }
    });
    onOpenShoppingList();
  };

  // Filter recipes inside picker modal
  const filteredRecipesForPicker = allRecipes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.mealType.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Compute Weekly Stats
  const totalMealsCount = plannedMeals.length;
  const totalWeeklyCalories = plannedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const avgCookTime =
    totalMealsCount > 0
      ? Math.round(
          plannedMeals.reduce((acc, m) => acc + (m.cookTimeMinutes || 0), 0) / totalMealsCount
        )
      : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-stone-900">Weekly Meal Planner</h1>
            <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
              Organize your meals from Monday to Sunday and generate automated grocery lists.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAllToShoppingList}
            disabled={plannedMeals.length === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Generate Shopping List</span>
          </button>
          {plannedMeals.length > 0 && (
            <button
              onClick={handleClearWeek}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-red-600 hover:bg-stone-50 transition-colors"
              title="Clear weekly plan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Weekly Stats Bar */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-center text-xs">
        <div>
          <span className="text-stone-700 font-semibold uppercase tracking-wider block">Planned Meals</span>
          <span className="text-base sm:text-xl font-bold text-stone-900">{totalMealsCount} of 28 slots</span>
        </div>
        <div>
          <span className="text-stone-700 font-semibold uppercase tracking-wider block">Weekly Est. Calories</span>
          <span className="text-base sm:text-xl font-bold text-amber-900">{totalWeeklyCalories} kcal</span>
        </div>
        <div>
          <span className="text-stone-700 font-semibold uppercase tracking-wider block">Avg Cook Time</span>
          <span className="text-base sm:text-xl font-bold text-stone-900">{avgCookTime} mins</span>
        </div>
      </div>

      {/* Days Tabs (Monday to Sunday) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200">
        {DAYS_OF_WEEK.map((day) => {
          const count = plannedMeals.filter((m) => m.day === day).length;
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Day Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MEAL_SLOTS.map((slot) => {
          const meal = plannedMeals.find((m) => m.day === activeDay && m.slot === slot);
          const fullRecipe = meal ? allRecipes.find((r) => r.id === meal.recipeId) : null;

          return (
            <div
              key={slot}
              className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs flex flex-col justify-between min-h-[220px]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  {slot}
                </span>
                {meal && (
                  <button
                    onClick={() => handleRemoveMeal(meal.id)}
                    className="p-1 rounded-md text-stone-400 hover:text-red-600 transition-colors"
                    title="Remove meal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {meal ? (
                <div className="py-3 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {meal.imageUrl && (
                      <img
                        src={meal.imageUrl}
                        alt={meal.recipeTitle}
                        className="w-full h-28 object-cover rounded-xl mb-2"
                      />
                    )}
                    <h4
                      onClick={() => fullRecipe && onSelectRecipe(fullRecipe)}
                      className="font-serif font-bold text-stone-900 hover:text-amber-800 transition-colors cursor-pointer text-sm line-clamp-1"
                    >
                      {meal.recipeTitle}
                    </h4>
                    <div className="text-[11px] text-stone-700 mt-1 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>{meal.cookTimeMinutes} mins</span>
                      <span>•</span>
                      <span>{meal.calories} kcal</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectRecipeModal({ day: activeDay, slot })}
                      className="text-xs text-amber-800 hover:underline font-semibold"
                    >
                      Swap Recipe
                    </button>
                    {fullRecipe && (
                      <button
                        onClick={() => onSelectRecipe(fullRecipe)}
                        className="text-xs text-stone-700 hover:text-stone-950 font-bold"
                      >
                        Cook →
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-stone-600">No {slot.toLowerCase()} scheduled</p>
                  <button
                    onClick={() => setSelectRecipeModal({ day: activeDay, slot })}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
                  >
                    + Add Meal
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Select Recipe Modal */}
      {selectRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Select {selectRecipeModal.slot} for {selectRecipeModal.day}
                </h3>
                <p className="text-xs text-stone-700">Choose from your catalog or saved recipes</p>
              </div>
              <button
                onClick={() => setSelectRecipeModal(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-stone-100">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search recipe by name or cuisine..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs outline-none focus:border-amber-500 bg-stone-50"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredRecipesForPicker.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleAddMeal(r)}
                  className="p-3 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.imageUrl}
                      alt={r.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm group-hover:text-amber-800">
                        {r.title}
                      </h4>
                      <div className="text-[11px] text-stone-700 mt-0.5">
                        {r.cuisine} • {r.totalTimeMinutes}m • {r.nutrition.calories} kcal
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-stone-900 group-hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
