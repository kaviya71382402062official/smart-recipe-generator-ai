import React, { useState, useRef, useEffect } from 'react';
import {
  ChefHat,
  Send,
  Sparkles,
  Trash2,
  HelpCircle,
  RefreshCw,
  Lightbulb,
  Copy,
  Check,
  Bot,
  User,
} from 'lucide-react';
import { UserProfile } from '../types/recipe';

interface Message {
  id: string;
  sender: 'user' | 'chef';
  text: string;
  timestamp: number;
}

interface AskAiChefPageProps {
  user: UserProfile | null;
  availableIngredients: string[];
}

const DEFAULT_STARTER_PROMPTS = [
  'What can I cook with eggs, rice, and tomatoes?',
  'What can I use instead of butter?',
  'Suggest a quick dinner under 20 minutes.',
  'How can I make my meals vegetarian without losing protein?',
  'How can I reduce food waste using leftover vegetables?',
  'Can I bake or air-fry instead of deep frying?',
];

export const AskAiChefPage: React.FC<AskAiChefPageProps> = ({ user, availableIngredients }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('smart_recipe_chef_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'msg-1',
        sender: 'chef',
        text: `Bonjour! I'm Chef Remy, your AI culinary assistant. ${
          availableIngredients.length > 0
            ? `I see you have ${availableIngredients.slice(0, 4).join(', ')} in your kitchen! `
            : ''
        }Ask me for substitute ideas, cooking steps, flavor balances, or how to eliminate food waste!`,
        timestamp: Date.now(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('smart_recipe_chef_chat', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          ingredients: availableIngredients,
          history: messages.slice(-4).map((m) => ({ role: m.sender, text: m.text })),
          userPreferences: user
            ? {
                dietary: user.dietaryPreferences,
                allergies: user.allergies,
              }
            : {},
        }),
      });

      const data = await response.json();
      const chefReply: Message = {
        id: `msg-${Date.now()}-reply`,
        sender: 'chef',
        text: data.answer || 'Cook with love and taste as you go!',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, chefReply]);
    } catch (error) {
      console.error(error);
      const errorReply: Message = {
        id: `msg-${Date.now()}-err`,
        sender: 'chef',
        text: 'I had a momentary kitchen hiccup. Taste your dish and feel free to ask again in a moment!',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'chef',
        text: "Kitchen slate cleaned! What culinary question would you like to explore now?",
        timestamp: Date.now(),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-2xl text-stone-900">Ask AI Chef</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Online
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
              Your 24/7 culinary advisor for ingredients, cooking techniques, and kitchen wisdom.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto border border-stone-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Starter Questions */}
      <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Suggested Questions & Cooking Queries</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/80 border border-amber-200 text-stone-800 hover:text-amber-950 font-medium transition-colors shadow-2xs text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages scroll list */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 relative group ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : 'bg-amber-50/60 border border-amber-200/70 text-stone-800 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                {msg.sender === 'chef' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute -bottom-2 right-2 p-1 rounded-md bg-white border border-stone-200 text-stone-400 hover:text-stone-700 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy advice"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                <ChefHat className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
                <span>Chef Remy is consulting recipes...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'How can I fix an oversalted stew?' or '3 quick recipes for chicken')..."
              className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-amber-500 bg-white shadow-2xs"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Chef</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
