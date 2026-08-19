export type Language = 'hi' | 'en';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface ExpenseItem {
  id: string;
  name: string;
  category: 'Housing' | 'Utilities' | 'Food & Groceries' | 'Subscriptions' | 'Transport' | 'Shopping' | 'Entertainment' | 'Healthcare' | 'Other';
  amount: number;
  frequency: 'monthly' | 'yearly';
  necessity?: 'essential' | 'discretionary' | 'luxury';
}

export interface KeyLeak {
  category: string;
  itemName: string;
  currentAmount: number;
  suggestedAmount: number;
  monthlySavings: number;
  urgency: 'High' | 'Medium' | 'Low' | string;
  leakReason: string;
  solution: string;
  negotiationScript?: string;
}

export interface QuickWin {
  title: string;
  instantSavings: number;
  timeToExecute: string;
  instructions: string;
  completed?: boolean;
}

export interface AuditResult {
  summary: string;
  currentTotal: number;
  optimizedTotal: number;
  totalMonthlySavings: number;
  totalYearlySavings: number;
  financialHealthScore: number;
  keyLeaks: KeyLeak[];
  quickWins: QuickWin[];
  smartHabits: string[];
}

export interface NegotiationScript {
  tone: string;
  script: string;
  bestFor: string;
}

export interface AlternativeItem {
  name: string;
  estimatedCost: string;
  pros: string;
  howToSwitch?: string;
}

export interface NegotiationResult {
  itemName: string;
  estimatedDiscountPercent: number;
  potentialSavings: number;
  negotiationScripts: NegotiationScript[];
  alternatives: AlternativeItem[];
  insiderTricks: string[];
}

export interface BillItem {
  name: string;
  price: number;
  isEssential: boolean;
  cutRecommendation?: string;
}

export interface BillAnalysis {
  merchantName: string;
  billDate: string;
  totalAmount: number;
  potentialWastage: number;
  items: BillItem[];
  detectedSurcharges: string[];
  actionStepsToCutBill: string[];
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentSaved: number;
  category: string;
  deadline?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DailyHack {
  id: string;
  title: string;
  category: string;
  estimatedMonthlySaving: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  description: string;
  actionStep: string;
  isCompleted?: boolean;
}

export type WithdrawalMethod = 'UPI' | 'BANK' | 'VOUCHER';

export interface WithdrawalTransaction {
  id: string;
  amount: number;
  method: WithdrawalMethod;
  destination: string;
  date: string;
  status: 'SUCCESS' | 'PROCESSING' | 'PENDING';
  utrNumber: string;
  recipientName?: string;
}

export interface AutoSavingsRule {
  id: string;
  titleHi: string;
  titleEn: string;
  category: string;
  dailyRate: number;
  enabled: boolean;
  descriptionHi: string;
  descriptionEn: string;
  monthlyImpact: number;
}

