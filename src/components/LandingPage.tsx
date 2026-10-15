import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ChefHat,
  Clock,
  Flame,
  CheckCircle2,
  UtensilsCrossed,
  RefreshCw,
  Leaf,
  Layers,
  Heart,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { Recipe } from '../types/recipe';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreRecipes: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  featuredRecipes: Recipe[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreRecipes,
  onSelectRecipe,
  featuredRecipes,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-100/30 border border-amber-200/80 p-8 sm:p-12 lg:p-16 shadow-xs">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 text-xs sm:text-sm font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>AI-Powered Food Waste Reducer & Recipe Engine</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
            Turn Your Ingredients into <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Delicious Meals</span> with AI
          </h1>

          <p className="text-stone-700 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Stop wondering what to cook. Simply tell us what ingredients you have in your kitchen or fridge, and our smart AI chef will instantly generate appetizing recipes, suggest substitutions, and calculate full nutrition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreRecipes}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm sm:text-base border border-stone-200/90 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <ChefHat className="w-4 h-4 text-amber-700" />
              <span>Explore Recipe Matcher</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-8 border-t border-amber-200/60 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">45+</div>
              <div className="text-[11px] sm:text-xs text-stone-700 mt-0.5">Curated & AI Dishes</div>
            </div>
            <div>
              <div className="font-serif font-bold text-xl sm:text-2xl text-orange-800">0%</div>
              <div className="text-[11px] sm:text-xs text-stone-700 mt-0.5">Kitchen Food Waste</div>
            </div>
            <div>
              <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">100%</div>
              <div className="text-[11px] sm:text-xs text-stone-700 mt-0.5">Custom Ingredient Match</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-3">
            How SmartRecipe AI Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Turn mismatched ingredients into restaurant-quality home cooking in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif font-bold text-xl">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Add Available Ingredients</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Type items you already have (e.g. Eggs, Tomato, Onion, Rice) or snap a quick photo of your fridge for instant vision detection.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-serif font-bold text-xl">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">AI Generates & Matches</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Our recommendation engine compares your ingredients against dozens of recipes, ranks by match percentage, and suggests substitutes for anything missing.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-serif font-bold text-xl">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Start Cooking Guided</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Follow step-by-step interactive instructions with built-in timers, check off steps, view macro nutrition, and ask Chef AI questions as you go.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Recipes Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
              Inspiration Catalog
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Community Favorites
            </h2>
          </div>
          <button
            onClick={onExploreRecipes}
            className="text-xs sm:text-sm font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 hover:underline self-start sm:self-auto"
          >
            <span>View All Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredRecipes.slice(0, 4).map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="group bg-white rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  {recipe.cuisine}
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{recipe.totalTimeMinutes}m</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {recipe.mealType}
                    </span>
                    <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded">
                      {recipe.difficulty}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {recipe.title}
                  </h4>
                  <p className="text-xs text-stone-700 mt-1 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700">
                  <span>{recipe.nutrition.calories} kcal</span>
                  <span className="font-semibold text-amber-800 flex items-center gap-1">
                    View Recipe →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Core Pillars Highlight Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-xs space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Why SmartRecipe AI?
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Engineered for Modern, Sustainable Cooking
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Gemini AI Culinary Brain</h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              Generates bespoke gourmet recipes tailored exactly to your pantry constraints and culinary preferences.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200/70 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-200 text-orange-900 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Smart Ingredient Substitutes</h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              Missing soy sauce, heavy cream, or eggs? Get instant, tested pantry alternatives with exact replacement ratios.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Zero Food Waste</h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              Use up lingering vegetables, wilting herbs, and grains before they spoil to save money and the environment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200/70 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-200 text-purple-900 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Dietary & Allergy Safe</h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              Custom filters for Vegetarian, Vegan, High Protein, Low Carb, Gluten Free, and Dairy Free lifestyle diets.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="rounded-3xl bg-gradient-to-r from-stone-900 to-stone-800 text-white p-8 sm:p-12 text-center space-y-5 shadow-lg">
        <h2 className="font-serif text-2xl sm:text-4xl font-bold max-w-xl mx-auto">
          Ready to discover what you can cook today?
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
          Join thousands of home cooks saving time and reducing food waste every single meal.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition-all hover:scale-105 inline-flex items-center gap-2"
        >
          <span>Create Free Account / Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-200/70 pt-10 text-xs text-stone-700 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-serif font-bold text-stone-900 text-base">
              <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                <ChefHat className="w-4 h-4" />
              </div>
              <span>SmartRecipe AI</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              An intelligent recipe generation and zero food waste system designed to turn pantry ingredients into nutritious meals.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-stone-900 mb-2.5">Features</h5>
            <ul className="space-y-1.5 text-stone-700">
              <li>Pantry Recipe Matching</li>
              <li>Camera Fridge Scanner</li>
              <li>Smart Substitutions</li>
              <li>Weekly Meal Planner</li>
              <li>Categorized Grocery List</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-stone-900 mb-2.5">About & Legal</h5>
            <ul className="space-y-1.5 text-stone-700">
              <li>About SmartRecipe AI</li>
              <li>Food Waste Mission</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Team Project Roles</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-stone-900 mb-2.5">Contact</h5>
            <p className="text-stone-700 leading-relaxed">
              Questions or feedback? Reach out to the student development team through the Project Specs panel.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-700">
          <span>© 2026 SmartRecipe AI. Intelligent Culinary Companion.</span>
          <span>Powered by Google Gemini 3.8 Flash</span>
        </div>
      </footer>
    </div>
  );
};
