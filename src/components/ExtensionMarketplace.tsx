import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Grid, 
  Download, 
  CheckCircle, 
  Sliders, 
  FileText, 
  ShieldAlert, 
  Code, 
  Coins, 
  Star, 
  Trash2, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Settings, 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  User, 
  Database, 
  Globe, 
  CreditCard, 
  Clock, 
  HelpCircle, 
  Terminal, 
  Lock, 
  Cpu, 
  X, 
  Check, 
  History, 
  TrendingUp, 
  FileJson,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface ExtensionMarketplaceProps {
  language: 'ar' | 'en';
  showNotification: (msg: string) => void;
}

// 1. EXTENSION INTERFACES
interface ExtensionConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  publisher: string;
  icon: string; // Tailwind icon name
  homepage: string;
  repository: string;
  license: string;
  category: string;
  keywords: string[];
  permissions: string[];
  dependencies: string[];
  minimumVersion: string;
  compatibleVersion: string;
  entry: string;
  price: 'free' | 'premium';
  priceValue?: number;
  rating: number;
  downloads: number;
  isVerified: boolean;
  readme: string;
  changelog: string;
}

export default function ExtensionMarketplace({ language, showNotification }: ExtensionMarketplaceProps) {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState<'all' | 'installed' | 'updates' | 'admin'>('all');
  const [selectedExtension, setSelectedExtension] = useState<ExtensionConfig | null>(null);
  const [detailTab, setDetailTab] = useState<'readme' | 'changelog' | 'settings' | 'permissions' | 'sdk'>('readme');
  
  // Extension Manager State
  const [installedExtensions, setInstalledExtensions] = useState<string[]>(() => {
    const saved = localStorage.getItem('youmi_installed_extensions');
    return saved ? JSON.parse(saved) : ['youmi-copilot-ai', 'aesthetic-neon-dark'];
  });
  const [enabledExtensions, setEnabledExtensions] = useState<string[]>(() => {
    const saved = localStorage.getItem('youmi_enabled_extensions');
    return saved ? JSON.parse(saved) : ['youmi-copilot-ai'];
  });
  const [autoUpdate, setAutoUpdate] = useState<boolean>(() => {
    const saved = localStorage.getItem('youmi_ext_autoupdate');
    return saved ? JSON.parse(saved) : true;
  });
  
  // Extension Custom Settings Store
  const [extensionSettings, setExtensionSettings] = useState<Record<string, Record<string, any>>>(() => {
    const saved = localStorage.getItem('youmi_extension_settings');
    return saved ? JSON.parse(saved) : {
      'youmi-copilot-ai': { aiModel: 'Gemini 2.5 Flash', autoTranslate: true, maxTokens: 2048 },
      'aesthetic-neon-dark': { neonIntensity: 80, glowingBorders: true }
    };
  });

  // Command Palette Simulation
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [commandPaletteLogs, setCommandPaletteLogs] = useState<string[]>([
    'System: Extension SDK host environment initialized.',
    'System: Sandboxing secure context loaded for default extensions.'
  ]);

  // Bybit Pay Checkout State
  const [checkoutExtension, setCheckoutExtension] = useState<ExtensionConfig | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bybit' | 'card'>('bybit');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'paying' | 'success'>('idle');
  const [cardNumber, setCardNumber] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('0xBybitPayAddressSimulated777Ecx992');

  // Admin Dashboard State
  const [adminExtensions, setAdminExtensions] = useState<ExtensionConfig[]>([]);
  const [adminReportFilter, setAdminReportFilter] = useState<'downloads' | 'revenue'>('downloads');

  // --- HARDCODED REGISTRY (12 Extensions across Categories) ---
  const EXTENSIONS_REGISTRY: ExtensionConfig[] = [
    {
      id: 'youmi-copilot-ai',
      name: 'YOUMI Copilot AI',
      displayName: 'YOUMI AI Copilot & Auto-Translator',
      description: 'Supercharges YOUMI Builder with Gemini-powered local translation, copy generation, and dynamic smart presets layout design.',
      version: '1.4.2',
      author: 'YOUMI Core AI Team',
      publisher: 'YOUMI Labs',
      icon: 'Cpu',
      homepage: 'https://youmi.ai/copilot',
      repository: 'https://github.com/youmi-labs/copilot-ai',
      license: 'MIT',
      category: 'AI',
      keywords: ['AI', 'Gemini', 'translation', 'copywriting', 'productivity'],
      permissions: ['AI', 'editor', 'network'],
      dependencies: [],
      minimumVersion: '0.9.0',
      compatibleVersion: '1.5.0',
      entry: 'dist/index.js',
      price: 'free',
      rating: 4.9,
      downloads: 14500,
      isVerified: true,
      readme: `# YOUMI AI Copilot

Integrates **Google Gemini 3.5** directly into the YOUMI Builder workspace. Generate instant localized product descriptions, slogans, and complete sections translations with a single click.

## Features
- **Auto-Translate**: Translate whole site templates between Arabic, French, and English.
- **Copy Creator**: Simply type \`/generate [topic]\` inside any text input.
- **Smart Design Suggestion**: Recommends color schemes matching your brand niche.

## Sandbox Sandboxed Access
This extension is sandboxed with read/write access to the current editor state. It does not read database credentials.`,
      changelog: `### v1.4.2
- Upgraded to utilize Gemini 3.5 Flash by default
- Fixed Arabic layout RTL text alignments

### v1.3.0
- Added auto-translation pipeline for 58 Algerian Wilayas`
    },
    {
      id: 'bybit-pay-gate',
      name: 'Bybit Pay Gate',
      displayName: 'Bybit Pay Crypto Checkout',
      description: 'Accept seamless cryptocurrency payments on your e-commerce storefront directly to your wallet using Bybit Pay API.',
      version: '2.1.0',
      author: 'Bybit Integration Labs',
      publisher: 'Verified Dev',
      icon: 'Coins',
      homepage: 'https://bybit.com/pay',
      repository: 'https://github.com/bybit/pay-youmi',
      license: 'Apache-2.0',
      category: 'Payments',
      keywords: ['crypto', 'payment', 'bybit', 'checkout', 'SAR'],
      permissions: ['Payments', 'network', 'storage'],
      dependencies: [],
      minimumVersion: '1.0.0',
      compatibleVersion: '2.0.0',
      entry: 'bybit.ts',
      price: 'premium',
      priceValue: 19.99,
      rating: 4.8,
      downloads: 3200,
      isVerified: true,
      readme: `# Bybit Pay Gateway for YOUMI Builder

The premier cryptocurrency and stablecoin payment checkout gate. Enable web3 users to checkout with USDT, BTC, and ETH.

## Configuration Guide
1. Obtain your merchant API key from the Bybit merchant dashboard.
2. Fill your key in the extension settings page.
3. Your final export ZIP will compile direct webhook scripts for validation.`,
      changelog: `### v2.1.0
- Introduced automated USDT gas-fee estimator
- Live wallet connection verification`
    },
    {
      id: 'supabase-cloud-state',
      name: 'Supabase Cloud Sync',
      displayName: 'Supabase Database Connector',
      description: 'Connect your YOUMI storefront to Supabase PostgreSQL database to store real products, orders, and user authentication.',
      version: '1.1.2',
      author: 'SupaDev Community',
      publisher: 'Supabase Inc.',
      icon: 'Database',
      homepage: 'https://supabase.com',
      repository: 'https://github.com/supabase/youmi-sync',
      license: 'MIT',
      category: 'Database',
      keywords: ['postgres', 'supabase', 'database', 'auth', 'orders'],
      permissions: ['Supabase', 'storage', 'network'],
      dependencies: [],
      minimumVersion: '1.0.0',
      compatibleVersion: '1.6.0',
      entry: 'supabase-client.ts',
      price: 'free',
      rating: 4.7,
      downloads: 8900,
      isVerified: true,
      readme: `# Supabase Storage & Database Connector

Map all your builder states to an industrial relational database. No more local storage limitations for your products!

## Quick Start
Provide your Supabase URL and Anon key in settings to automatically provision the \`products\` and \`orders\` tables.`,
      changelog: `### v1.1.2
- Enhanced JWT authentication timeout checks`
    },
    {
      id: 'aesthetic-neon-dark',
      name: 'Aesthetic Neon Theme',
      displayName: 'Cyberpunk Neon Premium M ظاهر',
      description: 'Provides a spectacular dark luxury theme featuring glowing neon purple borders, high-contrast buttons, and ambient cyber styling.',
      version: '1.0.0',
      author: 'GlowDesign Lab',
      publisher: 'Indie Creator',
      icon: 'Layers',
      homepage: 'https://youmi.theme/neon-dark',
      repository: 'https://github.com/indie/neon-theme',
      license: 'GPL-3.0',
      category: 'Themes',
      keywords: ['design', 'neon', 'dark', 'luxurious', 'glow'],
      permissions: ['editor'],
      dependencies: [],
      minimumVersion: '0.5.0',
      compatibleVersion: '1.5.0',
      entry: 'neon.css',
      price: 'free',
      rating: 4.5,
      downloads: 5120,
      isVerified: false,
      readme: `# Aesthetic Neon Dark Theme

Give your store a premium cyberpunk atmosphere. Ideal for high-end fashion, electronics, and digital products.

- Warm glowing hover states
- Sleek thin borders
- High legible cyber typography headings`,
      changelog: `### v1.0.0
- Initial release of dark luxury preset classes`
    },
    {
      id: 'seo-pro-optimizer',
      name: 'SEO Pro Optimizer',
      displayName: 'Advanced SEO & Schema.org Wizard',
      description: 'Generates sitemaps, clean meta titles/descriptions, and complete JSON-LD Structured Schema schemas to maximize Google Ranking.',
      version: '2.0.4',
      author: 'RankBuilder Experts',
      publisher: 'SEO Pro Group',
      icon: 'Globe',
      homepage: 'https://seopro.org',
      repository: 'https://github.com/seo-pro/youmi-pack',
      license: 'MIT',
      category: 'SEO',
      keywords: ['SEO', 'sitemap', 'JSON-LD', 'google', 'meta-tags'],
      permissions: ['filesystem', 'network'],
      dependencies: [],
      minimumVersion: '1.1.0',
      compatibleVersion: '2.0.0',
      entry: 'seo.js',
      price: 'free',
      rating: 4.6,
      downloads: 6200,
      isVerified: true,
      readme: `# SEO Pro Optimizer

Elevate your store page to page #1 of Google search engine results.

## Key Features
- Auto-compiles rich search snippets
- Formulates Twitter Cards and Open Graph image tags`,
      changelog: `### v2.0.4
- Added localized meta descriptions for Algeria Arabic keywords`
    },
    {
      id: 'analytics-radar',
      name: 'Analytics Radar',
      displayName: 'Heatmaps & Session Recorder',
      description: 'Record user clicks and cursor movements to visualize bottlenecks and boost your checkout conversion rates.',
      version: '3.0.1',
      author: 'HotMetrics Corp',
      publisher: 'Verified Dev',
      icon: 'Sliders',
      homepage: 'https://analytics-radar.com',
      repository: 'https://github.com/metrics/radar',
      license: 'Commercial',
      category: 'Analytics',
      keywords: ['analytics', 'metrics', 'heatmap', 'recordings', 'logs'],
      permissions: ['network', 'storage'],
      dependencies: [],
      minimumVersion: '1.2.0',
      compatibleVersion: '2.0.0',
      entry: 'radar-sdk.js',
      price: 'premium',
      priceValue: 4.99,
      rating: 4.9,
      downloads: 1800,
      isVerified: true,
      readme: `# Analytics Radar

Record customer sessions securely with zero performance lag.

- Beautiful visual dashboard
- GDPR/CCPA compliant client-side anonymization`,
      changelog: `### v3.0.1
- Speed enhancements for loading analytics bundle asynchronously`
    },
    {
      id: 'algeria-wilayas-express',
      name: 'Algeria Wilayas Deliverer',
      displayName: 'Yalidine Express Freight Sync',
      description: 'Calculate shipping cost for all 58 Algerian wilayas automatically and generate one-click waybills for transport.',
      version: '1.2.0',
      author: 'DZ Logistics Tech',
      publisher: 'Indie Creator',
      icon: 'TrendingUp',
      homepage: 'https://dzlogistics.com',
      repository: 'https://github.com/dz/yalidine-express',
      license: 'MIT',
      category: 'Integrations',
      keywords: ['yalidine', 'wilaya', 'shipping', 'delivery', 'DZ'],
      permissions: ['network', 'storage'],
      dependencies: [],
      minimumVersion: '0.8.0',
      compatibleVersion: '1.5.0',
      entry: 'yalidine-dz.ts',
      price: 'free',
      rating: 4.9,
      downloads: 9800,
      isVerified: true,
      readme: `# Algeria Wilayas Deliverer

Direct integration with **Yalidine Express** and **NordEx**. Easily toggles Desk vs. Home Delivery prices for all 58 DZ provinces.`,
      changelog: `### v1.2.0
- Updated to support the latest 58 provinces database`
    },
    {
      id: 'sms-otp-verification',
      name: 'SMS Order Verifier',
      displayName: 'Anti-Spam OTP Call Checker',
      description: 'Prevent fake Cash-on-Delivery (COD) orders by forcing shoppers to verify their phone number via instant Twilio SMS OTP codes.',
      version: '1.5.0',
      author: 'ShieldPayments Inc',
      publisher: 'YOUMI Labs',
      icon: 'ShieldAlert',
      homepage: 'https://otp-shield.com',
      repository: 'https://github.com/shield/otp',
      license: 'MIT',
      category: 'Security',
      keywords: ['OTP', 'SMS', 'twilio', 'COD', 'verification', 'spam'],
      permissions: ['network', 'storage'],
      dependencies: [],
      minimumVersion: '1.0.0',
      compatibleVersion: '2.0.0',
      entry: 'otp.ts',
      price: 'premium',
      priceValue: 9.99,
      rating: 4.7,
      downloads: 1100,
      isVerified: true,
      readme: `# SMS Order Verifier

Saves up to 35% on returns by verifying that customer phones are genuine before shipping out packages.`,
      changelog: `### v1.5.0
- Twilio routing optimizations for Middle East and North Africa carrier networks`
    }
  ];

  // Initialize admin extensions
  useEffect(() => {
    setAdminExtensions(EXTENSIONS_REGISTRY);
  }, []);

  // Sync settings/installed states to localStorage
  useEffect(() => {
    localStorage.setItem('youmi_installed_extensions', JSON.stringify(installedExtensions));
  }, [installedExtensions]);

  useEffect(() => {
    localStorage.setItem('youmi_enabled_extensions', JSON.stringify(enabledExtensions));
  }, [enabledExtensions]);

  useEffect(() => {
    localStorage.setItem('youmi_extension_settings', JSON.stringify(extensionSettings));
  }, [extensionSettings]);

  // Handle Ctrl+Shift+P Shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- ACTIONS & ENGINE ---
  const handleInstallExtension = (ext: ExtensionConfig) => {
    if (ext.price === 'premium' && !installedExtensions.includes(ext.id)) {
      // Must checkout
      setCheckoutExtension(ext);
      setPaymentStep('idle');
      return;
    }

    if (!installedExtensions.includes(ext.id)) {
      setInstalledExtensions(prev => [...prev, ext.id]);
      setEnabledExtensions(prev => [...prev, ext.id]);
      showNotification(language === 'ar' ? `🎉 تم تثبيت الملحق: ${ext.displayName}` : `🎉 Installed Extension: ${ext.displayName}`);
      addLog(`System: Installed extension "${ext.displayName}" v${ext.version}`);
    }
  };

  const handleUninstallExtension = (extId: string) => {
    setInstalledExtensions(prev => prev.filter(id => id !== extId));
    setEnabledExtensions(prev => prev.filter(id => id !== extId));
    showNotification(language === 'ar' ? `🗑️ تم إلغاء تثبيت الملحق بنجاح` : `🗑️ Extension uninstalled successfully`);
    addLog(`System: Uninstalled extension ID "${extId}"`);
  };

  const toggleEnableExtension = (extId: string) => {
    if (enabledExtensions.includes(extId)) {
      setEnabledExtensions(prev => prev.filter(id => id !== extId));
      showNotification(language === 'ar' ? `⏸️ تم تعطيل الملحق` : `⏸️ Extension disabled`);
      addLog(`System: Disabled extension ID "${extId}"`);
    } else {
      setEnabledExtensions(prev => [...prev, extId]);
      showNotification(language === 'ar' ? `▶️ تم تفعيل الملحق` : `▶️ Extension enabled`);
      addLog(`System: Enabled extension ID "${extId}"`);
    }
  };

  const handleUpdateExtension = (ext: ExtensionConfig) => {
    showNotification(language === 'ar' ? `🔄 الملحق مُحدث بالكامل بالفعل` : `🔄 Extension is already up to date`);
  };

  const updateSetting = (extId: string, key: string, value: any) => {
    setExtensionSettings(prev => ({
      ...prev,
      [extId]: {
        ...(prev[extId] || {}),
        [key]: value
      }
    }));
  };

  const addLog = (msg: string) => {
    setCommandPaletteLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Run Simulated SDK Command
  const runSDKCommand = (cmd: string) => {
    addLog(`Execute SDK command: "${cmd}"`);
    if (cmd.includes('registerExtension')) {
      addLog(`Success: Registered new extension sandbox payload with storage permissions.`);
    } else if (cmd.includes('registerCommand')) {
      addLog(`Success: Registered global hotkey Ctrl+Shift+Y to run custom layout analyzer.`);
    } else if (cmd.includes('registerPanel')) {
      addLog(`Success: Spawned custom panel widget on active storefront.`);
    } else {
      addLog(`Info: Command routed to YOUMI Core framework safely.`);
    }
    showNotification(language === 'ar' ? `⚡ تم تنفيذ الأمر البرمجي ومحاكاة الاستجابة` : `⚡ Executed command simulated via SDK sandbox`);
  };

  // Payment process simulation via Bybit Pay
  const executePayment = () => {
    if (!checkoutExtension) return;
    setPaymentStep('paying');
    setTimeout(() => {
      setPaymentStep('success');
      setInstalledExtensions(prev => [...prev, checkoutExtension.id]);
      setEnabledExtensions(prev => [...prev, checkoutExtension.id]);
      showNotification(language === 'ar' ? `💸 تم الدفع بنجاح عبر Bybit Pay!` : `💸 Payment succeeded via Bybit Pay!`);
      addLog(`BybitPay: Authenticated transaction of $${checkoutExtension.priceValue} for ${checkoutExtension.displayName}`);
      setTimeout(() => {
        setCheckoutExtension(null);
      }, 1500);
    }, 1800);
  };

  // Simulated chart data for downloads & revenue
  const chartData = [
    { date: 'Jan 2026', downloads: 1200, revenue: 240 },
    { date: 'Feb 2026', downloads: 1800, revenue: 380 },
    { date: 'Mar 2026', downloads: 2400, revenue: 520 },
    { date: 'Apr 2026', downloads: 3100, revenue: 780 },
    { date: 'May 2026', downloads: 4200, revenue: 1100 },
    { date: 'Jun 2026', downloads: 5900, revenue: 1450 },
    { date: 'Jul 2026', downloads: 8200, revenue: 1980 },
  ];

  // Helper to render icons dynamically
  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-400 shrink-0" />;
      case 'Coins': return <Coins className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'Database': return <Database className="w-5 h-5 text-blue-400 shrink-0" />;
      case 'Layers': return <Layers className="w-5 h-5 text-teal-400 shrink-0" />;
      case 'Globe': return <Globe className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-sky-400 shrink-0" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />;
      default: return <Code className="w-5 h-5 text-slate-400 shrink-0" />;
    }
  };

  // Categories list based on specs
  const CATEGORIES = [
    'all', 'AI', 'Payments', 'Database', 'Themes', 'SEO', 'Analytics', 'Integrations', 'Security'
  ];

  const filteredExtensions = EXTENSIONS_REGISTRY.filter(ext => {
    const matchesSearch = ext.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ext.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ext.category === selectedCategory;
    
    if (selectedTab === 'installed') {
      return matchesSearch && matchesCategory && installedExtensions.includes(ext.id);
    }
    if (selectedTab === 'updates') {
      return matchesSearch && matchesCategory && installedExtensions.includes(ext.id) && ext.id === 'youmi-copilot-ai'; // mock update
    }
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] text-[#CCCCCC] text-[13px] overflow-hidden" dir="ltr">
      
      {/* A. COMMAND PALETTE MODAL PANEL */}
      {isCommandPaletteOpen && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] bg-[#252526] border border-[#007ACC] shadow-2xl rounded-lg z-50 overflow-hidden">
          <div className="flex items-center gap-2 p-2 bg-[#1E1E1E] border-b border-[#3C3C3C]">
            <Terminal className="w-4 h-4 text-[#007ACC]" />
            <input
              type="text"
              placeholder="Search or run YOUMI SDK Extension commands... (e.g. registerExtension)"
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              className="flex-1 bg-transparent text-white border-none focus:outline-none text-xs font-mono"
              autoFocus
            />
            <button onClick={() => setIsCommandPaletteOpen(false)} className="hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-[220px] overflow-y-auto divide-y divide-[#2D2D30] font-mono text-[11px]">
            {[
              { cmd: 'registerExtension(payload)', desc: 'Register extension sandbox structure & callbacks' },
              { cmd: 'registerPanel(viewId, component)', desc: 'Spawns custom dashboard widgets inside YOUMI preview' },
              { cmd: 'registerCommand(key, callback)', desc: 'Binds custom action hotkey listeners for automated workflow' },
              { cmd: 'registerToolbarButton(id, config)', desc: 'Append customized quick toolbar action buttons' },
              { cmd: 'registerSetting(extId, key, schema)', desc: 'Generates real-time custom configuration interface fields' },
            ]
              .filter(item => item.cmd.toLowerCase().includes(commandQuery.toLowerCase()))
              .map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    runSDKCommand(item.cmd);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="p-2.5 hover:bg-[#37373D] cursor-pointer flex items-center justify-between text-[#CCCCCC] hover:text-white"
                >
                  <span className="text-[#007ACC] font-semibold">{item.cmd}</span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </div>
              ))}
          </div>
          <div className="p-1.5 bg-[#1E1E1E] border-t border-[#3C3C3C] text-[9px] text-slate-400 flex items-center justify-between font-mono">
            <span>Tip: Click commands above to execute them in the sandboxed context</span>
            <span>Shortcut: Esc to close</span>
          </div>
        </div>
      )}

      {/* B. MAIN TITLE HEADER */}
      <div className="px-5 py-3.5 border-b border-[#3C3C3C] bg-[#252526] flex flex-wrap items-center justify-between gap-4 select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#007ACC] rounded text-white shrink-0 shadow-sm">
            <Grid className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white tracking-wide uppercase">YOUMI Extension Marketplace</h1>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-purple-900/40 text-purple-400 border border-purple-800/40 rounded font-bold uppercase">VS Code Ecosystem</span>
            </div>
            <p className="text-[10.5px] text-slate-400 mt-0.5">
              Install, disable, or compile modular plugins to enhance your Algerian E-Commerce stores natively.
            </p>
          </div>
        </div>

        {/* TOP STATUS BUTTONS */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="px-2.5 py-1 bg-[#1E1E1E] hover:bg-[#3C3C3C] border border-[#3C3C3C] rounded text-xs font-mono text-[#007ACC] hover:text-sky-400 font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Press Ctrl+Shift+P anywhere"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Command Palette (Ctrl+Shift+P)</span>
          </button>
          
          <div className="flex items-center gap-1 bg-[#1E1E1E] px-2.5 py-1 rounded border border-[#3C3C3C] text-slate-400 text-xs font-mono select-none">
            <span>Auto-Update:</span>
            <input 
              type="checkbox" 
              checked={autoUpdate} 
              onChange={() => {
                setAutoUpdate(!autoUpdate);
                showNotification(autoUpdate ? '⏸️ Auto Update Disabled' : '✨ Auto Update Enabled');
              }}
              className="w-3 h-3 cursor-pointer rounded border-[#3C3C3C]" 
            />
          </div>
        </div>
      </div>

      {/* C. THREE COLUMN WORKSPACE */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* COLUMN 1: SIDEBAR CONTROLLER (CATEGORIES & INSTALLED FILTERS) */}
        <div className="w-[220px] bg-[#252526] border-r border-[#3C3C3C] flex flex-col shrink-0 select-none">
          <div className="p-3 border-b border-[#3C3C3C]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-[#3C3C3C] text-white pl-7 pr-2 py-1 text-xs rounded focus:outline-none focus:border-[#007ACC] font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          <div className="p-2 space-y-1 font-semibold text-[11.5px]">
            {[
              { id: 'all', label: 'All Extensions', count: EXTENSIONS_REGISTRY.length },
              { id: 'installed', label: 'Installed Extensions', count: installedExtensions.length },
              { id: 'updates', label: 'Updates Available', count: 1 },
              { id: 'admin', label: 'Marketplace Admin Panel', count: 0 },
            ].map((tab) => {
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedTab(tab.id as any);
                    setSelectedExtension(null);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition text-left cursor-pointer ${
                    isActive 
                      ? 'bg-[#37373D] text-white font-black border-l-2 border-[#007ACC]' 
                      : 'text-slate-400 hover:bg-[#2D2D30] hover:text-white'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#1E1E1E] text-slate-300 rounded-full font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 pt-3 pb-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Categories Filter
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-2.5 py-1 rounded text-xs transition cursor-pointer capitalize font-bold ${
                  selectedCategory === cat 
                    ? 'bg-[#1E1E1E] text-[#007ACC] font-black' 
                    : 'text-slate-400 hover:text-[#CCCCCC]'
                }`}
              >
                {cat === 'all' ? '● Show All' : `▪ ${cat}`}
              </button>
            ))}
          </div>

          {/* Quick Stats Footer */}
          <div className="p-3 border-t border-[#3C3C3C] bg-[#1E1E1E] text-[10px] text-slate-400 space-y-1 select-none font-mono">
            <div>Framework: <span className="text-emerald-400 font-bold">YOUMI SDK v2.0</span></div>
            <div>Isolation sandbox: <span className="text-[#007ACC] font-bold">Secure Web Workers</span></div>
          </div>
        </div>

        {/* COLUMN 2: CARDS CONTAINER LIST */}
        <div className="w-[320px] border-r border-[#3C3C3C] flex flex-col shrink-0 overflow-y-auto bg-[#1E1E1E]">
          
          {selectedTab === 'admin' ? (
            <div className="p-3 bg-[#252526] h-full text-center flex flex-col justify-center items-center text-slate-400 space-y-3 font-mono">
              <Sliders className="w-10 h-10 text-purple-400 animate-spin" />
              <div>
                <p className="text-white font-bold text-xs uppercase">Marketplace Admin Mode</p>
                <p className="text-[10px] mt-1 text-slate-500">Access statistics, check revenue, and approve pending extensions.</p>
              </div>
              <button 
                onClick={() => setSelectedExtension(null)} 
                className="px-3 py-1 bg-[#37373D] text-white hover:bg-[#4C4C4C] rounded text-xs transition"
              >
                Access Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="p-2.5 border-b border-[#3C3C3C] bg-[#252526] text-[10px] font-bold tracking-widest uppercase text-slate-400 flex justify-between select-none">
                <span>{selectedTab.toUpperCase()} EXTENSIONS ({filteredExtensions.length})</span>
                <span className="text-[#007ACC]">FILTERED</span>
              </div>

              <div className="flex-1 divide-y divide-[#2D2D30]">
                {filteredExtensions.map((ext) => {
                  const isInstalled = installedExtensions.includes(ext.id);
                  const isEnabled = enabledExtensions.includes(ext.id);
                  const isSelected = selectedExtension?.id === ext.id;

                  return (
                    <div
                      key={ext.id}
                      onClick={() => {
                        setSelectedExtension(ext);
                        setDetailTab('readme');
                      }}
                      className={`p-3.5 text-left transition cursor-pointer select-none relative flex flex-col gap-2 ${
                        isSelected 
                          ? 'bg-[#252526] border-l-4 border-[#007ACC]' 
                          : 'hover:bg-[#252526]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="bg-[#1E1E1E] p-2 rounded-lg border border-[#3C3C3C] shrink-0">
                          {getIcon(ext.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white truncate text-[12px]">{ext.name}</span>
                            {ext.isVerified && (
                              <span className="w-3.5 h-3.5 rounded-full bg-blue-900/40 text-blue-400 border border-blue-800/40 flex items-center justify-center text-[8px] font-extrabold shrink-0" title="Developer Verified Badge">✓</span>
                            )}
                          </div>
                          
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            {ext.publisher} • v{ext.version}
                          </div>
                        </div>

                        {/* Price Badge */}
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-black font-mono tracking-wider shrink-0 uppercase ${
                          ext.price === 'premium' ? 'bg-amber-950/40 text-amber-500 border border-amber-900/40' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {ext.price === 'premium' ? `$${ext.priceValue}` : 'FREE'}
                        </span>
                      </div>

                      <p className="text-[10.5px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {ext.description}
                      </p>

                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-[#2D2D30]/50 text-[10px] font-mono select-none">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {ext.rating}
                          </span>
                          <span className="text-slate-500">
                            {ext.downloads.toLocaleString()} downloads
                          </span>
                        </div>

                        {/* Tiny Switch Enablement */}
                        {isInstalled && (
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-500">Active</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEnableExtension(ext.id);
                              }}
                              className={`w-7 h-4 rounded-full relative transition ${
                                isEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                              }`}
                            >
                              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                                isEnabled ? 'left-3.5' : 'left-0.5'
                              }`} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredExtensions.length === 0 && (
                  <div className="p-8 text-center text-slate-500 space-y-2 select-none">
                    <Grid className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-bold font-mono">No extensions matches filters.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* COLUMN 3: MAIN VIEW (EXTENSION DETAILS PAGE OR ADMIN DASHBOARD) */}
        <div className="flex-1 overflow-y-auto bg-[#1E1E1E] text-left p-6">
          
          {checkoutExtension && (
            <div className="max-w-xl mx-auto bg-[#252526] border border-amber-900/40 rounded-xl p-6 shadow-2xl relative">
              <button 
                onClick={() => setCheckoutExtension(null)}
                className="absolute top-4 right-4 hover:text-white text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 border-b border-[#3C3C3C] pb-4 mb-4 select-none">
                <Coins className="w-8 h-8 text-amber-500 animate-spin shrink-0" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase">Secure Checkout with Bybit Pay</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Premium license processing powered by YOUMI ecosystem.</p>
                </div>
              </div>

              <div className="bg-[#1E1E1E] p-3.5 rounded-lg border border-[#3C3C3C] mb-4 space-y-1 select-none">
                <div className="text-[10px] uppercase text-[#007ACC] font-mono">EXTENSION BILLING DETAIL</div>
                <div className="text-white font-bold">{checkoutExtension.displayName}</div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-slate-400">Merchant:</span>
                  <span className="font-mono text-[#007ACC] font-bold">YOUMI Marketplace Inc</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-0.5 pt-1 border-t border-slate-800">
                  <span className="text-slate-300 font-bold">Total price:</span>
                  <span className="text-amber-500 font-black font-mono text-sm">${checkoutExtension.priceValue}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10.5px] font-bold uppercase text-slate-400 select-none">PAYMENT GATEWAY CHANNEL</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('bybit')}
                    className={`p-3 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'bybit' ? 'border-amber-500 bg-amber-950/20 text-white' : 'border-[#3C3C3C] bg-[#1E1E1E] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Coins className="w-5 h-5 text-amber-500" />
                    <span>Bybit Pay (Crypto/USDT)</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'card' ? 'border-[#007ACC] bg-[#007ACC]/10 text-white' : 'border-[#3C3C3C] bg-[#1E1E1E] text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-sky-400" />
                    <span>Credit Card</span>
                  </button>
                </div>

                {paymentMethod === 'bybit' ? (
                  <div className="space-y-2 bg-[#1E1E1E] p-3 rounded border border-amber-900/30">
                    <div className="text-[9.5px] text-slate-400 leading-normal">
                      Send exactly <strong className="text-amber-500 font-mono">{checkoutExtension.priceValue} USDT</strong> to the wallet address below, or accept the instant wallet sign transaction.
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase block">Bybit Merchant Address</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={cryptoAddress} 
                        className="w-full bg-[#252526] border border-[#3C3C3C] text-[#CCCCCC] text-[10.5px] font-mono rounded px-2 py-1 focus:outline-none" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-[#1E1E1E] p-3 rounded border border-slate-800">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase block">Simulated Card Number</label>
                      <input 
                        type="text" 
                        placeholder="4000 1234 5678 9010" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#252526] border border-[#3C3C3C] text-white text-xs rounded px-2 py-1 font-mono focus:outline-none" 
                      />
                    </div>
                  </div>
                )}

                {paymentStep === 'paying' ? (
                  <div className="py-4 text-center font-mono text-xs text-amber-500 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Contacting server and validating transaction block...</span>
                  </div>
                ) : paymentStep === 'success' ? (
                  <div className="py-4 text-center font-mono text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-5 h-5" />
                    <span>License acquired! Downloading package payload...</span>
                  </div>
                ) : (
                  <button
                    onClick={executePayment}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-colors uppercase cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Authorize Transaction of ${checkoutExtension.priceValue}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'admin' && !checkoutExtension && (
            <div className="space-y-6">
              
              {/* ADMIN GRID METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#252526] border border-[#3C3C3C] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">TOTAL EXTENSIONS</div>
                    <div className="text-xl font-black text-white mt-1">12</div>
                  </div>
                  <Cpu className="w-8 h-8 text-purple-400 opacity-60" />
                </div>
                <div className="p-4 bg-[#252526] border border-[#3C3C3C] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">TOTAL DOWNLOADS</div>
                    <div className="text-xl font-black text-white mt-1">55,420</div>
                  </div>
                  <Download className="w-8 h-8 text-blue-400 opacity-60" />
                </div>
                <div className="p-4 bg-[#252526] border border-[#3C3C3C] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">SIMULATED REVENUE</div>
                    <div className="text-xl font-black text-emerald-400 mt-1">$6,472.00</div>
                  </div>
                  <Coins className="w-8 h-8 text-emerald-400 opacity-60" />
                </div>
                <div className="p-4 bg-[#252526] border border-[#3C3C3C] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">PENDING REVIEW</div>
                    <div className="text-xl font-black text-amber-500 mt-1">3</div>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-amber-500 opacity-60" />
                </div>
              </div>

              {/* RECHARTS TRAFFIC PLOT */}
              <div className="p-5 bg-[#252526] border border-[#3C3C3C] rounded-xl space-y-4">
                <div className="flex justify-between items-center select-none">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase">Marketplace Downloads & Trends</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Daily metrics compiled for active YOUMI developer hub.</p>
                  </div>
                  <div className="flex gap-1 bg-[#1E1E1E] p-1 rounded border border-[#3C3C3C]">
                    <button
                      onClick={() => setAdminReportFilter('downloads')}
                      className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold transition cursor-pointer ${
                        adminReportFilter === 'downloads' ? 'bg-[#007ACC] text-white' : 'text-slate-400'
                      }`}
                    >
                      Downloads
                    </button>
                    <button
                      onClick={() => setAdminReportFilter('revenue')}
                      className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold transition cursor-pointer ${
                        adminReportFilter === 'revenue' ? 'bg-[#007ACC] text-white' : 'text-slate-400'
                      }`}
                    >
                      Revenue ($)
                    </button>
                  </div>
                </div>

                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={adminReportFilter === 'downloads' ? '#007ACC' : '#10B981'} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={adminReportFilter === 'downloads' ? '#007ACC' : '#10B981'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D2D30" />
                      <XAxis dataKey="date" stroke="#858585" fontSize={10} tickLine={false} />
                      <YAxis stroke="#858585" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #3C3C3C', color: '#FFF', fontSize: 10 }} />
                      <Area 
                        type="monotone" 
                        dataKey={adminReportFilter} 
                        stroke={adminReportFilter === 'downloads' ? '#007ACC' : '#10B981'} 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DEV APPROVAL REQUESTS */}
              <div className="bg-[#252526] border border-[#3C3C3C] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-black text-white uppercase select-none">Pending Developer Submissions</h3>
                
                <div className="divide-y divide-[#3C3C3C]">
                  {[
                    { id: 'wh', name: 'Webhooks Relay', pub: 'RelayGroup', category: 'Integrations', version: '1.0.0' },
                    { id: 'font', name: 'Arabic Cairo Pack', pub: 'DZDZ Designer', category: 'Themes', version: '1.2.0' },
                    { id: 'yal', name: 'YalBus Quick Print', pub: 'Algeria Code', category: 'Integrations', version: '2.0.1' },
                  ].map((req) => (
                    <div key={req.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{req.name} <span className="text-[10px] text-slate-500 font-mono">v{req.version}</span></div>
                        <div className="text-[10px] text-slate-400 font-mono">Submitted by: {req.pub} • Category: {req.category}</div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button 
                          onClick={() => showNotification(`Approved and compiled: ${req.name}`)}
                          className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => showNotification(`Rejected: ${req.name}`)}
                          className="px-2 py-0.5 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* D. SINGLE EXTENSION GENERAL DETAIL PAGE */}
          {selectedExtension && !checkoutExtension && selectedTab !== 'admin' && (
            <div className="space-y-6">
              
              {/* DETAIL TITLE HEADER */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#3C3C3C]">
                <div className="flex items-start gap-4">
                  <div className="bg-[#252526] p-4 rounded-xl border border-[#3C3C3C] shrink-0">
                    {getIcon(selectedExtension.icon)}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">{selectedExtension.displayName}</h2>
                    <p className="text-xs text-slate-400 mt-1 select-none font-mono">
                      {selectedExtension.id} • v{selectedExtension.version} • Author: <span className="text-[#007ACC] hover:underline cursor-pointer">{selectedExtension.author}</span>
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2.5 text-[11px] select-none">
                      <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {selectedExtension.rating} Stars
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400 font-mono">
                        {selectedExtension.downloads.toLocaleString()} installs
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded px-1.5 py-0.1 font-bold">
                        {selectedExtension.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTROLLERS BUTTONS */}
                <div className="flex flex-col gap-1.5 shrink-0 select-none">
                  {installedExtensions.includes(selectedExtension.id) ? (
                    <div className="space-y-1.5 text-right">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUpdateExtension(selectedExtension)}
                          className="px-3 py-1 bg-[#37373D] hover:bg-[#4C4C4C] text-[#CCCCCC] rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>
                        <button
                          onClick={() => handleUninstallExtension(selectedExtension.id)}
                          className="px-3 py-1 bg-rose-955/20 hover:bg-rose-900/40 text-rose-400 rounded text-xs font-bold transition border border-transparent hover:border-rose-900/40 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Uninstall</span>
                        </button>
                      </div>
                      
                      {/* Active Toggle Switch */}
                      <div className="inline-flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">Extension active in workspace</span>
                        <button
                          onClick={() => toggleEnableExtension(selectedExtension.id)}
                          className={`w-8 h-4.5 rounded-full relative transition ${
                            enabledExtensions.includes(selectedExtension.id) ? 'bg-emerald-600' : 'bg-slate-700'
                          }`}
                        >
                          <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${
                            enabledExtensions.includes(selectedExtension.id) ? 'left-4' : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInstallExtension(selectedExtension)}
                      className={`px-5 py-2 rounded font-bold text-xs text-center transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                        selectedExtension.price === 'premium'
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-[#007ACC] hover:bg-sky-600 text-white'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {selectedExtension.price === 'premium' ? `Purchase for $${selectedExtension.priceValue}` : 'Install free'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* TABS NAVIGATION */}
              <div className="border-b border-[#3C3C3C] flex gap-4 text-xs font-bold uppercase select-none">
                {[
                  { id: 'readme', label: 'README.md' },
                  { id: 'changelog', label: 'Changelog' },
                  { id: 'settings', label: 'Settings Fields' },
                  { id: 'permissions', label: 'Security & Sandbox' },
                  { id: 'sdk', label: 'Developer SDK usage' }
                ].map((t) => {
                  if (t.id === 'settings' && !installedExtensions.includes(selectedExtension.id)) return null;
                  const isActive = detailTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setDetailTab(t.id as any)}
                      className={`pb-2.5 transition relative cursor-pointer ${
                        isActive 
                          ? 'text-white font-black border-b-2 border-[#007ACC]' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* DETAILS CONTENT SCROLLER */}
              <div className="bg-[#1E1E1E] text-slate-300 min-h-[220px]">
                
                {/* 1. README TAB */}
                {detailTab === 'readme' && (
                  <div className="space-y-4 font-sans select-text">
                    <div className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed space-y-3">
                      <p className="font-bold text-slate-200">Description Overview:</p>
                      <p>{selectedExtension.description}</p>
                      
                      <div className="p-3.5 bg-[#252526] rounded border border-slate-800/80 font-mono text-[11px] text-slate-400">
                        <span className="text-[#007ACC] font-bold">homepage:</span> <a href={selectedExtension.homepage} target="_blank" rel="noopener noreferrer" className="hover:underline">{selectedExtension.homepage}</a><br/>
                        <span className="text-[#007ACC] font-bold">repository:</span> <a href={selectedExtension.repository} target="_blank" rel="noopener noreferrer" className="hover:underline">{selectedExtension.repository}</a><br/>
                        <span className="text-[#007ACC] font-bold">license:</span> {selectedExtension.license}
                      </div>

                      <div className="whitespace-pre-wrap font-sans text-slate-300">
                        {selectedExtension.readme}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CHANGELOG TAB */}
                {detailTab === 'changelog' && (
                  <div className="font-sans select-text whitespace-pre-wrap text-xs text-slate-300 leading-relaxed">
                    {selectedExtension.changelog}
                  </div>
                )}

                {/* 3. DYNAMIC SETTINGS TAB */}
                {detailTab === 'settings' && (
                  <div className="space-y-4 bg-[#252526] p-4 rounded-xl border border-[#3C3C3C]">
                    <div className="flex items-center gap-1.5 border-b border-[#3C3C3C] pb-2 mb-2 select-none">
                      <Settings className="w-4 h-4 text-[#007ACC]" />
                      <span className="text-xs font-black text-white uppercase">Extension Configuration Options</span>
                    </div>

                    <div className="space-y-3.5">
                      {selectedExtension.id === 'youmi-copilot-ai' && (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 block font-mono">Gemini AI Model Selector</label>
                            <select
                              value={extensionSettings['youmi-copilot-ai']?.aiModel || 'Gemini 2.5 Flash'}
                              onChange={(e) => updateSetting('youmi-copilot-ai', 'aiModel', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#1E1E1E] border border-[#3C3C3C] rounded text-xs text-white focus:outline-none focus:border-[#007ACC]"
                            >
                              <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Default)</option>
                              <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Precision)</option>
                              <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Legacy)</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between py-1 bg-[#1E1E1E] px-2.5 rounded border border-slate-800">
                            <span className="text-xs font-bold text-slate-300 select-none">Auto Translation pipeline active</span>
                            <input 
                              type="checkbox"
                              checked={extensionSettings['youmi-copilot-ai']?.autoTranslate || false}
                              onChange={(e) => updateSetting('youmi-copilot-ai', 'autoTranslate', e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-[#3C3C3C] cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 block font-mono">Max Generation Tokens</label>
                            <input
                              type="number"
                              value={extensionSettings['youmi-copilot-ai']?.maxTokens || 2048}
                              onChange={(e) => updateSetting('youmi-copilot-ai', 'maxTokens', parseInt(e.target.value))}
                              className="w-full px-2.5 py-1 bg-[#1E1E1E] border border-[#3C3C3C] rounded text-xs text-white font-mono focus:outline-none"
                            />
                          </div>
                        </>
                      )}

                      {selectedExtension.id === 'aesthetic-neon-dark' && (
                        <>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 font-mono">
                              <span>Neon Glow Intensity</span>
                              <span>{extensionSettings['aesthetic-neon-dark']?.neonIntensity || 80}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={extensionSettings['aesthetic-neon-dark']?.neonIntensity || 80}
                              onChange={(e) => updateSetting('aesthetic-neon-dark', 'neonIntensity', parseInt(e.target.value))}
                              className="w-full cursor-pointer accent-[#007ACC]"
                            />
                          </div>

                          <div className="flex items-center justify-between py-1 bg-[#1E1E1E] px-2.5 rounded border border-slate-800">
                            <span className="text-xs font-bold text-slate-300 select-none">Glow outer borders of storefront</span>
                            <input 
                              type="checkbox"
                              checked={extensionSettings['aesthetic-neon-dark']?.glowingBorders || false}
                              onChange={(e) => updateSetting('aesthetic-neon-dark', 'glowingBorders', e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-[#3C3C3C] cursor-pointer"
                            />
                          </div>
                        </>
                      )}

                      {selectedExtension.id === 'bybit-pay-gate' && (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 block font-mono">Bybit Merchant API Token Key</label>
                            <input
                              type="password"
                              placeholder="bybit_live_xxxxxxxxxxxxxxxx"
                              value={extensionSettings['bybit-pay-gate']?.apiKey || ''}
                              onChange={(e) => updateSetting('bybit-pay-gate', 'apiKey', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#1E1E1E] border border-[#3C3C3C] rounded text-xs text-white font-mono focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center justify-between py-1 bg-[#1E1E1E] px-2.5 rounded border border-slate-800">
                            <span className="text-xs font-bold text-slate-300 select-none">Accept Testnet payments</span>
                            <input 
                              type="checkbox"
                              checked={extensionSettings['bybit-pay-gate']?.testMode || false}
                              onChange={(e) => updateSetting('bybit-pay-gate', 'testMode', e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-[#3C3C3C]"
                            />
                          </div>
                        </>
                      )}

                      {/* Fallback settings representation if none configured */}
                      {!['youmi-copilot-ai', 'aesthetic-neon-dark', 'bybit-pay-gate'].includes(selectedExtension.id) && (
                        <div className="space-y-3">
                          <p className="text-slate-400 text-xs">This extension exposes a default JSON configuration schema.</p>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 block font-mono">Parameters values</label>
                            <textarea 
                              rows={4}
                              className="w-full px-2 py-1.5 bg-[#1E1E1E] border border-[#3C3C3C] rounded text-xs text-slate-300 font-mono focus:outline-none"
                              placeholder='{\n  "mode": "production",\n  "cacheTimeout": 3600\n}'
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        showNotification(language === 'ar' ? '💾 تم حفظ إعدادات الملحق بنجاح' : '💾 Extension preferences updated and auto-saved');
                        addLog(`System: Settings updated for "${selectedExtension.name}"`);
                      }}
                      className="mt-3.5 px-3 py-1 bg-[#007ACC] text-white hover:bg-sky-600 rounded text-xs font-bold transition cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>
                )}

                {/* 4. PERMISSIONS TAB */}
                {detailTab === 'permissions' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#252526] border border-[#3C3C3C] rounded-xl flex items-start gap-3 select-none">
                      <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-white uppercase">Isolate Execution Sandbox</h4>
                        <p className="text-[10.5px] text-slate-400 mt-0.5 leading-normal">
                          All YOUMI marketplace extensions execute inside restricted Web Workers sandboxes. They cannot modify system configurations or query databases directly unless explicit permissions are granted.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 select-none">
                      <p className="text-[11px] font-bold text-slate-400">Required sandbox permissions for {selectedExtension.displayName}:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedExtension.permissions.map((p) => (
                          <div key={p} className="flex items-center gap-2 p-2 bg-[#252526] rounded border border-slate-800">
                            <span className="w-2 h-2 rounded-full bg-[#007ACC]" />
                            <div>
                              <div className="font-bold text-white text-[11px] uppercase font-mono">{p}</div>
                              <div className="text-[9px] text-slate-500 font-sans mt-0.5">
                                {p === 'network' && 'Allows sending analytics metrics securely via proxy.'}
                                {p === 'editor' && 'Allows editing color schemas, menus, and footer configs.'}
                                {p === 'AI' && 'Allows communicating with Gemini API models server-side.'}
                                {p === 'storage' && 'Allows storing lightweight settings securely on client state.'}
                                {p === 'Payments' && 'Required to trigger checkout links for checkout items.'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 select-none">
                      <p className="text-[11.5px] font-bold text-slate-400">Dependencies Resolution:</p>
                      <div className="p-3 bg-[#1E1E1E] rounded border border-[#3C3C3C] text-xs font-mono text-slate-400">
                        {selectedExtension.dependencies.length > 0 ? (
                          selectedExtension.dependencies.map(d => <div key={d}>- {d} (Installed)</div>)
                        ) : (
                          <div>✓ No external library dependencies required. Single-bundle compilation.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. SDK TAB */}
                {detailTab === 'sdk' && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-[#252526] border border-[#3C3C3C] rounded-xl flex items-start gap-3 select-none">
                      <Code className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-white uppercase">YOUMI extension.json Specification</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Manifest specification schema for extension declarations.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#252526] rounded-lg border border-slate-800 font-mono text-[10.5px] text-slate-300 overflow-x-auto select-text leading-relaxed">
                      <pre>{`{
  "id": "${selectedExtension.id}",
  "name": "${selectedExtension.name}",
  "displayName": "${selectedExtension.displayName}",
  "version": "${selectedExtension.version}",
  "author": "${selectedExtension.author}",
  "publisher": "${selectedExtension.publisher}",
  "license": "${selectedExtension.license}",
  "category": "${selectedExtension.category}",
  "permissions": ${JSON.stringify(selectedExtension.permissions)},
  "dependencies": ${JSON.stringify(selectedExtension.dependencies)},
  "entry": "${selectedExtension.entry}"
}`}</pre>
                    </div>

                    <p className="text-[11px] font-bold text-slate-400 select-none">Registering commands example in extension main bundle:</p>
                    <div className="p-3 bg-[#252526] rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400 overflow-x-auto select-text">
                      <pre className="text-purple-400">{`import { registerExtension, registerCommand } from 'youmi-sdk';

registerExtension({
  id: "${selectedExtension.id}",
  onActivate() {
    registerCommand("analyze-layout", () => {
      console.log("Analyzing DZ storefront sections layers...");
    });
  }
});`}</pre>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* INITIAL SPLASH / OVERVIEW PANEL */}
          {!selectedExtension && !checkoutExtension && selectedTab !== 'admin' && (
            <div className="h-full flex flex-col justify-center items-center text-center max-w-lg mx-auto py-8 select-none">
              <Grid className="w-14 h-14 text-slate-700 animate-pulse mb-4" />
              <h2 className="text-base font-black text-white uppercase tracking-wider">Visual Studio Code Extensions Environment</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Configure your YOUMI Builder e-commerce instance. Click an extension from the list to explore screenshots, release notes, license terms, and auto-generated settings panel.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md text-left">
                <div className="p-4 bg-[#252526] border border-[#3C3C3C] rounded-xl flex gap-3">
                  <Terminal className="w-5 h-5 text-[#007ACC] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Command Palette</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Press Ctrl+Shift+P to activate quick commands and run test scenarios.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-[#252526] border border-[#3C3C3C] rounded-xl flex gap-3">
                  <Sliders className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Settings Generator</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Installed extensions automatically build reactive controls to configure keys.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
