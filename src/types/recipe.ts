export interface Ingredient {
  id: string;
  name: string;
  category: 'produce' | 'dairy' | 'protein' | 'grains' | 'pantry' | 'spices' | 'other';
  amount?: string;
  isAvailable?: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  sodium?: number; // in mg
}

export interface InstructionStep {
  stepNumber: number;
  title?: string;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
}

export interface MissingIngredientSubstitute {
  missingIngredient: string;
  substitutes: string[];
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  dietaryTags: string[]; // e.g. Vegetarian, Vegan, High Protein, Low Carb, Gluten Free, Dairy Free
  ingredients: {
    name: string;
    amount: string;
    category?: string;
    isAvailable?: boolean;
    isStaple?: boolean;
  }[];
  instructions: InstructionStep[];
  nutrition: NutritionInfo;
  imageUrl?: string;
  source: 'database' | 'ai';
  matchScore?: number; // 0 to 100
  missingCount?: number;
  missingIngredients?: string[];
  substitutes?: MissingIngredientSubstitute[];
  chefTip?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount?: string;
  recipeTitle?: string;
  checked: boolean;
  category?: string;
  dateAdded: number;
}

export interface DietaryFilterOptions {
  dietary: string[];
  maxCookTime: number; // 0 for any, 15, 30, 45, 60
  difficulty: string; // 'All' | 'Easy' | 'Medium' | 'Hard'
  cuisine: string; // 'All' or specific
  onlyReadyToCook: boolean; // 0 missing ingredients
  sortBy: 'match' | 'time' | 'calories' | 'protein' | 'popularity';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  dietaryPreferences: string[];
  allergies: string[];
  preferredCuisines: string[];
  defaultServings: number;
  preferredCookTime: number;
  savedCollections: string[];
  bio?: string;
  createdAt: number;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface PlannedMeal {
  id: string;
  day: DayOfWeek;
  slot: MealSlot;
  recipeId: string;
  recipeTitle: string;
  servings: number;
  imageUrl?: string;
  cookTimeMinutes?: number;
  calories?: number;
  cuisine?: string;
  ingredients?: { name: string; amount: string; category?: string }[];
}

export interface RecipeCollection {
  id: string;
  name: string;
  description?: string;
  recipeIds: string[];
  createdAt: number;
}

