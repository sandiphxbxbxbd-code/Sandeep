import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExpenseAuditor } from './components/ExpenseAuditor';
import { NegotiateTool } from './components/NegotiateTool';
import { BillScanner } from './components/BillScanner';
import { SavingsLocker } from './components/SavingsLocker';
import { DailyHacks } from './components/DailyHacks';
import { AIChatAdvisor } from './components/AIChatAdvisor';
import { WithdrawalCenter } from './components/WithdrawalCenter';
import { Language, Currency, SavingsGoal, WithdrawalTransaction, AutoSavingsRule } from './types';
import { INITIAL_SAVINGS_GOALS, INITIAL_AUTO_RULES } from './data/presets';
import { PiggyBank, Heart, Sparkles, ShieldCheck, ArrowDownCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('withdraw');
  const [language, setLanguage] = useState<Language>('hi');
  const [currency, setCurrency] = useState<Currency>('INR');

  // Vault / Withdrawable balance with localStorage persistence
  const [savedVaultAmount, setSavedVaultAmount] = useState<number>(() => {
    const saved = localStorage.getItem('bachat_vault_amount');
    return saved ? Number(saved) : 3450;
  });

  const [savingsHistory, setSavingsHistory] = useState<{ id: string; amount: number; reason: string; date: string }[]>(() => {
    const saved = localStorage.getItem('bachat_savings_history');
    return saved ? JSON.parse(saved) : [
      { id: '1', amount: 1200, reason: 'Swiggy/Zomato ऑनलाइन ऑर्डर कटौती', date: 'आज' },
      { id: '2', amount: 650, reason: 'AC तापमान 24°C पर सेट किया (बिजली बचत)', date: 'कल' },
      { id: '3', amount: 1400, reason: 'ब्रॉडबैंड प्लान री-नेगोशिएट डिस्काउंट', date: '3 दिन पहले' },
      { id: '4', amount: 200, reason: '⚡ दैनिक ऑटो-कटौती रिबेट क्रेडिट', date: 'आज सुबह' },
    ];
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('bachat_goals');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [autoRules, setAutoRules] = useState<AutoSavingsRule[]>(() => {
    const saved = localStorage.getItem('bachat_auto_rules');
    return saved ? JSON.parse(saved) : INITIAL_AUTO_RULES;
  });

  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalTransaction[]>(() => {
    const saved = localStorage.getItem('bachat_withdrawal_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'TX-894125',
        amount: 1500,
        method: 'UPI',
        destination: 'thakur@okhdfcbank',
        date: '18 Aug 2026, 04:30 PM',
        status: 'SUCCESS',
        utrNumber: 'UTR492019482710',
        recipientName: 'Sukhram Thakur'
      }
    ];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('bachat_vault_amount', savedVaultAmount.toString());
  }, [savedVaultAmount]);

  useEffect(() => {
    localStorage.setItem('bachat_savings_history', JSON.stringify(savingsHistory));
  }, [savingsHistory]);

  useEffect(() => {
    localStorage.setItem('bachat_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('bachat_auto_rules', JSON.stringify(autoRules));
  }, [autoRules]);

  useEffect(() => {
    localStorage.setItem('bachat_withdrawal_history', JSON.stringify(withdrawalHistory));
  }, [withdrawalHistory]);

  const handleAddSavingsToVault = (amount: number, reason: string) => {
    if (!amount || amount <= 0) return;

    setSavedVaultAmount(prev => prev + amount);

    const newEntry = {
      id: Date.now().toString(),
      amount,
      reason,
      date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })
    };

    setSavingsHistory(prev => [newEntry, ...prev]);

    // Distribute a portion to goals
    setGoals(prev => {
      let allocated = false;
      return prev.map(g => {
        if (!allocated && g.currentSaved < g.targetAmount) {
          allocated = true;
          return { ...g, currentSaved: Math.min(g.targetAmount, g.currentSaved + amount) };
        }
        return g;
      });
    });

    const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
    setToastMessage(language === 'hi' 
      ? `🎉 +${currencySymbol}${amount.toLocaleString('en-IN')} आपके निकासी वॉलेट में जुड़ गए!` 
      : `🎉 +${currencySymbol}${amount.toLocaleString('en-IN')} added to your Withdrawable Balance!`
    );

    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWithdraw = (transaction: WithdrawalTransaction) => {
    setSavedVaultAmount(prev => Math.max(0, prev - transaction.amount));
    setWithdrawalHistory(prev => [transaction, ...prev]);

    const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
    setToastMessage(language === 'hi'
      ? `💸 ${currencySymbol}${transaction.amount.toLocaleString('en-IN')} आपके ${transaction.destination} पर भेज दिए गए!`
      : `💸 ${currencySymbol}${transaction.amount.toLocaleString('en-IN')} withdrawn to ${transaction.destination}!`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleAutoRule = (ruleId: string) => {
    setAutoRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddGoal = (newGoal: SavingsGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400/30 flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold">
            <PiggyBank className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        savedVaultAmount={savedVaultAmount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {activeTab === 'withdraw' && (
          <WithdrawalCenter
            language={language}
            currency={currency}
            withdrawableBalance={savedVaultAmount}
            onWithdraw={handleWithdraw}
            withdrawalHistory={withdrawalHistory}
            autoRules={autoRules}
            onToggleAutoRule={handleToggleAutoRule}
            onClaimDailyAutoSavings={handleAddSavingsToVault}
          />
        )}

        {activeTab === 'audit' && (
          <ExpenseAuditor
            language={language}
            currency={currency}
            onAddSavingsToVault={handleAddSavingsToVault}
          />
        )}

        {activeTab === 'negotiate' && (
          <NegotiateTool
            language={language}
            currency={currency}
            onAddSavingsToVault={handleAddSavingsToVault}
          />
        )}

        {activeTab === 'bill-scan' && (
          <BillScanner
            language={language}
            currency={currency}
            onAddSavingsToVault={handleAddSavingsToVault}
          />
        )}

        {activeTab === 'vault' && (
          <SavingsLocker
            language={language}
            currency={currency}
            savedVaultAmount={savedVaultAmount}
            savingsHistory={savingsHistory}
            goals={goals}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
            onManualAddSaving={handleAddSavingsToVault}
          />
        )}

        {activeTab === 'hacks' && (
          <DailyHacks
            language={language}
            currency={currency}
            onAddSavingsToVault={handleAddSavingsToVault}
          />
        )}

        {activeTab === 'chat' && (
          <AIChatAdvisor
            language={language}
            currency={currency}
            savedVaultAmount={savedVaultAmount}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 mt-auto py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-zinc-800">
            <PiggyBank className="w-4 h-4 text-emerald-600" />
            <span>BachatAI (बचत AI)</span>
            <span>•</span>
            <span className="text-emerald-700">
              {language === 'hi' ? 'ऑटो खर्च कटौती • इंस्टेंट UPI / बैंक निकासी' : 'Auto Expense Reducer • Instant Cashout'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 max-w-md mx-auto">
            {language === 'hi'
              ? 'BachatAI आपके खर्चों को खुद कम करके बचत को अनलॉक करता है और सीधे UPI/बैंक ट्रांसफर के ज़रिये निकासी प्रदान करता है।'
              : 'BachatAI automatically trims unnecessary expenses, recovers cash leaks, and provides instant withdrawal to UPI / Bank accounts.'}
          </p>
        </div>
      </footer>

    </div>
  );
}
