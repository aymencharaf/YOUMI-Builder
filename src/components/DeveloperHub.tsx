import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code, Shield, FolderTree, BookOpen, Cpu, Layers, 
  Search, Star, Download, CheckCircle2, AlertTriangle, Play, 
  RotateCcw, FileText, PlusCircle, Check, Hammer, HelpCircle, 
  Sparkles, Globe, User, ShieldAlert, BadgeCheck, MessageSquare, 
  Share2, ArrowUpRight, Copy, Database, Zap, Settings, Eye, 
  CheckCircle, ChevronRight, HardDrive, RefreshCw, Heart
} from 'lucide-react';

interface DeveloperHubProps {
  language: 'ar' | 'en';
  currentConfig: any;
  onApplyConfig: (config: any) => void;
  showNotification: (msg: string) => void;
}

// Interfaces for our virtual WordPress-like Ecosystem
interface DeveloperProfile {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  portfolioCount: number;
  rating: number;
  reviewsCount: number;
  registeredPacks: string[];
}

interface MarketItem {
  id: string;
  code: string;
  name: string;
  author: string;
  category: 'pack' | 'plugin' | 'theme' | 'widget';
  description: string;
  version: string;
  downloads: number;
  rating: number;
  reviewsCount: number;
  price: 'Free' | string;
  isInstalled: boolean;
  isFavorited: boolean;
  dependencies: string[];
  releaseNotes: string;
}

