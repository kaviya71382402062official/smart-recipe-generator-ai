import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Flame,
  Check,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Send,
  Heart,
  Share2,
  Printer,
  Copy,
  Users,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe } from '../types/recipe';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  onAddMissingToShoppingList: (ingredients: string[], recipeTitle: string) => void;
  availableIngredients: string[];
  userAllergies?: string[];
  allRecipes?: Recipe[];
  onSelectRecipe?: (recipe: Recipe) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddMissingToShoppingList,
  availableIngredients,
  userAllergies = [],
  allRecipes = [],
  onSelectRecipe,
}) => {
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeTimerStep, setActiveTimerStep] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState(false);


  // Chef AI Q&A State
  const [chefQuestion, setChefQuestion] = useState('');
  const [chefAnswers, setChefAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [isAskingChef, setIsAskingChef] = useState(false);

  // Custom Substitute State
  const [customSubIng, setCustomSubIng] = useState('');
  const [customSubResult, setCustomSubResult] = useState<any>(null);
  const [isFetchingSub, setIsFetchingSub] = useState(false);

  // Missing items
  const missingIngredients = recipe.missingIngredients || [];
  const availableCount = recipe.ingredients.filter((i) => i.isAvailable).length;

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            try {
              // Play chime
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.8);
            } catch (e) {
              // audio context may require user gesture
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const startStepTimer = (stepNum: number, durationMinutes: number) => {
    setActiveTimerStep(stepNum);
    setTimerSecondsLeft(durationMinutes * 60);
    setIsTimerRunning(true);
  };

  const toggleStepCompletion = (stepNum: number) => {
    const isDone = completedSteps.includes(stepNum);
    const updated = isDone
      ? completedSteps.filter((s) => s !== stepNum)
      : [...completedSteps, stepNum];
    setCompletedSteps(updated);

    // If all steps completed, celebrate!
    if (!isDone && updated.length === recipe.instructions.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleAskChef = async (queryText?: string) => {
    const q = queryText || chefQuestion;
    if (!q.trim()) return;

    setIsAskingChef(true);
    try {
      const response = await fetch('/api/ask-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          recipeTitle: recipe.title,
          ingredients: recipe.ingredients.map((i) => `${i.amount} ${i.name}`),
          instructions: recipe.instructions.map((i) => i.instruction),
        }),
      });
      const data = await response.json();
      setChefAnswers((prev) => [...prev, { question: q, answer: data.answer || 'Happy cooking!' }]);
      setChefQuestion('');
    } catch (err) {
      console.error(err);
      setChefAnswers((prev) => [
        ...prev,
        { question: q, answer: 'Could not connect to Chef AI. Try adjusting seasonings to taste!' },
      ]);
    } finally {
      setIsAskingChef(false);
    }
  };

  const handleFetchCustomSub = async (ingName: string) => {
    if (!ingName.trim()) return;
    setIsFetchingSub(true);
    setCustomSubResult(null);
    try {
      const response = await fetch('/api/suggest-substitutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missingIngredient: ingName,
          recipeTitle: recipe.title,
        }),
      });
      const data = await response.json();
      setCustomSubResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingSub(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe for ${recipe.title} on SmartRecipe AI!`,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // fallback to clipboard
      }
    }
    navigator.clipboard.writeText(`${recipe.title} - SmartRecipe AI: ${window.location.href}`);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Check for allergy conflicts based on user preferences
  const allergenConflicts = userAllergies.filter((allergy) => {
    const a = allergy.toLowerCase();
    return recipe.ingredients.some((ing) => {
      const i = ing.name.toLowerCase();
      if (a.includes('dairy') || a.includes('milk')) {
        return i.includes('milk') || i.includes('cheese') || i.includes('butter') || i.includes('cream') || i.includes('yogurt');
      }
      if (a.includes('egg')) return i.includes('egg');
      if (a.includes('peanut')) return i.includes('peanut');
      if (a.includes('gluten') || a.includes('wheat')) {
        return i.includes('bread') || i.includes('pasta') || i.includes('flour') || i.includes('soy sauce');
      }
      return i.includes(a);
    });
  });

  const getScaledAmount = (amountStr: string) => {
    if (servingsMultiplier === 1) return amountStr;
    return amountStr.replace(/(\d+(\.\d+)?)/g, (match) => {
      const num = parseFloat(match);
      const scaled = Math.round(num * servingsMultiplier * 10) / 10;
      return scaled.toString();
    });
  };

  // Similar recipes matching cuisine or meal type
  const similarRecipes = allRecipes
    .filter((r) => r.id !== recipe.id && (r.cuisine === recipe.cuisine || r.mealType === recipe.mealType))
    .slice(0, 3);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 my-auto animate-in fade-in zoom-in-95 duration-200 print:max-h-none print:shadow-none print:border-none">
        {/* Hero Header with Image */}
        <div className="relative h-64 sm:h-80 w-full bg-stone-900 print:h-48">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Action buttons (Share, Print, Favorite, Close) */}
          <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-stone-700 hover:text-stone-950 shadow-md transition-all"
              title="Share Recipe"
            >
              {shareCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-stone-700 hover:text-stone-950 shadow-md transition-all"
              title="Print Recipe"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(recipe)}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-stone-700 hover:text-red-600 shadow-md transition-all"
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-stone-700 hover:text-stone-900 shadow-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Banner Content on Hero */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950">
                {recipe.cuisine} • {recipe.mealType}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                {recipe.difficulty} Difficulty
              </span>
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-stone-200 border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              {recipe.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl line-clamp-2">
              {recipe.description}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 space-y-8">
          {/* Allergy Conflict Warning if present */}
          {allergenConflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                  Allergy Safety Notice
                </span>
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                  This dish contains ingredients matching your profile allergy warning: <strong className="font-semibold">{allergenConflicts.join(', ')}</strong>. Consider using the suggested substitutes below.
                </p>
              </div>
            </div>
          )}

          {/* Quick Metrics Bar: Times & Servings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
            <div className="text-center">
              <div className="text-xs text-stone-700 font-medium uppercase tracking-wider">Prep Time</div>
              <div className="text-base sm:text-lg font-bold text-stone-900">{recipe.prepTimeMinutes} mins</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-stone-700 font-medium uppercase tracking-wider">Cook Time</div>
              <div className="text-base sm:text-lg font-bold text-stone-900">{recipe.cookTimeMinutes} mins</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-stone-700 font-medium uppercase tracking-wider">Total Time</div>
              <div className="text-base sm:text-lg font-bold text-amber-900">{recipe.totalTimeMinutes} mins</div>
            </div>
            <div className="text-center flex flex-col items-center justify-center">
              <div className="text-xs text-stone-700 font-medium uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Servings
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <button
                  onClick={() => setServingsMultiplier((prev) => Math.max(0.5, prev - 0.5))}
                  className="w-5 h-5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-sm font-bold text-stone-900">
                  {recipe.servings * servingsMultiplier}
                </span>
                <button
                  onClick={() => setServingsMultiplier((prev) => prev + 0.5)}
                  className="w-5 h-5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Chef Tip if available */}
          {recipe.chefTip && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-100/90 to-orange-100/80 border border-amber-300/80 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Chef&apos;s Secret Tip</span>
                <p className="text-xs sm:text-sm text-stone-800 mt-0.5 leading-relaxed">{recipe.chefTip}</p>
              </div>
            </div>
          )}

          {/* Ingredients & Missing Substitutes Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">Ingredients Breakdown</h3>
                <p className="text-xs text-stone-700">
                  {availableCount} available in pantry • {missingIngredients.length} missing
                </p>
              </div>

              {missingIngredients.length > 0 && (
                <button
                  onClick={() => onAddMissingToShoppingList(missingIngredients, recipe.title)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Missing to Shopping List</span>
                </button>
              )}
            </div>

            {/* Ingredients Grid */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    ing.isAvailable
                      ? 'bg-emerald-50/60 border-emerald-200 text-stone-900'
                      : 'bg-stone-50 border-stone-200/90 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        ing.isAvailable
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {ing.isAvailable ? <Check className="w-3.5 h-3.5" /> : '✖'}
                    </div>
                    <div>
                      <span className="font-semibold text-sm">{ing.name}</span>
                      {ing.isStaple && (
                        <span className="ml-1.5 text-[10px] text-stone-700 bg-stone-200/80 px-1.5 py-0.2 rounded">
                          staple
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-stone-700">
                    {getScaledAmount(ing.amount)}
                  </span>
                </div>
              ))}
            </div>

            {/* Smart Missing Ingredient Substitutes */}
            {recipe.substitutes && recipe.substitutes.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                <div className="flex items-center gap-2 mb-2 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Smart Substitutions for Missing Items
                  </h4>
                </div>
                <div className="space-y-2">
                  {recipe.substitutes.map((sub, idx) => (
                    <div key={idx} className="text-xs bg-white p-2.5 rounded-xl border border-amber-200/60">
                      <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <span className="text-red-600 line-through">{sub.missingIngredient}</span>
                        <ArrowRight className="w-3 h-3 text-stone-400" />
                        <span className="text-emerald-700 font-bold">
                          {sub.substitutes.join(' OR ')}
                        </span>
                      </div>
                      {sub.notes && <p className="text-stone-700 mt-1 italic">{sub.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ask AI for Custom Substitute widget */}
            <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-2 items-center">
              <span className="text-xs font-medium text-stone-700 shrink-0">
                Don&apos;t have an ingredient?
              </span>
              <div className="flex-1 flex gap-2 w-full">
                <input
                  type="text"
                  value={customSubIng}
                  onChange={(e) => setCustomSubIng(e.target.value)}
                  placeholder="e.g. Heavy Cream, Mirin, Fish Sauce..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleFetchCustomSub(customSubIng)}
                  disabled={!customSubIng.trim() || isFetchingSub}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg disabled:opacity-50 shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isFetchingSub ? 'Checking...' : 'Find Substitute'}</span>
                </button>
              </div>
            </div>

            {customSubResult && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-emerald-300 text-xs animate-in fade-in">
                <div className="font-bold text-emerald-900 mb-1">
                  Substitutes for {customSubResult.missingIngredient}:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {customSubResult.substitutes?.map((s: any, idx: number) => (
                    <div key={idx} className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-200/60">
                      <div className="font-semibold text-emerald-950">{s.name} ({s.ratio})</div>
                      <div className="text-stone-600 text-[11px] mt-0.5">{s.flavorImpact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cooking Instructions with Step-by-Step Mode */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">Cooking Instructions</h3>
                <p className="text-xs text-stone-700">Check off steps as you go • Tap timer to time any step</p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-stone-100 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {completedSteps.length} of {recipe.instructions.length} done
                </span>
              </div>
            </div>

            {/* Active timer banner if running */}
            {activeTimerStep !== null && (
              <div className="my-4 p-4 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-between shadow-md animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-950/10 flex items-center justify-center font-mono font-bold text-lg">
                    {formatTimer(timerSecondsLeft)}
                  </div>
                  <div>
                    <div className="font-bold text-sm">Step {activeTimerStep} Timer</div>
                    <div className="text-xs text-stone-800">
                      {isTimerRunning ? 'Timer is running...' : timerSecondsLeft === 0 ? 'Timer completed! 🎉' : 'Timer paused'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2 rounded-lg bg-stone-950 text-white hover:bg-stone-800 transition-colors"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      const step = recipe.instructions.find((i) => i.stepNumber === activeTimerStep);
                      if (step && step.durationMinutes) {
                        setTimerSecondsLeft(step.durationMinutes * 60);
                      }
                    }}
                    className="p-2 rounded-lg bg-stone-950/20 hover:bg-stone-950/30 transition-colors"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setActiveTimerStep(null);
                    }}
                    className="p-2 rounded-lg hover:bg-stone-950/10"
                    title="Dismiss timer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Instructions List */}
            <div className="mt-4 space-y-3">
              {recipe.instructions.map((step) => {
                const isDone = completedSteps.includes(step.stepNumber);
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStepCompletion(step.stepNumber)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isDone
                        ? 'bg-stone-50 border-stone-200 opacity-60'
                        : 'bg-white border-amber-200/80 hover:border-amber-400 shadow-xs'
                    }`}
                  >
                    {/* Checkbox button */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all font-bold text-xs mt-0.5 ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-stone-300 bg-stone-100 text-stone-600 hover:border-amber-500'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : step.stepNumber}
                    </div>

                    {/* Step details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4
                          className={`font-semibold text-sm ${
                            isDone ? 'line-through text-stone-500' : 'text-stone-900'
                          }`}
                        >
                          {step.title || `Step ${step.stepNumber}`}
                        </h4>

                        {step.durationMinutes && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startStepTimer(step.stepNumber, step.durationMinutes!);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>{step.durationMinutes} min timer</span>
                          </button>
                        )}
                      </div>

                      <p
                        className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                          isDone ? 'line-through text-stone-400' : 'text-stone-700'
                        }`}
                      >
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nutritional Information Details */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 pb-2 border-b border-stone-200 mb-4">
              Nutritional Information (Per Serving)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-center">
                <div className="text-xs text-stone-700 uppercase font-semibold">Calories</div>
                <div className="text-xl font-bold text-stone-900 mt-1">{recipe.nutrition.calories}</div>
                <div className="text-[10px] text-stone-700">kcal</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <div className="text-xs text-stone-700 uppercase font-semibold">Protein</div>
                <div className="text-xl font-bold text-stone-900 mt-1">{recipe.nutrition.protein}g</div>
                <div className="text-[10px] text-stone-700">building & repair</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <div className="text-xs text-stone-700 uppercase font-semibold">Carbs</div>
                <div className="text-xl font-bold text-stone-900 mt-1">{recipe.nutrition.carbs}g</div>
                <div className="text-[10px] text-stone-700">sustained energy</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <div className="text-xs text-stone-700 uppercase font-semibold">Fat</div>
                <div className="text-xl font-bold text-stone-900 mt-1">{recipe.nutrition.fat}g</div>
                <div className="text-[10px] text-stone-700">flavor & health</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <div className="text-xs text-stone-700 uppercase font-semibold">Fiber</div>
                <div className="text-xl font-bold text-stone-900 mt-1">{recipe.nutrition.fiber}g</div>
                <div className="text-[10px] text-stone-700">gut digestion</div>
              </div>
            </div>
          </div>

          {/* Ask Chef AI Drawer */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80">
            <div className="flex items-center gap-2 mb-2 text-stone-900">
              <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base">Ask Chef AI About This Recipe</h4>
                <p className="text-xs text-stone-700">Get instant advice on cookware, heat, spices, or wine pairings</p>
              </div>
            </div>

            {/* Quick question prompt chips */}
            <div className="flex flex-wrap gap-1.5 my-3">
              {[
                'How can I make this spicier?',
                'Can I bake or air-fry this?',
                'What wine or drink pairs well?',
                'How to store leftovers?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleAskChef(q)}
                  disabled={isAskingChef}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 text-stone-700 hover:text-amber-900 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Past Q&A */}
            {chefAnswers.length > 0 && (
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {chefAnswers.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-amber-200/80 text-xs">
                    <div className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.question}</span>
                    </div>
                    <div className="text-stone-700 pl-5 border-l-2 border-amber-400 mt-1 leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Input field */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chefQuestion}
                onChange={(e) => setChefQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskChef()}
                placeholder="Ask Chef anything about this dish..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleAskChef()}
                disabled={!chefQuestion.trim() || isAskingChef}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAskingChef ? 'Thinking...' : 'Ask'}</span>
              </button>
            </div>
          </div>

          {/* Similar Recipes Recommendations */}
          {similarRecipes.length > 0 && onSelectRecipe && (
            <div className="pt-4 border-t border-stone-200">
              <h4 className="font-serif font-bold text-base text-stone-900 mb-3">
                Similar Dishes You Might Like
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarRecipes.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectRecipe(sim)}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-300 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <img
                      src={sim.imageUrl}
                      alt={sim.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold text-xs text-stone-900 truncate group-hover:text-amber-800">
                        {sim.title}
                      </div>
                      <div className="text-[10px] text-stone-700 mt-0.5">
                        {sim.totalTimeMinutes}m • {sim.nutrition.calories} kcal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(recipe)}
              className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save Recipe'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
