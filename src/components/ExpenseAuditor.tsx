import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Zap, 
  Activity, 
  Lightbulb, 
  RotateCcw,
  BadgeAlert,
  WalletCards
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExpenseItem, AuditResult, Language, Currency } from '../types';
import { PRESET_EXPENSE_PROFILES } from '../data/presets';

interface ExpenseAuditorProps {
  language: Language;
  currency: Currency;
  onAddSavingsToVault: (amount: number, reason: string) => void;
}

export const ExpenseAuditor: React.FC<ExpenseAuditorProps> = ({
  language,
  currency,
  onAddSavingsToVault
}) => {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  // State
  const [income, setIncome] = useState<number>(60000);
  const [notes, setNotes] = useState<string>('');
  const [expenses, setExpenses] = useState<ExpenseItem[]>(PRESET_EXPENSE_PROFILES[0].expenses);
  const [selectedPreset, setSelectedPreset] = useState<string>('middle-class-family');
  
  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ExpenseItem['category']>('Food & Groceries');

  // Audit state
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);
  const [claimedQuickWins, setClaimedQuickWins] = useState<Record<number, boolean>>({});
  const [claimedLeaks, setClaimedLeaks] = useState<Record<number, boolean>>({});

  const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Handlers
  const handleLoadPreset = (profileId: string) => {
    const profile = PRESET_EXPENSE_PROFILES.find(p => p.id === profileId);
    if (profile) {
      setSelectedPreset(profileId);
      setIncome(profile.income);
      setExpenses([...profile.expenses]);
      setAuditResult(null);
      setErrorMsg(null);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemAmount || Number(newItemAmount) <= 0) return;

    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      amount: Number(newItemAmount),
      category: newItemCategory,
      frequency: 'monthly',
      necessity: 'discretionary',
    };

    setExpenses(prev => [newExpense, ...prev]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateAmount = (id: string, newAmount: number) => {
    setExpenses(prev => prev.map(item => item.id === id ? { ...item, amount: newAmount } : item));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore in iframe fallback
    }
  };

  const handleRunAudit = async () => {
    if (expenses.length === 0) {
      setErrorMsg(language === 'hi' ? 'कृपया कम से कम एक खर्च दर्ज करें।' : 'Please enter at least one expense.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/audit-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenses,
          income,
          currency,
          language,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze expenses');
      }

      setAuditResult(data.data);
      setClaimedQuickWins({});
      setClaimedLeaks({});
      triggerConfetti();

      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById('audit-results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      setErrorMsg(err.message || 'Error running audit. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2500);
  };

  const handleClaimQuickWin = (win: any, idx: number) => {
    if (claimedQuickWins[idx]) return;
    setClaimedQuickWins(prev => ({ ...prev, [idx]: true }));
    onAddSavingsToVault(win.instantSavings, `Quick Win: ${win.title}`);
    triggerConfetti();
  };

  const handleClaimLeak = (leak: any, idx: number) => {
    if (claimedLeaks[idx]) return;
    setClaimedLeaks(prev => ({ ...prev, [idx]: true }));
    onAddSavingsToVault(leak.monthlySavings, `Expense Cut: ${leak.itemName}`);
    triggerConfetti();
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? 'AI संचालित फिजूलखर्च घटाने वाला सिस्टम' : 'AI-Powered Expense Cutting Engine'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {language === 'hi'
              ? 'महीने के खर्चे कम करें, बचा हुआ पैसा सीधे जेब में पाएं'
              : 'Cut Your Monthly Expenses & Put Real Cash Back in Your Pocket'}
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            {language === 'hi'
              ? 'अपने महीने के खर्चे जोड़ें या एक सैंपल प्रोफ़ाइल चुनें। हमारा Gemini AI आपके बिलों का विश्लेषण कर अनावश्यक खर्चों को तुरंत 15% से 35% तक कम करने का सटीक फॉर्मूला देगा।'
              : 'Add your monthly expenses or load a realistic preset. BachatAI audits every spend, detects leakages, negotiates bills down, and recovers monthly cash for you.'}
          </p>
        </div>

        {/* Preset Selector Badges */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-xs text-emerald-300 font-semibold mb-3 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            {language === 'hi' ? 'रेफरेंस के लिए सैंपल प्रोफाइल चुनें (Quick Load):' : 'Choose a Sample Scenario:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_EXPENSE_PROFILES.map(profile => (
              <button
                key={profile.id}
                id={`preset-${profile.id}`}
                onClick={() => handleLoadPreset(profile.id)}
                className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedPreset === profile.id
                    ? 'bg-emerald-800/80 border-emerald-400 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm text-white truncate">
                  {language === 'hi' ? profile.nameHi : profile.nameEn}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                  {language === 'hi' ? profile.descriptionHi : profile.descriptionEn}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form & Expense Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Income & Expense List Builder (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Income & Notes Card */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <WalletCards className="w-5 h-5 text-emerald-600" />
                {language === 'hi' ? 'आपकी मासिक आय और संदर्भ' : 'Monthly Income & Context'}
              </span>
              <span className="text-xs font-normal text-zinc-500">
                {language === 'hi' ? '(वैकल्पिक)' : '(Optional)'}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  {language === 'hi' ? `मासिक आय (${currencySymbol})` : `Monthly Income (${currencySymbol})`}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    id="user-income-input"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    placeholder="60000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  {language === 'hi' ? 'विशेष परिस्थिति / आदतें' : 'Special Habits / Notes'}
                </label>
                <input
                  type="text"
                  id="user-notes-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. बाहर ज्यादा खाना, 3 OTT हैं, आदि' : 'e.g. daily dining out, 4 OTT subs'}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Add Expense Form */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                {language === 'hi' ? 'नया खर्च जोड़ें' : 'Add an Expense'}
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                {expenses.length} {language === 'hi' ? 'खर्च दर्ज हैं' : 'items added'}
              </span>
            </h2>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    id="new-expense-name-input"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={language === 'hi' ? 'खर्च का नाम (उदा. Swiggy, बिजली, वाईफाई)' : 'Item name (e.g. WiFi, Dining)'}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      id="new-expense-amount-input"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                      placeholder="1500"
                      className="w-full pl-7 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <select
                    id="new-expense-category-select"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Food & Groceries">🥗 Food & Groceries</option>
                    <option value="Utilities">💡 Utilities & Bills</option>
                    <option value="Housing">🏠 Housing / Rent</option>
                    <option value="Subscriptions">📺 Subscriptions (OTT/Apps)</option>
                    <option value="Transport">🚗 Transport / Fuel</option>
                    <option value="Shopping">🛍️ Shopping / Clothes</option>
                    <option value="Entertainment">🎟️ Entertainment / Gym</option>
                    <option value="Healthcare">💊 Healthcare</option>
                    <option value="Other">📦 Other / EMIs</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                id="add-expense-submit-btn"
                className="w-full py-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                {language === 'hi' ? 'खर्च सूची में जोड़ें (+)' : 'Add to List (+)'}
              </button>
            </form>
          </div>

          {/* Current Expenses Table / List */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  {language === 'hi' ? 'वर्तमान मासिक खर्चे' : 'Current Expenses List'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {language === 'hi' ? 'आप रकम पर क्लिक करके बदल भी सकते हैं' : 'Click amount to edit directly'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-zinc-500 uppercase">
                  {language === 'hi' ? 'कुल मासिक खर्च' : 'Total Monthly Spend'}
                </div>
                <div className="text-lg font-black text-zinc-900">
                  {currencySymbol} {totalExpense.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 max-h-[400px] overflow-y-auto pr-1">
              {expenses.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-zinc-900 truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-medium">
                      {item.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-bold">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleUpdateAmount(item.id, Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1.5 bg-zinc-50 hover:bg-zinc-100 focus:bg-white border border-zinc-200 rounded-lg text-xs font-bold text-right text-zinc-900 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveExpense(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Run Audit CTA Button */}
            <div className="pt-4 border-t border-zinc-100">
              <button
                id="run-ai-audit-btn"
                onClick={handleRunAudit}
                disabled={isLoading || expenses.length === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'hi' ? 'AI फिजूलखर्च ढूंढ रहा है...' : 'AI Analyzing & Cutting Spends...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
                    <span>
                      {language === 'hi' ? '⚡ AI खर्च ऑडिट करें और पैसे बचाएं' : '⚡ Run AI Audit & Cut Expenses Now'}
                    </span>
                    <ArrowRight className="w-5 h-5 text-emerald-200" />
                  </>
                )}
              </button>
              {errorMsg && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Col: Quick Visual Stats & Guidance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Why This Works Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-3xl p-6 shadow-md border border-zinc-700/50 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <Zap className="w-5 h-5" />
              <span>{language === 'hi' ? 'यह ऐप आपको पैसे कैसे बचा कर देगा?' : 'How BachatAI Unlocks Money'}</span>
            </div>
            
            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <span className="font-semibold text-white">
                    {language === 'hi' ? 'छिपे हुए लीकेज की पहचान:' : 'Identifies Silent Leaks:'}
                  </span>{' '}
                  {language === 'hi'
                    ? 'अनयूज्ड सब्सक्रिप्शन, ओवरप्राइस्ड वाईफाई/मोबाइल प्लान, और स्विगी/जोमैटो मार्कअप को स्पॉट करता है।'
                    : 'Unused OTT subs, overpriced telecom plans, and food delivery markups.'}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <span className="font-semibold text-white">
                    {language === 'hi' ? 'सटीक नेगोशिएशन स्क्रिप्ट:' : 'Actionable Scripts:'}
                  </span>{' '}
                  {language === 'hi'
                    ? 'इंटरनेट, जिम, और इंश्योरेंस कंपनियों को भेजने के लिए तैयार डिस्काउंट मैसेज देता है।'
                    : 'Ready-to-send discount & retention scripts for broadband, gym & insurers.'}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <span className="font-semibold text-white">
                    {language === 'hi' ? 'सस्ते व बेहतर विकल्प:' : 'Cheaper Alternatives:'}
                  </span>{' '}
                  {language === 'hi'
                    ? 'समान क्वालिटी की सेवाएं 30-50% कम दाम में पाने के तरीके सुझाता है।'
                    : 'Find identical quality alternatives at 30-50% lower price point.'}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>{language === 'hi' ? 'औसत मासिक बचत:' : 'Average User Savings:'}</span>
              <span className="text-emerald-400 font-extrabold text-sm">
                {currencySymbol} 4,500 - 8,000 / {language === 'hi' ? 'माह' : 'mo'}
              </span>
            </div>
          </div>

          {/* Quick Snapshot Before Audit */}
          {!auditResult && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 text-emerald-950 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'प्रारंभिक अनुमान' : 'Instant Estimation'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
                  <div className="text-[11px] text-zinc-500 font-medium uppercase">
                    {language === 'hi' ? 'संभावित मासिक बचत' : 'Potential Cut'}
                  </div>
                  <div className="text-lg font-black text-emerald-700 mt-1">
                    ~20% - 35%
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {currencySymbol} {Math.round(totalExpense * 0.25).toLocaleString('en-IN')} / {language === 'hi' ? 'माह' : 'mo'}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
                  <div className="text-[11px] text-zinc-500 font-medium uppercase">
                    {language === 'hi' ? '1 वर्ष का संचय' : '1-Year Unlocked'}
                  </div>
                  <div className="text-lg font-black text-emerald-700 mt-1">
                    {currencySymbol} {Math.round(totalExpense * 0.25 * 12).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {language === 'hi' ? 'गुल्लक में जमा होगा' : 'Direct to Vault'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-emerald-800/90 leading-relaxed">
                {language === 'hi'
                  ? '⚡ ऊपर दिए गए बटन पर क्लिक करें और देखें कि कौन से खर्चे तुरंत काटे जा सकते हैं।'
                  : '⚡ Click the "Run AI Audit" button to see exact itemized cuts and scripts.'}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* AUDIT RESULTS SECTION (Shown when available) */}
      {auditResult && (
        <div id="audit-results-section" className="pt-6 space-y-8 animate-fadeIn">
          
          {/* Main Savings Hero Summary */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                  {language === 'hi' ? 'AI ऑडिट पूर्ण - बचत प्लान तैयार' : 'Audit Complete - Action Plan Ready'}
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                  {auditResult.summary}
                </h2>
              </div>

              {/* Savings Big Stats */}
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/10 shrink-0 w-full sm:w-auto justify-around">
                <div className="text-center">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-200">
                    {language === 'hi' ? 'हर माह बचत' : 'Monthly Savings'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {currencySymbol} {auditResult.totalMonthlySavings?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-100">
                    {language === 'hi' ? 'सीधे आपकी बचत में' : 'Recovered cash'}
                  </div>
                </div>

                <div className="h-10 w-px bg-white/20" />

                <div className="text-center">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-200">
                    {language === 'hi' ? '1 वर्ष का संचय' : '1-Year Projection'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {currencySymbol} {auditResult.totalYearlySavings?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-100">
                    {language === 'hi' ? 'सालाना फ्री कैश' : 'Free cash / year'}
                  </div>
                </div>
              </div>

            </div>

            {/* Financial Health Score Bar */}
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-lg">
                  {auditResult.financialHealthScore}/100
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-100">
                    {language === 'hi' ? 'वित्तीय दक्षता स्कोर' : 'Financial Health Score'}
                  </div>
                  <div className="text-[11px] text-white/80">
                    {auditResult.financialHealthScore > 75 
                      ? (language === 'hi' ? 'उत्कृष्ट बजट' : 'Excellent Budget')
                      : (language === 'hi' ? 'सुधार की बहुत गुंजाइश है' : 'High Savings Potential')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm">
                  {currencySymbol}
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-100">
                    {language === 'hi' ? 'वर्तमान बनाम नया बजट' : 'Current vs Optimized'}
                  </div>
                  <div className="text-[11px] text-white font-bold">
                    {currencySymbol} {auditResult.currentTotal?.toLocaleString('en-IN')} → {currencySymbol} {auditResult.optimizedTotal?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-100">
                    {language === 'hi' ? 'खर्च में कुल कटौती' : 'Total Expense Cut'}
                  </div>
                  <div className="text-[11px] text-white font-bold">
                    {Math.round(((auditResult.totalMonthlySavings || 0) / (auditResult.currentTotal || 1)) * 100)}% {language === 'hi' ? 'की कमी' : 'Reduced'}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Wins Checklist (5-Minute Instant Cash) */}
          {auditResult.quickWins && auditResult.quickWins.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base sm:text-lg">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span>{language === 'hi' ? '⚡ तुरंत 5 मिनट में लागू करने वाले क्विक विन्स' : '⚡ 5-Minute Instant Quick Wins'}</span>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-full">
                  {language === 'hi' ? 'क्लिक करके गुल्लक में जोड़ें' : 'Click to Claim to Vault'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditResult.quickWins.map((win, idx) => {
                  const isClaimed = claimedQuickWins[idx];
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isClaimed
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-white border-amber-200/80 text-zinc-900 shadow-2xs hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-bold text-sm text-zinc-900">
                          {win.title}
                        </div>
                        <span className="shrink-0 bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-lg border border-emerald-200">
                          +{currencySymbol} {win.instantSavings}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                        {win.instructions}
                      </p>
                      <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-zinc-500">
                          ⏱️ {win.timeToExecute || '5 min'}
                        </span>
                        <button
                          onClick={() => handleClaimQuickWin(win, idx)}
                          disabled={isClaimed}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            isClaimed
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs'
                          }`}
                        >
                          {isClaimed ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              {language === 'hi' ? 'गुल्लक में जुड़ गया ✓' : 'Added to Vault ✓'}
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              {language === 'hi' ? 'पैसे बचाएं व जोड़ें' : 'Claim & Save to Vault'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Itemized Key Leaks & Reductions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-extrabold text-lg sm:text-xl">
              <BadgeAlert className="w-6 h-6 text-rose-600" />
              <span>
                {language === 'hi' ? '🚨 मुख्य फिजूलखर्च और कटौती का फॉर्मूला' : '🚨 Detected Money Leaks & Action Plans'}
              </span>
            </div>

            <div className="space-y-4">
              {auditResult.keyLeaks && auditResult.keyLeaks.map((leak, idx) => {
                const isClaimed = claimedLeaks[idx];
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4 hover:border-emerald-300 transition-colors"
                  >
                    {/* Top Row: Item name, Category, Urgency, Savings Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 font-black flex items-center justify-center text-sm border border-rose-100">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-base text-zinc-900">
                            {leak.itemName}
                          </div>
                          <div className="text-xs text-zinc-500 font-medium">
                            {leak.category} •{' '}
                            <span className={`font-semibold ${leak.urgency === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>
                              {leak.urgency} {language === 'hi' ? 'प्राथमिकता' : 'Priority'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-zinc-400 line-through">
                            {currencySymbol} {leak.currentAmount}
                          </div>
                          <div className="text-sm font-bold text-zinc-800">
                            → {currencySymbol} {leak.suggestedAmount}
                          </div>
                        </div>
                        <div className="bg-emerald-100 text-emerald-900 font-extrabold text-sm px-3 py-1.5 rounded-xl border border-emerald-200">
                          {language === 'hi' ? 'बचत:' : 'Save:'} +{currencySymbol} {leak.monthlySavings}/{language === 'hi' ? 'माह' : 'mo'}
                        </div>
                      </div>
                    </div>

                    {/* Why this leaks money */}
                    <div className="bg-zinc-50 rounded-2xl p-4 text-xs sm:text-sm space-y-2 border border-zinc-100">
                      <div className="text-zinc-700">
                        <span className="font-bold text-rose-700">
                          {language === 'hi' ? 'कमी का कारण:' : 'Why It Leaks:'}
                        </span>{' '}
                        {leak.leakReason}
                      </div>
                      <div className="text-zinc-800 font-medium">
                        <span className="font-bold text-emerald-700">
                          {language === 'hi' ? 'समाधान व एक्शन:' : 'Solution & Action:'}
                        </span>{' '}
                        {leak.solution}
                      </div>
                    </div>

                    {/* Ready Negotiation Script if available */}
                    {leak.negotiationScript && (
                      <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                          <span>
                            {language === 'hi' ? '📋 कॉपी करने योग्य नेगोशिएशन / कैंसिलेशन स्क्रिप्ट:' : '📋 Copy-Paste Negotiation Message:'}
                          </span>
                          <button
                            onClick={() => handleCopyScript(leak.negotiationScript!, idx)}
                            className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                          >
                            {copiedScriptIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">{language === 'hi' ? 'कॉपी हो गया!' : 'Copied!'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{language === 'hi' ? 'कॉपी करें' : 'Copy'}</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-xs text-teal-950 font-mono bg-white/80 p-3 rounded-xl border border-teal-100 leading-relaxed select-all">
                          {leak.negotiationScript}
                        </div>
                      </div>
                    )}

                    {/* Mark as Cut Action */}
                    <div className="flex items-center justify-end pt-2">
                      <button
                        onClick={() => handleClaimLeak(leak, idx)}
                        disabled={isClaimed}
                        className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                          isClaimed
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
                        }`}
                      >
                        {isClaimed ? (
                          <>
                            <Check className="w-4 h-4" />
                            {language === 'hi' ? 'यह खर्च कम कर दिया ✓ (गुल्लक में जमा)' : 'Cut Applied ✓ (Saved in Vault)'}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            {language === 'hi' ? 'मैंने यह खर्च कम कर दिया (गुल्लक में जोड़ें)' : 'I Cut This Spend (Add to Vault)'}
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Long-term Smart Habits */}
          {auditResult.smartHabits && auditResult.smartHabits.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 font-extrabold text-base sm:text-lg">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>{language === 'hi' ? '💡 लाइफस्टाइल बनाए रखते हुए पैसे बचाने की 4 आदतें' : '💡 4 Smart Habits to Keep Money Safe'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {auditResult.smartHabits.map((habit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                      {habit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
