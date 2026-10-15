import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Search,
  Plus,
  Trash2,
  FolderPlus,
  BookOpen,
  Folder,
  Tag,
  ArrowRight,
  Clock,
  ChefHat,
} from 'lucide-react';
import { Recipe, RecipeCollection } from '../types/recipe';
import { RecipeCard } from './RecipeCard';

interface FavoritesPageProps {
  favorites: Recipe[];
  aiRecipes: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onAddMissingToShoppingList: (ingredients: string[], recipeTitle: string) => void;
  onDeleteRecipe: (recipeId: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  aiRecipes,
  onToggleFavorite,
  onSelectRecipe,
  onAddMissingToShoppingList,
  onDeleteRecipe,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'favorites' | 'generated' | 'collections'>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [collections, setCollections] = useState<RecipeCollection[]>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_custom_collections');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      { id: 'col-1', name: 'Quick Dinners', recipeIds: [], createdAt: Date.now() },
      { id: 'col-2', name: 'Weekend Comfort', recipeIds: [], createdAt: Date.now() },
      { id: 'col-3', name: 'High Protein', recipeIds: [], createdAt: Date.now() },
    ];
  });

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const newCol: RecipeCollection = {
      id: `col-${Date.now()}`,
      name: newCollectionName.trim(),
      recipeIds: [],
      createdAt: Date.now(),
    };
    const updated = [...collections, newCol];
    setCollections(updated);
    localStorage.setItem('smart_recipe_custom_collections', JSON.stringify(updated));
    setNewCollectionName('');
  };

  const currentList = activeSubTab === 'favorites' ? favorites : aiRecipes;

  const filteredList = currentList.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
            <Heart className="w-8 h-8 fill-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-stone-900">
              My Saved Recipes & Collections
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
              Browse bookmarked favorites, past AI-crafted creations, and curated kitchen folders.
            </p>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex p-1 rounded-2xl bg-stone-100 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('favorites')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'favorites'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>Favorites ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('generated')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'generated'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Creations ({aiRecipes.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('collections')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'collections'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-amber-700" />
            <span>Collections ({collections.length})</span>
          </button>
        </div>
      </div>

      {/* Collections Management View */}
      {activeSubTab === 'collections' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-700" />
              <span>Create New Recipe Collection</span>
            </h3>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. Quick 15m Lunches, Holiday Baking..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-stone-50"
              />
              <button
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {collections.map((col) => (
              <div
                key={col.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-amber-300 shadow-xs transition-all space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Folder className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-stone-900">{col.name}</h4>
                <p className="text-xs text-stone-700">
                  {col.recipeIds.length} recipes in this custom folder
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div className="bg-white rounded-2xl p-3 border border-stone-200 flex items-center gap-2.5">
            <Search className="w-4 h-4 text-stone-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeSubTab === 'favorites' ? 'saved favorites' : 'AI generated recipes'}...`}
              className="w-full text-xs sm:text-sm outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-stone-400 hover:text-stone-700 px-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Recipes Grid */}
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favorites.some((f) => f.id === recipe.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelectRecipe={onSelectRecipe}
                  onAddMissingToShoppingList={onAddMissingToShoppingList}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-200 space-y-3">
              <ChefHat className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-stone-800">
                {activeSubTab === 'favorites'
                  ? 'No favorite recipes match your search'
                  : 'No custom AI recipes saved yet'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 max-w-sm mx-auto">
                {activeSubTab === 'favorites'
                  ? 'Click the heart icon on any recipe card to save dishes to your personal cookbook!'
                  : 'Use the "Ask AI Chef" button to create personalized zero-waste recipes on demand.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
