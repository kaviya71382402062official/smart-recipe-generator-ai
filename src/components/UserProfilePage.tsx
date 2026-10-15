import React, { useState } from 'react';
import {
  User,
  Shield,
  Heart,
  AlertTriangle,
  Clock,
  Save,
  LogOut,
  Sparkles,
  Check,
  Utensils,
  ChefHat,
} from 'lucide-react';
import { UserProfile } from '../types/recipe';

interface UserProfilePageProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

const ALLERGY_OPTIONS = [
  'Peanuts',
  'Tree Nuts',
  'Dairy / Milk',
  'Eggs',
  'Gluten / Wheat',
  'Soy',
  'Shellfish',
  'Fish',
  'Sesame',
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'High Protein',
  'Low Carb',
  'Gluten Free',
  'Dairy Free',
];

const CUISINE_OPTIONS = [
  'Asian',
  'Italian',
  'Mexican',
  'Indian',
  'Mediterranean',
  'American',
  'French',
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  onUpdateProfile,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [bio, setBio] = useState(user.bio || '');
  const [dietary, setDietary] = useState<string[]>(user.dietaryPreferences);
  const [allergies, setAllergies] = useState<string[]>(user.allergies);
  const [cuisines, setCuisines] = useState<string[]>(user.preferredCuisines);
  const [defaultServings, setDefaultServings] = useState<number>(user.defaultServings);
  const [preferredCookTime, setPreferredCookTime] = useState<number>(user.preferredCookTime);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      avatarUrl,
      bio,
      dietaryPreferences: dietary,
      allergies,
      preferredCuisines: cuisines,
      defaultServings,
      preferredCookTime,
    };
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={avatarUrl}
            alt={name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-amber-200 shadow-md"
          />
          <div className="space-y-1">
            <h1 className="font-serif font-bold text-2xl text-stone-900">{name}</h1>
            <p className="text-xs text-stone-700">{user.email}</p>
            <p className="text-xs text-stone-700 italic max-w-md pt-1">
              &ldquo;{bio || 'Passionate about zero-waste home cooking.'}&rdquo;
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors flex items-center gap-1.5 self-center sm:self-start"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar & Basic Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-700" />
            <span>Profile Details</span>
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">Choose Avatar</label>
            <div className="flex flex-wrap gap-2.5">
              {AVATAR_OPTIONS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Avatar option ${idx}`}
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                    avatarUrl === url ? 'border-amber-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-stone-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-100 text-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Culinary Bio / Cooking Motto</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Trying to cook more weeknight veggies and cut grocery bills."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-stone-50"
            />
          </div>
        </div>

        {/* Dietary Preferences & Allergies */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-600" />
              <span>Dietary Preferences</span>
            </h3>
            <p className="text-xs text-stone-700 mt-0.5">
              We prioritize matching recipes satisfying all of your lifestyle diets.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((tag) => {
              const isSelected = dietary.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleArrayItem(dietary, setDietary, tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-700 text-white shadow-2xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-100">
            <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span>Food Allergies & Ingredients to Avoid</span>
            </h4>
            <p className="text-xs text-stone-700 mt-0.5 mb-3">
              Recipes containing these ingredients will display clear warning flags.
            </p>

            <div className="flex flex-wrap gap-2">
              {ALLERGY_OPTIONS.map((allergy) => {
                const isSelected = allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleArrayItem(allergies, setAllergies, allergy)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {allergy}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cuisines & Serving Sizes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-700" />
            <span>Cooking Defaults</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Default Serving Size</label>
              <select
                value={defaultServings}
                onChange={(e) => setDefaultServings(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 outline-none focus:border-amber-500 font-medium"
              >
                <option value={1}>1 Person (Solo)</option>
                <option value={2}>2 People (Couple / Shared)</option>
                <option value={4}>4 People (Family)</option>
                <option value={6}>6+ People (Group)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Weeknight Cook Time</label>
              <select
                value={preferredCookTime}
                onChange={(e) => setPreferredCookTime(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 outline-none focus:border-amber-500 font-medium"
              >
                <option value={15}>Quick & Easy (≤ 15 mins)</option>
                <option value={30}>Balanced (≤ 30 mins)</option>
                <option value={45}>Comfort Cooking (≤ 45 mins)</option>
                <option value={60}>Slow Simmer (≤ 60 mins)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Favorite Cuisines</label>
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map((c) => {
                const isSelected = cuisines.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleArrayItem(cuisines, setCuisines, c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <Check className="w-4 h-4" />
              <span>Preferences saved successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-stone-700">All preferences persist in your browser profile.</span>
          )}

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
