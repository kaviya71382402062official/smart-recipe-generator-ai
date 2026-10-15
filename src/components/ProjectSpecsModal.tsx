import React from 'react';
import {
  Layers,
  Users,
  Cpu,
  Database,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Terminal,
  Target,
  Lightbulb,
  Code2,
  Wrench,
  Bot,
  Zap,
} from 'lucide-react';

export const ProjectSpecsModal: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-amber-200/80 max-w-4xl mx-auto space-y-10">
      {/* Title & Banner */}
      <div className="pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Full Architecture & Capstone Documentation</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
          SmartRecipe AI — Intelligent Recipe Generator
        </h1>
        <p className="text-stone-700 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          A full-stack, zero-food-waste culinary intelligence platform powered by Google Gemini 3.8 Flash, local matching algorithms, and automated pantry-to-meal planning pipelines.
        </p>
      </div>

      {/* 1. Problem Statement & Proposed Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
          <div className="flex items-center gap-2 text-orange-900 font-serif font-bold text-base">
            <Target className="w-5 h-5 text-orange-600" />
            <span>Problem Statement</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            Households across the globe discard an estimated 1.3 billion tons of edible food annually. The most common trigger is mismatched pantry items: consumers have ingredients at home but don&apos;t know what meals they can prepare with them, resulting in unnecessary food waste, grocery overspending, and dinner fatigue.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-serif font-bold text-base">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
            <span>Proposed Solution</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            SmartRecipe AI inverts the cooking paradigm: users input available pantry items (via typing or instant camera snapshot). The recommendation engine scores and ranks existing recipe matches while Gemini 3.8 Flash synthesizes custom gourmet meals, auto-calculates missing ingredients with realistic pantry substitutes, and plans weekly meals with zero waste.
          </p>
        </div>
      </div>

      {/* 2. Team Member Roles (4 Members) */}
      <div>
        <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-amber-700" />
          <span>Team Member Responsibilities (4 Members)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Member 1 */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-amber-950 text-sm">Member 1 – Frontend Architecture</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">UI / UX</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1">
              <li>• Responsive React 19 SPA with Tailwind CSS v4 styling</li>
              <li>• Interactive pantry tag chips, camera photo scanner UI, and modals</li>
              <li>• Step-by-step cooking checklist with audio chimes and timers</li>
            </ul>
          </div>

          {/* Member 2 */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-orange-950 text-sm">Member 2 – Backend & Routing</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-200 text-orange-900">Node / Express</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1">
              <li>• Express API server with endpoints for vision, recipe gen, and Ask AI Chef</li>
              <li>• Secure proxy integration of GoogleGenAI SDK with user telemetry</li>
              <li>• Robust payload buffering and intelligent fallback safety nets</li>
            </ul>
          </div>

          {/* Member 3 */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-emerald-950 text-sm">Member 3 – AI & Recommendation Engine</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">AI / ML</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1">
              <li>• Cosine / Jaccard ingredient matching and coverage ranking</li>
              <li>• Multimodal vision prompt engineering for ingredient extraction</li>
              <li>• Dynamic culinary substitution engine with flavor impact metrics</li>
            </ul>
          </div>

          {/* Member 4 */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-blue-950 text-sm">Member 4 – Database & Testing</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">Data & QA</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1">
              <li>• Curated relational recipe schema, ingredient taxonomy, and macros</li>
              <li>• LocalStorage persistence for user profiles, meal plans, and grocery lists</li>
              <li>• Strict TypeScript types, unit tests, and cross-browser QA</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. System Architecture & Pipeline Workflow */}
      <div>
        <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-amber-700" />
          <span>System Pipeline & Inference Workflow</span>
        </h3>

        <div className="p-5 rounded-2xl bg-stone-900 text-white font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
          <div className="text-amber-400 font-bold mb-1">=== DUAL-TRACK ARCHITECTURE ===</div>
          <p className="text-stone-300">
            [User Inputs: Keyboard / Camera Snapshot]
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;▼
            <br />
            [Ingredient Normalizer & Tokenizer] ───&gt; (Stemming, plurals, units stripped)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;├──► [Track A: Instant Local Dataset] ───&gt; Jaccard / Cosine Vector Matcher
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rank = (Matched Ingredients / Total Recipe Ingredients) * 100
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;└──► [Track B: Server-Side Gemini 3.8 Flash] ───&gt; Bespoke AI Generation
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Structured JSON Schema Response (Recipes, Steps, Substitutes, Macros)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;▼
            <br />
            [Missing Ingredient Identifier] ───&gt; [Rule-based & AI Substitution Suggestion]
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;▼
            <br />
            [Allergy Safety Verification] ───&gt; [Dynamic Nutrition Calculator & Step Timers]
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;▼
            <br />
            [UI Feed: Recipe Cards, Weekly Meal Planner, Exportable Shopping List]
          </p>
        </div>
      </div>

      {/* 4. Technology Stack & AI Integration Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center gap-2 font-serif font-bold text-stone-900">
            <Code2 className="w-5 h-5 text-amber-700" />
            <span>Technology Stack</span>
          </div>
          <ul className="text-xs text-stone-700 space-y-1">
            <li>• <strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS v4, Motion, Lucide</li>
            <li>• <strong>Backend:</strong> Node.js, Express, tsx runtime</li>
            <li>• <strong>AI Engine:</strong> @google/genai SDK (Gemini 3.8 Flash)</li>
            <li>• <strong>Data Storage:</strong> LocalStorage profile persistence, Firebase Firestore ready</li>
            <li>• <strong>Build Tools:</strong> Vite 8, ESBuild, PostCSS</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center gap-2 font-serif font-bold text-stone-900">
            <Bot className="w-5 h-5 text-orange-600" />
            <span>AI Integration Specifics</span>
          </div>
          <ul className="text-xs text-stone-700 space-y-1">
            <li>• <strong>Model:</strong> gemini-3.8-flash for low-latency reasoning and vision</li>
            <li>• <strong>Structured Schema:</strong> Type.OBJECT & Type.ARRAY enforcing JSON outputs</li>
            <li>• <strong>Multimodal:</strong> Inline base64 image parsing for fridge recognition</li>
            <li>• <strong>Culinary Heuristics:</strong> Contextual prompt framing for kitchen substitutions</li>
            <li>• <strong>Resilience:</strong> Deterministic culinary fallback generators</li>
          </ul>
        </div>
      </div>

      {/* 5. Future Enhancements */}
      <div>
        <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-amber-600" />
          <span>Roadmap & Future Enhancements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70">
            <div className="font-bold text-stone-900">Barcode & Expiration Tracker</div>
            <div className="text-stone-700 mt-1">Automatic alert notifications before fresh produce or dairy expires.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70">
            <div className="font-bold text-stone-900">Voice-Guided Cooking</div>
            <div className="text-stone-700 mt-1">Hands-free voice next-step advancement using Gemini Live audio API.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70">
            <div className="font-bold text-stone-900">Grocery Store API Sync</div>
            <div className="text-stone-700 mt-1">1-click order fulfillment through Instacart or local supermarket delivery.</div>
          </div>
        </div>
      </div>

      {/* 6. Requirements Compliance Matrix */}
      <div>
        <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Feature Requirements Compliance Matrix</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            '1. Dynamic Ingredient Input (text typing, chips, presets, camera vision scan)',
            '2. Recipe Generation (Egg Fried Rice, Tomato Rice, Omelette, Egg Curry, etc.)',
            '3. Missing Ingredient Identification & Smart Substitutions Engine',
            '4. Step-by-Step Cooking Instructions with Live Countdown Timers',
            '5. Nutritional Breakdown (Calories, Protein, Carbs, Fat, Fiber, Sodium)',
            '6. Dietary Filters (Vegetarian, Vegan, High Protein, Low Carb, Gluten/Dairy Free)',
            '7. Cooking Time Filters (≤15m, ≤30m, ≤45m, ≤60m) & Difficulty Tiers',
            '8. User Authentication, Profile Preferences, & Allergy Warnings',
            '9. Weekly Meal Planner (Monday–Sunday with 4 daily meal slots)',
            '10. Automated Categorized Shopping List with duplicate prevention & print',
            '11. Ask AI Chef interactive 24/7 conversational assistant',
            '12. Saved Favorites & Custom Recipe Collections manager',
          ].map((feat, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-stone-800">{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
