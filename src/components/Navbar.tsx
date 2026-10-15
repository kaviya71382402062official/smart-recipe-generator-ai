import React, { useState } from 'react';
import {
  ChefHat,
  Heart,
  ShoppingBag,
  Sparkles,
  BookOpen,
  Layers,
  Calendar,
  MessageSquare,
  Home,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { UserProfile } from '../types/recipe';

export type NavTab =
  | 'landing'
  | 'dashboard'
  | 'recipes'
  | 'favorites'
  | 'shopping'
  | 'specs'
  | 'planner'
  | 'ask-chef'
  | 'profile'
  | 'auth';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  favoritesCount: number;
  shoppingCount: number;
  onOpenAiGenerate: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  shoppingCount,
  onOpenAiGenerate,
  user,
  onLogout,
  onOpenAuth,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigateTo = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigateTo(user ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
                  SmartRecipe<span className="text-orange-600">.ai</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Zero Waste
                </span>
              </div>
              <p className="text-[11px] text-stone-700 hidden sm:block">Intelligent culinary generator</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Landing or Dashboard */}
            <button
              onClick={() => navigateTo('landing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'landing'
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-amber-700" />
              <span>Home</span>
            </button>

            {user && (
              <button
                onClick={() => navigateTo('dashboard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-700" />
                <span>Dashboard</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('recipes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'recipes'
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Recipe Matcher</span>
            </button>

            <button
              onClick={() => navigateTo('ask-chef')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ask-chef'
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
              <span>Ask AI Chef</span>
            </button>

            <button
              onClick={() => navigateTo('planner')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'planner'
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Meal Planner</span>
            </button>

            <button
              onClick={() => navigateTo('shopping')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 relative ${
                activeTab === 'shopping'
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Grocery List</span>
              {shoppingCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                  {shoppingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('favorites')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 relative ${
                activeTab === 'favorites'
                  ? 'bg-amber-100 text-amber-950 font-bold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-red-500 text-red-500' : 'text-stone-500'}`} />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-100 text-red-700">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('specs')}
              title="Team Project Architecture & Specs"
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'specs'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Specs</span>
            </button>
          </nav>

          {/* Right Area: AI Quick Action + User Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* AI Generator CTA button */}
            <button
              onClick={onOpenAiGenerate}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-xs flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
              <span className="hidden sm:inline">AI Recipe</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* User Profile or Login button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50 hover:bg-amber-50/50 transition-all"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-amber-300"
                  />
                  <span className="text-xs font-bold text-stone-800 hidden md:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 space-y-1 animate-in fade-in zoom-in-95 z-50">
                    <div className="p-2 border-b border-stone-100">
                      <div className="font-bold text-xs text-stone-900 truncate">{user.name}</div>
                      <div className="text-[10px] text-stone-700 truncate">{user.email}</div>
                    </div>
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-amber-50 text-stone-700 hover:text-stone-900 flex items-center gap-2 font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => navigateTo('profile')}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-amber-50 text-stone-700 hover:text-stone-900 flex items-center gap-2 font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>Profile & Diet Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-2xs"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 space-y-1 animate-in slide-in-from-top-2">
            <button
              onClick={() => navigateTo('landing')}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-amber-700" />
              <span>Home</span>
            </button>
            {user && (
              <button
                onClick={() => navigateTo('dashboard')}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-700" />
                <span>Dashboard</span>
              </button>
            )}
            <button
              onClick={() => navigateTo('recipes')}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Recipe Matcher</span>
            </button>
            <button
              onClick={() => navigateTo('ask-chef')}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span>Ask AI Chef</span>
            </button>
            <button
              onClick={() => navigateTo('planner')}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Weekly Meal Planner</span>
            </button>
            <button
              onClick={() => navigateTo('shopping')}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span>Grocery List</span>
              </div>
              {shoppingCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                  {shoppingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateTo('favorites')}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Favorites</span>
              </div>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-100 text-red-700">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigateTo('specs')}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-stone-600" />
              <span>Project Specs</span>
            </button>
            {user && (
              <button
                onClick={() => navigateTo('profile')}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-stone-800 hover:bg-stone-100 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-amber-600" />
                <span>Profile Settings</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
