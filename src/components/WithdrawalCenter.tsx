import React, { useState } from 'react';
import { 
  ArrowDownCircle, 
  SendHorizontal, 
  CheckCircle2, 
  QrCode, 
  Building2, 
  Gift, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Zap, 
  RotateCw, 
  Sliders, 
  TrendingUp, 
  DollarSign, 
  Wallet,
  Receipt,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Currency, WithdrawalMethod, WithdrawalTransaction, AutoSavingsRule } from '../types';

interface WithdrawalCenterProps {
  language: Language;
  currency: Currency;
  withdrawableBalance: number;
  onWithdraw: (transaction: WithdrawalTransaction) => void;
  withdrawalHistory: WithdrawalTransaction[];
  autoRules: AutoSavingsRule[];
  onToggleAutoRule: (ruleId: string) => void;
  onClaimDailyAutoSavings: (amount: number, source: string) => void;
}

export const WithdrawalCenter: React.FC<WithdrawalCenterProps> = ({
  language,
  currency,
  withdrawableBalance,
  onWithdraw,
  withdrawalHistory,
  autoRules,
  onToggleAutoRule,
  onClaimDailyAutoSavings,
}) => {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  // Form State
  const [method, setMethod] = useState<WithdrawalMethod>('UPI');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [upiId, setUpiId] = useState<string>('thakur@okhdfcbank');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('HDFC0001234');
  const [accountName, setAccountName] = useState<string>('Sukhram Thakur');

  // Processing & Slip State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [completedTx, setCompletedTx] = useState<WithdrawalTransaction | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<boolean>(false);

  // Daily claimable calculation from enabled auto-rules
  const dailyTotalRate = autoRules
    .filter(r => r.enabled)
    .reduce((sum, r) => sum + r.dailyRate, 0);

  const [dailyClaimed, setDailyClaimed] = useState<boolean>(false);

  const quickAmounts = [100, 500, 1000, 2000, withdrawableBalance > 0 ? withdrawableBalance : 5000];

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);

    if (!amt || amt <= 0) {
      setErrorMsg(language === 'hi' ? 'कृपया एक वैध राशि दर्ज करें।' : 'Please enter a valid amount.');
      return;
    }

    if (amt > withdrawableBalance) {
      setErrorMsg(
        language === 'hi'
          ? `आपके पास निकालने के लिए पर्याप्त बैलेंस नहीं है। वर्तमान बैलेंस: ${currencySymbol}${withdrawableBalance.toLocaleString('en-IN')}`
          : `Insufficient withdrawable balance. Current: ${currencySymbol}${withdrawableBalance.toLocaleString('en-IN')}`
      );
      return;
    }

    if (method === 'UPI' && !upiId.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपनी UPI ID दर्ज करें।' : 'Please enter your UPI ID.');
      return;
    }

    if (method === 'BANK' && (!accountNumber.trim() || !ifscCode.trim())) {
      setErrorMsg(language === 'hi' ? 'कृपया खाता संख्या और IFSC कोड दर्ज करें।' : 'Please enter account number and IFSC.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    // Realistic multi-stage verification flow
    setProcessingStep(language === 'hi' ? '1/3: बचत फंड का सत्यापन हो रहा है...' : '1/3: Verifying Auto-Saved Funds...');

    setTimeout(() => {
      setProcessingStep(language === 'hi' ? '2/3: NPCI / बैंकिंग गेटवे से कनेक्शन...' : '2/3: Connecting to Bank / UPI Switch...');
    }, 1100);

    setTimeout(() => {
      setProcessingStep(language === 'hi' ? '3/3: राशि आपके खाते में भेजी जा रही है...' : '3/3: Dispatching Cash Payout...');
    }, 2200);

    setTimeout(() => {
      setIsProcessing(false);

      const generatedUtr = 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000);
      const destinationLabel = method === 'UPI' 
        ? upiId.trim() 
        : method === 'BANK' 
        ? `A/C: ****${accountNumber.slice(-4) || '8492'} (${ifscCode})` 
        : 'Amazon Gift Card (Redeem Code)';

      const newTx: WithdrawalTransaction = {
        id: 'TX-' + Date.now().toString().slice(-6),
        amount: amt,
        method,
        destination: destinationLabel,
        date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESS',
        utrNumber: generatedUtr,
        recipientName: accountName || 'User',
      };

      onWithdraw(newTx);
      setCompletedTx(newTx);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 3200);
  };

  const handleClaimDailyAuto = () => {
    if (dailyClaimed || dailyTotalRate <= 0) return;
    setDailyClaimed(true);
    onClaimDailyAutoSavings(
      dailyTotalRate,
      language === 'hi' ? 'ऑटो-सिस्टम दैनिक बचत (Auto-Cut Cash)' : 'Auto-Savings Daily Credit'
    );
    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.65 } });
    } catch {}
  };

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-zinc-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              <ArrowDownCircle className="w-3.5 h-3.5" />
              {language === 'hi' ? 'सीधा बैंक / UPI निकासी गेटवे' : 'Instant Cashout & Withdrawal Gateway'}
            </div>
            
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-200">
              {language === 'hi' ? 'निकासी के लिए उपलब्ध बची हुई राशि' : 'Available for Direct Withdrawal'}
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
              <span>{currencySymbol} {withdrawableBalance.toLocaleString('en-IN')}</span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-300 uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                {language === 'hi' ? 'तुरंत विथड्रॉल योग्य' : 'Instant Payout'}
              </span>
            </h1>

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              {language === 'hi'
                ? 'यह वह पैसा है जो AI ने आपके खर्च कम करके और ऑटो-कटौती से बचाया है। इसे सीधे अपने UPI ID (GPay, PhonePe, Paytm) या बैंक खाते में ट्रांसफर करें।'
                : 'Cash unlocked from automated expense reduction, bill dispute refunds, and daily savings. Transfer instantly to your UPI or Bank Account.'}
            </p>
          </div>

          {/* Daily Auto-Saved Booster Claim Box */}
          <div className="w-full md:w-84 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                {language === 'hi' ? 'आज की ऑटो-बचत (Auto-Cut)' : "Today's Auto-Cut Cash"}
              </span>
              <span className="bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-md font-black text-[10px]">
                {language === 'hi' ? 'लाइव' : 'LIVE'}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-white">
                +{currencySymbol} {dailyTotalRate} <span className="text-xs text-zinc-300 font-normal">/{language === 'hi' ? 'दिन' : 'day'}</span>
              </div>
              <div className="text-[11px] text-emerald-200">
                {autoRules.filter(r => r.enabled).length} {language === 'hi' ? 'ऑटो-नियम चालू' : 'active rules'}
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 leading-snug">
              {language === 'hi'
                ? 'आपके सक्रिय खर्च-कटौती नियमों से आज का अनलॉक हुआ पैसा।'
                : 'Daily yield unlocked from your automated savings policies.'}
            </p>

            <button
              onClick={handleClaimDailyAuto}
              disabled={dailyClaimed || dailyTotalRate <= 0}
              className={`w-full py-2.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                dailyClaimed
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-amber-400 to-emerald-400 text-zinc-950 hover:brightness-105 active:scale-95'
              }`}
            >
              {dailyClaimed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{language === 'hi' ? 'आज की बचत जमा हो गई ✓' : 'Collected for Today ✓'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'hi' ? `आज के +${currencySymbol}${dailyTotalRate} बैलेंस में जोड़ें` : `Collect +${currencySymbol}${dailyTotalRate} Now`}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Main Withdrawal Box & Auto Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Withdrawal Form & Success Receipt (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Withdrawal Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 flex items-center gap-2">
                  <SendHorizontal className="w-5 h-5 text-emerald-600" />
                  {language === 'hi' ? 'पैसे निकालें (Withdrawal Request)' : 'Request Cash Withdrawal'}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {language === 'hi' ? '2 मिनट में UPI / बैंक खाते में क्रेडिट' : 'Instant payout via UPI / IMPS'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span>NPCI / IMPS 256-bit</span>
              </div>
            </div>

            {/* Method Tabs (UPI, Bank, Voucher) */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-zinc-100 rounded-2xl">
              <button
                type="button"
                id="method-upi-btn"
                onClick={() => { setMethod('UPI'); setCompletedTx(null); }}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'UPI'
                    ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>UPI (GPay/Paytm)</span>
              </button>

              <button
                type="button"
                id="method-bank-btn"
                onClick={() => { setMethod('BANK'); setCompletedTx(null); }}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'BANK'
                    ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'बैंक खाता' : 'Bank Transfer'}</span>
              </button>

              <button
                type="button"
                id="method-voucher-btn"
                onClick={() => { setMethod('VOUCHER'); setCompletedTx(null); }}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'VOUCHER'
                    ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Amazon Gift Card</span>
              </button>
            </div>

            {/* Withdrawal Form */}
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              
              {/* Amount Input & Quick Chips */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  {language === 'hi' ? `निकासी राशि (${currencySymbol})` : `Withdrawal Amount (${currencySymbol})`} *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-extrabold text-base">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    id="withdrawal-amount-input"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="500"
                    className="w-full pl-9 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-base font-black text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Quick Amount Chips */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setWithdrawAmount(q.toString())}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        Number(withdrawAmount) === q
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {currencySymbol}{q.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Inputs based on Method */}
              {method === 'UPI' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      {language === 'hi' ? 'अपनी UPI ID दर्ज करें' : 'Enter Your UPI ID'} *
                    </label>
                    <input
                      type="text"
                      id="withdrawal-upi-input"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                      required
                    />
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-500 font-medium">
                      <span>{language === 'hi' ? 'समर्थित:' : 'Supported:'}</span>
                      <span className="font-semibold text-zinc-700">Google Pay • PhonePe • Paytm • BHIM • Cred</span>
                    </div>
                  </div>
                </div>
              )}

              {method === 'BANK' && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        {language === 'hi' ? 'बैंक खाता संख्या (Account No.)' : 'Bank Account Number'} *
                      </label>
                      <input
                        type="password"
                        id="withdrawal-account-input"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="e.g. 50100234589211"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        {language === 'hi' ? 'IFSC कोड' : 'IFSC Code'} *
                      </label>
                      <input
                        type="text"
                        id="withdrawal-ifsc-input"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="HDFC0001234"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 uppercase"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      {language === 'hi' ? 'खाताधारक का नाम' : 'Account Holder Name'}
                    </label>
                    <input
                      type="text"
                      id="withdrawal-name-input"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Sukhram Thakur"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm font-semibold text-zinc-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {method === 'VOUCHER' && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span>{language === 'hi' ? 'इंस्टेंट अमेज़न गिफ्ट वाउचर कोड' : 'Instant Amazon Gift Voucher'}</span>
                  </div>
                  <p>
                    {language === 'hi'
                      ? 'निकासी कन्फर्म होते ही आपको 16-अंकों का अमेज़न पे गिफ्ट वाउचर कोड तुरंत रसीद में मिलेगा।'
                      : 'You will receive an instant 16-digit voucher redeem code immediately upon withdrawal.'}
                  </p>
                </div>
              )}

              {/* Error Box */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                id="submit-withdrawal-btn"
                disabled={isProcessing || withdrawableBalance <= 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-base shadow-lg shadow-emerald-700/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{processingStep}</span>
                  </div>
                ) : (
                  <>
                    <SendHorizontal className="w-5 h-5 text-emerald-200" />
                    <span>
                      {language === 'hi'
                        ? `💸 ${currencySymbol}${withdrawAmount || '0'} खाते में निकालें (Withdraw Cash)`
                        : `💸 Withdraw ${currencySymbol}${withdrawAmount || '0'} Now`}
                    </span>
                  </>
                )}
              </button>

            </form>

          </div>

          {/* SUCCESSFUL WITHDRAWAL SLIP / RECEIPT (Shown on success) */}
          {completedTx && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 shadow-xl space-y-6 animate-scaleUp">
              
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      {language === 'hi' ? 'निकासी सफल (Payout Successful)' : 'Withdrawal Successful'}
                    </span>
                    <h3 className="text-xl font-black text-zinc-900">
                      {currencySymbol} {completedTx.amount.toLocaleString('en-IN')} {language === 'hi' ? 'ट्रांसफर हो गए' : 'Transferred'}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-zinc-400">STATUS</div>
                  <div className="bg-emerald-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full inline-block">
                    COMPLETED
                  </div>
                </div>
              </div>

              {/* Transaction Receipt Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-zinc-400 font-semibold">{language === 'hi' ? 'लेनदेन आईडी (Tx ID)' : 'Transaction ID'}</div>
                  <div className="font-bold text-zinc-900 font-mono mt-0.5">{completedTx.id}</div>
                </div>

                <div>
                  <div className="text-zinc-400 font-semibold">{language === 'hi' ? 'तारीख व समय' : 'Date & Time'}</div>
                  <div className="font-bold text-zinc-900 mt-0.5">{completedTx.date}</div>
                </div>

                <div>
                  <div className="text-zinc-400 font-semibold">{language === 'hi' ? 'माध्यम' : 'Method'}</div>
                  <div className="font-bold text-zinc-900 mt-0.5">{completedTx.method}</div>
                </div>

                <div className="col-span-2 sm:col-span-2">
                  <div className="text-zinc-400 font-semibold">{language === 'hi' ? 'डेस्टिनेशन (UPI/खाता)' : 'Destination'}</div>
                  <div className="font-bold text-emerald-800 font-mono mt-0.5">{completedTx.destination}</div>
                </div>

                <div>
                  <div className="text-zinc-400 font-semibold">UTR Reference No.</div>
                  <div className="flex items-center gap-1 font-bold text-zinc-900 font-mono mt-0.5">
                    <span>{completedTx.utrNumber}</span>
                    <button
                      onClick={() => handleCopyUtr(completedTx.utrNumber)}
                      className="text-zinc-400 hover:text-zinc-700"
                      title="Copy UTR"
                    >
                      {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {completedTx.method === 'VOUCHER' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl font-mono text-center text-xs font-bold text-amber-950">
                  🎁 Amazon Code: AMZN-SAV-{Math.floor(1000 + Math.random() * 9000)}-{Math.floor(1000 + Math.random() * 9000)}
                </div>
              )}

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950 font-medium">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {language === 'hi' ? 'राशि आपके खाते में 2 मिनट के भीतर दिख जाएगी।' : 'Funds will reflect in your account within 2 minutes.'}
                </span>
                <span className="font-bold text-emerald-800">100% Verified</span>
              </div>

            </div>
          )}

        </div>

        {/* Right Col: Auto-Expense Cutter Rules & Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Auto Savings Engine Switchboard */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-zinc-900 text-base">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>{language === 'hi' ? 'ऑटो-कटौती नियम (पैसा खुद कम हो)' : 'Auto-Savings Policy Rules'}</span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                AI Autopilot
              </span>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              {language === 'hi'
                ? 'इन ऑटोमैटिक नियमों को ऑन रखें। AI आपके बिलों व खर्चों को बैकग्राउंड में खुद कम करके दैनिक बचत निकासी खाते में जोड़ता रहेगा।'
                : 'Keep these automated rules active. BachatAI automatically trims hidden fees and credits daily savings to your withdrawable wallet.'}
            </p>

            {/* Rules List */}
            <div className="space-y-3 pt-2">
              {autoRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    rule.enabled
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-zinc-50 border-zinc-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-zinc-900">
                        {language === 'hi' ? rule.titleHi : rule.titleEn}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {language === 'hi' ? rule.descriptionHi : rule.descriptionEn}
                      </div>
                      <div className="text-xs font-black text-emerald-700 mt-2">
                        +{currencySymbol}{rule.dailyRate}/{language === 'hi' ? 'दिन' : 'day'}{' '}
                        <span className="text-zinc-400 font-normal">
                          (~{currencySymbol}{rule.monthlyImpact}/{language === 'hi' ? 'माह' : 'mo'})
                        </span>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => onToggleAutoRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        rule.enabled ? 'bg-emerald-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          rule.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Withdrawal History Card */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-zinc-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>{language === 'hi' ? 'निकासी का इतिहास (Payout Log)' : 'Withdrawal History'}</span>
              </h3>
              <span className="text-xs font-bold text-zinc-400">
                {withdrawalHistory.length} {language === 'hi' ? 'ट्रांजेक्शन' : 'txns'}
              </span>
            </div>

            <div className="divide-y divide-zinc-100 max-h-64 overflow-y-auto pr-1">
              {withdrawalHistory.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-400">
                  {language === 'hi' ? 'अभी तक कोई निकासी नहीं की गई है।' : 'No withdrawals made yet.'}
                </div>
              ) : (
                withdrawalHistory.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-zinc-900">
                        {currencySymbol} {tx.amount.toLocaleString('en-IN')} → {tx.destination}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {tx.date} • {tx.utrNumber}
                      </div>
                    </div>
                    <span className="shrink-0 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                      SUCCESS ✓
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
