import { AIAgent, AIRecipe, PromptTemplate } from '../types/aiHub';

export const MOCK_AI_RESOURCES: AIAgent[] = [
  {
    id: 'ai-1',
    name: 'Gemini 2.5 Flash Autonomous Store Manager',
    nameAr: 'مدير المتجر الذكي التلقائي - جيميناي',
    category: 'agents',
    provider: 'Google Gemini',
    price: 49,
    rating: 4.9,
    downloads: 1420,
    version: '1.4.2',
    author: {
      name: 'YOUMI Core AI',
      badge: 'Elite Creator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'
    },
    description: 'An advanced agent that automatically monitors customer carts, responds to WhatsApp product queries, writes sales summaries, and triggers dynamic coupons when sales slump.',
    descriptionAr: 'عميل ذكي متقدم يقوم بمراقبة السلات، الرد التلقائي على استفسارات واتساب، كتابة تقارير المبيعات، وتفعيل كوبونات خصم عند تراجع المبيعات.',
    tags: ['ecommerce', 'automation', 'whatsapp', 'rag'],
    features: ['RAG Knowledge Base', 'Direct WhatsApp Webhook', 'Cart abandonment recovery'],
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'ai-2',
    name: 'DeepSeek-V3 Arabize SEO Generator',
    nameAr: 'مولد السيو والتعريب - ديب سيك V3',
    category: 'prompts',
    provider: 'DeepSeek',
    price: 0,
    rating: 4.8,
    downloads: 3200,
    version: '2.0.0',
    author: {
      name: 'Riyadh AI Labs',
      badge: 'Verified Creator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
    },
    description: 'Industry-standard prompt studio bundle optimized to generate high-conversion Arabic copywriting, meta descriptors, and schema markup matching Gulf search volume.',
    descriptionAr: 'مجموعة نصوص توجيهية متكاملة لتهيئة محركات البحث وكتابة الإعلانات باللهجات الخليجية والجزائرية والمغاربية لزيادة المبيعات.',
    tags: ['seo', 'copywriting', 'deepseek', 'free'],
    features: ['Optimized for DeepSeek V3/R1', '10+ localized tone presets', 'Anti-hallucination guardrails'],
    isStaffPick: true,
    isTrending: true
  },
  {
    id: 'ai-3',
    name: 'Auto-Sync Baridimob Delivery Workflow',
    nameAr: 'سير عمل تأكيد طلبيات بريدي موب تلقائياً',
    category: 'workflows',
    provider: 'Claude',
    price: 19,
    rating: 4.7,
    downloads: 980,
    version: '1.1.0',
    author: {
      name: 'Algerian Devs',
      badge: 'Gold Creator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150'
    },
    description: 'Watches incoming email alerts for BaridiMob payment transactions, extracts paid amount, validates order, and prints Yalidine shipping slips instantly.',
    descriptionAr: 'يتتبع رسائل البريد الإلكتروني الواردة لمدفوعات بريدي موب، يستخرج القيمة المدفوعة، يؤكد الطلب تلقائياً، ويرسله لشركة الشحن يالدين.',
    tags: ['baridimob', 'shipping', 'workflow', 'payment'],
    features: ['Email parser node', 'Yalidine integration', 'Discord/Telegram alerts'],
    isNewRelease: true
  },
  {
    id: 'ai-4',
    name: 'Voice-Activated AI Customer Receptionist',
    nameAr: 'موظف الاستقبال الذكي بالصوت',
    category: 'chatbots',
    provider: 'OpenAI',
    price: 89,
    rating: 4.6,
    downloads: 450,
    version: '1.0.1',
    author: {
      name: 'VocalTech Solutions',
      badge: 'Verified Creator',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150'
    },
    description: 'A voice-capable AI widget you can embed into any YOUMI storefront. Allows visitors to voice-search products and checkout verbally with custom TTS/STT.',
    descriptionAr: 'أداة ذكاء اصطناعي صوتية مدمجة تتيح للزوار البحث عن المنتجات بالصوت وإتمام الطلب شفهياً عبر تقنيات التعرف على الكلام.',
    tags: ['voice', 'widget', 'tts', 'stt'],
    features: ['Dual English/Arabic voice recognition', 'Ultra-low latency', 'Customizable avatar animations'],
    isFeatured: true
  },
  {
    id: 'ai-5',
    name: 'Social Proof Instagram Comment auto-responder',
    nameAr: 'الرد التلقائي الذكي على تعليقات إنستغرام',
    category: 'automations',
    provider: 'Meta Llama',
    price: 0,
    rating: 4.5,
    downloads: 1890,
    version: '1.2.0',
    author: {
      name: 'YOUMI Core AI',
      badge: 'Elite Creator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'
    },
    description: 'Listens to comments on your Instagram posts, answers pricing queries instantly via Llama-3-Groq, and fires direct buy-links into Instagram DMs.',
    descriptionAr: 'يتتبع التعليقات على منشورات إنستغرام الخاصة بمتجرك، يجيب على الأسئلة ويرسل رابط الشراء المباشر تلقائياً في الرسائل الخاصة.',
    tags: ['instagram', 'automation', 'llama', 'free'],
    features: ['Auto-DM trigger', 'Groq high-speed latency', 'Safe-list comment filters'],
    isStaffPick: true
  },
  {
    id: 'ai-6',
    name: 'Gemini Pro Content & Banner Designer',
    nameAr: 'مصمم المحتوى والبانرات الإعلانية الذكي',
    category: 'templates',
    provider: 'Google Gemini',
    price: 29,
    rating: 4.9,
    downloads: 1100,
    version: '3.0.1',
    author: {
      name: 'PixelCraft AI',
      badge: 'Gold Creator',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'
    },
    description: 'Design beautiful seasonal banners, generate product highlight copy, and auto-export them to Facebook or Pinterest with one click.',
    descriptionAr: 'تصميم لافتات إعلانية جميلة، كتابة مميزات المنتجات بالذكاء الاصطناعي، ونشرها تلقائياً على فيسبوك وبينتريست بضغطة زر.',
    tags: ['design', 'images', 'gemini', 'marketing'],
    features: ['Direct Canva API support', 'High-res image generation', 'Automated caption generator'],
    isTrending: true
  }
];

