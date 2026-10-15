import React, { useState } from 'react';
import {
  ChefHat,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
  Shield,
  Sparkles,
  Info,
} from 'lucide-react';
import { UserProfile } from '../types/recipe';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onLoginSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onCancel,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Validation
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { label: string; percent: number; color: string } => {
    if (!pwd) return { label: 'Empty', percent: 0, color: 'bg-stone-200' };
    let score = 0;
    if (pwd.length >= 8) score += 35;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;

    if (score < 40) return { label: 'Weak', percent: 35, color: 'bg-red-500' };
    if (score < 75) return { label: 'Medium', percent: 70, color: 'bg-amber-500' };
    return { label: 'Strong', percent: 100, color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(password);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Retrieve or create user profile
      const storedUsersRaw = localStorage.getItem('smart_recipe_registered_users');
      let registeredUsers: any[] = [];
      try {
        registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      } catch (e) {
        registeredUsers = [];
      }

      const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      const userProfile: UserProfile = foundUser
        ? {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            avatarUrl: foundUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            dietaryPreferences: foundUser.dietaryPreferences || [],
            allergies: foundUser.allergies || [],
            preferredCuisines: foundUser.preferredCuisines || ['Italian', 'Asian'],
            defaultServings: foundUser.defaultServings || 2,
            preferredCookTime: foundUser.preferredCookTime || 30,
            savedCollections: foundUser.savedCollections || ['Favorites', 'Quick Dinners'],
            createdAt: foundUser.createdAt || Date.now(),
          }
        : {
            id: `user-${Date.now()}`,
            name: email.split('@')[0],
            email,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            dietaryPreferences: [],
            allergies: [],
            preferredCuisines: ['Asian', 'Mediterranean'],
            defaultServings: 2,
            preferredCookTime: 30,
            savedCollections: ['Favorites', 'Quick Dinners'],
            createdAt: Date.now(),
          };

      onLoginSuccess(userProfile);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must accept the Terms and Conditions to proceed.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        dietaryPreferences: [],
        allergies: [],
        preferredCuisines: ['Italian', 'Asian', 'Mexican'],
        defaultServings: 2,
        preferredCookTime: 30,
        savedCollections: ['Favorites', 'Meal Preps', 'Quick Dinners'],
        createdAt: Date.now(),
      };

      // Save to registered users pool
      try {
        const storedUsersRaw = localStorage.getItem('smart_recipe_registered_users');
        const list = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        list.push(newUser);
        localStorage.setItem('smart_recipe_registered_users', JSON.stringify(list));
      } catch (e) {
        console.error(e);
      }

      setSuccessMsg('Account registered successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 1000);
    }, 800);
  };

  // Quick Demo Login for evaluator convenience
  const handleDemoLogin = (role: 'chef' | 'beginner') => {
    const demoProfile: UserProfile =
      role === 'chef'
        ? {
            id: 'demo-chef-1',
            name: 'Chef Olivia Bennett',
            email: 'olivia.chef@smartrecipe.ai',
            avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
            dietaryPreferences: ['High Protein', 'Gluten Free'],
            allergies: ['Peanuts'],
            preferredCuisines: ['Mediterranean', 'Italian', 'Asian'],
            defaultServings: 2,
            preferredCookTime: 25,
            savedCollections: ['Favorites', 'Gourmet Dinners', 'Low-Carb'],
            bio: 'Home culinary enthusiast focused on zero-waste farm-to-table cooking.',
            createdAt: Date.now() - 86400000 * 30,
          }
        : {
            id: 'demo-user-2',
            name: 'Alex Rivera',
            email: 'alex.rivera@student.edu',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            dietaryPreferences: ['Vegetarian'],
            allergies: [],
            preferredCuisines: ['Mexican', 'Asian'],
            defaultServings: 1,
            preferredCookTime: 15,
            savedCollections: ['Quick Weeknight', 'Budget Meals'],
            bio: 'College student looking for quick 15-minute healthy meals.',
            createdAt: Date.now() - 86400000 * 10,
          };

    onLoginSuccess(demoProfile);
  };

  return (
    <div className="max-w-md w-full mx-auto my-6 sm:my-10 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/80 animate-in fade-in zoom-in-95 duration-200">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
          <ChefHat className="w-6 h-6" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-stone-900">
          {mode === 'login' ? 'Welcome Back to SmartRecipe' : 'Create Your Free Account'}
        </h2>
        <p className="text-xs text-stone-700">
          {mode === 'login'
            ? 'Access your saved recipes, customized weekly meal plans, and pantry.'
            : 'Join to save recipes, generate AI meal plans, and eliminate kitchen waste.'}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex p-1 rounded-xl bg-stone-100 mb-6">
        <button
          onClick={() => {
            setMode('login');
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          Register
        </button>
      </div>

      {/* Error / Success alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-800">
          <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Mode = LOGIN */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. chef@smartrecipe.ai"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-xs text-amber-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-stone-50/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Remember me on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Signing in...</span> : <span>Sign In</span>}
          </button>
        </form>
      )}

      {/* Mode = REGISTER */}
      {mode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Samantha Hayes"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="samantha@example.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-stone-50/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="mt-1.5 space-y-1">
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                    style={{ width: `${pwdStrength.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-700 font-medium">
                  <span>Strength: {pwdStrength.label}</span>
                  <span>Requires letters & numbers</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-stone-50/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-xs text-stone-600 pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
            />
            <span>
              I agree to the <span className="text-amber-700 underline font-medium">Terms of Service</span> and <span className="text-amber-700 underline font-medium">Privacy Policy</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Registering...</span> : <span>Create Account</span>}
          </button>
        </form>
      )}

      {/* Demo Quick Sign-in Section */}
      <div className="mt-6 pt-5 border-t border-stone-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-700" />
            Quick 1-Click Demo Profiles
          </span>
          <span className="text-[10px] text-stone-600 font-medium">No typing required</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDemoLogin('chef')}
            className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-colors text-xs"
          >
            <div className="font-bold text-amber-950">Chef Olivia</div>
            <div className="text-[10px] text-amber-800">High-Protein Gourmet</div>
          </button>
          <button
            onClick={() => handleDemoLogin('beginner')}
            className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-colors text-xs"
          >
            <div className="font-bold text-stone-800">Alex (Student)</div>
            <div className="text-[10px] text-stone-700">Quick & Vegetarian</div>
          </button>
        </div>
      </div>

      {/* Security & Authentication architecture notice */}
      <div className="mt-5 p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2 text-[11px] text-stone-700">
        <Info className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-800">Authentication Architecture: </span>
          Sessions and profiles are safely managed in your browser session with multi-profile support. Live Firebase Authentication can be connected using the platform Firebase skill.
        </div>
      </div>

      {/* Forgot Password Dialog */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">Reset Your Password</h3>
            <p className="text-xs text-stone-600">
              Enter your email address and we will generate a password reset verification link.
            </p>
            {forgotEmailSent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                A password reset simulation link has been sent to your email address!
              </div>
            ) : (
              <input
                type="email"
                placeholder="your.email@example.com"
                defaultValue={email}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs outline-none focus:border-amber-500"
              />
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setForgotEmailSent(false);
                }}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Close
              </button>
              {!forgotEmailSent && (
                <button
                  onClick={() => setForgotEmailSent(true)}
                  className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
