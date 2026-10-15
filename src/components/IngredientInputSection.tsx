import React, { useState, useRef } from 'react';
import { Plus, X, Camera, Sparkles, Trash2, Check, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';
import { COMMON_PANTRY_ITEMS, PRESET_PANTRY_PRESETS } from '../data/recipes';

interface IngredientInputSectionProps {
  ingredients: string[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (name: string) => void;
  onClearIngredients: () => void;
  onLoadPreset: (items: string[]) => void;
  onAddMultiple: (items: string[]) => void;
}

export const IngredientInputSection: React.FC<IngredientInputSectionProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearIngredients,
  onLoadPreset,
  onAddMultiple,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [detectedItems, setDetectedItems] = useState<{ name: string; category: string; selected: boolean }[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCurrentInput();
    }
  };

  const addCurrentInput = () => {
    const trimmed = inputValue.trim().replace(/^,+|,+$/g, '');
    if (trimmed) {
      onAddIngredient(trimmed);
      setInputValue('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      analyzePhoto(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async (base64Image: string, mimeType: string) => {
    setIsAnalyzingPhoto(true);
    setPhotoError(null);
    try {
      const response = await fetch('/api/recognize-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, mimeType }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze photo');
      }

      if (data.ingredients && data.ingredients.length > 0) {
        setDetectedItems(
          data.ingredients.map((item: any) => ({
            name: item.name,
            category: item.category || 'other',
            selected: true,
          }))
        );
      } else {
        setPhotoError('No clear culinary ingredients were identified in this photo. Try another clearer angle or well-lit shot.');
      }
    } catch (err: any) {
      console.error(err);
      setPhotoError(err.message || 'Error communicating with AI vision service.');
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const handleConfirmDetected = () => {
    const toAdd = detectedItems.filter((item) => item.selected).map((item) => item.name);
    if (toAdd.length > 0) {
      onAddMultiple(toAdd);
    }
    setIsPhotoModalOpen(false);
    setPhotoPreview(null);
    setDetectedItems([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-amber-200/80 p-5 sm:p-6 mb-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>What&apos;s In Your Kitchen?</span>
            <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Zero Food Waste
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Add ingredients you have on hand. We&apos;ll rank matching recipes and suggest smart missing ingredient substitutes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Camera className="w-4 h-4 text-amber-700" />
            <span>Scan Fridge / Photo</span>
          </button>

          {ingredients.length > 0 && (
            <button
              onClick={onClearIngredients}
              className="px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
              title="Clear all ingredients"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Ingredient Input */}
      <div className="mt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an ingredient (e.g. Tomato, Egg, Onion, Rice, Cheese...) and press Enter"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm outline-none transition-all placeholder:text-stone-400 bg-stone-50/50 focus:bg-white"
            />
          </div>
          <button
            onClick={addCurrentInput}
            disabled={!inputValue.trim()}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Active Ingredients Tags */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Your Available Pantry ({ingredients.length} items)
          </span>
          {ingredients.length === 0 && (
            <span className="text-xs text-amber-700 font-medium">Add ingredients or select a preset below</span>
          )}
        </div>

        {ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100/90 text-amber-950 border border-amber-300 text-xs sm:text-sm font-medium shadow-2xs transition-transform hover:scale-105"
              >
                <Check className="w-3.5 h-3.5 text-amber-800" />
                <span>{ing}</span>
                <button
                  onClick={() => onRemoveIngredient(ing)}
                  className="p-0.5 hover:bg-amber-200/80 rounded-full text-amber-800 hover:text-amber-950 transition-colors"
                  title={`Remove ${ing}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-amber-300/80 bg-amber-50/40 text-center">
            <p className="text-sm text-stone-600">
              No ingredients added yet! Try our quick example preset below or tap any common item.
            </p>
          </div>
        )}
      </div>

      {/* Quick Add Common Pantry Items */}
      <div className="mt-5 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Quick Add Common Items
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_PANTRY_ITEMS.map((item) => {
            const isAlreadyAdded = ingredients.some(
              (i) => i.toLowerCase() === item.name.toLowerCase()
            );
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (isAlreadyAdded) {
                    onRemoveIngredient(item.name);
                  } else {
                    onAddIngredient(item.name);
                  }
                }}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium flex items-center gap-1 ${
                  isAlreadyAdded
                    ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                    : 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200/60'
                }`}
              >
                {isAlreadyAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-stone-400" />}
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Example Presets:
        </span>
        {PRESET_PANTRY_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onLoadPreset(preset.items)}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-50 hover:bg-amber-100 border border-stone-200 text-stone-700 hover:text-amber-900 transition-colors"
            title={`${preset.description}: ${preset.items.join(', ')}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Photo AI Recognition Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">AI Fridge & Ingredient Scanner</h3>
                  <p className="text-xs text-stone-700">Multimodal Gemini AI vision recognition</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setPhotoPreview(null);
                  setDetectedItems([]);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              {!photoPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 rounded-xl p-8 text-center cursor-pointer transition-colors"
                >
                  <Camera className="w-10 h-10 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-800">Upload or snap a photo of your fridge or counter</p>
                  <p className="text-xs text-stone-700 mt-1">Supports JPEG, PNG, WebP up to 15MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    Choose Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-stone-200 max-h-56 bg-black flex items-center justify-center">
                    <img src={photoPreview} alt="Fridge snapshot" className="max-h-56 object-contain" />
                    <button
                      onClick={() => {
                        setPhotoPreview(null);
                        setDetectedItems([]);
                      }}
                      className="absolute top-2 right-2 px-2 py-1 bg-black/70 hover:bg-black text-white text-xs rounded-md backdrop-blur-xs flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Change Photo
                    </button>
                  </div>

                  {isAnalyzingPhoto && (
                    <div className="flex items-center justify-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
                      <span className="text-sm font-medium text-amber-900">
                        Analyzing photo with Gemini AI vision...
                      </span>
                    </div>
                  )}

                  {photoError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                      <span>{photoError}</span>
                    </div>
                  )}

                  {detectedItems.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                          Detected Ingredients ({detectedItems.filter((i) => i.selected).length} selected)
                        </span>
                        <button
                          onClick={() =>
                            setDetectedItems((prev) =>
                              prev.map((item) => ({ ...item, selected: !prev.every((p) => p.selected) }))
                            )
                          }
                          className="text-xs text-amber-700 hover:underline font-medium"
                        >
                          Toggle All
                        </button>
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200">
                        {detectedItems.map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200/80 hover:bg-amber-50/50 cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setDetectedItems((prev) =>
                                    prev.map((p, i) => (i === idx ? { ...p, selected: checked } : p))
                                  );
                                }}
                                className="rounded text-amber-600 focus:ring-amber-500"
                              />
                              <span className="font-semibold text-stone-800">{item.name}</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => setIsPhotoModalOpen(false)}
                          className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirmDetected}
                          disabled={detectedItems.filter((i) => i.selected).length === 0}
                          className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg shadow-sm flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Selected to Pantry</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