export const MOCK_RECIPES: AIRecipe[] = [
  {
    id: 'rec-1',
    title: 'E-commerce Automation AI Suite',
    titleAr: 'الحزمة الكاملة لأتمتة التجارة الإلكترونية بالذكاء الاصطناعي',
    icon: 'ShoppingCart',
    description: 'Installs cart recovery, multi-lingual client assistance, automated daily sales logging to Sheets, and Yalidine shipping slip triggers.',
    category: 'E-commerce AI',
    difficulty: 'Easy',
    estimatedSavings: '12 Hours/Week'
  },
  {
    id: 'rec-2',
    title: 'Restaurant Dynamic QR & Assistant',
    titleAr: 'قائمة المطاعم الذكية والتوصية بالطلبات',
    icon: 'Utensils',
    description: 'Generates conversational menu QR codes. Recommends side items matching user preferences, handles booking tables, and manages Chef alerts.',
    category: 'Restaurant AI',
    difficulty: 'Medium',
    estimatedSavings: '$350 / Month'
  },
  {
    id: 'rec-3',
    title: 'Real Estate Virtual Agent & Tour Guide',
    titleAr: 'العميل العقاري الافتراضي والمرشد الذكي',
    icon: 'Home',
    description: 'Answers pricing/neighborhood queries, qualifies leads based on monthly budget, sets up tour appointments, and exports reports to CRM.',
    category: 'Real Estate AI',
    difficulty: 'Medium',
    estimatedSavings: '15 Leads / Day'
  },
  {
    id: 'rec-4',
    title: 'WhatsApp Automated Sales Generator',
    titleAr: 'منشئ المبيعات الذكي التلقائي للواتساب',
    icon: 'MessageSquare',
    description: 'Connects your local WhatsApp Business API directly to Gemini. Allows full checkout, order status checks, and queries handling over chat.',
    category: 'WhatsApp AI',
    difficulty: 'Advanced',
    estimatedSavings: '24/7 Operations'
  },
  {
    id: 'rec-5',
    title: 'Medical Clinic Booking & Triage Agent',
    titleAr: 'منظم العيادات الطبية وفرز الحالات وحجز المواعيد',
    icon: 'Heart',
    description: 'Handles medical scheduling, screens symptom severity before doctor visits, issues virtual prescription receipts, and tracks follow-ups.',
    category: 'Medical AI',
    difficulty: 'Medium',
    estimatedSavings: '85% Phone reduction'
  }
];

export const PROVIDERS_LIST = [
  { id: 'gemini', name: 'Google Gemini', logo: '♊', status: 'Connected', delay: '120ms', cost: '$0.00 / 1K Tokens' },
  { id: 'openai', name: 'OpenAI (GPT-4o)', logo: '⚡', status: 'Connected', delay: '240ms', cost: '$0.0025 / 1K Tokens' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', logo: '🍁', status: 'API Key Required', delay: '--', cost: '$0.0030 / 1K Tokens' },
  { id: 'deepseek', name: 'DeepSeek-V3 / R1', logo: '🌀', status: 'Connected', delay: '180ms', cost: '$0.0001 / 1K Tokens' },
  { id: 'llama', name: 'Meta Llama 3.1 (Groq)', logo: '🦙', status: 'Connected', delay: '45ms', cost: 'Free Sandbox' },
  { id: 'mistral', name: 'Mistral Large', logo: '🌪️', status: 'API Key Required', delay: '--', cost: '$0.0020 / 1K Tokens' },
  { id: 'grok', name: 'Grok 2 (xAI)', logo: '✖️', status: 'API Key Required', delay: '--', cost: '$0.0020 / 1K Tokens' }
];

export const INITIAL_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'pr-1',
    title: 'Arabic E-commerce Conversion Prompt',
    systemInstruction: 'You are an elite Algerian marketing specialist expert in Algerian dialect (Darija) and elegant classic Arabic. Generate high converting product highlights.',
    userTemplate: 'Create an engaging product description for {productName} which has features {productFeatures}. Target audience is {targetAudience}. Use attractive emojis and call-to-actions.',
    variables: ['productName', 'productFeatures', 'targetAudience'],
    version: '1.2.0',
    forks: 184,
    likes: 312
  },
  {
    id: 'pr-2',
    title: 'Cart Recovery Email Sequence Generator',
    systemInstruction: 'You are a CRM automation copies generator. Your tone is warm, urging, and friendly without being intrusive.',
    userTemplate: 'Draft a 3-part recovery email sequence for a shopper named {clientName} who left a cart containing {cartItems} with total price {cartTotal}. Offer a coupon of {couponValue}.',
    variables: ['clientName', 'cartItems', 'cartTotal', 'couponValue'],
    version: '1.0.4',
    forks: 92,
    likes: 145
  }
];
