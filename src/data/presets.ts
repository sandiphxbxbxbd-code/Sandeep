import { ExpenseItem, DailyHack, SavingsGoal } from '../types';

export const PRESET_EXPENSE_PROFILES: {
  id: string;
  nameHi: string;
  nameEn: string;
  descriptionHi: string;
  descriptionEn: string;
  income: number;
  expenses: ExpenseItem[];
}[] = [
  {
    id: 'middle-class-family',
    nameHi: '👨‍👩‍👦 मध्यमवर्गीय परिवार (Middle Class Family)',
    nameEn: '👨‍👩‍👦 Middle Class Family',
    descriptionHi: 'किराया, राशन, बिजली, OTT और बच्चों के खर्च',
    descriptionEn: 'Rent, groceries, power, OTT, and household spends',
    income: 60000,
    expenses: [
      { id: '1', name: 'घर का किराया (House Rent)', category: 'Housing', amount: 15000, frequency: 'monthly', necessity: 'essential' },
      { id: '2', name: 'राशन और सब्जियां (Groceries)', category: 'Food & Groceries', amount: 9500, frequency: 'monthly', necessity: 'essential' },
      { id: '3', name: 'बिजली बिल (Electricity Bill)', category: 'Utilities', amount: 2800, frequency: 'monthly', necessity: 'essential' },
      { id: '4', name: 'मोबाइल + वाईफाई प्लान (Mobile & WiFi)', category: 'Utilities', amount: 1699, frequency: 'monthly', necessity: 'essential' },
      { id: '5', name: 'बाहर का खाना / Swiggy Zomato', category: 'Food & Groceries', amount: 4800, frequency: 'monthly', necessity: 'discretionary' },
      { id: '6', name: 'Netflix + Prime + Hotstar', category: 'Subscriptions', amount: 1450, frequency: 'monthly', necessity: 'discretionary' },
      { id: '7', name: 'पेट्रोल व कैब (Fuel / Commute)', category: 'Transport', amount: 4500, frequency: 'monthly', necessity: 'essential' },
      { id: '8', name: 'ऑनलाइन शॉपिंग (Amazon/Myntra)', category: 'Shopping', amount: 5000, frequency: 'monthly', necessity: 'discretionary' },
      { id: '9', name: 'जिम मेंबरशिप (Gym Subscription)', category: 'Entertainment', amount: 1800, frequency: 'monthly', necessity: 'discretionary' },
      { id: '10', name: 'क्रेडिट कार्ड ब्याज / EMI शुल्क', category: 'Other', amount: 2200, frequency: 'monthly', necessity: 'discretionary' },
    ]
  },
  {
    id: 'single-bachelor',
    nameHi: '🧑‍💻 युवा कर्मचारी / बैचलर (Single Professional)',
    nameEn: '🧑‍💻 Single Professional',
    descriptionHi: 'रूम रेंट, फूड डिलीवरी, पार्टी, कैब और गैजेट्स',
    descriptionEn: 'PG rent, food delivery, weekend outings, subscriptions',
    income: 45000,
    expenses: [
      { id: 'b1', name: 'PG / फ्लैट शेयरिंग किराया', category: 'Housing', amount: 11000, frequency: 'monthly', necessity: 'essential' },
      { id: 'b2', name: 'Zomato / Swiggy डेली मील', category: 'Food & Groceries', amount: 7200, frequency: 'monthly', necessity: 'discretionary' },
      { id: 'b3', name: 'वीकेंड पार्टी व कैफे (Outings)', category: 'Entertainment', amount: 5500, frequency: 'monthly', necessity: 'luxury' },
      { id: 'b4', name: 'Ola / Uber कैब राइड्स', category: 'Transport', amount: 3800, frequency: 'monthly', necessity: 'discretionary' },
      { id: 'b5', name: 'मल्टीपल OTT (Spotify, YouTube, OTT)', category: 'Subscriptions', amount: 1199, frequency: 'monthly', necessity: 'discretionary' },
      { id: 'b6', name: 'गैजेट्स और कपड़े (Fashion Spends)', category: 'Shopping', amount: 4000, frequency: 'monthly', necessity: 'discretionary' },
      { id: 'b7', name: 'मोबाइल 5G रिचार्ज (Mobile Bill)', category: 'Utilities', amount: 799, frequency: 'monthly', necessity: 'essential' },
    ]
  },
  {
    id: 'student',
    nameHi: '🎓 कॉलेज छात्र / प्रतियोगी छात्र (Student)',
    nameEn: '🎓 Student / Aspirant',
    descriptionHi: 'हॉस्टल, मेस, स्नैक्स, स्टेशनरी और ऑनलाइन कोर्सेज',
    descriptionEn: 'Hostel, canteen, snacks, mobile data, courses',
    income: 12000,
    expenses: [
      { id: 's1', name: 'हॉस्टल / रूम किराया', category: 'Housing', amount: 5000, frequency: 'monthly', necessity: 'essential' },
      { id: 's2', name: 'मेस व कैंटीन स्नैक्स', category: 'Food & Groceries', amount: 3200, frequency: 'monthly', necessity: 'essential' },
      { id: 's3', name: 'मोबाइल डेटा व हॉटस्पॉट रिचार्ज', category: 'Utilities', amount: 499, frequency: 'monthly', necessity: 'essential' },
      { id: 's4', name: 'चाय, कैफे और दोस्तों के साथ खर्च', category: 'Entertainment', amount: 1800, frequency: 'monthly', necessity: 'discretionary' },
      { id: 's5', name: 'स्टेशनरी व फोटोकॉपी', category: 'Other', amount: 600, frequency: 'monthly', necessity: 'essential' },
    ]
  }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'g1',
    title: '🛡️ इमरजेंसी फंड (Emergency Cash Vault)',
    targetAmount: 25000,
    currentSaved: 4800,
    category: 'Emergency',
    deadline: '2026-12-31'
  },
  {
    id: 'g2',
    title: '🏍️ टू-व्हीलर / गैजेट फंड (Goal Purchase)',
    targetAmount: 15000,
    currentSaved: 6200,
    category: 'Purchase',
    deadline: '2026-10-30'
  }
];

