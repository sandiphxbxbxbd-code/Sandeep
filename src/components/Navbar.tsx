import React from 'react';
import { 
  PiggyBank, 
  Sparkles, 
  Receipt, 
  MessageSquare, 
  Lightbulb, 
  HandCoins, 
  Flame,
  Languages,
  ArrowDownCircle,
  SendHorizontal
} from 'lucide-react';
import { Language, Currency } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  savedVaultAmount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  currency,
  setCurrency,
  savedVaultAmount,
}) => {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const navItems = [
    {
      id: 'withdraw',
      labelHi: '💸 पैसे निकालें (Withdrawal)',
      labelEn: '💸 Instant Withdrawal',
      icon: ArrowDownCircle,
      highlight: true,
    },
    {
      id: 'audit',
      labelHi: 'खर्च कम करें (AI Audit)',
      labelEn: 'Audit & Cut Spends',
      icon: Flame,
    },
    {
      id: 'negotiate',
      labelHi: 'मोलभाव व सस्ता विकल्प',
      labelEn: 'Negotiator & Deals',
      icon: HandCoins,
    },
    {
      id: 'bill-scan',
      labelHi: 'बिल स्कैनर',
      labelEn: 'Bill Analyzer',
      icon: Receipt,
    },
    {
      id: 'vault',
      labelHi: 'बचत गुल्लक',
      labelEn: 'Savings Vault',
      icon: PiggyBank,
    },
    {
      id: 'hacks',
      labelHi: 'पैसे बचाने के नुस्खे',
      labelEn: 'Daily Hacks',
      icon: Lightbulb,
    },
    {
      id: 'chat',
      labelHi: 'AI सलाहकार',
      labelEn: 'AI Advisor Chat',
      icon: MessageSquare,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('audit')}
            id="brand-logo-button"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/20 text-white transform group-hover:scale-105 transition-transform duration-200">
              <PiggyBank className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 flex items-center">
                  Bachat<span className="text-emerald-600">AI</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {language === 'hi' ? 'खर्च घटाओ • पैसे पाओ' : 'Cut Spends • Payout'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 hidden sm:block">
                {language === 'hi' ? 'AI जो खर्च खुद कम करके सीधे UPI / बैंक में निकासी दे' : 'AI that cuts expenses & credits cash for withdrawal'}
              </p>
            </div>
          </div>

          {/* Right Action Bar (Withdraw CTA, Vault Pill, Currency, Language) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Instant Withdrawal Action Button */}
            <button
              id="header-withdraw-action-btn"
              onClick={() => setActiveTab('withdraw')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पैसे निकालें (UPI)' : 'Withdraw Cash'}</span>
            </button>

            {/* Live Vault Pill */}
            <button
              id="header-vault-badge"
              onClick={() => setActiveTab('withdraw')}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors text-emerald-900 font-semibold shadow-xs cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                {currencySymbol}
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                  {language === 'hi' ? 'उपलब्ध बैलेंस' : 'Withdrawable'}
                </div>
                <div className="text-xs sm:text-sm font-black text-emerald-900">
                  {currencySymbol} {savedVaultAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </button>

            {/* Currency Selector */}
            <select
              id="currency-selector"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-700 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>

            {/* Language Toggle */}
            <button
              id="language-toggle-button"
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors text-xs font-semibold shadow-xs"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar border-t border-zinc-100 text-xs sm:text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? item.highlight 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm'
                      : 'bg-emerald-700 text-white shadow-sm'
                    : item.highlight
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-700' : 'text-zinc-500'}`} />
                <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                {item.id === 'withdraw' && (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'}`}>
                    FAST
                  </span>
                )}
                {item.id === 'audit' && (
                  <span className="hidden md:inline-flex items-center gap-0.5 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

