import React, { useState } from 'react';
import { 
  Receipt, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Currency, BillAnalysis } from '../types';

interface BillScannerProps {
  language: Language;
  currency: Currency;
  onAddSavingsToVault: (amount: number, reason: string) => void;
}

const SAMPLE_BILLS = [
  {
    titleHi: '🍕 रेस्टोरेंट डिनर बिल (सर्विस चार्ज व वाटर मार्कअप)',
    titleEn: '🍕 Restaurant Dinner Bill (Service Charge & Markup)',
    text: `THE ROYAL BISTRO
Date: 15-Aug-2026
1x Paneer Butter Masala: ₹380
2x Butter Naan: ₹140
1x Mocktail Blue Lagoon: ₹220
1x Mineral Water (MRP 20): ₹65 (Markup)
Subtotal: ₹805
Service Charge (10%): ₹80.50
CGST (2.5%): ₹22.14
SGST (2.5%): ₹22.14
Total Amount: ₹930.00`
  },
  {
    titleHi: '🛵 स्विगी/जोमैटो फूड डिलीवरी आर्डर बिल',
    titleEn: '🛵 Food Delivery App Receipt (Fees & Surge)',
    text: `Zomato Order Receipt
Restaurant: Biryani Express
1x Chicken Biryani: ₹360 (In-store price ₹280)
1x Extra Raita: ₹50
Item Total: ₹410
Delivery Fee: ₹65
Platform Fee: ₹10
Rain Surge Surcharge: ₹35
Restaurant Packaging Charge: ₹40
GST on Restaurant: ₹20.50
GST on Delivery: ₹11.70
Total Paid: ₹592.20`
  },
  {
    titleHi: '💡 बिजली बिल (Electricity Bill - Peak Tariff)',
    titleEn: '💡 Electricity Utility Bill (Peak Charges)',
    text: `State Power Distribution Ltd
Consumer No: 99482710
Billing Period: July 2026
Units Consumed: 480 kWh (Peak tariff applied on 210 units)
Energy Charges: ₹3,840
Fixed Demand Charges: ₹450
Power Factor Surcharge: ₹180
Fuel Surcharge Adjustment (FSA): ₹340
Electricity Duty: ₹240
Total Amount Payable: ₹5,050.00`
  }
];

