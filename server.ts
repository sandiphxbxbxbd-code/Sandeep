import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy GoogleGenAI initialization
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Audit Expenses & Generate Reduction Plan
app.post('/api/audit-expenses', async (req, res) => {
  try {
    const { expenses, income, currency = 'INR', language = 'hi', notes = '' } = req.body;

    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ error: 'Please provide a list of expenses.' });
    }

    const ai = getGenAI();

    const prompt = `You are an expert AI Money Saver & Expense Reduction Genius (बचत और खर्च कम करने वाला AI एक्सपर्ट).
Your mission is to find every single way to CUT DOWN expenses, stop money leaks, eliminate hidden wastage, negotiate lower rates, switch to cheaper alternatives, and return hard cash into the user's pocket ("पैसे कम करके यूजर को बचा कर दें").

User Financial Profile:
- Monthly Income: ${income ? `${currency} ${income}` : 'Not specified'}
- Preferred Output Language: ${language === 'hi' ? 'Hindi with easy English financial terms (Hinglish/Hindi)' : 'English'}
- Currency: ${currency}
- Additional Context/Habits: ${notes || 'Standard household / personal expenses'}
- Current Expenses List:
${JSON.stringify(expenses, null, 2)}

Provide a detailed, ruthless but realistic money-saving analysis in JSON format.
Calculate exact projected monthly savings, 1-year savings forecast, category-wise breakdown, high-priority cuts (urgent leaks), smart reduction alternatives, and ready-to-use negotiation/cancellation scripts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'An encouraging summary headline explaining total potential savings and financial health score.',
            },
            currentTotal: {
              type: Type.NUMBER,
              description: 'Total sum of current expenses',
            },
            optimizedTotal: {
              type: Type.NUMBER,
              description: 'Optimized total expenses after implementing AI cuts',
            },
            totalMonthlySavings: {
              type: Type.NUMBER,
              description: 'Exact amount saved per month',
            },
            totalYearlySavings: {
              type: Type.NUMBER,
              description: 'Projected savings over 12 months',
            },
            financialHealthScore: {
              type: Type.NUMBER,
              description: 'Health score from 1 to 100 based on expense efficiency',
            },
            keyLeaks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  itemName: { type: Type.STRING },
                  currentAmount: { type: Type.NUMBER },
                  suggestedAmount: { type: Type.NUMBER },
                  monthlySavings: { type: Type.NUMBER },
                  urgency: { type: Type.STRING, description: 'High, Medium, or Low' },
                  leakReason: { type: Type.STRING, description: 'Why this is leaking money' },
                  solution: { type: Type.STRING, description: 'Exact step-by-step action to reduce or cut this' },
                  negotiationScript: { type: Type.STRING, description: 'Sample message or script to negotiate or cancel if applicable' }
                },
                required: ['category', 'itemName', 'currentAmount', 'suggestedAmount', 'monthlySavings', 'solution']
              }
            },
            quickWins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  instantSavings: { type: Type.NUMBER },
                  timeToExecute: { type: Type.STRING, description: 'e.g. 5 minutes, 1 hour' },
                  instructions: { type: Type.STRING }
                },
                required: ['title', 'instantSavings', 'instructions']
              }
            },
            smartHabits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-5 behavioral tricks to keep expenses down without sacrificing quality of life'
            }
          },
          required: ['summary', 'currentTotal', 'optimizedTotal', 'totalMonthlySavings', 'totalYearlySavings', 'financialHealthScore', 'keyLeaks', 'quickWins', 'smartHabits']
        }
      }
    });

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/audit-expenses:', error);
    res.status(500).json({
      error: error.message || 'Failed to audit expenses. Please check your inputs or try again.'
    });
  }
});

// 2. Negotiate Price & Find Cheaper Alternatives
app.post('/api/negotiate-price', async (req, res) => {
  try {
    const { itemName, currentPrice, provider = '', category = 'service', currency = 'INR', language = 'hi' } = req.body;

    if (!itemName) {
      return res.status(400).json({ error: 'Please provide an item or service name.' });
    }

    const ai = getGenAI();

    const prompt = `You are an expert consumer advocate, discount negotiator, and deal finder.
The user wants to reduce the price or find cheaper alternatives for:
- Item/Service: ${itemName}
- Current Cost/Fee: ${currency} ${currentPrice || 'Unknown'}
- Provider/Brand: ${provider || 'General'}
- Category: ${category}
- Language: ${language === 'hi' ? 'Hindi with English terms' : 'English'}

