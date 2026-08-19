import React, { useState } from 'react';
import { 
  HandCoins, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Layers, 
  Flame, 
  ShieldCheck, 
  Tag, 
  MessageSquareQuote
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Currency, NegotiationResult } from '../types';

interface NegotiateToolProps {
  language: Language;
  currency: Currency;
  onAddSavingsToVault: (amount: number, reason: string) => void;
}

const PRESET_NEGOTIATIONS = [
  { name: 'Jio / Airtel Fiber वाईफाई बिल', currentPrice: 999, category: 'Broadband / Internet' },
  { name: 'Gym / फिटनेस मेंबरशिप फीस', currentPrice: 2000, category: 'Health & Fitness' },
  { name: 'क्रेडिट कार्ड एनुअल फीस (Annual Fee Waiver)', currentPrice: 1500, category: 'Banking / Cards' },
  { name: 'कार या बाइक इंश्योरेंस रिन्यूअल', currentPrice: 8500, category: 'Insurance' },
  { name: 'OTT सब्सक्रिप्शन (Netflix / Prime)', currentPrice: 649, category: 'Entertainment' },
  { name: 'लैपटॉप या नया स्मार्टफोन खरीद', currentPrice: 45000, category: 'Electronics' },
];

export const NegotiateTool: React.FC<NegotiateToolProps> = ({
  language,
  currency,
  onAddSavingsToVault
}) => {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const [itemName, setItemName] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('Service / Subscription');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [claimed, setClaimed] = useState(false);

  const handleSelectPreset = (preset: typeof PRESET_NEGOTIATIONS[0]) => {
    setItemName(preset.name);
    setCurrentPrice(preset.currentPrice.toString());
    setCategory(preset.category);
    setResult(null);
  };

  const handleNegotiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setClaimed(false);

    try {
      const response = await fetch('/api/negotiate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName,
          currentPrice: Number(currentPrice) || undefined,
          provider,
          category,
          currency,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate negotiation strategy');
      }

      setResult(data.data);
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const handleClaimSavings = () => {
    if (!result || claimed) return;
    setClaimed(true);
    onAddSavingsToVault(result.potentialSavings || 500, `Negotiation: ${result.itemName}`);
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
    } catch {}
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-4">
            <HandCoins className="w-3.5 h-3.5" />
            {language === 'hi' ? 'दाम घटाने व डिस्काउंट पाने का AI टूल' : 'AI Price Drop & Deal Negotiator'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {language === 'hi'
              ? 'किसी भी सर्विस, बिल या सामान का दाम कम करवाएं'
              : 'Negotiate Any Bill, Subscription or Price Down with AI'}
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            {language === 'hi'
              ? 'ब्रॉडबैंड, जिम, क्रेडिट कार्ड फीस, इंश्योरेंस या किसी भी खरीद का नाम डालें। AI तुरंत 3 कॉपी-पेस्ट नेगोशिएशन मैसेज, सस्ते विकल्प और सीक्रेट छूट कोड देगा।'
              : 'Enter any expense, service, or gadget purchase. Get 3 custom copy-paste negotiation scripts, competitor price-matching tactics, and cheaper alternatives.'}
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-xs text-teal-300 font-semibold mb-3">
            {language === 'hi' ? '⚡ लोकप्रिय नेगोशिएशन टेम्प्लेट (क्लिक करें):' : '⚡ Popular Negotiation Presets:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_NEGOTIATIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="text-xs bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/10 px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer"
              >
                {preset.name} ({currencySymbol}{preset.currentPrice})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
        <form onSubmit={handleNegotiate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                {language === 'hi' ? 'सर्विस या आइटम का नाम' : 'Item / Service Name'} *
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. JioFiber 999 प्लान, Cult.fit जिम' : 'e.g. Airtel Broadband, Gold Gym'}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                {language === 'hi' ? `वर्तमान कीमत (${currencySymbol})` : `Current Price (${currencySymbol})`}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  placeholder="999"
                  className="w-full pl-8 pr-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                {language === 'hi' ? 'कंपनी / प्रोवाइडर का नाम' : 'Provider / Brand (Optional)'}
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. Airtel, HDFC, Amazon' : 'e.g. Airtel, Netflix, HDFC'}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={isLoading || !itemName.trim()}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-800/20 transition-all cursor-pointer hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{language === 'hi' ? 'AI डिस्काउंट व नेगोशिएशन रणनीति बना रहा है...' : 'Crafting Negotiation Tactics...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>{language === 'hi' ? 'पैसे कम करने की रणनीति व मैसेज पाएं' : 'Generate Discount Script & Cheaper Options'}</span>
                <ArrowRight className="w-5 h-5 text-emerald-200" />
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Result View */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Savings Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                {language === 'hi' ? 'अनुमानित बचत क्षमता' : 'Target Savings'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                ~{result.estimatedDiscountPercent}% {language === 'hi' ? 'तक दाम घट सकता है' : 'Discount Possible'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                {language === 'hi' ? 'संभावित बचत:' : 'Estimated Cash Saved:'}{' '}
                <span className="font-extrabold text-white text-base">
                  {currencySymbol} {result.potentialSavings}
                </span>
              </p>
            </div>

            <button
              onClick={handleClaimSavings}
              disabled={claimed}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shrink-0 shadow-md ${
                claimed
                  ? 'bg-white text-emerald-800 cursor-default'
                  : 'bg-zinc-950 text-white hover:bg-zinc-900 active:scale-95'
              }`}
            >
              {claimed ? (
                <>✓ {language === 'hi' ? 'गुल्लक में जुड़ गया' : 'Added to Vault'}</>
              ) : (
                <>+ {language === 'hi' ? 'यह बचत गुल्लक में जोड़ें' : 'Save this to My Vault'}</>
              )}
            </button>
          </div>

          {/* Negotiation Scripts (3 Tones) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-extrabold text-lg">
              <MessageSquareQuote className="w-5 h-5 text-teal-600" />
              <span>
                {language === 'hi' ? '📋 कॉपी-पेस्ट नेगोशिएशन मैसेज (Customer Care/Support को भेजें)' : '📋 Copy-Ready Negotiation Messages'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.negotiationScripts.map((item, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-400 transition-colors">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200">
                        {item.tone}
                      </span>
                      <button
                        onClick={() => handleCopy(item.script, idx)}
                        className="p-1.5 text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="text-[11px] text-zinc-500 font-medium mt-2">
                      <span className="font-bold">{language === 'hi' ? 'कब उपयोग करें:' : 'Best For:'}</span> {item.bestFor}
                    </div>
                    <div className="text-xs text-zinc-800 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100 mt-3 leading-relaxed select-all">
                      "{item.script}"
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item.script, idx)}
                    className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'hi' ? 'कॉपी हो गया ✓' : 'Copied ✓'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'मैसेज कॉपी करें' : 'Copy Script'}</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cheaper Alternatives */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 font-extrabold text-lg">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>
                  {language === 'hi' ? '💡 सस्ते और बेहतर विकल्प (Cheaper Alternatives)' : '💡 Cheaper Alternatives'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.alternatives.map((alt, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="font-bold text-sm text-zinc-900">
                      {alt.name}
                    </div>
                    <div className="text-xs font-extrabold text-emerald-700">
                      {language === 'hi' ? 'लागत:' : 'Cost:'} {alt.estimatedCost}
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {alt.pros}
                    </p>
                    {alt.howToSwitch && (
                      <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-200">
                        <span className="font-semibold text-zinc-700">{language === 'hi' ? 'स्विच कैसे करें:' : 'How to switch:'}</span> {alt.howToSwitch}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insider Tricks */}
          {result.insiderTricks && result.insiderTricks.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
                <Tag className="w-4 h-4 text-amber-700" />
                <span>{language === 'hi' ? '🔐 सीक्रेट डिस्काउंट व कैशबैक ट्रिक्स' : '🔐 Insider Discount & Cashback Hacks'}</span>
              </div>
              <ul className="space-y-2">
                {result.insiderTricks.map((trick, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-amber-950 flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{trick}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
