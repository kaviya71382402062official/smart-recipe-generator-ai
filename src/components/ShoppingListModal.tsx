import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Check, Copy, CheckCheck, X, Printer, Filter, Layers } from 'lucide-react';
import { ShoppingItem } from '../types/recipe';

interface ShoppingListModalProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (name: string, category?: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
}

// Heuristic categorization helper for groceries
export function categorizeGrocery(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('tomato') || n.includes('onion') || n.includes('garlic') || n.includes('pepper') || n.includes('spinach') || n.includes('potato') || n.includes('carrot') || n.includes('mushroom') || n.includes('lemon') || n.includes('lime') || n.includes('herb') || n.includes('basil')) {
    return 'Produce & Fresh';
  }
  if (n.includes('milk') || n.includes('cheese') || n.includes('butter') || n.includes('cream') || n.includes('yogurt')) {
    return 'Dairy & Refrigerated';
  }
  if (n.includes('egg') || n.includes('chicken') || n.includes('beef') || n.includes('turkey') || n.includes('tuna') || n.includes('salmon') || n.includes('tofu') || n.includes('bean') || n.includes('lentil')) {
    return 'Protein & Legumes';
  }
  if (n.includes('rice') || n.includes('pasta') || n.includes('noodle') || n.includes('bread') || n.includes('flour') || n.includes('oat') || n.includes('quinoa')) {
    return 'Grains & Bakery';
  }
  if (n.includes('soy') || n.includes('oil') || n.includes('vinegar') || n.includes('sauce') || n.includes('salt') || n.includes('pepper') || n.includes('spice') || n.includes('sugar') || n.includes('honey')) {
    return 'Pantry, Oils & Spices';
  }
  return 'Other Pantry Items';
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  items,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onClearChecked,
  onClearAll,
}) => {
  const [newInput, setNewInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(true);

  const handleAdd = () => {
    if (newInput.trim()) {
      onAddItem(newInput.trim(), categorizeGrocery(newInput.trim()));
      setNewInput('');
    }
  };

  const handleCopyList = () => {
    if (items.length === 0) return;
    const text = items
      .map(
        (i) =>
          `[${i.checked ? 'X' : ' '}] ${i.name}${
            i.recipeTitle ? ` (for ${i.recipeTitle})` : ''
          }`
      )
      .join('\n');

    navigator.clipboard.writeText(`🛒 Smart Grocery Shopping List:\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const pendingItems = items.filter((i) => !i.checked);
  const checkedItems = items.filter((i) => i.checked);

  // Group items by category
  const categoriesMap: Record<string, ShoppingItem[]> = {};
  items.forEach((item) => {
    const cat = item.category || categorizeGrocery(item.name);
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(item);
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 max-w-3xl mx-auto print:shadow-none print:border-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
              Smart Shopping List
            </h2>
            <p className="text-xs sm:text-sm text-stone-700">
              {pendingItems.length} items to buy • {checkedItems.length} checked
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => setGroupByCategory(!groupByCategory)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              groupByCategory
                ? 'bg-amber-100 border-amber-300 text-amber-950'
                : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Group by Category</span>
          </button>
          {items.length > 0 && (
            <>
              <button
                onClick={handlePrint}
                className="p-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                title="Print List"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyList}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center gap-1.5"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              {checkedItems.length > 0 && (
                <button
                  onClick={onClearChecked}
                  className="px-3 py-2 text-xs font-medium rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  Clear Done
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Custom Item Input */}
      <div className="mt-5 flex gap-2">
        <input
          type="text"
          value={newInput}
          onChange={(e) => setNewInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add an item to your grocery list (e.g. Soy Sauce, Olive Oil)..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-stone-50/50"
        />
        <button
          onClick={handleAdd}
          disabled={!newInput.trim()}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Items list */}
      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/50">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-600 font-medium text-sm">Your shopping list is empty!</p>
            <p className="text-stone-700 text-xs mt-1">
              When viewing recipes, click &ldquo;Add Missing Ingredients&rdquo; or add items above.
            </p>
          </div>
        ) : (
          <>
            {/* Unchecked items */}
            {groupByCategory ? (
              <div className="space-y-4">
                {Object.entries(categoriesMap).map(([category, catItems]) => {
                  const pendingCatItems = catItems.filter((i) => !i.checked);
                  if (pendingCatItems.length === 0) return null;
                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50/80 px-2.5 py-1 rounded-md inline-block">
                        {category} ({pendingCatItems.length})
                      </div>
                      <div className="space-y-1.5 pl-1">
                        {pendingCatItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-white border border-stone-200 hover:border-emerald-300 flex items-center justify-between transition-all group"
                          >
                            <label className="flex items-center gap-3 cursor-pointer flex-1">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => onToggleItem(item.id)}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <div>
                                <span className="font-semibold text-stone-800 text-sm">{item.name}</span>
                                {item.recipeTitle && (
                                  <span className="ml-2 text-xs text-amber-700 font-medium">
                                    for {item.recipeTitle}
                                  </span>
                                )}
                              </div>
                            </label>

                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-stone-200 hover:border-emerald-300 flex items-center justify-between transition-all group"
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => onToggleItem(item.id)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-semibold text-stone-800 text-sm">{item.name}</span>
                        {item.recipeTitle && (
                          <span className="ml-2 text-xs text-amber-700 font-medium">
                            for {item.recipeTitle}
                          </span>
                        )}
                      </div>
                    </label>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Checked items */}
            {checkedItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-2">
                  Completed Items ({checkedItems.length})
                </span>
                <div className="space-y-1.5 opacity-60">
                  {checkedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => onToggleItem(item.id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="line-through text-stone-500 text-sm">{item.name}</span>
                      </label>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire List</span>
          </button>
        </div>
      )}
    </div>
  );
};
