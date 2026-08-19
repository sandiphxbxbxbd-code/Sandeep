import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Target, 
  TrendingUp, 
  History, 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  Trash2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Currency, SavingsGoal } from '../types';

interface SavingsLockerProps {
  language: Language;
  currency: Currency;
  savedVaultAmount: number;
  savingsHistory: { id: string; amount: number; reason: string; date: string }[];
  goals: SavingsGoal[];
  onAddGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onManualAddSaving: (amount: number, reason: string) => void;
}

export const SavingsLocker: React.FC<SavingsLockerProps> = ({
  language,
  currency,
  savedVaultAmount,
  savingsHistory,
  goals,
  onAddGoal,
  onDeleteGoal,
  onManualAddSaving
}) => {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const [manualAmount, setManualAmount] = useState('');
  const [manualReason, setManualReason] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Emergency');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(manualAmount);
    if (!amt || amt <= 0) return;

    onManualAddSaving(amt, manualReason.trim() || (language === 'hi' ? 'दैनिक बचत' : 'Daily Savings'));
    setManualAmount('');
    setManualReason('');

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(newGoalTarget);
    if (!newGoalTitle.trim() || !target || target <= 0) return;

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      title: newGoalTitle.trim(),
      targetAmount: target,
      currentSaved: 0,
      category: newGoalCategory,
    };

    onAddGoal(newGoal);
    setNewGoalTitle('');
    setNewGoalTarget('');
    setShowGoalModal(false);

    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch {}
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Vault Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-zinc-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              <PiggyBank className="w-3.5 h-3.5" />
              {language === 'hi' ? 'आपकी असली बचत तिजोरी' : 'Your Digital Cash Vault'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              {currencySymbol} {savedVaultAmount.toLocaleString('en-IN')}
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {language === 'hi'
                ? 'यह वह कुल पैसा है जो आपने अनावश्यक खर्च कम करके, बिल नेगोशिएट करके और AI टिप्स से बचाया है।'
                : 'Total hard cash saved & recovered by cutting unnecessary expenses and optimizing bills.'}
            </p>
          </div>

          {/* Quick Manual Deposit Box */}
          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3">
            <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
              <span>{language === 'hi' ? '💰 सीधी बचत जमा करें' : '💰 Quick Deposit Saved Cash'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <form onSubmit={handleDeposit} className="space-y-2.5">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 font-bold text-xs">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="500"
                  className="w-full pl-7 pr-3 py-2 bg-black/20 border border-white/20 rounded-xl text-sm font-bold text-white placeholder-white/40 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>
              <input
                type="text"
                value={manualReason}
                onChange={(e) => setManualReason(e.target.value)}
                placeholder={language === 'hi' ? 'वजह (उदा. आज बाहर खाना नहीं खाया)' : 'Reason (e.g. skipped takeout)'}
                className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {language === 'hi' ? 'गुल्लक में जोड़ें' : 'Add to Vault'}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Savings Goals Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              {language === 'hi' ? '🎯 बचत लक्ष्य (Savings Goals)' : '🎯 Savings Goals'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'hi' ? 'खर्च कम करके जमा हुआ पैसा इन लक्ष्यों में उपयोग करें' : 'Track milestones powered by your expense reductions'}
            </p>
          </div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            {language === 'hi' ? 'नया गोल बनाएं' : 'New Goal'}
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
            return (
              <div key={goal.id} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 relative group">
                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-rose-600 transition-colors p-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="font-bold text-base text-zinc-900 pr-8">
                  {goal.title}
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-700 font-extrabold">
                    {currencySymbol} {goal.currentSaved.toLocaleString('en-IN')}{' '}
                    <span className="text-zinc-400 font-normal">/ {currencySymbol} {goal.targetAmount.toLocaleString('en-IN')}</span>
                  </span>
                  <span className="text-zinc-600 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
                    {percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings Ledger / History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            {language === 'hi' ? 'बचत का इतिहास (Savings Ledger)' : 'Savings History & Log'}
          </h2>
          <span className="text-xs text-zinc-500 font-semibold">
            {savingsHistory.length} {language === 'hi' ? 'एंट्री' : 'entries'}
          </span>
        </div>

        <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto pr-1">
          {savingsHistory.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              {language === 'hi' ? 'अभी तक कोई एंट्री नहीं है। ऊपर से बचत जोड़ें!' : 'No entries yet. Start saving from Quick Wins or manual deposit!'}
            </div>
          ) : (
            savingsHistory.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm text-zinc-900">
                    {item.reason}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {item.date}
                  </div>
                </div>
                <div className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  +{currencySymbol} {item.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200 space-y-4 animate-scaleUp">
            <h3 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              {language === 'hi' ? 'नया बचत लक्ष्य बनाएं' : 'Create Savings Goal'}
            </h3>
            
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {language === 'hi' ? 'लक्ष्य का नाम' : 'Goal Title'}
                </label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. नया लैपटॉप या बाइक फंड' : 'e.g. Emergency Fund or Bike'}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {language === 'hi' ? `टारगेट रकम (${currencySymbol})` : `Target Amount (${currencySymbol})`}
                </label>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="20000"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  {language === 'hi' ? 'लक्ष्य सेव करें' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
