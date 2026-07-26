import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Star, Heart, Share2, AlertTriangle, Download, 
  RefreshCw, Upload, Check, X, Award, ChevronRight, MessageSquare, 
  Plus, FileText, Settings, UserCheck, CreditCard, DollarSign, 
  Users, Trash2, Edit, Eye, Copy, ArrowUpDown, CheckCircle2, 
  ShoppingCart, Lock, HelpCircle, Shield, Sparkles, Layout, Globe, 
  Palette, Type, Layers, Image as ImageIcon, Video, Terminal, 
  ExternalLink, Play, CheckSquare, Zap, Cpu, Compass, BookOpen, 
  Database, Mail, MessageCircle, Volume2, Eye as EyeIcon, Save, 
  History, ShieldCheck, HelpCircle as HelpIcon, Key, Network, Activity,
  Sliders, ListCollapse, ChevronDown, UserPlus, Coins, MessageSquareCode
} from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { AIAgent, AIRecipe, PromptTemplate, WorkflowNode, WorkflowConnection } from '../types/aiHub';
import { MOCK_AI_RESOURCES, MOCK_RECIPES, PROVIDERS_LIST, INITIAL_PROMPT_TEMPLATES } from '../data/aiHubMockData';
import { authService } from '../utils/authService';
import ComingSoonModal from './ComingSoonModal';