export default function DeveloperHub({ 
  language, 
  currentConfig, 
  onApplyConfig, 
  showNotification 
}: DeveloperHubProps) {
  // Tabs for the Developer Platform
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sdk' | 'cli' | 'marketplace' | 'docs' | 'sandbox'>('dashboard');
  
  // Developer Profile State
  const [devProfile, setDevProfile] = useState<DeveloperProfile | null>(() => {
    const saved = localStorage.getItem('youmi_dev_profile');
    if (saved) return JSON.parse(saved);
    return null;
  });

  // Developer Registration Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPortfolio, setRegPortfolio] = useState('https://github.com/developer');

  // Online Repository Community Marketplace Items State (Pre-populated similar to WordPress.org Plugin Directory)
  const [marketItems, setMarketItems] = useState<MarketItem[]>([
    {
      id: 'dev-pack-stripe',
      code: 'PACK-STRP',
      name: 'Stripe Instant Floating Checkout',
      author: 'Aymen AlgerianDev',
      category: 'pack',
      description: 'Provides a custom, fast Stripe overlay credit-card popup with direct conversion logs.',
      version: '1.2.4',
      downloads: 4820,
      rating: 4.8,
      reviewsCount: 32,
      price: 'Free',
      isInstalled: false,
      isFavorited: false,
      dependencies: ['PACK-046', 'PACK-051'],
      releaseNotes: 'v1.2.4: Fixed mobile safari scrolling viewport overlay issue.'
    },
    {
      id: 'dev-pack-whatsapp',
      code: 'PACK-WHSP',
      name: 'Smart WhatsApp Cart Order Dispatcher',
      author: 'Bilal Tech-Pro',
      category: 'pack',
      description: 'Sends the full customer order checklist, subtotal, and address directly via WhatsApp to the vendor.',
      version: '2.1.0',
      downloads: 12900,
      rating: 4.9,
      reviewsCount: 118,
      price: 'Free',
      isInstalled: false,
      isFavorited: true,
      dependencies: ['PACK-001', 'PACK-002'],
      releaseNotes: 'v2.1.0: Supports sending 58 wilayas local shipping rates automatically.'
    },
    {
      id: 'dev-theme-cyber',
      code: 'THEME-CYBR',
      name: 'Cyberpunk Neon Dark Store Theme',
      author: 'Yasmin Creative',
      category: 'theme',
      description: 'A dark glowing futuristic cyberpunk theme using intense teal and purple accents with space-grotesk font.',
      version: '1.0.0',
      downloads: 3200,
      rating: 4.7,
      reviewsCount: 14,
      price: '$12.00',
      isInstalled: false,
      isFavorited: false,
      dependencies: [],
      releaseNotes: 'v1.0.0: Initial public release with customizable grid alignments.'
    },
    {
      id: 'dev-plugin-pixel',
      code: 'PLUG-FBPIX',
      name: 'Facebook Conversions API Server-Side Pixel',
      author: 'Smail Analytics',
      category: 'plugin',
      description: 'Fires server-side event tracking to ensure 100% iOS 14+ purchase events delivery bypass.',
      version: '3.4.1',
      downloads: 8740,
      rating: 4.6,
      reviewsCount: 54,
      price: 'Free',
      isInstalled: false,
      isFavorited: false,
      dependencies: ['PACK-061'],
      releaseNotes: 'v3.4.1: Enhanced cloud signature verification handshake.'
    },
    {
      id: 'dev-widget-timer',
      code: 'WDG-SALE',
      name: 'Sticker Banner Flash Sale Countdown',
      author: 'Sofiane Dev',
      category: 'widget',
      description: 'Places a beautiful glowing floating micro-sale countdown sticky widget on checkout.',
      version: '1.1.2',
      downloads: 2150,
      rating: 4.5,
      reviewsCount: 9,
      price: 'Free',
      isInstalled: false,
      isFavorited: false,
      dependencies: ['PACK-011'],
      releaseNotes: 'v1.1.2: Added countdown reset interval option.'
    }
  ]);

  const [marketSearch, setMarketSearch] = useState('');
  const [marketCatFilter, setMarketCatFilter] = useState<'all' | 'pack' | 'plugin' | 'theme' | 'widget'>('all');

  // PACK SDK virtual workspace files
  const [selectedSdkFile, setSelectedSdkFile] = useState<string>('manifest.json');
  const [sdkFilesContent, setSdkFilesContent] = useState<Record<string, string>>({
    'manifest.json': `{
  "id": "youmi-stripe-addon",
  "name": "Stripe Smart Checkout Integration",
  "version": "1.2.4",
  "author": "YOUMI Verified Developer",
  "permissions": [
    "inject_scripts",
    "custom_headers",
    "access_cart_state"
  ],
  "signature": "sha256-df82c7a9163e9f4a8b7c6c4e0987aef234b025a1b3c4f5678a9c0d3e2b10a5",
  "compatibility": ">=2.4.0"
}`,
    'schema.json': `{
  "properties": {
    "stripePublicKey": {
      "type": "string",
      "title": "Stripe Live Key",
      "default": "pk_live_..."
    },
    "enableApplePay": {
      "type": "boolean",
      "title": "Enable Apple Pay Checkout",
      "default": true
    },
    "buttonTheme": {
      "type": "string",
      "enum": ["dark", "light", "custom"],
      "default": "dark"
    }
  }
}`,
    'config.json': `{
  "stripePublicKey": "pk_live_youmi_builder_custom_keys",
  "enableApplePay": true,
  "buttonTheme": "dark"
}`,
    'README.md': `# Stripe Smart Checkout Add-on
Allows Algerian and international merchants to capture instant debit card payments.

### Features
- 3D Secure Verification
- Google Pay & Apple Pay automated detection
- Smooth viewport responsive scaling

### Developer Support
Published by YOUMI Core Partner program.`,
    'src/index.tsx': `// Custom React component injected securely on the Canvas
import React, { useState } from 'react';

export default function StripeCheckoutWidget({ config, cartState }) {
  const [status, setStatus] = useState('idle');

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('completed');
      alert('Payment Simulated Successfully!');
    }, 1500);
  };

  return (
    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
      <h3 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">
        Secure Stripe Checkout Gateway
      </h3>
      <p className="text-xs text-slate-400 mb-3">Live Key: {config.stripePublicKey}</p>
      
      <button 
        onClick={handlePay}
        className="w-full py-2 bg-[#0F766E] text-white rounded-lg text-xs font-bold transition hover:opacity-90 flex items-center justify-center gap-2"
      >
        {status === 'processing' ? 'Processing...' : status === 'completed' ? 'Paid ✓' : 'Pay via Credit Card'}
      </button>
    </div>
  );
}`,
    'src/styles.css': `/* Injected component styles */
.stripe-floating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #3B82F6;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: bold;
}`,
    'src/hooks.js': `// Custom Developer Hooks
export function useStripeExchangeRate(currency) {
  const [rate, setRate] = useState(1.0);
  useEffect(() => {
    // Simulated live API response
    if (currency === 'DA') setRate(140.5);
  }, [currency]);
  return rate;
}`
  });

  // CLI Emulator Terminal State
  const [cliHistory, setCliHistory] = useState<string[]>([
    'YOUMI Platform CLI [Version 2.4.0]',
    'Type "help" or run "youmi --help" to see available command systems.',
    ''
  ]);
  const [cliInput, setCliInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Security Sandbox Gates State
  const [sandboxedPermissions, setSandboxedPermissions] = useState({
    accessCartState: true,
    injectScripts: true,
    accessSiteInfo: false,
    networkRequests: true,
    apiProxyAccess: false
  });

  const [digitalSignatureStatus, setDigitalSignatureStatus] = useState<'valid' | 'unsigned' | 'corrupted'>('valid');

  // AI Support: AI Pack Generator Prompt & State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Auto Scroll Terminal to bottom
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cliHistory]);

  const handleDevRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      showNotification(language === 'ar' ? '⚠️ يرجى ملء الحقول المطلوبة' : '⚠️ Please fill in all required fields');
      return;
    }

    const newProfile: DeveloperProfile = {
      id: `dev-${Math.floor(Math.random() * 90000) + 10000}`,
      name: regName,
      email: regEmail,
      isVerified: true,
      portfolioCount: 1,
      rating: 5.0,
      reviewsCount: 1,
      registeredPacks: ['PACK-STRP']
    };

    setDevProfile(newProfile);
    localStorage.setItem('youmi_dev_profile', JSON.stringify(newProfile));
    showNotification(language === 'ar' ? '🎉 تم تسجيل حسابك كـ مطور معتمد!' : '🎉 Successfully registered as a Verified Developer!');
  };

  const handleInstallPack = (packId: string) => {
    setMarketItems(prev => prev.map(item => {
      if (item.id === packId) {
        if (item.isInstalled) {
          // Uninstall
          showNotification(language === 'ar' ? `🗑️ تم إلغاء تثبيت ${item.name}` : `🗑️ Uninstalled ${item.name}`);
          return { ...item, isInstalled: false };
        } else {
          // Install with Dependency manager check!
          showNotification(language === 'ar' 
            ? `📥 جاري تثبيت الملحق والمستندات والتحقق من التبعيات: ${item.dependencies.join(', ')}` 
            : `📥 Installing pack, schema assets and analyzing dependencies: ${item.dependencies.join(', ')}`
          );
          return { ...item, isInstalled: true };
        }
      }
      return item;
    }));
  };

  const handleFavoritePack = (packId: string) => {
    setMarketItems(prev => prev.map(item => {
      if (item.id === packId) {
        return { ...item, isFavorited: !item.isFavorited };
      }
      return item;
    }));
  };

  // Run Virtual CLI Shell commands
  const handleCliCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = cliInput.trim();
    if (!command) return;

    const newHistory = [...cliHistory, `youmi-shell$ ${command}`];
    const parts = command.split(' ');
    const baseCommand = parts[0];
    const subCommand = parts[1];
    const targetName = parts[2] || 'custom-addon';

    switch (baseCommand) {
      case 'help':
      case 'youmi':
        if (subCommand === 'create' || parts.includes('--help')) {
          newHistory.push(
            'YOUMI CLI Dev Commands Toolkit:',
            '  youmi create pack <name>    - Create new modular commerce PACK structure',
            '  youmi create plugin <name>  - Create a sandboxed plugin extension script',
            '  youmi create theme <name>   - Create deep styling colors and typography themes',
            '  youmi validate              - Verify digital signatures and schema compliance',
            '  youmi publish               - Publish the active bundle direct to WordPress-style repo',
            '  clear                       - Clear console logs screen'
          );
        } else {
          newHistory.push(
            'Available commands:',
            '  youmi create [pack|plugin|theme] <name>',
            '  youmi validate',
            '  youmi publish',
            '  clear'
          );
        }
        break;

      case 'clear':
        setCliHistory([]);
        setCliInput('');
        return;

      case 'youmi create':
      case 'youmi':
        if (subCommand === 'create') {
          const type = parts[2];
          const name = parts[3] || 'my-awesome-addon';
          newHistory.push(
            `🚀 Creating fresh custom ${type || 'pack'} schema scaffolding named "${name}"...`,
            `  [+] Initialized /${type || 'packs'}/${name}/manifest.json`,
            `  [+] Generated /${type || 'packs'}/${name}/schema.json for Inspector UI mapping`,
            `  [+] Configured /${type || 'packs'}/${name}/config.json defaults`,
            `  [+] Created /${type || 'packs'}/${name}/src/index.tsx React hooks`,
            `🎉 Scaffolding compiled! Run "youmi validate" next to check rules.`
          );
          showNotification(`Created scaffold for ${name}`);
        } else if (subCommand === 'validate') {
          newHistory.push(
            '🔍 Validating manifest.json structure...',
            '  ✓ manifest.json includes security signature.',
            '  ✓ schema.json parameters are mapping properly to YOUMI inspector fields.',
            '  ✓ src/index.tsx code compiles perfectly under sandbox environment rules.',
            '🟢 Validation Succeeded! Ready for production deployment.'
          );
        } else if (subCommand === 'publish') {
          newHistory.push(
            '📤 Compiling production package ZIP bundle...',
            '🔒 Appending digital signature and metadata headers...',
            '🛰️ Handshaking with YOUMI WordPress-like open marketplace servers...',
            '🎉 Bundle uploaded successfully! Live updates pushed to +12,900 Active installs.'
          );
          showNotification('Plugin published successfully to Community Repository!');
        } else {
          newHistory.push(`Unknown sub-command system: "${subCommand}". Run "youmi --help" for list.`);
        }
        break;

      default:
        newHistory.push(`command not found: "${baseCommand}". Type "help" to view options.`);
    }

    setCliHistory(newHistory);
    setCliInput('');
  };

  // Generate pack securely with AI
  const handleAiPackGenerate = () => {
    if (!aiPrompt) {
      showNotification(language === 'ar' ? '⚠️ يرجى كتابة فكرة الإضافة أولاً' : '⚠️ Please describe your add-on first');
      return;
    }

    setIsAiGenerating(true);
    
    setTimeout(() => {
      // Create code files dynamically based on input
      const sanitizedName = aiPrompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24);
      
      const generatedManifest = `{
  "id": "${sanitizedName}",
  "name": "AI ${aiPrompt.split(' ').slice(0, 3).join(' ')}",
  "version": "1.0.0",
  "author": "YOUMI AI Code Generator",
  "permissions": [
    "inject_scripts",
    "access_cart_state"
  ],
  "signature": "sha256-gen-ai-${Math.random().toString(16).slice(2)}"
}`;

      const generatedIndex = `// AI Generated React Component based on prompt: "${aiPrompt}"
import React, { useState } from 'react';

export default function GeneratedWidget({ config, cartState }) {
  const [active, setActive] = useState(false);

  return (
    <div className="p-4 border-2 border-dashed border-teal-500 rounded-2xl bg-teal-50/10 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-teal-400 font-extrabold">
          ✨ AI Generated Add-on
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
      </div>
      <h3 className="text-sm font-black text-slate-100 mb-1">
        ${aiPrompt}
      </h3>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Custom component live injected inside the layout container canvas securely.
      </p>
      
      <button 
        onClick={() => setActive(!active)}
        className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg text-xs font-bold w-full transition hover:scale-[1.02]"
      >
        {active ? 'Component Active ✓' : 'Trigger Custom Action'}
      </button>
    </div>
  );
}`;

      setSdkFilesContent(prev => ({
        ...prev,
        'manifest.json': generatedManifest,
        'src/index.tsx': generatedIndex
      }));

      setIsAiGenerating(false);
      showNotification(language === 'ar' ? '✨ تم توليد الأكواد والملفات عن طريق الذكاء الاصطناعي بنجاح!' : '✨ AI successfully built full code files inside your SDK workspace!');
      setActiveTab('sdk');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl overflow-hidden font-sans border border-slate-800" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Platform Header */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-teal-950/40 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-[9px] font-black rounded-md tracking-wider uppercase">
              WordPress Ecosystem v2.4
            </span>
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Hammer className="w-5 h-5 text-teal-500" />
            {language === 'ar' ? 'منصة يومي المفتوحة للمطورين' : 'YOUMI Open Developer Platform'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'ar' 
              ? 'برمج، جرب، وانشر الإضافات (PACKs) والسمات المخصصة وحزم الأكواد بحرية تامة.'
              : 'Create, sandbox, monetize, and distribute custom commerce packages and plugins.'}
          </p>
        </div>

        {/* Action button bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              const fileContent = JSON.stringify(sdkFilesContent, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(fileContent);
              const link = document.createElement('a');
              link.setAttribute('href', dataUri);
              link.setAttribute('download', 'youmi-sdk-package.json');
              document.body.appendChild(link);
              link.click();
              link.remove();
              showNotification(language === 'ar' ? '📦 تم تحميل حزمة SDK البرمجية بنجاح' : '📦 Downloaded SDK package workspace files!');
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تحميل حزمة SDK' : 'Download ZIP Payload'}</span>
          </button>

          <a 
            href="#live-preview-container"
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold rounded-lg transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'معاينة حية' : 'Live Preview'}</span>
          </a>
        </div>
      </div>

      {/* Navigation tabs for Platform */}
      <div className="bg-slate-900 border-b border-slate-800 flex overflow-x-auto text-[11px] font-extrabold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard' ? 'border-teal-500 bg-teal-500/5 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'حساب المطور والداشبورد' : 'Developer Dashboard'}</span>
        </button>

        <button
          onClick={() => setActiveTab('sdk')}
          className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'sdk' ? 'border-teal-500 bg-teal-500/5 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'بيئة التطوير SDK' : 'PACK Code SDK'}</span>
        </button>

        <button
          onClick={() => setActiveTab('cli')}
          className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'cli' ? 'border-teal-500 bg-teal-500/5 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الـ CLI والمحاكاة' : 'Developer CLI Terminal'}</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'marketplace' ? 'border-teal-500 bg-teal-500/5 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'سوق الملحقات والقوالب' : 'WordPress-style Repo'}</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'sandbox' ? 'border-teal-500 bg-teal-500/5 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الأمان والصلاحيات' : 'Sandbox & Permissions'}</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`px-5 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'docs' ? 'border-teal-500 bg-teal-500/5 text-teal-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'التوثيق ومرجع الـ API' : 'API Docs & Guides'}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* TAB 1: DEVELOPER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {!devProfile ? (
              <div className="max-w-xl mx-auto p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ar' ? 'سجل كـ مطور في منصة يومي المفتوحة' : 'Register as a YOUMI Ecosystem Developer'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'ar' 
                      ? 'انضم لأكثر من 500 مطور جزائري وعالمي يساهمون في بناء وتطوير متاجر يومي الرقمية.'
                      : 'Publish custom templates, scripts, shipping wrappers, or checkout portals and start selling.'}
                  </p>
                </div>

                <form onSubmit={handleDevRegister} className="space-y-3 text-start" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {language === 'ar' ? 'الاسم الكامل المكتوب' : 'Full / Business Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Reda AlgerianDev"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {language === 'ar' ? 'البريد الإلكتروني المهني' : 'Professional Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. reda@algeriadev.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {language === 'ar' ? 'معرض الأعمال أو Github' : 'Github Portfolio / Website'}
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://github.com/myusername"
                      value={regPortfolio}
                      onChange={(e) => setRegPortfolio(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
                  >
                    {language === 'ar' ? 'تأكيد التسجيل وتفعيل الحساب' : 'Submit & Activate Developer Credentials'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Profile Card */}
                <div className="md:col-span-1 p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-500 text-slate-950 font-black text-lg flex items-center justify-center">
                      {devProfile.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-extrabold text-white text-sm">{devProfile.name}</h4>
                        <BadgeCheck className="w-4 h-4 text-teal-400 fill-teal-400/10" />
                      </div>
                      <span className="text-[10px] text-slate-400">{devProfile.email}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/60">
                      <span className="text-[9px] text-slate-500 block uppercase font-mono">Portfolio</span>
                      <span className="text-sm font-black text-teal-400">{devProfile.portfolioCount} Active</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/60">
                      <span className="text-[9px] text-slate-500 block uppercase font-mono">Rating</span>
                      <span className="text-sm font-black text-amber-400">★ {devProfile.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Developer verification status
                    </span>
                    <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-xl flex items-center gap-2.5 text-xs text-teal-400">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <div>
                        <span className="font-bold block">Verified Gold Partner</span>
                        <span className="text-[10px] text-slate-400">Access to global API proxy pipelines and custom CJS runtime.</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.removeItem('youmi_dev_profile');
                      setDevProfile(null);
                      showNotification('Signed out of developer hub');
                    }}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs rounded-xl font-bold transition"
                  >
                    {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out Developer Account'}
                  </button>
                </div>

                {/* Dashboard Metrics */}
                <div className="md:col-span-2 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Active Downloads</span>
                        <span className="text-lg font-black text-white mt-1 block">17,720</span>
                        <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">↑ 14% this week</span>
                      </div>
                      <Download className="w-8 h-8 text-teal-500/20" />
                    </div>

                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Simulated Revenue</span>
                        <span className="text-lg font-black text-white mt-1 block">$384.50</span>
                        <span className="text-[9px] text-teal-400 font-bold block mt-0.5">WP.org Paid Store</span>
                      </div>
                      <Database className="w-8 h-8 text-blue-500/20" />
                    </div>

                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Global Rank</span>
                        <span className="text-lg font-black text-white mt-1 block">Top #45</span>
                        <span className="text-[9px] text-amber-400 font-bold block mt-0.5">Community Verified</span>
                      </div>
                      <Zap className="w-8 h-8 text-amber-500/20" />
                    </div>
                  </div>

                  {/* Registered Extensions List */}
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase text-white tracking-wider">
                        My Registered Packages & Plugins
                      </h4>
                      <button
                        onClick={() => setActiveTab('sdk')}
                        className="text-[10px] text-teal-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <span>Create New</span>
                        <PlusCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-800/60">
                      <div className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">Stripe Smart Checkout Integration</span>
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">LIVE</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">Version 1.2.4 • Last updated July 2026 • 4,820 downloads</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setActiveTab('sdk')}
                            className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                          >
                            <Code className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PACK CODE SDK WORKSPACE */}
        {activeTab === 'sdk' && (
          <div className="space-y-4">
            {/* AI Generator Helper Bar */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-teal-400">
                <Sparkles className="w-4 h-4 animate-spin" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  {language === 'ar' ? 'مساعد الذكاء الاصطناعي لتوليد الحزم تلقائياً' : 'AI-Powered Pack Generator Co-Pilot'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {language === 'ar'
                  ? 'صف الإضافة التي ترغب ببرمجتها بكلمات بسيطة، وسيقوم المساعد الذكي بكتابة كافة ملفات الحزمة البرمجية (manifest.json, schema.json, index.tsx) وتثبيتها فوراً.'
                  : 'Describe your custom commerce idea (e.g. "Stripe payment popup" or "Algier shipping tracker") and our AI will synthesize all schema files instantly.'}
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. PayPal express popup button, integrated floating banner..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={handleAiPackGenerate}
                  disabled={isAiGenerating}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-45"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiGenerating ? 'Generating...' : (language === 'ar' ? 'توليد الحزمة' : 'Generate Schema')}</span>
                </button>
              </div>
            </div>

            {/* Main SDK Code Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* SDK File Tree Navigation */}
              <div className="lg:col-span-1 p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  PACK Folder Tree Structure
                </span>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 p-1.5 text-slate-300 font-mono">
                    <FolderTree className="w-3.5 h-3.5 text-teal-400" />
                    <span>/youmi-stripe-addon</span>
                  </div>

                  <div className="pl-3 space-y-1 font-mono">
                    {[
                      { name: 'manifest.json', icon: FileText },
                      { name: 'schema.json', icon: FileText },
                      { name: 'config.json', icon: FileText },
                      { name: 'README.md', icon: BookOpen },
                      { name: 'src/index.tsx', icon: Code },
                      { name: 'src/styles.css', icon: Eye },
                      { name: 'src/hooks.js', icon: Code }
                    ].map((file) => {
                      const FileIcon = file.icon;
                      const isSelected = selectedSdkFile === file.name;
                      return (
                        <button
                          key={file.name}
                          onClick={() => setSelectedSdkFile(file.name)}
                          className={`w-full text-start p-1.5 rounded-lg flex items-center gap-2 transition ${
                            isSelected ? 'bg-teal-600/10 text-teal-400 font-extrabold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <FileIcon className="w-3.5 h-3.5" />
                          <span>{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">
                    Version & SemVer Control
                  </span>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[10px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Version</span>
                      <span className="font-mono text-teal-400">v1.2.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Compatibility Check</span>
                      <span className="font-mono text-emerald-400">Compatible ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Panel */}
              <div className="lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    File Editor: {selectedSdkFile}
                  </span>
                  <button
                    onClick={() => {
                      showNotification(language === 'ar' ? '💾 تم حفظ التعديلات على حزمة الـ SDK بنجاح' : '💾 Saved SDK draft successfully!');
                    }}
                    className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded transition"
                  >
                    Save Draft
                  </button>
                </div>

                <textarea
                  value={sdkFilesContent[selectedSdkFile] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSdkFilesContent(prev => ({ ...prev, [selectedSdkFile]: val }));
                  }}
                  className="w-full h-80 p-4 bg-slate-950 text-slate-300 text-xs font-mono focus:outline-none resize-none leading-relaxed"
                />

                <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Lines: {(sdkFilesContent[selectedSdkFile] || '').split('\n').length}</span>
                  <span className="text-teal-400 font-bold">Interactive SDK Sandbox Enabled</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEVELOPER CLI TERMINAL */}
        {activeTab === 'cli' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-teal-400">
                <Terminal className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  YOUMI CLI Emulator Dashboard
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {language === 'ar'
                  ? 'قم بتشغيل أوامر حزمة المطورين لإنشاء والتحقق ونشر الإضافات والسمات مباشرة.'
                  : 'Manage local scaffolding and compile production-ready packages instantly in our virtual console.'}
              </p>
            </div>

            {/* Interactive Terminal Window */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs flex flex-col h-[340px]">
              {/* Window Header */}
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between select-none">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                </div>
                <span className="text-[10px] text-slate-500">youmi-shell (zsh)</span>
                <span className="w-4" />
              </div>

              {/* Logs Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1 text-slate-300">
                {cliHistory.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                    {line}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>

              {/* Console Input Bar */}
              <form onSubmit={handleCliCommand} className="p-2.5 bg-slate-900 border-t border-slate-800 flex gap-2">
                <span className="text-teal-400 font-bold self-center shrink-0">youmi-shell$</span>
                <input
                  type="text"
                  placeholder='Try "youmi create pack stripe-checkout" or "youmi publish"'
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  className="flex-1 bg-transparent text-white border-none outline-none focus:ring-0 text-xs py-1"
                />
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: WORDPRESS-STYLE CENTRAL ONLINE REPOSITORY MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-5">
            {/* Search Filter Head */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="w-full sm:w-80 relative">
                <input
                  type="text"
                  placeholder="Search 12,400+ community extensions..."
                  value={marketSearch}
                  onChange={(e) => setMarketSearch(e.target.value)}
                  className="w-full p-2.5 pl-9 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500 text-start"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>

              {/* Category buttons */}
              <div className="flex bg-slate-900 p-1 rounded-xl text-[10px] font-bold overflow-x-auto w-full sm:w-auto">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pack', label: 'PACKs' },
                  { id: 'plugin', label: 'Plugins' },
                  { id: 'theme', label: 'Themes' },
                  { id: 'widget', label: 'Widgets' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMarketCatFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                      marketCatFilter === cat.id ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of marketplace items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketItems
                .filter(item => {
                  const query = marketSearch.toLowerCase();
                  const matchesSearch = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.code.toLowerCase().includes(query);
                  const matchesCat = marketCatFilter === 'all' || item.category === marketCatFilter;
                  return matchesSearch && matchesCat;
                })
                .map((item) => (
                  <div key={item.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-mono">
                          {item.code} • {item.category.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold">{item.rating}</span>
                          <span className="text-slate-500 text-[10px]">({item.reviewsCount})</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-white text-sm line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] text-slate-500">By {item.author}</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{item.downloads.toLocaleString()} Active installs</span>
                        <span className="font-mono text-teal-400 font-extrabold">{item.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleInstallPack(item.id)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 ${
                          item.isInstalled
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        {item.isInstalled ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                        <span>{item.isInstalled ? (language === 'ar' ? 'مفعّل' : 'Activated') : (language === 'ar' ? 'تثبيت' : 'Install Now')}</span>
                      </button>

                      <button
                        onClick={() => handleFavoritePack(item.id)}
                        className={`p-1.5 bg-slate-950 border border-slate-800 rounded-lg hover:text-rose-500 transition ${
                          item.isFavorited ? 'text-rose-500' : 'text-slate-500'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY SANDBOX & PERMISSIONS */}
        {activeTab === 'sandbox' && (
          <div className="space-y-5">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-teal-400">
                <Shield className="w-4 h-4 animate-pulse" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Secure Plugin Sandbox & Permissions Gate
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {language === 'ar'
                  ? 'تقوم منصة يومي بعزل الأكواد البرمجية التابعة لجهات خارجية وتشغيلها داخل حاوية برمجية مغلقة لمنع تسريب مفاتيح الـ API أو العبث بتصميم المتجر.'
                  : 'To ensure 100% security, third-party PACKs and plugins are sandboxed with granular access tokens.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Permission Switches */}
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-extrabold uppercase text-white tracking-wider">
                  Active Sandbox Permissions
                </h4>

                <div className="space-y-3">
                  {[
                    { id: 'accessCartState', label: 'Access cart state & checkout totals', desc: 'Allows addon to read active visitor items.' },
                    { id: 'injectScripts', label: 'Inject scripts & CSS elements safely', desc: 'Allows rendering UI overlay frames.' },
                    { id: 'accessSiteInfo', label: 'Read site metadata & phone coordinates', desc: 'Allows access to shop owner metadata.' },
                    { id: 'networkRequests', label: 'Perform external API fetches', desc: 'Required for real-time tracking.' },
                    { id: 'apiProxyAccess', label: 'Execute server-side YOUMI Proxy calls', desc: 'Proxy secure requests bypass.' }
                  ].map((perm) => (
                    <div key={perm.id} className="flex items-start justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/60">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">{perm.label}</span>
                        <span className="text-[10px] text-slate-500 block leading-normal">{perm.desc}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSandboxedPermissions(prev => ({
                            ...prev,
                            [perm.id]: !prev[perm.id as keyof typeof sandboxedPermissions]
                          }));
                          showNotification('Updated sandbox permission token state');
                        }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                          sandboxedPermissions[perm.id as keyof typeof sandboxedPermissions] ? 'bg-teal-500' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          sandboxedPermissions[perm.id as keyof typeof sandboxedPermissions] ? 'transform translate-x-4' : ''
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Signatures verification */}
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-extrabold uppercase text-white tracking-wider">
                  Digital Signatures & Validation Checks
                </h4>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Verified Signature Hash:</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-mono text-[9px] font-bold">
                      SHA-256 VALID
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal">
                    YOUMI verifies digital signatures dynamically upon importing any ZIP config package. If the signature is missing or altered, deployment is immediately aborted.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setDigitalSignatureStatus('valid');
                        showNotification('Digital Signature verified successfully!');
                      }}
                      className="flex-1 py-2 bg-slate-900 border border-slate-800 text-xs font-bold rounded-lg text-slate-300 hover:text-white transition"
                    >
                      Verify Now
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-white">Active Protection Guard</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      No runtime dependency leaks. If a malicious script attempts to access global keys, the container automatically restarts in read-only mode.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: API DOCUMENTATION & DEVELOPER GUIDES */}
        {activeTab === 'docs' && (
          <div className="space-y-4 text-start">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-2">
                YOUMI SDK Developers API Reference Manual
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Use our global React props and window API bindings to build interactive templates or headless commerce stores with zero dependency.
              </p>
            </div>

            {/* Snippet Card */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white">1. Fetching Store Configuration & Injecting Layout Hooks</h4>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-teal-400 overflow-x-auto leading-relaxed">
                {`import { useYoumiContext } from '@youmi/sdk-core';

export default function MyCustomAddon() {
  const { siteInfo, colors, cartState, dispatch } = useYoumiContext();

  return (
    <div style={{ color: colors.primary }}>
      <h4>Site Name: {siteInfo.siteName}</h4>
      <span>Total cart items: {cartState.itemsCount}</span>
    </div>
  );
}`}
              </div>
            </div>

            {/* Event listeners docs */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white">2. Intercepting checkout actions (JavaScript API)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add standard event listeners on checkout forms to capture conversion pixels easily.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-teal-400 overflow-x-auto leading-relaxed">
                {`window.YoumiEvents.on('checkout_confirm', (payload) => {
  console.log("Customer confirmed checkout! Payload: ", payload);
  // Send data to Yalidine shipping or Facebook conversion pixel API proxy
});`}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Help component inside
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 11 2 2 4-4" />
    </svg>
  );
}
