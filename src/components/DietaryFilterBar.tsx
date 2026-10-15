import React from 'react';
import { Filter, Clock, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { DietaryFilterOptions } from '../types/recipe';

interface DietaryFilterBarProps {
  filters: DietaryFilterOptions;
  onChangeFilters: (filters: DietaryFilterOptions) => void;
  totalAvailableRecipes: number;
}

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'High Protein',
  'Low Carb',
  'Gluten Free',
  'Dairy Free',
];

const TIME_OPTIONS = [
  { label: 'Any Time', value: 0 },
  { label: '≤ 15 min', value: 15 },
  { label: '≤ 30 min', value: 30 },
  { label: '≤ 45 min', value: 45 },
  { label: '≤ 60 min', value: 60 },
];

const DIFFICULTY_OPTIONS = ['All', 'Easy', 'Medium', 'Hard'];

const CUISINE_OPTIONS = ['All', 'Asian', 'Indian', 'Italian', 'Mediterranean', 'American', 'Mexican'];

export const DietaryFilterBar: React.FC<DietaryFilterBarProps> = ({
  filters,
  onChangeFilters,
  totalAvailableRecipes,
}) => {
  const toggleDietaryTag = (tag: string) => {
    const exists = filters.dietary.includes(tag);
    const updated = exists
      ? filters.dietary.filter((t) => t !== tag)
      : [...filters.dietary, tag];
    onChangeFilters({ ...filters, dietary: updated });
  };

  const handleTimeChange = (time: number) => {
    onChangeFilters({ ...filters, maxCookTime: time });
  };

  const handleDifficultyChange = (diff: string) => {
    onChangeFilters({ ...filters, difficulty: diff });
  };

  const handleCuisineChange = (c: string) => {
    onChangeFilters({ ...filters, cuisine: c });
  };

  const toggleReadyToCook = () => {
    onChangeFilters({ ...filters, onlyReadyToCook: !filters.onlyReadyToCook });
  };

  const handleSortChange = (sortBy: DietaryFilterOptions['sortBy']) => {
    onChangeFilters({ ...filters, sortBy });
  };

  const clearAllFilters = () => {
    onChangeFilters({
      dietary: [],
      maxCookTime: 0,
      difficulty: 'All',
      cuisine: 'All',
      onlyReadyToCook: false,
      sortBy: 'match',
    });
  };

  const hasActiveFilters =
    filters.dietary.length > 0 ||
    filters.maxCookTime > 0 ||
    filters.difficulty !== 'All' ||
    filters.cuisine !== 'All' ||
    filters.onlyReadyToCook;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-amber-200/70 p-4 sm:p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-700" />
          <h3 className="font-semibold text-stone-900 text-sm">Dietary & Recipe Filters</h3>
          <span className="text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
            {totalAvailableRecipes} recipes found
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Ready to cook fast toggle */}
          <button
            onClick={toggleReadyToCook}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filters.onlyReadyToCook
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Ready (0 Missing)</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter rows */}
      <div className="mt-3.5 space-y-3">
        {/* Dietary tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-stone-700 w-16 shrink-0">Dietary:</span>
          {DIETARY_OPTIONS.map((tag) => {
            const isSelected = filters.dietary.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleDietaryTag(tag)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                  isSelected
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Cook Time, Difficulty, Cuisine, and Sort Controls in responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* Max Cook Time */}
          <div className="flex items-center gap-2 bg-stone-50/80 border border-stone-200/80 rounded-xl px-3 py-1.5">
            <Clock className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              value={filters.maxCookTime}
              onChange={(e) => handleTimeChange(Number(e.target.value))}
              className="bg-transparent text-xs font-medium text-stone-800 w-full outline-none cursor-pointer"
            >
              {TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Time: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2 bg-stone-50/80 border border-stone-200/80 rounded-xl px-3 py-1.5">
            <Flame className="w-4 h-4 text-stone-500 shrink-0" />
            <select
              value={filters.difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-stone-800 w-full outline-none cursor-pointer"
            >
              {DIFFICULTY_OPTIONS.map((diff) => (
                <option key={diff} value={diff}>
                  Difficulty: {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Cuisine */}
          <div className="flex items-center gap-2 bg-stone-50/80 border border-stone-200/80 rounded-xl px-3 py-1.5">
            <span className="text-xs font-medium text-stone-700 shrink-0">Cuisine:</span>
            <select
              value={filters.cuisine}
              onChange={(e) => handleCuisineChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-stone-800 w-full outline-none cursor-pointer"
            >
              {CUISINE_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 bg-stone-50/80 border border-stone-200/80 rounded-xl px-3 py-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as DietaryFilterOptions['sortBy'])}
              className="bg-transparent text-xs font-medium text-stone-800 w-full outline-none cursor-pointer"
            >
              <option value="match">Sort: Best Match %</option>
              <option value="popularity">Sort: Most Popular</option>
              <option value="time">Sort: Quickest Time</option>
              <option value="protein">Sort: Highest Protein</option>
              <option value="calories">Sort: Lowest Calories</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