Provide:
1. Realistic target price you can negotiate down to.
2. 3 ready-to-copy negotiation messages (Polite/Diplomatic, Competitor-Price-Match, Retention/Threaten-to-Cancel).
3. 3 Cheaper alternative brands/services or DIY hacks that provide the same or better value.
4. Secret promo code/cashback/timing tricks to save maximum cash.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            estimatedDiscountPercent: { type: Type.NUMBER },
            potentialSavings: { type: Type.NUMBER },
            negotiationScripts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tone: { type: Type.STRING, description: 'e.g. Polite Loyalty Discount, Competitor Match, Cancellation/Retention Script' },
                  script: { type: Type.STRING, description: 'Exact copy-paste text to send in chat, email, or call script' },
                  bestFor: { type: Type.STRING, description: 'When to use this script' }
                },
                required: ['tone', 'script', 'bestFor']
              }
            },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  pros: { type: Type.STRING },
                  howToSwitch: { type: Type.STRING }
                },
                required: ['name', 'estimatedCost', 'pros']
              }
            },
            insiderTricks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['itemName', 'estimatedDiscountPercent', 'potentialSavings', 'negotiationScripts', 'alternatives', 'insiderTricks']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/negotiate-price:', error);
    res.status(500).json({ error: error.message || 'Failed to generate negotiation strategy.' });
  }
});

// 3. Scan Bill / Receipt (Text or Image)
app.post('/api/analyze-bill', async (req, res) => {
  try {
    const { billText, imageBase64, mimeType = 'image/jpeg', currency = 'INR', language = 'hi' } = req.body;

    if (!billText && !imageBase64) {
      return res.status(400).json({ error: 'Please provide bill text or an image.' });
    }

    const ai = getGenAI();
    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }

    const textPrompt = `Analyze this bill/receipt/invoice. Extract all items, detect hidden taxes/surcharges/overcharging/unnecessary add-ons, and tell the user specifically how to reduce this bill next time and claim refunds/discounts.
Bill context: ${billText || 'Uploaded Bill Image'}
Output Language: ${language === 'hi' ? 'Hindi with English financial terms' : 'English'}
Currency: ${currency}`;

    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchantName: { type: Type.STRING },
            billDate: { type: Type.STRING },
            totalAmount: { type: Type.NUMBER },
            potentialWastage: { type: Type.NUMBER, description: 'Amount spent on unnecessary items or inflated charges' },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  isEssential: { type: Type.BOOLEAN },
                  cutRecommendation: { type: Type.STRING }
                },
                required: ['name', 'price', 'isEssential']
              }
            },
            detectedSurcharges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Hidden fees, service charges that could be waived, inflated delivery or tech fees'
            },
            actionStepsToCutBill: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['merchantName', 'totalAmount', 'potentialWastage', 'items', 'detectedSurcharges', 'actionStepsToCutBill']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/analyze-bill:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze bill.' });
  }
});

// 4. Financial Advisor Chat for Expense Cutting & Savings
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userContext, language = 'hi', currency = 'INR' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getGenAI();

    const systemInstruction = `You are "BachatAI" (बचत AI), a friendly, highly intelligent, money-saving financial strategist.
Your single goal is to help the user cut expenses, save maximum money ("पैसे कम करना और जेब में पैसे बचाकर देना"), find deals, stop unnecessary subscriptions, negotiate bills, and increase monthly net savings.
Always reply in ${language === 'hi' ? 'clear Hindi mixed naturally with English financial terms (Hinglish/Hindi)' : 'English'}.
Keep advice practical, actionable with concrete rupee/currency numbers and exact step-by-step guidance.
User context: ${JSON.stringify(userContext || {})}`;

    // Format chat history
    const contents: any[] = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction,
      }
    });

    res.json({ success: true, reply: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: error.message || 'Chat service encountered an error.' });
  }
});

// 5. Daily Money Saving Hacks & Instant Cashback / Passive Growth
app.post('/api/daily-hacks', async (req, res) => {
  try {
    const { category = 'all', currency = 'INR', language = 'hi' } = req.body;
    const ai = getGenAI();

    const prompt = `Generate 6 high-impact, practical, proven money-saving hacks and expense cutter strategies for ${category} category in India/Global.
Language: ${language === 'hi' ? 'Hindi / Hinglish' : 'English'}
Currency: ${currency}
Focus on real actionable tricks: UPI cashbacks, grocery bulk timing, electricity unit saving, OTT subscription sharing, insurance comparison, telecom plan downgrades, credit card rewards.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              estimatedMonthlySaving: { type: Type.NUMBER },
              difficulty: { type: Type.STRING, description: 'Easy, Medium, Hard' },
              description: { type: Type.STRING },
              actionStep: { type: Type.STRING }
            },
            required: ['id', 'title', 'category', 'estimatedMonthlySaving', 'difficulty', 'description', 'actionStep']
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/daily-hacks:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch daily hacks.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BachatAI Server running on port ${PORT}`);
  });
}

startServer();