export default function YoumiAIHub() {
  const { t, language, dir } = useTranslation();

  // --- CORE TABS ---
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(() => authService.getCurrentSession()?.user?.email || '');

  // Listen to session changes to sync email
  useEffect(() => {
    const unsubscribe = authService.onSessionChange((session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });
    return unsubscribe;
  }, []);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'marketplace' | 'recipes' | 'builder' | 'prompt' | 'workflow' | 'providers' | 'appstore' | 'community' | 'assistant'>('dashboard');

  // --- LOCAL PERSISTENT STORAGE ---
  const [resources, setResources] = useState<AIAgent[]>(() => {
    const saved = localStorage.getItem('youmi_ai_resources');
    return saved ? JSON.parse(saved) : MOCK_AI_RESOURCES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('youmi_ai_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [installedApps, setInstalledApps] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('youmi_ai_installed');
    return saved ? JSON.parse(saved) : { 'ai-2': '2.0.0' }; // Preset default installed item
  });

  const [licenses, setLicenses] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('youmi_ai_licenses');
    return saved ? JSON.parse(saved) : {};
  });

  // --- MULTILINGUAL LANGUAGES CODES ---
  const [currentLocale, setCurrentLocale] = useState<'ar' | 'en' | 'fr'>('en');

  // Multi-lingual translations dictionary
  const hubT = {
    en: {
      dashboardTitle: 'YOUMI AI Hub',
      dashboardSubtitle: 'Official AI Marketplace & Automation Platform',
      marketplace: 'AI Marketplace',
      recipes: 'AI Recipes',
      agentBuilder: 'AI Agent Builder',
      promptStudio: 'Prompt Studio',
      workflowBuilder: 'Workflow Builder',
      providers: 'Supported Providers',
      appstore: 'AI App Store',
      community: 'AI Community',
      assistant: 'Built-in AI Assistant',
      security: 'Enterprise Security',
      searchPlaceholder: 'Search AI agents, prompts, chatbot nodes...',
      featured: 'Featured AI',
      trending: 'Trending AI',
      recommended: 'Recommended For You',
      newReleases: 'New Releases',
      staffPicks: 'Staff Picks',
      priceFree: 'Free',
      buyNow: 'Unlock License',
      installNow: 'One-Click Install',
      uninstall: 'Remove App',
      update: 'Update App',
      sandboxMode: 'Sandbox Mode Active',
      encryptedKeys: 'Encrypted API Keys',
      developers: 'Developer Portal',
      monetization: 'Monetization & CCP Payouts'
    },
    ar: {
      dashboardTitle: 'منصة YOUMI للذكاء الاصطناعي',
      dashboardSubtitle: 'المتجر الرسمي وحلول الأتمتة الذكية المتكاملة لرواد الأعمال',
      marketplace: 'متجر الذكاء الاصطناعي',
      recipes: 'وصفات ذكاء اصطناعي',
      agentBuilder: 'باني الوكلاء الأذكياء',
      promptStudio: 'استوديو الأوامر',
      workflowBuilder: 'مخطط سير العمل',
      providers: 'مزودي الخدمات المدعومين',
      appstore: 'متجر تطبيقات الذكاء',
      community: 'مجتمع الذكاء الاصطناعي',
      assistant: 'المساعد الذكي الداخلي',
      security: 'الأمان المؤسسي المشفر',
      searchPlaceholder: 'البحث عن الوكلاء الأذكياء، الأوامر، مسارات العمل...',
      featured: 'المميزة عالمياً',
      trending: 'الرائجة حالياً',
      recommended: 'موصى به لك',
      newReleases: 'أحدث الإضافات',
      staffPicks: 'اختيارات الإدارة',
      priceFree: 'مجاني',
      buyNow: 'شراء رخصة الاستخدام',
      installNow: 'تثبيت بضغطة زر',
      uninstall: 'حذف التطبيق',
      update: 'تحديث التطبيق',
      sandboxMode: 'بيئة الاختبار الآمنة مفعلة',
      encryptedKeys: 'مفاتيح الربط المشفرة',
      developers: 'بوابة المطورين',
      monetization: 'الأرباح وسحوبات CCP'
    },
    fr: {
      dashboardTitle: 'Espace YOUMI AI Hub',
      dashboardSubtitle: 'Boutique Officielle d\'IA & Automatisation pour Entreprises',
      marketplace: 'Marché d\'IA',
      recipes: 'Recettes d\'IA',
      agentBuilder: 'Constructeur d\'Agents',
      promptStudio: 'Studio de Prompts',
      workflowBuilder: 'Flux de Travail',
      providers: 'Fournisseurs IA',
      appstore: 'Boutique d\'Apps',
      community: 'Communauté IA',
      assistant: 'Assistant IA Intégré',
      security: 'Sécurité Entreprise',
      searchPlaceholder: 'Rechercher des agents IA, des prompts, des chatbots...',
      featured: 'IA Vedettes',
      trending: 'IA Tendances',
      recommended: 'Recommandé pour vous',
      newReleases: 'Nouveautés',
      staffPicks: 'Sélections de l\'Équipe',
      priceFree: 'Gratuit',
      buyNow: 'Débloquer Licence',
      installNow: 'Installer 1-Click',
      uninstall: 'Désinstaller',
      update: 'Mettre à jour',
      sandboxMode: 'Mode Bac à Sable Actif',
      encryptedKeys: 'Clés API Chiffrées',
      developers: 'Portail Développeur',
      monetization: 'Monétisation et Retraits CCP'
    }
  };

  const getT = (key: keyof typeof hubT['en']) => {
    return hubT[currentLocale][key] || hubT['en'][key];
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('youmi_ai_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('youmi_ai_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('youmi_ai_installed', JSON.stringify(installedApps));
  }, [installedApps]);

  useEffect(() => {
    localStorage.setItem('youmi_ai_licenses', JSON.stringify(licenses));
  }, [licenses]);

  // --- FILTERS & SEARCH ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.nameAr && res.nameAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesProvider = selectedProvider === 'all' || res.provider === selectedProvider;

    return matchesSearch && matchesCategory && matchesProvider;
  });

  // CATEGORIES
  const ALL_CATEGORIES = [
    { id: 'all', label: currentLocale === 'ar' ? 'الكل' : 'All Resources', icon: Compass },
    { id: 'agents', label: currentLocale === 'ar' ? 'وكلاء ذكاء' : 'AI Agents', icon: Cpu },
    { id: 'prompts', label: currentLocale === 'ar' ? 'أوامر ونصوص' : 'AI Prompts', icon: FileText },
    { id: 'workflows', label: currentLocale === 'ar' ? 'مسارات عمل' : 'AI Workflows', icon: Network },
    { id: 'automations', label: currentLocale === 'ar' ? 'أتمتة ذكية' : 'AI Automations', icon: Sliders },
    { id: 'components', label: currentLocale === 'ar' ? 'مكونات ذكية' : 'AI Components', icon: Layout },
    { id: 'chatbots', label: currentLocale === 'ar' ? 'روبوتات محادثة' : 'AI Chatbots', icon: MessageCircle },
    { id: 'solutions', label: currentLocale === 'ar' ? 'حلول أعمال' : 'AI Solutions', icon: Award }
  ];

  // Favorite toggle helper
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const exists = prev.includes(id);
      return exists ? prev.filter(fId => fId !== id) : [...prev, id];
    });
  };

  // --- ONE CLICK INSTALL SIMULATION ---
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);

  const startInstallApp = (id: string, version: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInstallingId(id);
    setInstallProgress(10);
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setInstallingId(null);
          setInstalledApps(prevInst => ({ ...prevInst, [id]: version }));
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const uninstallApp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInstalledApps(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Buy and unlock licenses
  const [checkoutItem, setCheckoutItem] = useState<AIAgent | null>(null);
  const triggerLicensePurchase = (item: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsComingSoonOpen(true);
  };

  const completeLicenseCheckout = () => {
    if (!checkoutItem) return;
    const key = `LIC-YOUMI-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${checkoutItem.id.toUpperCase()}`;
    setLicenses(prev => ({ ...prev, [checkoutItem.id]: key }));
    setCheckoutItem(null);
    alert(currentLocale === 'ar' 
      ? `🎉 تم ترخيص الأداة بنجاح! كود الترخيص: ${key}` 
      : `🎉 Successfully purchased! License key: ${key}`);
  };

  // --- AI RECIPES SIMULATION ---
  const [installingRecipeId, setInstallingRecipeId] = useState<string | null>(null);
  const installRecipeSuite = (recipe: AIRecipe) => {
    setInstallingRecipeId(recipe.id);
    setTimeout(() => {
      setInstallingRecipeId(null);
      alert(currentLocale === 'ar' 
        ? `🚀 تم تثبيت وتفعيل حزمة ${recipe.titleAr} بالكامل على متجرك!` 
        : `🚀 Installed and optimized ${recipe.title} workspace successfully!`);
    }, 2500);
  };

  // --- AI AGENT BUILDER WORKSPACE STATE ---
  const [agentName, setAgentName] = useState('My Custom Sales Assistant');
  const [agentMemory, setAgentMemory] = useState(true);
  const [agentRAG, setAgentRAG] = useState(false);
  const [agentVoice, setAgentVoice] = useState(false);
  const [agentVision, setAgentVision] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>(['whatsapp', 'email']);
  const [knowledgeDocuments, setKnowledgeDocuments] = useState<string[]>(['Company_Refund_Policy.pdf']);
  const [newDocName, setNewDocName] = useState('');
  const [selectedProviderInBuilder, setSelectedProviderInBuilder] = useState('Google Gemini');

  const addKnowledgeDoc = () => {
    if (newDocName.trim()) {
      setKnowledgeDocuments([...knowledgeDocuments, newDocName.trim()]);
      setNewDocName('');
    }
  };

  const removeKnowledgeDoc = (index: number) => {
    setKnowledgeDocuments(knowledgeDocuments.filter((_, i) => i !== index));
  };

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);
  };

  // Sandbox simulation Chat
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent', text: string }[]>([
    { sender: 'agent', text: 'Hello! I am your customized AI Sales Agent. I have active tools and access to refund policies. How can I assist your customers today?' }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [agentIsThinking, setAgentIsThinking] = useState(false);

  const sendSandboxMessage = () => {
    if (!userChatInput.trim() || agentIsThinking) return;
    const text = userChatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setUserChatInput('');
    setAgentIsThinking(true);

    setTimeout(() => {
      setAgentIsThinking(false);
      let reply = "I've checked the store inventory database. That product is in stock with 15 pieces remaining! Would you like me to reserve one?";
      if (text.toLowerCase().includes('refund') || text.toLowerCase().includes('ارجاع')) {
        reply = `According to your uploaded document "${knowledgeDocuments[0] || 'Rules'}": refunds are acceptable within 14 days of delivery. Let me generate a return label via Yalidine.`;
      } else if (text.toLowerCase().includes('discount') || text.toLowerCase().includes('خصم')) {
        reply = "I triggered custom tool 'Dynamic Coupon Generator'. The checkout discount of 15% has been applied to your visitor cart!";
      }
      setChatMessages(prev => [...prev, { sender: 'agent', text: reply }]);
    }, 1200);
  };

  // --- PROMPT STUDIO STATE ---
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>(() => {
    const saved = localStorage.getItem('youmi_prompt_templates');
    return saved ? JSON.parse(saved) : INITIAL_PROMPT_TEMPLATES;
  });
  const [selectedPromptId, setSelectedPromptId] = useState<string>('pr-1');
  const [promptVariablesValues, setPromptVariablesValues] = useState<Record<string, string>>({
    productName: 'Traditional Algerian Kaftan',
    productFeatures: 'Handcrafted velvet, gold embroidery, comfortable standard fit',
    targetAudience: 'Brides and formal occasion shoppers in Algeria and France'
  });
  const [promptOutputResult, setPromptOutputResult] = useState('');
  const [isRunningPrompt, setIsRunningPrompt] = useState(false);

  // Sync prompts
  useEffect(() => {
    localStorage.setItem('youmi_prompt_templates', JSON.stringify(promptTemplates));
  }, [promptTemplates]);

  const activePrompt = promptTemplates.find(p => p.id === selectedPromptId) || promptTemplates[0];

  const handlePromptVariableChange = (name: string, val: string) => {
    setPromptVariablesValues(prev => ({ ...prev, [name]: val }));
  };

  const executePromptStudioTest = () => {
    setIsRunningPrompt(true);
    setPromptOutputResult('');
    setTimeout(() => {
      setIsRunningPrompt(false);
      let localizedResult = '';
      if (currentLocale === 'ar' || activePrompt.id === 'pr-1') {
        localizedResult = `✨ **اكتشفي الأناقة المطلقة مع ${promptVariablesValues.productName || 'المنتج'} المميز!** ✨\n\nصُنع خصيصاً لـ *${promptVariablesValues.targetAudience || 'عملائنا'}* الباحثين عن الفخامة والتميز.\n\n🌟 **لماذا تختارين هذا المنتج؟**\n• ${promptVariablesValues.productFeatures || 'مزايا فريدة ومتقنة'}\n\n🛒 **اطلبي الآن واحصلي على توصيل سريع لباب المنزل مع تتبع حي!**\n\n*الكمية محدودة جداً!* 🇩🇿`;
      } else {
        localizedResult = `🚨 **Special Offer Details for ${promptVariablesValues.clientName || 'Valued Client'}!** 🚨\n\nWe noticed you left some amazing items in your basket, including: **${promptVariablesValues.cartItems || 'your selected products'}**.\n\nTo help you complete your order, we generated a unique 15% code: **WELCOME15**. Total order value was $${promptVariablesValues.cartTotal || '99'}.\n\nClick here to recover your checkout instantly!`;
      }
      setPromptOutputResult(localizedResult);
    }, 1500);
  };

  // Create customized new prompt
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false);
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptSys, setNewPromptSys] = useState('');
  const [newPromptUser, setNewPromptUser] = useState('');
  const [newPromptVars, setNewPromptVars] = useState('');

  const saveCustomPrompt = () => {
    if (!newPromptTitle || !newPromptUser) return;
    const parsedVars = newPromptVars.split(',').map(v => v.trim()).filter(Boolean);
    const newPrompt: PromptTemplate = {
      id: `pr-${Date.now()}`,
      title: newPromptTitle,
      systemInstruction: newPromptSys,
      userTemplate: newPromptUser,
      variables: parsedVars,
      version: '1.0.0',
      forks: 0,
      likes: 1
    };
    setPromptTemplates([...promptTemplates, newPrompt]);
    setSelectedPromptId(newPrompt.id);
    setIsCreatingPrompt(false);
    setNewPromptTitle('');
    setNewPromptSys('');
    setNewPromptUser('');
    setNewPromptVars('');
  };

  // --- WORKFLOW BUILDER STATE ---
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    { id: 'wn-1', type: 'trigger', title: 'New Store Order (Webhook)', icon: 'Terminal', status: 'idle', config: { url: '/api/v1/webhooks/orders' }, x: 50, y: 150 },
    { id: 'wn-2', type: 'provider', title: 'Gemini AI Analyze Intent', icon: 'Cpu', status: 'idle', config: { model: 'gemini-2.5-flash', temp: 0.2 }, x: 280, y: 150 },
    { id: 'wn-3', type: 'condition', title: 'Is Order High Value?', icon: 'Sliders', status: 'idle', config: { minPrice: 150 }, x: 500, y: 150 },
    { id: 'wn-4', type: 'action', title: 'Send VIP WhatsApp Offer', icon: 'MessageCircle', status: 'idle', config: { template: 'vip_gift' }, x: 740, y: 50 },
    { id: 'wn-5', type: 'database', title: 'Store in Firebase Database', icon: 'Database', status: 'idle', config: { collection: 'vip_clients' }, x: 740, y: 250 }
  ]);

  const [workflowConnections] = useState<WorkflowConnection[]>([
    { fromId: 'wn-1', toId: 'wn-2' },
    { fromId: 'wn-2', toId: 'wn-3' },
    { fromId: 'wn-3', toId: 'wn-4' },
    { fromId: 'wn-3', toId: 'wn-5' }
  ]);

  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [activeRunningNodeId, setActiveRunningNodeId] = useState<string | null>(null);

  const runWorkflowSimulation = () => {
    setIsWorkflowRunning(true);
    // Reset status
    setWorkflowNodes(nodes => nodes.map(n => ({ ...n, status: 'idle' })));
    
    // Simulate step-by-step progress
    const steps = ['wn-1', 'wn-2', 'wn-3', 'wn-4', 'wn-5'];
    let index = 0;

    const executeNextStep = () => {
      if (index >= steps.length) {
        setIsWorkflowRunning(false);
        setActiveRunningNodeId(null);
        alert(currentLocale === 'ar' ? '✔️ اكتمل تشغيل سيناريو العمل الذكي بنجاح!' : '✔️ Smart Workflow execution completed successfully!');
        return;
      }
      const currentNodeId = steps[index];
      setActiveRunningNodeId(currentNodeId);
      setWorkflowNodes(nodes => nodes.map(n => n.id === currentNodeId ? { ...n, status: 'running' } : n));

      setTimeout(() => {
        setWorkflowNodes(nodes => nodes.map(n => n.id === currentNodeId ? { ...n, status: 'success' } : n));
        index++;
        executeNextStep();
      }, 1000);
    };

    executeNextStep();
  };

  const addNewNodeToWorkflow = (type: WorkflowNode['type']) => {
    const nextId = `wn-custom-${Date.now()}`;
    const titles = {
      trigger: 'Trigger: Client Registered',
      action: 'Send Email Notification',
      condition: 'Check User Country',
      provider: 'DeepSeek: Classify Lead',
      database: 'PostgreSQL: Insert Log',
      response: 'Send JSON Response'
    };
    const icons = {
      trigger: 'Zap',
      action: 'Mail',
      condition: 'Sliders',
      provider: 'Cpu',
      database: 'Database',
      response: 'CheckSquare'
    };
    const newNode: WorkflowNode = {
      id: nextId,
      type,
      title: titles[type],
      icon: icons[type],
      status: 'idle',
      config: {},
      x: 350,
      y: 80 + Math.random() * 200
    };
    setWorkflowNodes([...workflowNodes, newNode]);
  };

  // --- DEVELOPER / MONETIZATION STATE ---
  const [devIsRegistered, setDevIsRegistered] = useState(true);
  const [devBalance, setDevBalance] = useState(340);
  const [payoutCCP, setPayoutCCP] = useState('');
  const [devProducts, setDevProducts] = useState([
    { id: 'dev-p1', name: 'Arabic Dialect Chatbot Pro', sales: 12, rev: 240, status: 'approved' },
    { id: 'dev-p2', name: 'Baridimob Automated Validator Node', sales: 5, rev: 100, status: 'approved' }
  ]);

  const [newPublishName, setNewPublishName] = useState('');
  const [newPublishCategory, setNewPublishCategory] = useState<AIAgent['category']>('agents');
  const [newPublishPrice, setNewPublishPrice] = useState('0');
  const [newPublishDesc, setNewPublishDesc] = useState('');

  const submitProductToHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPublishName) return;

    const priceNum = parseFloat(newPublishPrice) || 0;
    const newAgent: AIAgent = {
      id: `custom-ai-${Date.now()}`,
      name: newPublishName,
      category: newPublishCategory,
      provider: 'Google Gemini',
      price: priceNum,
      rating: 5.0,
      downloads: 0,
      version: '1.0.0',
      author: {
        name: 'Amine AI Dev',
        badge: 'Verified Creator',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'
      },
      description: newPublishDesc,
      tags: ['custom', 'publisher'],
      features: ['API-enabled', 'Sandbox test compatible']
    };

    setResources([newAgent, ...resources]);
    setNewPublishName('');
    setNewPublishDesc('');
    alert(currentLocale === 'ar' ? '🚀 تم تقديم طلب النشر للإدارة للمراجعة!' : '🚀 Product submitted successfully for validation review!');
  };

  const requestCCPPayout = () => {
    if (!payoutCCP) {
      alert(currentLocale === 'ar' ? 'الرجاء إدخال رقم حساب CCP أو BaridiMob الخاص بك' : 'Please insert your CCP account or BaridiMob RIP');
      return;
    }
    setDevBalance(0);
    alert(currentLocale === 'ar' 
      ? `✔️ تم استلام طلب السحب بنجاح. سيتم تحويل القيمة لحساب CCP: ${payoutCCP} في غضون 24 ساعة.` 
      : `✔️ Withdrawal request received. Sum will be sent to CCP RIP ${payoutCCP} within 24 hours.`);
  };

  // --- YOUMI CLOUD STATE ---
  const [isCloudSynced, setIsCloudSynced] = useState(true);
  const [autoSaveActive, setAutoSaveActive] = useState(true);
  const [backupHistory, setBackupHistory] = useState([
    { id: 'b-1', date: '2026-07-22 10:45', size: '142 KB', nodes: 5 },
    { id: 'b-2', date: '2026-07-21 16:30', size: '138 KB', nodes: 5 }
  ]);

  const triggerCloudBackupNow = () => {
    setIsCloudSynced(false);
    setTimeout(() => {
      setIsCloudSynced(true);
      const newBackup = {
        id: `b-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        size: `${140 + Math.floor(Math.random() * 10)} KB`,
        nodes: workflowNodes.length
      };
      setBackupHistory([newBackup, ...backupHistory]);
    }, 1500);
  };

  // --- SECURITY ENCRYPTED KEYS STATE ---
  const [savedAPIKeys, setSavedAPIKeys] = useState<{ provider: string, key: string, encrypted: boolean }[]>([
    { provider: 'Google Gemini', key: 'AIzaSyAs************************', encrypted: true },
    { provider: 'OpenAI (GPT-4)', key: 'sk-proj-********************************', encrypted: true }
  ]);
  const [keyInputProvider, setKeyInputProvider] = useState('Google Gemini');
  const [keyInputSecret, setKeyInputSecret] = useState('');

  const saveEncryptedAPIKey = () => {
    if (!keyInputSecret.trim()) return;
    const masked = keyInputSecret.substring(0, 7) + '*'.repeat(24);
    setSavedAPIKeys([...savedAPIKeys, { provider: keyInputProvider, key: masked, encrypted: true }]);
    setKeyInputSecret('');
    alert(currentLocale === 'ar' ? '🔒 تم تشفير وحفظ مفتاح الـ API بأمان في الذاكرة المعزولة!' : '🔒 API Key encrypted and stored securely inside the Sandbox!');
  };

  // --- BUILT-IN ASSISTANT COMPONENT GENERATOR ---
  const [assistantPrompt, setAssistantPrompt] = useState('Generate an elegant responsive Hero Section for a luxury watch storefront in Algeria');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGeneratingComponent, setIsGeneratingComponent] = useState(false);
  const [codePreviewMode, setCodePreviewMode] = useState<'preview' | 'code'>('preview');

  const runAssistantGeneration = () => {
    setIsGeneratingComponent(true);
    setGeneratedCode('');
    setTimeout(() => {
      setIsGeneratingComponent(false);
      setCodePreviewMode('preview');
      const mockResultHTML = `
<div class="bg-gradient-to-r from-slate-900 to-black text-white py-16 px-6 rounded-3xl text-center border border-slate-800">
  <span class="text-[9px] uppercase tracking-widest text-amber-500 font-extrabold bg-amber-500/10 px-3 py-1 rounded-full">Exclusive Collection</span>
  <h1 class="text-3xl font-extrabold mt-4">Luxury Watchmaking Reimagined</h1>
  <p class="text-xs text-slate-400 mt-2 max-w-md mx-auto">Explore premium Swiss timepieces delivered securely to 58 wilayas in Algeria with authentic certifications.</p>
  <div class="mt-6 flex flex-wrap justify-center gap-3">
    <button class="bg-amber-500 text-slate-900 font-bold px-5 py-2 rounded-xl text-xs hover:bg-amber-400 transition">Browse Models</button>
    <button class="border border-slate-700 hover:border-slate-500 px-5 py-2 rounded-xl text-xs transition">Contact Advisor</button>
  </div>
</div>
      `;
      setGeneratedCode(mockResultHTML.trim());
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-slate-800 dark:text-slate-200" dir={dir}>
      
      {/* 1. TOP PREMIUM HEADER */}
      <div className="bg-white dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 dark:bg-teal-500 rounded-2xl flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-start">
            <h2 className="text-sm font-extrabold flex items-center gap-2">
              <span>{getT('dashboardTitle')}</span>
              <span className="text-[9px] bg-teal-500 text-white px-2 py-0.5 rounded-full font-bold">V4 PRO</span>
            </h2>
            <p className="text-[10.5px] text-slate-500 mt-0.5">
              {getT('dashboardSubtitle')}
            </p>
          </div>
        </div>

        {/* Multilingual Swapper Bar */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setCurrentLocale('en')} 
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${currentLocale === 'en' ? 'bg-teal-600 text-white' : 'text-slate-500'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setCurrentLocale('ar')} 
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${currentLocale === 'ar' ? 'bg-teal-600 text-white' : 'text-slate-500'}`}
            >
              AR
            </button>
            <button 
              onClick={() => setCurrentLocale('fr')} 
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${currentLocale === 'fr' ? 'bg-teal-600 text-white' : 'text-slate-500'}`}
            >
              FR
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] rounded-xl font-bold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{getT('sandboxMode')}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HUB WORKSPACE LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar (Vertical Rail) */}
        <nav className="w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-4 overflow-y-auto shrink-0 flex flex-col justify-between hidden md:flex">
          <div className="space-y-4 text-start">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-2 px-2">
                Ecosystem
              </span>
              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: currentLocale === 'ar' ? 'الرئيسية' : 'Home Hub', icon: Compass },
                  { id: 'marketplace', label: getT('marketplace'), icon: ShoppingCart },
                  { id: 'recipes', label: getT('recipes'), icon: BookOpen },
                  { id: 'assistant', label: getT('assistant'), icon: MessageSquareCode }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                        activeTab === item.id 
                          ? 'bg-teal-50 dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-extrabold' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-2 px-2">
                Automations & Coding
              </span>
              <div className="space-y-1">
                {[
                  { id: 'builder', label: getT('agentBuilder'), icon: Cpu },
                  { id: 'prompt', label: getT('promptStudio'), icon: FileText },
                  { id: 'workflow', label: getT('workflowBuilder'), icon: Network }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                        activeTab === item.id 
                          ? 'bg-teal-50 dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-extrabold' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-2 px-2">
                Config & Community
              </span>
              <div className="space-y-1">
                {[
                  { id: 'providers', label: getT('providers'), icon: Key },
                  { id: 'appstore', label: getT('appstore'), icon: Layers },
                  { id: 'community', label: getT('community'), icon: Users }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                        activeTab === item.id 
                          ? 'bg-teal-50 dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-extrabold' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Balance card */}
          <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 mt-4 text-start">
            <span className="text-[10px] text-slate-400 block font-bold">CCP / Payout Balance</span>
            <p className="text-xs font-black text-teal-600 mt-1">${devBalance}.00 USD</p>
            <p className="text-[9px] text-slate-400 mt-1">Cleared revenue from your custom published AI packages.</p>
          </div>
        </nav>

        {/* Main interactive window */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/40">
          
          {/* --- TAB 1: DASHBOARD --- */}
          {activeTab === 'dashboard' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-start">
              
              {/* Hero Banner Grid */}
              <div className="bg-gradient-to-br from-teal-600 to-cyan-750 text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                <div className="max-w-xl z-10">
                  <span className="text-[9px] bg-white/20 px-3 py-1 rounded-full font-black tracking-widest uppercase">
                    Enterprise AI Cloud Marketplace
                  </span>
                  <h3 className="text-xl font-extrabold mt-3">
                    {currentLocale === 'ar' ? 'أكبر منظومة للذكاء الاصطناعي وأتمتة التجارة الإلكترونية' : 'The Largest E-Commerce Automation & Prompt Studio Ecosystem'}
                  </h3>
                  <p className="text-xs text-teal-100 mt-1 leading-relaxed">
                    Deploy conversational chatbots, automated delivery workflows, and fine-tuned GPT agents onto your YOUMI Builder storefront in seconds.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 z-10">
                  <button 
                    onClick={() => setActiveTab('marketplace')} 
                    className="px-4 py-2 bg-white text-teal-800 text-xs font-extrabold rounded-xl shadow hover:bg-teal-50 transition"
                  >
                    {currentLocale === 'ar' ? 'تصفح كافة المكونات' : 'Explore All Components'}
                  </button>
                  <button 
                    onClick={() => setActiveTab('recipes')} 
                    className="px-4 py-2 bg-teal-700/50 border border-teal-500/50 text-white text-xs font-extrabold rounded-xl hover:bg-teal-700 transition"
                  >
                    {currentLocale === 'ar' ? 'وصفات بضغطة واحدة' : '1-Click Active Recipes'}
                  </button>
                </div>
                {/* Decorative background visual */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
                  <Cpu className="w-64 h-64" />
                </div>
              </div>

              {/* Grid of highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Highlight Col 1: Featured Agents */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-slate-400">✨ {getT('featured')}</span>
                    <button onClick={() => setActiveTab('marketplace')} className="text-[10px] font-bold text-teal-600 hover:underline">View All</button>
                  </div>
                  {resources.filter(r => r.isFeatured).slice(0, 2).map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setActiveTab('marketplace')}
                      className="p-4 bg-white dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-850 hover:border-teal-500 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">{item.provider}</span>
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-extrabold mt-2 line-clamp-1">{currentLocale === 'ar' && item.nameAr ? item.nameAr : item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>

                {/* Highlight Col 2: Trending / Best Sellers */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-slate-400">🔥 {getT('trending')}</span>
                    <button onClick={() => setActiveTab('marketplace')} className="text-[10px] font-bold text-teal-600 hover:underline">View All</button>
                  </div>
                  {resources.filter(r => r.isTrending).slice(0, 2).map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setActiveTab('marketplace')}
                      className="p-4 bg-white dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-850 hover:border-teal-500 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">{item.category}</span>
                        <span className="text-[10px] text-teal-500 font-extrabold">{item.price === 0 ? 'Free' : `$${item.price}`}</span>
                      </div>
                      <h4 className="text-xs font-extrabold mt-2 line-clamp-1">{currentLocale === 'ar' && item.nameAr ? item.nameAr : item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>

                {/* Highlight Col 3: Staff Picks & Recommended */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-slate-400">🏆 {getT('staffPicks')}</span>
                    <button onClick={() => setActiveTab('marketplace')} className="text-[10px] font-bold text-teal-600 hover:underline">View All</button>
                  </div>
                  {resources.filter(r => r.isStaffPick).slice(0, 2).map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setActiveTab('marketplace')}
                      className="p-4 bg-white dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-850 hover:border-teal-500 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded uppercase font-bold">STAFF CHOICE</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Download className="w-3 h-3" />
                          <span>{item.downloads}</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-extrabold mt-2 line-clamp-1">{currentLocale === 'ar' && item.nameAr ? item.nameAr : item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  ))}
                </div>

              </div>

              {/* Ecosystem comparison footer banner */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase">YOUMI AI Standard Scalability</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    An open developer ecosystem modeled after WordPress.org, Figma Community, OpenAI GPT Store and n8n workflow triggers.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500">100% Encrypted Secrets</span>
                  <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500">Node-by-Node Sandbox</span>
                </div>
              </div>

            </div>
          )}

          {/* --- TAB 2: MARKETPLACE --- */}
          {activeTab === 'marketplace' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Internal Category Rail */}
              <aside className="w-48 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto text-start hidden lg:block">
                <span className="text-[9px] font-black uppercase text-slate-400 block mb-3">Categories</span>
                <div className="space-y-1">
                  {ALL_CATEGORIES.map(cat => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                          selectedCategory === cat.id 
                            ? 'bg-teal-50 dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-extrabold' 
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <CatIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 border-t border-slate-100 dark:border-slate-850 pt-4">
                  <span className="text-[9px] font-black uppercase text-slate-400 block mb-3">Providers</span>
                  <div className="space-y-1">
                    {['all', 'Google Gemini', 'OpenAI', 'Claude', 'DeepSeek', 'Meta Llama'].map(prov => (
                      <button
                        key={prov}
                        onClick={() => setSelectedProvider(prov)}
                        className={`w-full text-start block px-2 py-1 text-[11px] rounded transition ${
                          selectedProvider === prov ? 'text-teal-600 font-extrabold bg-teal-50/50 dark:bg-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {prov === 'all' ? 'Any Provider' : prov}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Catalog results block */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={getT('searchPlaceholder')}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>{filteredResources.length} items found</span>
                  </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                  {filteredResources.length === 0 ? (
                    <div className="py-16 text-center">
                      <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h4 className="text-sm font-bold">No items match your selected filters.</h4>
                      <p className="text-xs text-slate-400 mt-1">Try changing categories, provider tags, or searching for other prompts.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredResources.map(item => {
                        const isInstalled = !!installedApps[item.id];
                        const isLicensed = licenses[item.id] || item.price === 0;
                        const isLiked = favorites.includes(item.id);

                        return (
                          <div 
                            key={item.id}
                            className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-5 flex flex-col justify-between text-start hover:shadow-lg hover:border-teal-500/30 transition duration-300"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                  {item.category}
                                </span>
                                <button 
                                  onClick={(e) => toggleFavorite(item.id, e)} 
                                  className="text-slate-400 hover:text-red-500 transition"
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>
                              </div>

                              <h4 className="text-xs font-black text-slate-900 dark:text-white mt-3">
                                {currentLocale === 'ar' && item.nameAr ? item.nameAr : item.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                                {item.description}
                              </p>

                              {/* Features checklist strip */}
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-850 space-y-1">
                                {item.features.map((feat, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                    <Check className="w-3 h-3 text-emerald-500" />
                                    <span className="truncate">{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Footer control panel */}
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2">
                              <div className="text-start">
                                <span className="text-[9px] text-slate-400 block font-mono">PROVIDER</span>
                                <span className="text-[11px] font-black text-slate-800 dark:text-white">{item.provider}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {installingId === item.id ? (
                                  <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-850 rounded-xl text-[10px] font-black flex items-center gap-1 text-teal-600">
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    <span>{installProgress}%</span>
                                  </div>
                                ) : isInstalled ? (
                                  <div className="flex items-center gap-1">
                                    <span className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black flex items-center gap-1">
                                      <CheckSquare className="w-3.5 h-3.5" />
                                      <span>Active</span>
                                    </span>
                                    <button 
                                      onClick={(e) => uninstallApp(item.id, e)}
                                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                                      title={getT('uninstall')}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : !isLicensed ? (
                                  <button 
                                    onClick={(e) => triggerLicensePurchase(item, e)}
                                    className="px-3 py-1.5 bg-amber-550 hover:bg-amber-600 dark:bg-amber-650 dark:hover:bg-amber-600 text-white rounded-xl text-[10px] font-black transition flex items-center gap-1 cursor-pointer shadow-sm shadow-amber-500/10"
                                  >
                                    <span className="bg-white/20 text-white text-[8px] font-black uppercase px-1 py-0.5 rounded leading-none shrink-0 mr-1">Soon</span>
                                    <span>Notify Me</span>
                                  </button>
                                ) : (
                                  <button 
                                    onClick={(e) => startInstallApp(item.id, item.version, e)}
                                    className="px-3 py-1.5 bg-teal-600/10 text-teal-600 dark:text-teal-400 hover:bg-teal-600 hover:text-white rounded-xl text-[10px] font-black transition"
                                  >
                                    Install Free
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* --- TAB 3: AI RECIPES --- */}
          {activeTab === 'recipes' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-start">
              
              {/* Informative Header */}
              <div className="max-w-3xl">
                <h3 className="text-sm font-extrabold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>One-Click Active Recipes Sandbox</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active Recipes are complete, production-ready prepackaged automation sequences. Select your domain to optimize, click install, and the hub will automatically seed appropriate agents, knowledge bases, and API configurations onto your storefront workspace.
                </p>
              </div>

              {/* Grid of recipes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                {MOCK_RECIPES.map(recipe => (
                  <div 
                    key={recipe.id}
                    className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">
                          {recipe.category}
                        </span>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">
                          {recipe.difficulty}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-slate-900 dark:text-white mt-3">
                        {currentLocale === 'ar' ? recipe.titleAr : recipe.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        {recipe.description}
                      </p>

                      <div className="mt-4 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          Estimated savings: <strong>{recipe.estimatedSavings}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                      <button 
                        disabled={installingRecipeId !== null}
                        onClick={() => installRecipeSuite(recipe)}
                        className={`px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-black shadow flex items-center gap-1.5 transition ${
                          installingRecipeId === recipe.id ? 'opacity-80 cursor-wait' : ''
                        }`}
                      >
                        {installingRecipeId === recipe.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Installing automation...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Install Recipe Suite</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* --- TAB 4: AGENT BUILDER --- */}
          {activeTab === 'builder' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden text-start">
              
              {/* Builder Sidebar properties */}
              <aside className="w-full lg:w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto shrink-0 space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400">Agent Details</h4>
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Agent Name</label>
                      <input 
                        type="text" 
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Base AI Provider Model</label>
                      <select 
                        value={selectedProviderInBuilder}
                        onChange={(e) => setSelectedProviderInBuilder(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                      >
                        <option>Google Gemini</option>
                        <option>OpenAI (GPT-4o)</option>
                        <option>Claude 3.5 Sonnet</option>
                        <option>DeepSeek-V3</option>
                        <option>Meta Llama (Groq)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                  <h4 className="text-xs font-black uppercase text-slate-400">Capabilities Toggles</h4>
                  <div className="mt-3 space-y-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agentMemory}
                        onChange={(e) => setAgentMemory(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-[11px] font-bold">Memory & Context retention</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agentRAG}
                        onChange={(e) => setAgentRAG(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-[11px] font-bold">Retrieval-Augmented Gen (RAG)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agentVoice}
                        onChange={(e) => setAgentVoice(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-[11px] font-bold">Voice & Speech Synthesis (TTS)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agentVision}
                        onChange={(e) => setAgentVision(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-[11px] font-bold">Vision & Multimodal Support</span>
                    </label>
                  </div>
                </div>

                {/* Custom Tools bindings */}
                <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                  <h4 className="text-xs font-black uppercase text-slate-400">Custom Tools & APIs</h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp API' },
                      { id: 'email', label: 'Email Webhook' },
                      { id: 'ccp', label: 'Baridimob CCP check' },
                      { id: 'yalidine', label: 'Yalidine Shipping' }
                    ].map(tool => {
                      const isActive = selectedTools.includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => toggleTool(tool.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${
                            isActive 
                              ? 'bg-teal-50 dark:bg-slate-900 text-teal-600 border-teal-500/30' 
                              : 'text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {tool.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Knowledge documents (RAG) */}
                {agentRAG && (
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                    <h4 className="text-xs font-black uppercase text-slate-400">RAG Knowledge Base</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          placeholder="Doc name..." 
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          className="flex-1 px-2 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 rounded-lg outline-none"
                        />
                        <button 
                          onClick={addKnowledgeDoc}
                          className="p-1 px-2 bg-slate-200 text-slate-700 rounded-lg text-xs"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-1">
                        {knowledgeDocuments.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-1.5 rounded-lg border border-slate-100">
                            <span className="text-[10px] font-mono truncate max-w-[150px]">{doc}</span>
                            <button onClick={() => removeKnowledgeDoc(idx)} className="text-red-500 hover:text-red-700">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </aside>

              {/* Main Interactive Sandbox Emulator */}
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/20">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-xs font-black uppercase">Live Agent Sandbox Simulator ({agentName})</span>
                  </div>
                  <button 
                    onClick={() => {
                      setChatMessages([{ sender: 'agent', text: 'State reset. Send a message to test your revised agent configuration!' }]);
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Chat</span>
                  </button>
                </div>

                {/* Sandbox Chat logs area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-teal-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-bl-none'
                      }`}>
                        <div className="font-bold text-[9px] text-slate-400 block mb-1">
                          {msg.sender === 'user' ? 'TEST USER' : 'AGENT OUT'}
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {agentIsThinking && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-850">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <Cpu className="w-3.5 h-3.5 animate-spin text-teal-600" />
                          <span>Agent reading knowledge documents & calculating variables...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick actions triggers buttons bar */}
                <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 flex items-center gap-2 shrink-0 overflow-x-auto">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block shrink-0">Simulate triggers:</span>
                  <button 
                    onClick={() => {
                      setUserChatInput('Hi, is kaftan size XL in stock?');
                      setTimeout(() => sendSandboxMessage(), 100);
                    }}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-[10px] hover:bg-slate-200"
                  >
                    🔍 Check kaftan stock
                  </button>
                  <button 
                    onClick={() => {
                      setUserChatInput('How do I apply for a refund?');
                      setTimeout(() => sendSandboxMessage(), 100);
                    }}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-[10px] hover:bg-slate-200"
                  >
                    💵 Ask refund policy
                  </button>
                  <button 
                    onClick={() => {
                      setUserChatInput('Do you have discount coupons?');
                      setTimeout(() => sendSandboxMessage(), 100);
                    }}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-[10px] hover:bg-slate-200"
                  >
                    🎁 Trigger custom discount tool
                  </button>
                </div>

                {/* Sandbox input controls */}
                <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2 shrink-0">
                  <input 
                    type="text" 
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendSandboxMessage()}
                    placeholder="Type sandbox user query here..."
                    className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs outline-none"
                  />
                  <button 
                    onClick={sendSandboxMessage}
                    className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs shadow hover:bg-teal-700 transition"
                  >
                    Send Test
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* --- TAB 5: PROMPT STUDIO --- */}
          {activeTab === 'prompt' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden text-start">
              
              {/* Prompt left templates list panel */}
              <aside className="w-full lg:w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto shrink-0 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Templates</span>
                    <button 
                      onClick={() => setIsCreatingPrompt(true)}
                      className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {promptTemplates.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => setSelectedPromptId(p.id)}
                        className={`p-3 rounded-xl border text-start cursor-pointer transition ${
                          selectedPromptId === p.id 
                            ? 'bg-teal-50 dark:bg-slate-900 border-teal-500/30' 
                            : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50'
                        }`}
                      >
                        <h4 className="text-[11.5px] font-extrabold truncate">{p.title}</h4>
                        <span className="text-[9px] text-slate-400 block mt-1">Version {p.version}</span>
                        <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400">
                          <span>🍴 {p.forks} forks</span>
                          <span>❤️ {p.likes} likes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-teal-50/50 dark:bg-slate-900/40 p-3 rounded-xl border border-teal-100/30">
                  <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 block">Prompt studio features</span>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1">Fork other prompt patterns, test mock execution sequences, and publish to community portals.</p>
                </div>
              </aside>

              {/* Central Editor and Sandbox output */}
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/20">
                {isCreatingPrompt ? (
                  /* Create custom prompt form */
                  <div className="p-6 space-y-4 max-w-xl">
                    <h3 className="text-sm font-extrabold">Create New Prompt Template</h3>
                    
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Prompt Title</label>
                      <input 
                        type="text" 
                        value={newPromptTitle}
                        onChange={(e) => setNewPromptTitle(e.target.value)}
                        placeholder="e.g. Darija customer service reply"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none border border-slate-250 dark:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">System Instructions</label>
                      <textarea 
                        value={newPromptSys}
                        onChange={(e) => setNewPromptSys(e.target.value)}
                        placeholder="Define AI persona..."
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none border border-slate-250 dark:border-slate-800 h-20 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">User Prompt Template</label>
                      <textarea 
                        value={newPromptUser}
                        onChange={(e) => setNewPromptUser(e.target.value)}
                        placeholder="Use brackets e.g. Write email to {clientName}"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none border border-slate-250 dark:border-slate-800 h-20 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Variables List (Comma separated)</label>
                      <input 
                        type="text" 
                        value={newPromptVars}
                        onChange={(e) => setNewPromptVars(e.target.value)}
                        placeholder="clientName, totalAmount"
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs outline-none border border-slate-250 dark:border-slate-800"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={saveCustomPrompt} className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">Save & Edit</button>
                      <button onClick={() => setIsCreatingPrompt(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                    </div>
                  </div>
                ) : (
                  /* Live sandbox interactive test environment */
                  <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Prompt configurations */}
                    <div className="w-full lg:w-96 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto shrink-0 space-y-4">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400">System context instructions</span>
                        <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10.5px] font-mono leading-relaxed border border-slate-100 dark:border-slate-850">
                          {activePrompt.systemInstruction}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                        <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">Variables Binding Inputs</span>
                        <div className="space-y-3">
                          {activePrompt.variables.map(v => (
                            <div key={v}>
                              <label className="text-[9px] font-bold text-slate-400 uppercase">{v}</label>
                              <input 
                                type="text"
                                value={promptVariablesValues[v] || ''}
                                onChange={(e) => handlePromptVariableChange(v, e.target.value)}
                                className="w-full mt-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
                        <button
                          onClick={executePromptStudioTest}
                          disabled={isRunningPrompt}
                          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black shadow transition flex items-center justify-center gap-1.5"
                        >
                          {isRunningPrompt ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Compiling outputs...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Execute & Test Studio</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Output and code structure */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 shrink-0">
                        <span className="text-xs font-black uppercase">Live Output Compilation result</span>
                      </div>

                      <div className="flex-1 p-5 overflow-y-auto">
                        {promptOutputResult ? (
                          <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl text-xs leading-relaxed max-w-2xl whitespace-pre-line shadow-xs">
                            {promptOutputResult}
                          </div>
                        ) : (
                          <div className="py-24 text-center">
                            <Sliders className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <h4 className="text-xs font-bold text-slate-400">Trigger "Execute & Test Studio" to run mock compilation with customized parameters.</h4>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* --- TAB 6: WORKFLOW BUILDER --- */}
          {activeTab === 'workflow' && (
            <div className="flex-1 flex flex-col overflow-hidden text-start">
              
              {/* Action trigger tool header */}
              <div className="p-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 flex flex-wrap items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={runWorkflowSimulation}
                    disabled={isWorkflowRunning}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-700/60 text-white text-xs font-black rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    {isWorkflowRunning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scenario Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Run Workflow Scenario</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Add node:</span>
                    <button onClick={() => addNewNodeToWorkflow('trigger')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs rounded font-bold">⚡ Trigger</button>
                    <button onClick={() => addNewNodeToWorkflow('provider')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs rounded font-bold">♊ AI</button>
                    <button onClick={() => addNewNodeToWorkflow('action')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs rounded font-bold">✉️ Mail</button>
                    <button onClick={() => addNewNodeToWorkflow('database')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs rounded font-bold">🗄️ SQL</button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">FLOW VERSION: 1.0.4 (AUTOSAVED)</span>
                </div>
              </div>

              {/* Dynamic visual graph visualizer canvas area */}
              <div className="flex-1 relative overflow-auto bg-slate-100 dark:bg-slate-950/40 p-8 min-h-[400px]">
                {/* SVG connection lines overlay */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full min-w-[1000px] min-h-[600px]">
                  {workflowConnections.map((conn, idx) => {
                    const fromNode = workflowNodes.find(n => n.id === conn.fromId);
                    const toNode = workflowNodes.find(n => n.id === conn.toId);
                    if (!fromNode || !toNode) return null;

                    const x1 = fromNode.x + 180;
                    const y1 = fromNode.y + 40;
                    const x2 = toNode.x;
                    const y2 = toNode.y + 40;

                    // Compute clean cubic curve paths
                    const pathD = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

                    const isCurrentLinkRunning = activeRunningNodeId === fromNode.id;

                    return (
                      <g key={idx}>
                        <path 
                          d={pathD} 
                          stroke={isCurrentLinkRunning ? '#0d9488' : '#cbd5e1'} 
                          strokeWidth={isCurrentLinkRunning ? '3' : '2'}
                          strokeDasharray={isCurrentLinkRunning ? '6,6' : 'none'}
                          className={isCurrentLinkRunning ? 'animate-pulse' : ''}
                          fill="none" 
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Draw HTML absolute nodes */}
                <div className="relative w-full h-full min-w-[1000px] min-h-[500px]">
                  {workflowNodes.map(node => {
                    const isActive = activeRunningNodeId === node.id;
                    return (
                      <div
                        key={node.id}
                        style={{ left: `${node.x}px`, top: `${node.y}px` }}
                        className={`absolute w-44 bg-white dark:bg-slate-900 border p-3 rounded-2xl shadow-sm hover:shadow transition duration-200 select-none ${
                          isActive 
                            ? 'border-teal-500 ring-2 ring-teal-500/20' 
                            : node.status === 'success' 
                              ? 'border-emerald-500 bg-emerald-50/10' 
                              : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono">{node.type}</span>
                          {node.status === 'running' && (
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                          )}
                          {node.status === 'success' && (
                            <span className="text-emerald-500 font-bold text-[9px]">✔️ SUCCESS</span>
                          )}
                        </div>

                        <h4 className="text-[11px] font-black mt-1.5 truncate">{node.title}</h4>

                        {/* Internal variables node configuration indicator */}
                        <div className="mt-2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded text-[9px] text-slate-400 truncate">
                          {Object.keys(node.config).length > 0 
                            ? JSON.stringify(node.config) 
                            : 'Default Settings active'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* --- TAB 7: PROVIDERS --- */}
          {activeTab === 'providers' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-start max-w-4xl">
              
              {/* API Security warning */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900/60 dark:to-slate-900 p-5 rounded-2xl border border-emerald-100 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase">Protected API Keys Sandbox</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                      YOUMI Hub executes prompts and agent webhooks entirely server-side. Your secrets are securely encrypted in memory with hardware isolation.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white dark:bg-slate-950 text-[10px] font-mono text-slate-500 rounded-lg">AES-256</span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-950 text-[10px] font-mono text-slate-500 rounded-lg">SSL-Signed</span>
                </div>
              </div>

              {/* Providers Status table list */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Supported AI Models & Gateways</h4>
                <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-mono text-[10px]">
                        <th className="p-3">Model Provider</th>
                        <th className="p-3">API Latency (Algeria Ingress)</th>
                        <th className="p-3">Token Costs</th>
                        <th className="p-3">Connection Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      {PROVIDERS_LIST.map(p => (
                        <tr key={p.id}>
                          <td className="p-3 font-bold flex items-center gap-2">
                            <span className="text-sm">{p.logo}</span>
                            <span>{p.name}</span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{p.delay}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{p.cost}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              p.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* API Encryption storage binder form */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-850 p-6 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Encrypt and Store New API Key</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Provider Tag</label>
                    <select 
                      value={keyInputProvider}
                      onChange={(e) => setKeyInputProvider(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                    >
                      <option>Google Gemini</option>
                      <option>OpenAI (GPT-4o)</option>
                      <option>Claude Anthropic</option>
                      <option>DeepSeek API</option>
                      <option>Meta Llama / Groq</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Private Secret API Key</label>
                    <input 
                      type="password" 
                      value={keyInputSecret}
                      onChange={(e) => setKeyInputSecret(e.target.value)}
                      placeholder="Insert credentials sk-..."
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={saveEncryptedAPIKey}
                    className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs"
                  >
                    Authorize & Secure Store
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* --- TAB 8: APP STORE & CLOUD --- */}
          {activeTab === 'appstore' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-start max-w-4xl">
              
              {/* Sync settings indicator */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Upload className="w-8 h-8 text-teal-600 animate-bounce" />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase">YOUMI Cloud Storage & Projects Backup</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Keep your workflow scenarios, prompts templates, and custom API keys automatically synced across all workspace nodes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <input 
                      type="checkbox" 
                      checked={autoSaveActive}
                      onChange={(e) => setAutoSaveActive(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Auto Backup</span>
                  </label>

                  <button 
                    onClick={triggerCloudBackupNow}
                    className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-extrabold transition shadow"
                  >
                    Sync Backup Now
                  </button>
                </div>
              </div>

              {/* Version backup restore history list */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Recent Cloud Backups Version History</h4>
                <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] uppercase font-mono">
                        <th className="p-3">Backup Date & Stamp</th>
                        <th className="p-3">Project File Size</th>
                        <th className="p-3">Saved Active Nodes</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                      {backupHistory.map(b => (
                        <tr key={b.id}>
                          <td className="p-3 font-bold flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.date}</span>
                          </td>
                          <td className="p-3 font-mono">{b.size}</td>
                          <td className="p-3 text-slate-500">{b.nodes} nodes synced</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => {
                                alert(`✔️ Project restored back to ${b.date} successfully.`);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition"
                            >
                              Restore Version
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* --- TAB 9: COMMUNITY & DEV CENTER --- */}
          {activeTab === 'community' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-start max-w-5xl">
              
              {/* Creator badges strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { badge: 'Verified Creator', desc: 'Sellers with verified identity & merchant authorization.', count: 42, icon: UserCheck, color: 'text-blue-500' },
                  { badge: 'Gold Creator', desc: 'Publishers with over 500 premium pack sales.', count: 18, icon: Award, color: 'text-amber-500' },
                  { badge: 'Elite Creator', desc: 'YOUMI core official developers and automation managers.', count: 5, icon: Sparkles, color: 'text-purple-500' }
                ].map(b => {
                  const Icon = b.icon;
                  return (
                    <div key={b.badge} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-850">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400">Hub Creator Tiers</span>
                        <Icon className={`w-5 h-5 ${b.color}`} />
                      </div>
                      <h4 className="text-xs font-black mt-2">{b.badge}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">{b.desc}</p>
                      <div className="mt-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                        Total Creators: <strong>{b.count}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Developer publishes and Payouts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Product publishing portal */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-850 p-6">
                  <h4 className="text-xs font-black uppercase text-slate-400 mb-4">Publish Custom AI Assets</h4>
                  
                  <form onSubmit={submitProductToHub} className="space-y-4">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={newPublishName}
                        onChange={(e) => setNewPublishName(e.target.value)}
                        placeholder="e.g. Arabic Dialect Kaftan Assistant"
                        className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                        <select 
                          value={newPublishCategory}
                          onChange={(e: any) => setNewPublishCategory(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        >
                          <option value="agents">AI Agent</option>
                          <option value="prompts">AI Prompt</option>
                          <option value="workflows">AI Workflow</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Price (USD)</label>
                        <input 
                          type="number" 
                          value={newPublishPrice}
                          onChange={(e) => setNewPublishPrice(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Short Description</label>
                      <textarea 
                        value={newPublishDesc}
                        onChange={(e) => setNewPublishDesc(e.target.value)}
                        placeholder="Briefly pitch capabilities..."
                        className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs h-20 outline-none resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black shadow"
                    >
                      Publish to Validation Queue
                    </button>
                  </form>
                </div>

                {/* Baridimob CCP Payout Request */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-850 p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-400 mb-1">CC / BaridiMob Payout clearance</h4>
                    <p className="text-[11px] text-slate-400 leading-normal mb-6">
                      Withdraw your sales earnings directly to your Algerian Postal Account (CCP) or BaridiMob RIP card with 15% system commissions subtracted.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Your RIP / CCP Account Number</label>
                        <input 
                          type="text" 
                          value={payoutCCP}
                          onChange={(e) => setPayoutCCP(e.target.value)}
                          placeholder="e.g. 000799999234857489"
                          className="w-full mt-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none"
                        />
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] text-slate-400 block font-bold">Payout Value</span>
                        <strong className="text-base font-black text-teal-600">${devBalance}.00 USD</strong>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={requestCCPPayout}
                    className="w-full mt-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black shadow"
                  >
                    Clear Revenue to CCP
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* --- TAB 10: AI ASSISTANT --- */}
          {activeTab === 'assistant' && (
            <div className="flex-1 flex flex-col overflow-hidden text-start">
              
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div>
                  <h3 className="text-xs font-black uppercase">Built-in AI Assistant & Layout Generator</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Prompt the AI to write clean, responsive Tailwind code layouts to apply directly to your builder canvas.</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Assistant Input panel */}
                <div className="w-full lg:w-96 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto shrink-0 space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Describe what to generate</label>
                    <textarea 
                      value={assistantPrompt}
                      onChange={(e) => setAssistantPrompt(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs h-36 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-2">
                    {['Hero Section', 'Features Grid', 'Pricing Cards'].map(lbl => (
                      <button 
                        key={lbl} 
                        onClick={() => setAssistantPrompt(`Generate an elegant responsive ${lbl} for my storefront`)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] rounded"
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={runAssistantGeneration}
                    disabled={isGeneratingComponent}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-xl shadow transition"
                  >
                    {isGeneratingComponent ? 'Thinking & Writing code...' : 'Generate Component'}
                  </button>
                </div>

                {/* Assistant Results block */}
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-100/50 dark:bg-slate-950/20">
                  <div className="p-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between shrink-0">
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200">
                      <button 
                        onClick={() => setCodePreviewMode('preview')} 
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${codePreviewMode === 'preview' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                      >
                        Visual Preview
                      </button>
                      <button 
                        onClick={() => setCodePreviewMode('code')} 
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${codePreviewMode === 'code' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                      >
                        Code Output
                      </button>
                    </div>

                    {generatedCode && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCode);
                          alert('Code copied to clipboard!');
                        }}
                        className="flex items-center gap-1 text-[10px] font-bold text-teal-600 hover:underline"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy HTML</span>
                      </button>
                    )}
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto">
                    {isGeneratingComponent ? (
                      <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
                        <h4 className="text-xs font-bold text-slate-400">AI is modeling clean Tailwind columns, typography, and color classes...</h4>
                      </div>
                    ) : generatedCode ? (
                      codePreviewMode === 'preview' ? (
                        <div className="max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: generatedCode }} />
                      ) : (
                        <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono overflow-x-auto max-w-3xl mx-auto text-left whitespace-pre-wrap leading-relaxed">
                          {generatedCode}
                        </pre>
                      )
                    ) : (
                      <div className="py-24 text-center">
                        <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-xs font-bold text-slate-400">Describe the component layout in the prompt panel and hit Generate.</h4>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* --- LICENSE PURCHASE MODAL CHECKOUT DIALOG (REPLACED WITH COMING SOON LEAD CAPTURE) --- */}
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        language={language}
        showNotification={(msg) => alert(msg)}
        userEmail={userEmail}
      />

    </div>
  );
}
