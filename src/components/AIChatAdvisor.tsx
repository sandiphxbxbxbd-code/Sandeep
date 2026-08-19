import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle,
  TrendingDown,
  Coins
} from 'lucide-react';
import { Language, Currency, ChatMessage } from '../types';

interface AIChatAdvisorProps {
  language: Language;
  currency: Currency;
  savedVaultAmount: number;
}

export const AIChatAdvisor: React.FC<AIChatAdvisorProps> = ({
  language,
  currency,
  savedVaultAmount
}) => {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const defaultGreeting: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: language === 'hi'
      ? `नमस्ते! मैं आपका BachatAI (बचत AI) फाइनेंशियल असिस्टेंट हूँ। 💰\n\nमेरा काम आपके गैर-जरूरी खर्चों को कम करके आपकी जेब में पैसे बचाना है।\n\nआप मुझसे किसी भी बिल को कम करने, सस्ते विकल्प ढूंढने, या पैसे बचाने के तरीकों पर सीधे सवाल पूछ सकते हैं!`
      : `Hello! I am your BachatAI Financial Assistant. 💰\n\nMy only mission is to cut your unnecessary expenses, eliminate money leaks, and put hard cash back into your pocket.\n\nAsk me anything about lowering utility bills, finding cheaper plans, cutting food delivery costs, or negotiating subscriptions!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultGreeting]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    {
      hi: '⚡ बिजली का बिल 25% कम कैसे करें?',
      en: '⚡ How to cut electric bill by 25%?'
    },
    {
      hi: '🍔 Swiggy और Zomato का खर्च आधा कैसे करें?',
      en: '🍔 How to halve food delivery spend?'
    },
    {
      hi: '📺 Netflix और Prime का खर्च कैसे बचाएं?',
      en: '📺 How to save on OTT & streaming?'
    },
    {
      hi: '💡 सैलरी में से हर महीने ₹5,000 कैसे बचाएं?',
      en: '💡 Step-by-step plan to save ₹5k/mo'
    }
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userContext: {
            currency,
            savedVaultAmount,
          },
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'मैं आपकी कैसे सहायता कर सकता हूँ?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorBotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'hi'
          ? 'माफ़ कीजिए, AI सर्वर से जुड़ने में कोई समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Sorry, encountered an error contacting AI service. Please retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-zinc-950 flex items-center justify-center font-black">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              {language === 'hi' ? '24/7 AI वित्तीय बचत सलाहकार' : '24/7 AI Expense Cutter Chat'}
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              {language === 'hi' ? 'BachatAI से पूछें: पैसे कैसे बचाएं?' : 'Ask BachatAI: How to Cut Expenses'}
            </h1>
          </div>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(language === 'hi' ? q.hi : q.en)}
              className="text-xs bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/10 px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer"
            >
              {language === 'hi' ? q.hi : q.en}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                    isBot
                      ? 'bg-zinc-50 border border-zinc-200 text-zinc-900'
                      : 'bg-emerald-700 text-white font-medium rounded-br-xs'
                  }`}
                >
                  {msg.content}
                  <div className={`text-[10px] mt-2 ${isBot ? 'text-zinc-400' : 'text-emerald-200'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-4 text-xs text-zinc-500 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>{language === 'hi' ? 'BachatAI जवाब सोच रहा है...' : 'BachatAI is thinking...'}</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-zinc-50 border-t border-zinc-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'hi' ? 'पूछें (उदा. मेरा वाईफाई बिल ₹1200 है, कम कैसे करें?)...' : 'Ask anything (e.g. How to reduce broadband bill?)...'}
              className="flex-1 px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