export const BillScanner: React.FC<BillScannerProps> = ({
  language,
  currency,
  onAddSavingsToVault
}) => {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const [billText, setBillText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BillAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleText: string) => {
    setBillText(sampleText);
    setImageBase64(null);
    setImagePreview(null);
    setAnalysis(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billText.trim() && !imageBase64) return;

    setIsLoading(true);
    setErrorMsg(null);
    setClaimed(false);

    try {
      const response = await fetch('/api/analyze-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billText: billText.trim(),
          imageBase64: imageBase64 || undefined,
          currency,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze bill');
      }

      setAnalysis(data.data);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Error scanning bill');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = () => {
    if (!analysis || claimed) return;
    setClaimed(true);
    onAddSavingsToVault(analysis.potentialWastage || 150, `Bill Audit: ${analysis.merchantName}`);
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
            <Receipt className="w-3.5 h-3.5" />
            {language === 'hi' ? 'AI बिल व रसीद ऑडिटर' : 'AI Bill & Receipt Overcharge Detector'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {language === 'hi'
              ? 'बिल की फोटो या टेक्स्ट डालें, छिपे हुए चार्ज पकड़कर पैसे बचाएं'
              : 'Scan Any Bill to Spot Overcharging & Hidden Fees'}
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            {language === 'hi'
              ? 'रेस्टोरेंट, स्विगी, बिजली या अस्पताल के बिल में अनचाहे सर्विस चार्ज, पैकेजिंग फीस और महंगे आइटम्स को AI तुरंत पकड़कर आपको अगली बार 15-30% बचाने की तरकीब देता है।'
              : 'Paste or upload receipts from restaurants, food delivery, utilities, or shopping. AI flags unlawful service charges, markups, and actionable cuts.'}
          </p>
        </div>

        {/* Sample Bills */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-xs text-emerald-300 font-semibold mb-3">
            {language === 'hi' ? '📄 टेस्ट करने के लिए सैंपल बिल चुनें (1-Click Try):' : '📄 Try a Sample Bill Receipt:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_BILLS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample.text)}
                className="text-xs bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/10 px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer"
              >
                {language === 'hi' ? sample.titleHi : sample.titleEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
        <form onSubmit={handleAnalyze} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bill Text Box */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2 flex items-center justify-between">
                <span>{language === 'hi' ? 'बिल का टेक्स्ट या लाइन-आइटम्स पेस्ट करें' : 'Paste Bill Text / Breakdown'}</span>
                <span className="text-[11px] font-normal text-zinc-400">{language === 'hi' ? '(या फोटो अपलोड करें)' : '(or upload photo)'}</span>
              </label>
              <textarea
                rows={8}
                value={billText}
                onChange={(e) => setBillText(e.target.value)}
                placeholder={language === 'hi' 
                  ? 'उदा. 1x पिज्जा ₹450, डिलीवरी फीस ₹60, सर्विस चार्ज ₹50, कुल ₹560...' 
                  : 'e.g. 1x Pizza $18, Delivery Fee $5, Service Fee $3, Total $26...'}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-mono text-zinc-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Photo Upload Box */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2">
                {language === 'hi' ? 'या बिल की रसीद फोटो अपलोड करें' : 'Or Upload Receipt Photo'}
              </label>
              
              <div className="border-2 border-dashed border-zinc-200 hover:border-emerald-500 bg-zinc-50/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative min-h-[190px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Receipt preview" className="max-h-32 object-contain rounded-lg mx-auto" />
                    <p className="text-xs font-bold text-emerald-700">{language === 'hi' ? 'फोटो अपलोड हो गई ✓' : 'Image ready ✓'}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-zinc-800">
                      {language === 'hi' ? 'फोटो चुनें या ड्रैग करें' : 'Click to Upload or Drag Receipt'}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      PNG, JPG, JPEG (Max 10MB)
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={isLoading || (!billText.trim() && !imageBase64)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/20 transition-all cursor-pointer hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{language === 'hi' ? 'AI बिल स्कैन कर अनचाहे चार्ज ढूंढ रहा है...' : 'Scanning Bill for Overcharges...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>{language === 'hi' ? '⚡ बिल का विश्लेषण करें और बचत जानें' : '⚡ Analyze Bill & Detect Overcharges'}</span>
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

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Card */}
          <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                {analysis.merchantName || 'Merchant Bill'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                {currencySymbol} {analysis.potentialWastage} {language === 'hi' ? 'अनावश्यक खर्च पकड़ा गया' : 'Potential Overcharge Detected'}
              </h2>
              <p className="text-xs text-emerald-100 mt-1">
                {language === 'hi' ? 'कुल बिल राशि:' : 'Total Bill Paid:'} {currencySymbol} {analysis.totalAmount}
              </p>
            </div>

            <button
              onClick={handleClaim}
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
                <>+ {language === 'hi' ? 'यह बची रकम गुल्लक में जोड़ें' : 'Save this to Vault'}</>
              )}
            </button>
          </div>

          {/* Surcharges & Flags */}
          {analysis.detectedSurcharges && analysis.detectedSurcharges.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>{language === 'hi' ? '⚠️ पकड़े गए अनावश्यक या छिपे हुए चार्ज:' : '⚠️ Detected Surcharges & Questionable Fees:'}</span>
              </div>
              <ul className="space-y-2">
                {analysis.detectedSurcharges.map((surcharge, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-rose-950 flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{surcharge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Steps to Cut Bill Next Time */}
          {analysis.actionStepsToCutBill && analysis.actionStepsToCutBill.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 font-extrabold text-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>
                  {language === 'hi' ? '💡 अगली बार इस बिल को 20-30% कम करने का तरीका' : '💡 How to Cut This Bill by 20-30% Next Time'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {analysis.actionStepsToCutBill.map((step, idx) => (
                  <div key={idx} className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                      {step}
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
