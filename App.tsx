/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import { IngredientInputSection } from './components/IngredientInputSection';
import { DietaryFilterBar } from './components/DietaryFilterBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { ProjectSpecsModal } from './components/ProjectSpecsModal';
import { GenerateAiRecipeModal } from './components/GenerateAiRecipeModal';
import { AskAiChefPage } from './components/AskAiChefPage';
import { MealPlannerPage } from './components/MealPlannerPage';
import { UserProfilePage } from './components/UserProfilePage';
import { AuthPage } from './components/AuthPage';
import { FavoritesPage } from './components/FavoritesPage';
import { INITIAL_RECIPE_DATABASE } from './data/recipes';
import { matchAndRankRecipes } from './utils/recipeMatcher';
import { Recipe, ShoppingItem, DietaryFilterOptions, UserProfile } from './types/recipe';
import { Sparkles, Heart, ChefHat, CheckCircle2, AlertCircle } from 'lucide-react';

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'demo-chef-1',
  name: 'Chef Olivia',
  email: 'olivia.chef@smartrecipe.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  dietaryPreferences: ['High Protein'],
  allergies: ['Peanuts'],
  preferredCuisines: ['Italian', 'Asian', 'Mediterranean'],
  defaultServings: 2,
  preferredCookTime: 25,
  savedCollections: ['Favorites', 'Quick Dinners', 'High-Protein'],
  bio: 'Home culinary enthusiast focused on zero-waste farm-to-table cooking.',
  createdAt: Date.now() - 86400000 * 30,
};