export const INITIAL_DAILY_HACKS: DailyHack[] = [
  {
    id: 'h1',
    title: 'बिजली बिल में 20% की तुरंत कटौती (AC & Star Ratings)',
    category: 'Utilities',
    estimatedMonthlySaving: 750,
    difficulty: 'Easy',
    description: 'AC को 18°C की जगह 24°C पर चलाएं और इन्वर्टर स्लीप मोड ऑन रखें। हर 1°C बढ़ाने पर 6% बिजली बचती है।',
    actionStep: 'AC टेम्परेचर 24°C फिक्स करें और टाइमर लगाएं।'
  },
  {
    id: 'h2',
    title: 'OTT सब्सक्रिप्शन फैमिली शेयरिंग या एनुअल क्लस्टर',
    category: 'Subscriptions',
    estimatedMonthlySaving: 600,
    difficulty: 'Easy',
    description: 'सिंगल इंडिविजुअल प्लान की जगह फैमिली प्लान 3-4 दोस्तों/परिवार के साथ स्प्लिट करें या JioCinema/Airtel Xstream बंडल लें।',
    actionStep: 'दोस्त के साथ Netflix/Prime शेयर करें और आधा पैसा बचाएं।'
  },
  {
    id: 'h3',
    title: 'Swiggy/Zomato पर डिलीवरी व सर्विस फीस जीरो करें',
    category: 'Food & Groceries',
    estimatedMonthlySaving: 1200,
    difficulty: 'Medium',
    description: 'प्लेटफॉर्म फीस और 40% रेस्टोरेंट मार्कअप से बचने के लिए सीधे रेस्टोरेंट से टेकअवे लें या क्रेडिट कार्ड कूपन लगाएं।',
    actionStep: 'हफ्ते में सिर्फ 1 बार ऑनलाइन ऑर्डर सीमित करें और ₹1200 बचाएं।'
  },
  {
    id: 'h4',
    title: 'राशन और ग्रॉसरी पर DMart / थोक बाजार बचत',
    category: 'Food & Groceries',
    estimatedMonthlySaving: 1500,
    difficulty: 'Medium',
    description: 'रोज क्विक-कॉमर्स (Blinkit/Zepto) से छोटी चीजें मंगाने पर 15-25% ज्यादा खर्च होता है। महीने का सामान थोक या DMart से 1 बार लें।',
    actionStep: 'महीने की 1 ग्रॉसरी लिस्ट बनाएं और क्विक-कॉमर्स इंपल्स बाइ बंद करें।'
  },
  {
    id: 'h5',
    title: 'क्रेडिट कार्ड रिवॉर्ड पॉइंट व ऑटो-पे से बिल छूट',
    category: 'Other',
    estimatedMonthlySaving: 450,
    difficulty: 'Easy',
    description: 'बिजली, पानी व मोबाइल बिल पेमेंट पर 5% कैशबैक वाले कार्ड (जैसे Airtel Axis या Amazon Pay ICICI) का उपयोग करें।',
    actionStep: 'बिल पेमेंट हमेशा 5% कैशबैक वाले ऐप/कार्ड से करें।'
  },
  {
    id: 'h6',
    title: 'ब्रॉडबैंड व मोबाइल प्लान का री-नेगोशिएशन',
    category: 'Utilities',
    estimatedMonthlySaving: 300,
    difficulty: 'Easy',
    description: 'अपने इंटरनेट प्रोवाइडर को कॉल करके कॉम्पिटिटर प्लान का हवाला दें और 3 महीने का डिस्काउंट या फ्री एक्स्ट्रा स्पीड मांगें।',
    actionStep: 'कस्टमर केयर को "प्लान डाउनग्रेड या कैंसल" का अनुरोध भेजें, वे रिटेंशन डिस्काउंट देंगे।'
  }
];

