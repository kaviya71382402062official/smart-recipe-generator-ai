import React from 'react';
import {
  ChefHat,
  Sparkles,
  ArrowRight,
  Heart,
  Calendar,
  ShoppingBag,
  Clock,
  Flame,
  Plus,
  Compass,
  MessageSquare,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { UserProfile, Recipe } from '../types/recipe';

interface UserDashboardProps {
  user: UserProfile;
  recentRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  recentlyViewed: Recipe[];
  allRecipes: Recipe[];
  availableIngredients: string[];
  onNavigate: (tab: 'recipes' | 'favorites' | 'shopping' | 'specs' | 'planner' | 'ask-chef' | 'profile') => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onOpenAiGenerate: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  recentRecipes,
  favoriteRecipes,
  recentlyViewed,
  allRecipes,
  availableIngredients,
  onNavigate,
  onSelectRecipe,
  onOpenAiGenerate,
}) => {
  // Inspiration Recipe of the Day (seeded or first match)
  const inspirationRecipe = allRecipes[0] || recentRecipes[0];

  // Personalized suggestions: filter by user dietary or preferences
  const personalizedSuggestions = allRecipes
    .filter((r) => {
      if (user.dietaryPreferences.length > 0) {
        return user.dietaryPreferences.some((pref) =>
          r.dietaryTags.some((tag) => tag.toLowerCase() === pref.toLowerCase())
        );
      }
      return true;
    })
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-10 border border-stone-800 shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Chef Dashboard
                </span>
                {user.dietaryPreferences.map((d) => (
                  <span
                    key={d}
                    className="text-xs font-medium bg-white/10 text-stone-200 px-2 py-0.5 rounded-full"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                You have <span className="text-amber-300 font-semibold">{availableIngredients.length} ingredients</span> in your pantry ready to be transformed into zero-waste meals.
              </p>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('recipes')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              <span>Browse Recipes</span>
            </button>
            <button
              onClick={onOpenAiGenerate}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI Chef</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Shortcuts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('recipes')}
          className="p-4 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-700 font-medium">Ingredient Matcher</div>
            <div className="font-bold text-stone-900 text-sm">Find Recipes</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('favorites')}
          className="p-4 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-red-500" />
          </div>
          <div>
            <div className="text-xs text-stone-700 font-medium">Bookmarks ({favoriteRecipes.length})</div>
            <div className="font-bold text-stone-900 text-sm">My Favorites</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('planner')}
          className="p-4 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-700 font-medium">Weekly Schedule</div>
            <div className="font-bold text-stone-900 text-sm">Meal Planner</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('ask-chef')}
          className="p-4 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-700 font-medium">AI Culinary Bot</div>
            <div className="font-bold text-stone-900 text-sm">Ask AI Chef</div>
          </div>
        </button>
      </div>

      {/* Daily Cooking Inspiration Hero */}
      {inspirationRecipe && (
        <div className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-xs flex flex-col md:flex-row">
          <div className="relative md:w-1/2 h-60 md:h-auto bg-stone-100">
            <img
              src={inspirationRecipe.imageUrl}
              alt={inspirationRecipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Cooking Inspiration</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-700 mb-1">
                <span>{inspirationRecipe.cuisine}</span>
                <span>•</span>
                <span>{inspirationRecipe.mealType}</span>
                <span>•</span>
                <span>{inspirationRecipe.difficulty}</span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                {inspirationRecipe.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 mt-2 leading-relaxed">
                {inspirationRecipe.description}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 text-xs font-medium text-stone-700">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>{inspirationRecipe.totalTimeMinutes} mins</span>
                </div>
                <div>
                  <span>{inspirationRecipe.nutrition.calories} kcal</span>
                </div>
                <div>
                  <span>{inspirationRecipe.nutrition.protein}g protein</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectRecipe(inspirationRecipe)}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>Cook This Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Recipe Suggestions for this User */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Recommended for You</span>
            </h3>
            <p className="text-xs text-stone-700 mt-0.5">
              Personalized matches aligned with your diet & kitchen ingredients
            </p>
          </div>
          <button
            onClick={() => onNavigate('recipes')}
            className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
          >
            <span>See all recipes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalizedSuggestions.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="bg-white rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-36 bg-stone-100 overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  {recipe.totalTimeMinutes}m • {recipe.cuisine}
                </div>
              </div>
              <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {recipe.title}
                  </h4>
                  <p className="text-[11px] text-stone-700 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-medium text-stone-700">
                  <span>{recipe.nutrition.calories} kcal</span>
                  <span className="text-amber-800 font-bold">Cook →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed Recipes */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Recently Viewed
            </h3>
            <span className="text-xs text-stone-700">History</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentlyViewed.slice(0, 3).map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className="p-3 bg-white rounded-2xl border border-stone-200 hover:border-amber-300 flex items-center gap-3.5 cursor-pointer shadow-xs transition-all group"
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate group-hover:text-amber-800">
                    {recipe.title}
                  </h4>
                  <div className="text-[11px] text-stone-700 mt-0.5">
                    {recipe.totalTimeMinutes} mins • {recipe.difficulty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