export default function App() {
  // Current user authentication profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_current_user');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  // Available ingredients in kitchen
  const [ingredients, setIngredients] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_ingredients');
      return saved ? JSON.parse(saved) : ['Tomato', 'Egg', 'Onion', 'Rice'];
    } catch {
      return ['Tomato', 'Egg', 'Onion', 'Rice'];
    }
  });

  // Base and AI-generated recipes
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const savedAi = localStorage.getItem('smart_recipe_ai_recipes');
      const parsedAi = savedAi ? JSON.parse(savedAi) : [];
      return [...INITIAL_RECIPE_DATABASE, ...parsedAi];
    } catch {
      return INITIAL_RECIPE_DATABASE;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Active detailed recipe in modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Recently viewed recipes history
  const [recentlyViewed, setRecentlyViewed] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI Recipe generator modal
  const [isAiGenerateModalOpen, setIsAiGenerateModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<DietaryFilterOptions>({
    dietary: currentUser ? currentUser.dietaryPreferences : [],
    maxCookTime: 0,
    difficulty: 'All',
    cuisine: 'All',
    onlyReadyToCook: false,
    sortBy: 'match',
  });

  // Saved favorites
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_favorites');
      return saved ? JSON.parse(saved) : [INITIAL_RECIPE_DATABASE[0], INITIAL_RECIPE_DATABASE[1]];
    } catch {
      return [INITIAL_RECIPE_DATABASE[0], INITIAL_RECIPE_DATABASE[1]];
    }
  });

  // Shopping list items
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_shopping');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage sync effects
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smart_recipe_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('smart_recipe_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('smart_recipe_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('smart_recipe_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('smart_recipe_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('smart_recipe_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // User actions
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
    showToast('You have been signed out.');
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    setFilters((prev) => ({ ...prev, dietary: updated.dietaryPreferences }));
    showToast('Profile and preferences updated!');
  };

  // Recipe selection (adds to recently viewed)
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((r) => r.id !== recipe.id);
      return [recipe, ...filtered].slice(0, 8);
    });
  };

  // Ingredients management
  const handleAddIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`${trimmed} is already in your pantry.`);
      return;
    }
    setIngredients((prev) => [...prev, trimmed]);
  };

  const handleRemoveIngredient = (name: string) => {
    setIngredients((prev) => prev.filter((i) => i.toLowerCase() !== name.toLowerCase()));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
    showToast('Cleared all pantry ingredients.');
  };

  const handleLoadPreset = (items: string[]) => {
    setIngredients(items);
    showToast(`Loaded ${items.length} preset ingredients!`);
  };

  const handleAddMultiple = (newItems: string[]) => {
    const uniqueToAdd = newItems.filter(
      (item) => !ingredients.some((i) => i.toLowerCase() === item.toLowerCase())
    );
    if (uniqueToAdd.length > 0) {
      setIngredients((prev) => [...prev, ...uniqueToAdd]);
      showToast(`Added ${uniqueToAdd.length} detected ingredients to your pantry!`);
    } else {
      showToast('All detected ingredients are already in your pantry.');
    }
  };

  // Favorites management
  const handleToggleFavorite = (recipe: Recipe) => {
    const exists = favorites.some((f) => f.id === recipe.id);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== recipe.id));
      showToast(`Removed "${recipe.title}" from favorites.`);
    } else {
      setFavorites((prev) => [...prev, recipe]);
      showToast(`Saved "${recipe.title}" to favorites! ❤️`);
    }
  };

  const handleDeleteSavedRecipe = (recipeId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== recipeId));
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    showToast('Recipe deleted.');
  };

  // Shopping list management
  const handleAddMissingToShoppingList = (missingItems: string[], recipeTitle: string) => {
    const newItems: ShoppingItem[] = missingItems
      .filter(
        (item) =>
          !shoppingList.some(
            (s) => s.name.toLowerCase() === item.toLowerCase() && !s.checked
          )
      )
      .map((item) => ({
        id: `shop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: item,
        recipeTitle,
        checked: false,
        dateAdded: Date.now(),
      }));

    if (newItems.length > 0) {
      setShoppingList((prev) => [...newItems, ...prev]);
      showToast(`Added ${newItems.length} items to your shopping list! 🛒`);
    } else {
      showToast('These items are already on your grocery list.');
    }
  };

  const handleAddShoppingItem = (name: string, category?: string) => {
    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}`,
      name,
      category,
      checked: false,
      dateAdded: Date.now(),
    };
    setShoppingList((prev) => [newItem, ...prev]);
    showToast(`Added "${name}" to grocery list.`);
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeleteShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCheckedShopping = () => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
    showToast('Cleared checked grocery items.');
  };

  const handleClearAllShopping = () => {
    setShoppingList([]);
    showToast('Cleared entire shopping list.');
  };

  // New AI recipes generated
  const handleRecipesGenerated = (newAiRecipes: Recipe[]) => {
    setRecipes((prev) => {
      const combined = [...newAiRecipes, ...prev];
      try {
        const onlyAi = combined.filter((r) => r.source === 'ai');
        localStorage.setItem('smart_recipe_ai_recipes', JSON.stringify(onlyAi));
      } catch (e) {
        console.error(e);
      }
      return combined;
    });

    if (newAiRecipes.length > 0) {
      handleSelectRecipe(newAiRecipes[0]);
      showToast(`AI Chef crafted ${newAiRecipes.length} custom recipes for you!`);
    }
  };

  // Rank and match recipes based on current ingredients & filters
  const matchedRecipes = useMemo(() => {
    return matchAndRankRecipes(recipes, ingredients, filters);
  }, [recipes, ingredients, filters]);

  // Favorite recipes decorated with matching
  const matchedFavorites = useMemo(() => {
    return matchAndRankRecipes(favorites, ingredients, filters);
  }, [favorites, ingredients, filters]);

  // Keep selectedRecipe in sync with live matches
  const currentSelectedRecipe = useMemo(() => {
    if (!selectedRecipe) return null;
    const found = matchedRecipes.find((r) => r.id === selectedRecipe.id);
    return found || selectedRecipe;
  }, [selectedRecipe, matchedRecipes]);

  const aiGeneratedRecipes = useMemo(() => {
    return recipes.filter((r) => r.source === 'ai');
  }, [recipes]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 bg-amber-50/30 text-stone-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-stone-800 animate-in slide-in-from-bottom-4 duration-150">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        shoppingCount={shoppingList.filter((i) => !i.checked).length}
        onOpenAiGenerate={() => setIsAiGenerateModalOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setActiveTab('auth')}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* View 1: Landing Page */}
        {activeTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setActiveTab(currentUser ? 'dashboard' : 'auth')}
            onExploreRecipes={() => setActiveTab('recipes')}
            onSelectRecipe={handleSelectRecipe}
            featuredRecipes={recipes}
          />
        )}

        {/* View 2: User Dashboard */}
        {activeTab === 'dashboard' && (
          currentUser ? (
            <UserDashboard
              user={currentUser}
              recentRecipes={recipes.slice(0, 5)}
              favoriteRecipes={favorites}
              recentlyViewed={recentlyViewed}
              allRecipes={matchedRecipes}
              availableIngredients={ingredients}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectRecipe={handleSelectRecipe}
              onOpenAiGenerate={() => setIsAiGenerateModalOpen(true)}
            />
          ) : (
            <LandingPage
              onGetStarted={() => setActiveTab('auth')}
              onExploreRecipes={() => setActiveTab('recipes')}
              onSelectRecipe={handleSelectRecipe}
              featuredRecipes={recipes}
            />
          )
        )}

        {/* View 3: Ingredient-Based Recipe Matcher & Explorer */}
        {activeTab === 'recipes' && (
          <div>
            {/* Ingredients Input & Pantry Management Section */}
            <IngredientInputSection
              ingredients={ingredients}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onClearIngredients={handleClearIngredients}
              onLoadPreset={handleLoadPreset}
              onAddMultiple={handleAddMultiple}
            />

            {/* Dietary & Recipe Filters Bar */}
            <DietaryFilterBar
              filters={filters}
              onChangeFilters={setFilters}
              totalAvailableRecipes={matchedRecipes.length}
            />

            {/* Recipes Grid */}
            {matchedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.some((f) => f.id === recipe.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectRecipe={handleSelectRecipe}
                    onAddMissingToShoppingList={handleAddMissingToShoppingList}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-amber-300">
                <ChefHat className="w-12 h-12 text-amber-600/70 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-xl text-stone-900">No matching recipes found</h3>
                <p className="text-stone-700 text-xs sm:text-sm max-w-md mx-auto mt-1 leading-relaxed">
                  Try relaxing your dietary or cook-time filters, add more pantry items, or let our AI Chef craft a brand new recipe!
                </p>
                <button
                  onClick={() => setIsAiGenerateModalOpen(true)}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate Custom AI Recipe</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* View 4: Saved Favorites & Collections */}
        {activeTab === 'favorites' && (
          <FavoritesPage
            favorites={matchedFavorites}
            aiRecipes={aiGeneratedRecipes}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={handleSelectRecipe}
            onAddMissingToShoppingList={handleAddMissingToShoppingList}
            onDeleteRecipe={handleDeleteSavedRecipe}
          />
        )}

        {/* View 5: Smart Shopping List */}
        {activeTab === 'shopping' && (
          <ShoppingListModal
            items={shoppingList}
            onToggleItem={handleToggleShoppingItem}
            onDeleteItem={handleDeleteShoppingItem}
            onAddItem={handleAddShoppingItem}
            onClearChecked={handleClearCheckedShopping}
            onClearAll={handleClearAllShopping}
          />
        )}

        {/* View 6: Ask AI Chef Page */}
        {activeTab === 'ask-chef' && (
          <AskAiChefPage
            user={currentUser}
            availableIngredients={ingredients}
          />
        )}

        {/* View 7: Weekly Meal Planner */}
        {activeTab === 'planner' && (
          <MealPlannerPage
            allRecipes={recipes}
            onAddIngredientsToShoppingList={handleAddMissingToShoppingList}
            onSelectRecipe={handleSelectRecipe}
            onOpenShoppingList={() => setActiveTab('shopping')}
          />
        )}

        {/* View 8: User Profile & Diet Settings */}
        {activeTab === 'profile' && (
          currentUser ? (
            <UserProfilePage
              user={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
            />
          ) : (
            <AuthPage onLoginSuccess={handleLoginSuccess} />
          )
        )}

        {/* View 9: Authentication (Login / Register) */}
        {activeTab === 'auth' && (
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setActiveTab('landing')}
          />
        )}

        {/* View 10: Team Project Architecture & Specifications */}
        {activeTab === 'specs' && <ProjectSpecsModal />}
      </main>

      {/* Recipe Detail Modal */}
      {currentSelectedRecipe && (
        <RecipeModal
          recipe={currentSelectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={favorites.some((f) => f.id === currentSelectedRecipe.id)}
          onToggleFavorite={handleToggleFavorite}
          onAddMissingToShoppingList={handleAddMissingToShoppingList}
          availableIngredients={ingredients}
          userAllergies={currentUser ? currentUser.allergies : []}
          allRecipes={recipes}
          onSelectRecipe={handleSelectRecipe}
        />
      )}

      {/* Custom AI Recipe Generator Modal */}
      <GenerateAiRecipeModal
        isOpen={isAiGenerateModalOpen}
        onClose={() => setIsAiGenerateModalOpen(false)}
        availableIngredients={ingredients}
        onRecipesGenerated={handleRecipesGenerated}
      />
    </div>
  );
}