export const INITIAL_AUTO_RULES: import('../types').AutoSavingsRule[] = [
  {
    id: 'ar1',
    titleHi: '⚡ बिजली व यूटिलिटी ऑटो-रिबेट (Smart Utility Saver)',
    titleEn: '⚡ Utility & Power Auto-Rebate',
    category: 'Utilities',
    dailyRate: 45,
    enabled: true,
    descriptionHi: 'ऑफ-पीक ऑवर ऑप्टिमाइजेशन व 5% ऑटो-बिल कैशबैक से बचत',
    descriptionEn: 'Auto cash recovered from off-peak power optimization',
    monthlyImpact: 1350
  },
  {
    id: 'ar2',
    titleHi: '🍔 फूड डिलीवरी सरचार्ज शील्ड (Food App Surcharge Shield)',
    titleEn: '🍔 Food App Surcharge Shield',
    category: 'Food',
    dailyRate: 60,
    enabled: true,
    descriptionHi: 'प्लेटफॉर्म फीस और रेस्टोरेंट ओवरप्राइसिंग रोककर सीधे वॉलेट में जमा',
    descriptionEn: 'Auto blocks surge markups & redirects savings to wallet',
    monthlyImpact: 1800
  },
  {
    id: 'ar3',
    titleHi: '📺 साइलेंट सब्सक्रिप्शन ऑटो-फ्रीज (OTT Auto-Freeze)',
    titleEn: '📺 Inactive Subscription Auto-Freeze',
    category: 'Subscriptions',
    dailyRate: 35,
    enabled: true,
    descriptionHi: 'कम देखे जाने वाले OTT को ऑटो-पॉज करके पैसे बचाए',
    descriptionEn: 'Pauses unused OTT months & recovers cash',
    monthlyImpact: 1050
  },
  {
    id: 'ar4',
    titleHi: '💳 UPI व किराना राउंड-अप कैशबैक (Round-Up Vault)',
    titleEn: '💳 Round-Up Spend Cashout',
    category: 'Banking',
    dailyRate: 50,
    enabled: true,
    descriptionHi: 'हर खर्च के राउंड-अप चिल्लर को निकासी वॉलेट में ट्रांसफर करे',
    descriptionEn: 'Auto round-up spare change into withdrawable cash',
    monthlyImpact: 1500
  }
];

