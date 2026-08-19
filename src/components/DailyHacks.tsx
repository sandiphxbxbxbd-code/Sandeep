import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Check, 
  Plus, 
  Flame, 
  ArrowRight,
  TrendingDown,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Currency, DailyHack } from '../types';
import { INITIAL_DAILY_HACKS } from '../data/presets';

interface DailyHacksProps {
  language: Language;
  currency: Currency;
  onAddSavingsToVault: (amount: number, reason: string) => void;
}

export const DailyHacks: React.FC<DailyHacksProps> = ({
  language,
  currency,
  onAddSavingsToVault
}) => {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const [hacks, setHacks] = useState<DailyHack[]>(INITIAL_DAILY_HACKS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [completedHacks, setCompletedHacks] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', labelHi: 'सभी नुस्खे (All)', labelEn: 'All' },
    { id: 'Food & Groceries', labelHi: '🥗 भोजन व राशन', labelEn: 'Food & Groceries' },
    { id: 'Utilities', labelHi: '💡 बिजली व बिल', labelEn: 'Utilities' },
    { id: 'Subscriptions', labelHi: '📺 OTT व सब्सक्रिप्शन', labelEn: 'Subscriptions' },
    { id: 'Other', labelHi: '💳 कार्ड्स व बैंक', labelEn: 'Banking & Cards' },
  ];

  const filteredHacks = selectedCategory === 'all'
    ? hacks
    : hacks.filter(h => h.category === selectedCategory);

  const handleApplyHack = (hack: DailyHack) => {
    if (completedHacks[hack.id]) return;

    setCompletedHacks(prev => ({ ...prev, [hack.id]: true }));
    onAddSavingsToVault(hack.estimatedMonthlySaving, `Hack: ${hack.title}`);

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  const handleFetchFreshHacks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/daily-hacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          currency,
          language,
        }),
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setHacks(data.data);
        try {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        } catch {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              {language === 'hi' ? 'दैनिक बचत गाइड' : 'Daily Cash Hacks & Secrets'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'hi'
                ? 'रोजाना पैसे बचाने और फिजूलखर्च रोकने के स्मार्ट तरीके'
                : 'Smart Ways to Save Money & Stop Daily Money Leaks'}
            </h1>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {language === 'hi'
                ? 'इन आसान ट्रिक्स को लागू करें और हर महीने ₹3,000 से ₹8,000 तक अतिरिक्त बचत सीधे अपनी तिजोरी में जोड़ें।'
                : 'Practical, high-yield tricks across groceries, utilities, credit cards, and OTT to recover hard cash.'}
            </p>
          </div>

          <button
            onClick={handleFetchFreshHacks}
            disabled={isLoading}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{language === 'hi' ? 'AI से नए नुस्खे लाएं' : 'Generate Fresh AI Hacks'}</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'bg-white/10 text-zinc-300 hover:bg-white/20'
              }`}
            >
              {language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Hacks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHacks.map((hack) => {
          const isDone = completedHacks[hack.id];
          return (
            <div
              key={hack.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                isDone
                  ? 'border-emerald-400 bg-emerald-50/50 shadow-xs'
                  : 'border-zinc-200 shadow-xs hover:border-emerald-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                    {hack.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    +{currencySymbol} {hack.estimatedMonthlySaving}/{language === 'hi' ? 'माह' : 'mo'}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-zinc-900 leading-snug">
                  {hack.title}
                </h3>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {hack.description}
                </p>

                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs text-zinc-800 font-medium">
                  <span className="font-bold text-emerald-800">
                    {language === 'hi' ? '👉 क्या करें:' : '👉 Action Step:'}
                  </span>{' '}
                  {hack.actionStep}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <button
                  onClick={() => handleApplyHack(hack)}
                  disabled={isDone}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'लागू कर दिया ✓ (गुल्लक में जुड़ा)' : 'Applied ✓ (Saved to Vault)'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'hi' ? 'लागू करें और पैसे बचाएं' : 'Apply & Save to Vault'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
