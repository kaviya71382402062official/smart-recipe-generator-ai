import { Recipe, DietaryFilterOptions } from '../types/recipe';
import { COMMON_SUBSTITUTES } from '../data/recipes';

// Normalize ingredient string: strip quantities, punctuation, lowercase, and simple pluralization
export function normalizeIngredient(raw: string): string {
  let cleaned = raw.toLowerCase().trim();
  // Strip common words like 'fresh', 'diced', 'cloves', 'teaspoons', etc.
  cleaned = cleaned.replace(/\b(fresh|dried|chopped|diced|sliced|minced|large|medium|small|cloves?|tablespoons?|teaspoons?|cups?|grams?|kg|oz|lbs?)\b/gi, '');
  cleaned = cleaned.replace(/[^a-z\s]/g, '').trim();

  // Simple singularization
  if (cleaned.endsWith('ies')) {
    cleaned = cleaned.slice(0, -3) + 'y';
  } else if (cleaned.endsWith('es') && !cleaned.endsWith('cheese')) {
    cleaned = cleaned.slice(0, -2);
  } else if (cleaned.endsWith('s') && !cleaned.endsWith('ss') && !cleaned.endsWith('beans') && !cleaned.endsWith('oats')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

// Compute Jaccard Similarity: |A ∩ B| / |A ∪ B|
export function computeJaccardSimilarity(userIngredients: string[], recipeIngredients: string[]): number {
  const setA = new Set(userIngredients.map(normalizeIngredient).filter(Boolean));
  const setB = new Set(recipeIngredients.map(normalizeIngredient).filter(Boolean));

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionCount = 0;
  for (const item of setA) {
    for (const target of setB) {
      if (item.includes(target) || target.includes(item)) {
        intersectionCount++;
        break;
      }
    }
  }

  const unionSize = setA.size + setB.size - intersectionCount;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
}

// Check if a single recipe ingredient matches any of the user's available ingredients
export function checkIngredientMatch(recipeIngName: string, userIngredients: string[]): boolean {
  const normRecipe = normalizeIngredient(recipeIngName);
  return userIngredients.some((userIng) => {
    const normUser = normalizeIngredient(userIng);
    if (!normUser || !normRecipe) return false;
    return (
      normUser === normRecipe ||
      normRecipe.includes(normUser) ||
      normUser.includes(normRecipe)
    );
  });
}

// Rank and decorate recipes based on user pantry ingredients
export function matchAndRankRecipes(
  recipes: Recipe[],
  userIngredients: string[],
  filters: DietaryFilterOptions
): Recipe[] {
  if (userIngredients.length === 0) {
    // If no ingredients, still apply filters and return
    return filterRecipes(recipes, filters);
  }

  const decorated = recipes.map((recipe) => {
    let availableCount = 0;
    const missingIngredients: string[] = [];

    const enrichedIngredients = recipe.ingredients.map((ing) => {
      const isAvailable = checkIngredientMatch(ing.name, userIngredients);
      if (isAvailable) {
        availableCount++;
      } else {
        missingIngredients.push(ing.name);
      }
      return {
        ...ing,
        isAvailable,
      };
    });

    const totalCount = recipe.ingredients.length;
    const matchScore = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0;
    const missingCount = missingIngredients.length;

    // Attach substitutions
    const substitutes = missingIngredients.map((missing) => {
      const norm = normalizeIngredient(missing);
      let foundSubs: string[] = [];
      for (const [key, subs] of Object.entries(COMMON_SUBSTITUTES)) {
        if (norm.includes(key) || key.includes(norm)) {
          foundSubs = subs;
          break;
        }
      }
      if (foundSubs.length === 0) {
        foundSubs = ['Alternative pantry spice or aromatic', 'Skip if unavailable'];
      }
      return {
        missingIngredient: missing,
        substitutes: foundSubs,
      };
    });

    return {
      ...recipe,
      ingredients: enrichedIngredients,
      matchScore,
      missingCount,
      missingIngredients,
      substitutes,
    };
  });

  // Filter based on options
  const filtered = filterRecipes(decorated, filters);

  // Sort
  return filtered.sort((a, b) => {
    if (filters.sortBy === 'match') {
      // First by match score descending
      if ((b.matchScore ?? 0) !== (a.matchScore ?? 0)) {
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      }
      // Then by missing count ascending
      return (a.missingCount ?? 0) - (b.missingCount ?? 0);
    }
    if (filters.sortBy === 'time') {
      return a.totalTimeMinutes - b.totalTimeMinutes;
    }
    if (filters.sortBy === 'calories') {
      return a.nutrition.calories - b.nutrition.calories;
    }
    if (filters.sortBy === 'protein') {
      return b.nutrition.protein - a.nutrition.protein;
    }
    if (filters.sortBy === 'popularity') {
      return (b.matchScore ?? 0) - (a.matchScore ?? 0);
    }
    return 0;
  });
}

export function filterRecipes(recipes: Recipe[], filters: DietaryFilterOptions): Recipe[] {
  return recipes.filter((recipe) => {
    // Ready to cook filter
    if (filters.onlyReadyToCook && (recipe.missingCount ?? 0) > 0) {
      return false;
    }

    // Cook time filter
    if (filters.maxCookTime > 0 && recipe.totalTimeMinutes > filters.maxCookTime) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty !== 'All' && recipe.difficulty !== filters.difficulty) {
      return false;
    }

    // Cuisine filter
    if (filters.cuisine !== 'All' && recipe.cuisine.toLowerCase() !== filters.cuisine.toLowerCase()) {
      return false;
    }

    // Dietary filters (recipe must satisfy all selected dietary requirements)
    if (filters.dietary.length > 0) {
      const hasAllDietary = filters.dietary.every((tag) =>
        recipe.dietaryTags.some((rTag) => rTag.toLowerCase() === tag.toLowerCase())
      );
      if (!hasAllDietary) return false;
    }

    return true;
  });
}
