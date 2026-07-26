import React, { useState, useEffect } from 'react';
import { useTranslation } from '../utils/i18n';
import { authService, AuthUser } from '../utils/authService';
import BrandLogo from './BrandLogo';
import TechAnimatedBackground from './TechAnimatedBackground';
import { 
  User, Mail, Lock, Sparkles, AlertCircle, CheckCircle2, 
  Eye, EyeOff, Languages, Shield, CreditCard, Chrome, 
  Github, Database, HelpCircle, ArrowRight, RefreshCw, Key,
  BookOpen, Info, PhoneCall, FileText, Check, ChevronRight,
  Monitor, Layout, Layers, Grid, Cpu, Terminal
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser, startInAdminPortal?: boolean) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
}

export default function AuthScreen({ onLoginSuccess, language, setLanguage }: AuthScreenProps) {
  const { t, dir } = useTranslation();
  
  // Tab Views: 'welcome' | 'signin' | 'admin-signin' | 'signup' | 'forgot' | 'reset' | 'pricing' | 'about' | 'docs' | 'contact' | 'privacy' | 'terms' | 'releases'
  const [authView, setAuthView] = useState<'welcome' | 'signin' | 'admin-signin' | 'signup' | 'forgot' | 'reset' | 'pricing' | 'about' | 'docs' | 'contact' | 'privacy' | 'terms' | 'releases'>('welcome');
  
  // Registration and credentials states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [subscription, setSubscription] = useState<'Free' | 'Pro' | 'Enterprise'>('Pro');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Field visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Dynamic Pricing states
  const [proPrice, setProPrice] = useState(29);
  const [enterprisePrice, setEnterprisePrice] = useState(99);
  const [currency, setCurrency] = useState('$');

  // Status messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Connection check helper
  const isSupabase = authService.isSupabaseEnabled();

  // Handle URL Hash Check (For password reset redirects)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
      setAuthView('reset');
      setSuccess(language === 'ar' ? 'تم التحقق من الرابط بنجاح! يرجى إدخال كلمة المرور الجديدة.' : 'Recovery link verified! Please enter your new password.');
    }

    // Load custom pricing configurations
    const storedPro = localStorage.getItem('youmi_price_pro');
    if (storedPro) setProPrice(Number(storedPro));
    const storedEnt = localStorage.getItem('youmi_price_enterprise');
    if (storedEnt) setEnterprisePrice(Number(storedEnt));
    const storedCurrency = localStorage.getItem('youmi_sys_currency');
    if (storedCurrency) setCurrency(storedCurrency);
  }, [language]);

  const handleToggleMode = (newView: typeof authView) => {
    setAuthView(newView);
    setError(null);
    setSuccess(null);
    setPassword('');
    setConfirmPassword('');
  };

  // Sign Up Flow
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error: signUpError } = await authService.signUp(
        email.trim(),
        password,
        name.trim(),
        role,
        subscription
      );

      if (signUpError) {
        setError(signUpError);
      } else {
        setSuccess(
          isSupabase 
            ? (language === 'ar' ? 'تم إرسال رسالة تفعيل لبريدك الإلكتروني بنجاح!' : 'Verification email sent! Please check your inbox.')
            : (language === 'ar' ? 'تم تسجيل الحساب بنجاح! الرجاء تفعيل الحساب لإكمال التسجيل.' : 'Account registered successfully! Please verify your email.')
        );
        
        setName('');
        if (!isSupabase) {
          setTimeout(() => {
            setAuthView('verify-email');
            setSuccess(null);
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Email Verification Flow
  const handleVerifyEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!verificationCode.trim()) {
      setError(language === 'ar' ? 'الرجاء إدخال رمز التحقق' : 'Please enter verification code');
      return;
    }

    setIsLoading(true);
    try {
      const { success: ok, error: verifyError } = await authService.verifyEmail(email.trim(), verificationCode.trim());
      if (verifyError) {
        setError(verifyError);
      } else if (ok) {
        setSuccess(language === 'ar' ? 'تم تفعيل الحساب بنجاح! يمكنك الآن تسجيل الدخول.' : 'Account verified successfully! You can now sign in.');
        setTimeout(() => {
          setAuthView('signin');
          setSuccess(null);
          setVerificationCode('');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In Flow
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const { session, error: signInError } = await authService.signIn(
        email.trim(),
        password,
        rememberMe
      );

      if (signInError) {
        if (signInError.startsWith('verification_pending:')) {
          const pendingEmail = signInError.split(':')[1];
          setEmail(pendingEmail);
          setAuthView('verify-email');
          setError(language === 'ar' ? 'الرجاء تفعيل حسابك أولاً باستخدام رمز التحقق المرسل إليك.' : 'Please verify your account first using the verification code.');
        } else {
          setError(signInError);
        }
      } else if (session) {
        onLoginSuccess(session.user);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Restricted Admin Portal Login Flow
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال بيانات حساب مسؤول المنصة' : 'Please enter admin credentials');
      return;
    }

    setIsLoading(true);
    try {
      const { session, error: signInError } = await authService.signIn(
        email.trim(),
        password,
        rememberMe
      );

      if (signInError) {
        setError(signInError);
      } else if (session) {
        if (session.user.role !== 'Admin') {
          setError(
            language === 'ar' 
              ? '⛔ تم رفض الدخول: هذا الحساب ليس لديه صلاحيات مدير المنصة. يرجى تسجيل الدخول كمسؤول.'
              : '⛔ Access Denied: Account lacks Platform Administrator privileges.'
          );
        } else {
          setSuccess(language === 'ar' ? '✅ مرحباً بك في بوابة إدارة المنصة!' : '✅ Welcome to Admin Portal!');
          setTimeout(() => {
            onLoginSuccess(session.user, true);
          }, 600);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Flow
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError(language === 'ar' ? 'يرجى كتابة البريد الإلكتروني' : 'Please specify an email address');
      return;
    }

    setIsLoading(true);
    try {
      const { success: ok, error: resetError } = await authService.sendPasswordResetEmail(email.trim());
      if (resetError) {
        setError(resetError);
      } else if (ok) {
        setSuccess(language === 'ar' ? 'تم إرسال رابط استعادة كلمة المرور لبريدك بنجاح!' : 'Password reset link sent successfully!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password Flow (from verified link)
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password.trim() || !confirmPassword.trim()) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { success: ok, error: resetError } = await authService.resetPassword(password);
      if (resetError) {
        setError(resetError);
      } else if (ok) {
        setSuccess(language === 'ar' ? 'تم تحديث كلمة المرور بنجاح! جاري تحويلك...' : 'Password updated successfully! Redirecting...');
        setTimeout(() => {
          setAuthView('signin');
          setSuccess(null);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // SSO Login handler
  const handleOAuthLogin = async (provider: 'google' | 'github' | 'microsoft') => {
    setError(null);
    if (!isSupabase) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const nameMap = {
          google: 'Google Developer',
          github: 'GitHub Contributor',
          microsoft: 'Enterprise User'
        };
        onLoginSuccess({
          id: `oauth_${provider}_` + Math.random().toString(36).substring(2),
          name: nameMap[provider],
          email: `${provider}-user@youmi.com`,
          role: 'Admin',
          subscription: 'Enterprise',
          createdAt: new Date().toISOString()
        });
      }, 1000);
    } else {
      try {
        const { data, error: oauthErr } = await (authService as any).supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin
          }
        });
        if (oauthErr) setError(oauthErr.message);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  // Handle Contact Inquiry submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactOrg('');
      setContactMsg('');
      setTimeout(() => setContactSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden" dir={dir}>
      
      {/* Professional animated tech background */}
      <TechAnimatedBackground />

      {/* 1. TOP PORTAL NAVIGATION HEADER */}
      <header className="w-full bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <button 
            type="button"
            onClick={() => handleToggleMode('welcome')}
            className="flex items-center gap-2 text-start focus:outline-none cursor-pointer"
          >
            <BrandLogo size={36} showText={true} />
          </button>

          {/* Center Navigation Links (Marketing & Docs) */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'welcome', label: language === 'ar' ? 'الرئيسية' : 'Overview' },
              { id: 'docs', label: language === 'ar' ? 'التوثيق البرمجي' : 'Documentation' },
              { id: 'about', label: language === 'ar' ? 'حول المنصة' : 'About Corp' },
              { id: 'releases', label: language === 'ar' ? 'الإصدارات' : "What's New" },
              { id: 'contact', label: language === 'ar' ? 'تواصل معنا' : 'Contact Support' },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleToggleMode(link.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  authView === link.id 
                    ? 'bg-slate-800 text-white border border-slate-700/80' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Language switches */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-800 transition cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Dedicated Admin Portal Sign In Button */}
            <button
              type="button"
              onClick={() => handleToggleMode('admin-signin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer border ${
                authView === 'admin-signin'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 ring-1 ring-rose-500/30'
                  : 'bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border-slate-800 hover:border-rose-800/60'
              }`}
              title={language === 'ar' ? 'بوابة دخول مسؤول المنصة' : 'Platform Admin Portal Login'}
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">{language === 'ar' ? 'دخول المسؤولين' : 'Admin Login'}</span>
            </button>

            {/* Auth Buttons */}
            {authView !== 'signin' && authView !== 'signup' ? (
              <button
                type="button"
                onClick={() => handleToggleMode('signin')}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-teal-600/10 transition cursor-pointer"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleToggleMode('welcome')}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                {language === 'ar' ? 'العودة للرئيسية' : 'Back Home'}
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. MAIN WORKSPACE / CONTENT VIEWER PORTAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center relative z-10">
        
        {/* VIEW 1: WELCOME / LANDING HERO */}
        {authView === 'welcome' && (
          <div className="space-y-12 py-6 text-center max-w-4xl mx-auto flex flex-col items-center">
            
            <BrandLogo 
              size={144} 
              showText={true} 
              showTagline={true} 
              className="mb-6 flex-col justify-center text-center scale-95 hover:scale-100 transition-all duration-500" 
              textClassName="text-3xl sm:text-4xl" 
            />

            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>{language === 'ar' ? 'منصة بناء وتصميم المشاريع والمتاجر الرقمية الأولى' : 'Enterprise Project & Store Builder Platform'}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                {language === 'ar' ? 'ابدأ بتصميم وتصدير مشروعك الاحترافي' : 'Design, Package, and Export Your Professional Project'}
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {language === 'ar' 
                  ? 'منصة متطورة مدعومة بالكامل بنماذج الذكاء الاصطناعي لـ يومي ونظام حزم متكامل لتوليد وتصدير الكود المصدري النظيف لمختلف أنواع المشاريع والمتاجر.'
                  : 'Power up your web app deployments with full developer controls, responsive layout managers, custom fonts pairing, and direct source ZIP compilation.'}
              </p>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => handleToggleMode('signup')}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-sm font-extrabold rounded-xl shadow-xl shadow-teal-600/15 transition cursor-pointer flex items-center gap-2"
              >
                <span>{language === 'ar' ? 'أنشئ حسابك مجاناً وباشر التصميم' : 'Start Designing - Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode('docs')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl border border-slate-700 transition cursor-pointer"
              >
                {language === 'ar' ? 'قراءة التوثيق البرمجي' : 'Explore Developer Docs'}
              </button>
            </div>

            {/* Feature Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8">
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl text-start space-y-3">
                <div className="w-9 h-9 bg-teal-500/10 text-teal-400 rounded-lg flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">{language === 'ar' ? 'توليد ذكي بالذكاء الاصطناعي' : 'YOUMI AI Integration'}</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  {language === 'ar' 
                    ? 'صمم المتجر بالكامل عن طريق وصف بسيط بلغتك المفضلة، وسيقوم مساعد يومي بتطبيق هيكلية الألوان والمنتجات والتنسيقات.'
                    : 'Describe your store niche and colors in simple text, and the AI co-pilot designs custom components immediately.'}
                </p>
              </div>

              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl text-start space-y-3">
                <div className="w-9 h-9 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">{language === 'ar' ? 'حزم برمجية متطورة' : 'Specialized Modular Packs'}</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  {language === 'ar' 
                    ? 'أقسام حرة وتفاعلية للهيدر، السلايدرات، القوائم، وتنسيقات الهواتف الذكية ببادينج وحواف مخصصة.'
                    : 'Combine custom sliders, checkout options, whatsapp floaters, and pixel scripts together into deployable archives.'}
                </p>
              </div>

              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl text-start space-y-3">
                <div className="w-9 h-9 bg-sky-500/10 text-sky-400 rounded-lg flex items-center justify-center font-bold">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">{language === 'ar' ? 'كود نظيف جاهز للنشر' : 'Production-Ready Clean Code'}</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  {language === 'ar' 
                    ? 'اضغط زر Compilation لتنزيل أرشيف ZIP مدمج ومتكامل لـ React أو Next.js بدون تعقيدات أو كود مكرر.'
                    : 'Download compiled bundle folders of standard HTML/CSS/JS or full React + Vite SPAs with one single click.'}
                </p>
              </div>
            </div>

          </div>
        )}


        {/* VIEW 3: DEVELOPER DOCUMENTATION */}
        {authView === 'docs' && (
          <div className="space-y-6 max-w-4xl mx-auto py-4 text-start">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{language === 'ar' ? 'التوثيق البرمجي لمنصة يومي بيلدر' : 'YOUMI Developer Documentation'}</h2>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'دليلك الشامل لهيكلية المتاجر وقواعد البيانات وملفات الإعدادات.' : 'Comprehensive reference guide for template layouts and packaging structures.'}</p>
            </div>

            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>{language === 'ar' ? '1. هيكلية ملف الإعدادات الموحد (template.json)' : '1. Unified Configuration Schema (template.json)'}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ar' 
                    ? 'يقوم النظام بحفظ ومعالجة كافة تفاصيل التصميم وقنوات الاتصال والمنتجات داخل كود JSON معياري وموحد. مما يسمح للمطور باستيراد وتصدير الهوية كاملة في ثوانٍ.'
                    : 'YOUMI Builder compiles your layout preferences, chosen fonts, categories, WhatsApp channels, and metadata parameters inside a clean JSON schema.'}
                </p>
                <pre className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto">
{`{
  "siteInfo": {
    "siteName": "My Store",
    "description": "Premium multi-vendor outlet",
    "currency": "DZD"
  },
  "colors": {
    "primary": "#0d9488",
    "secondary": "#1e293b",
    "background": "#f8fafc"
  },
  "fonts": {
    "headingFont": "Inter",
    "bodyFont": "Inter"
  }
}`}
                </pre>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-slate-900">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>{language === 'ar' ? '2. نظام الحزم والملحقات (Packs & Plugins)' : '2. Modularity & Custom Extensions'}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'ar' 
                    ? 'تحتوي لوحة التحكم على أكثر من 100 حزمة برمجية جاهزة للتفعيل، مثل بيكسل فيسبوك، شريط الإعلانات، حاسبة الشحن التلقائي، والمزيد.'
                    : 'Easily incorporate specialized script blocks, shipping fee rules, or analytics tools directly into your generated archive.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: ABOUT CORP */}
        {authView === 'about' && (
          <div className="space-y-6 max-w-3xl mx-auto py-4 text-start">
            <div className="space-y-2 text-center md:text-start">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{language === 'ar' ? 'عن شركة يومي للتكنولوجيا' : 'About YOUMI Technologies'}</h2>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'بناء الجيل القادم من حلول التجارة الإلكترونية لمنطقة شمال أفريقيا.' : 'Engineering the next-generation e-commerce toolkits for North African merchants.'}</p>
            </div>

            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4 leading-relaxed">
              <h3 className="text-sm font-extrabold text-white">{language === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Backstory & Commitment'}</h3>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'انطلقت شركة يومي تكنولوجيز كشركة تقنية متخصصة لتذليل صعوبات البناء البرمجي لأصحاب المتاجر في الجزائر. نحن نؤمن بأن تصميم متجر احترافي عالي الأداء لا يجب أن يكون معقداً أو يتطلب آلاف الدولارات للمطورين.'
                  : 'Founded as a dedicated engineering powerhouse, YOUMI Technologies streamlines custom workspace tools and full-stack solutions. Our primary framework is YOUMI Builder, which democratizes commercial web creation.'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900 text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase">{language === 'ar' ? 'تاريخ التأسيس' : 'Inception:'}</span>
                  <span className="font-bold text-white">2026</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 block uppercase">{language === 'ar' ? 'المركز الرئيسي' : 'Headquarters:'}</span>
                  <span className="font-bold text-white">Algiers, Algeria</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: RELEASE NOTES */}
        {authView === 'releases' && (
          <div className="space-y-6 max-w-3xl mx-auto py-4 text-start">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{language === 'ar' ? 'سجل إصدارات وتحديثات يومي بيلدر' : 'YOUMI Builder Release Notes'}</h2>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'متابعة آخر التحسينات والمميزات المضافة إلى النظام.' : 'Stay updated with milestones and layout optimizations.'}</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-2">
                  <div>
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded text-[9px] font-black uppercase">CURRENT</span>
                    <h3 className="text-xs font-bold text-white mt-1">v1.0.0 - Production Launch</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">July 2026</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-400 list-disc pl-4 pr-4">
                  <li>{language === 'ar' ? 'تفعيل مساعد الذكاء الاصطناعي يومي لتوليد القوالب بالكامل.' : 'Integrated full-fidelity YOUMI AI Assistant for single-prompt templates generation.'}</li>
                  <li>{language === 'ar' ? 'إطلاق نظام الحفظ السحابي المتكامل مع مزامنة المشاريع للشركات.' : 'Added real-time secure cloud project synchronization across devices.'}</li>
                  <li>{language === 'ar' ? 'دعم كامل للتجاوب على الهواتف والأجهزة المختلفة (Desktop, Tablet, Mobile).' : 'Optimized fluid viewport zooming simulator with precise padding values.'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: CONTACT SUPPORT */}
        {authView === 'contact' && (
          <div className="space-y-6 max-w-md mx-auto py-4 text-start">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">{language === 'ar' ? 'تواصل مع دعم يومي تكنولوجي' : 'Contact Support Inquiry'}</h2>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'أرسل لنا استفسارك وسيقوم فريق المبيعات والدعم الفني بمساعدتك فوراً.' : 'Have custom requests? Reach out to YOUMI support specialists.'}</p>
            </div>

            {contactSuccess ? (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold">{language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Inquiry Submitted Successfully!'}</h4>
                <p className="text-[11px] text-slate-400">{language === 'ar' ? 'نشكرك على تواصلك معنا. سيقوم فريق يومي بالرد عليك خلال 12 ساعة.' : 'A customer representative from YOUMI Technologies will contact you shortly.'}</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'اسم المؤسسة / الشركة (اختياري)' : 'Organization (Optional)'}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    value={contactOrg}
                    onChange={(e) => setContactOrg(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'محتوى الاستفسار' : 'Your Message'}</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{language === 'ar' ? 'إرسال الاستفسار' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* VIEW 7: PRIVACY POLICY */}
        {authView === 'privacy' && (
          <div className="space-y-6 max-w-3xl mx-auto py-4 text-start leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{language === 'ar' ? 'سياسة الخصوصية وأمان البيانات' : 'Corporate Privacy Policy'}</h2>
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4 text-xs text-slate-400">
              <p>{language === 'ar' ? 'تلتزم شركة يومي تكنولوجيز بحماية بياناتك الشخصية وتفاصيل قوالب متجرك الرقمي. لا نقوم بمشاركة أي شيفرة مصدرية أو معلومات مع أي طرف ثالث خارج إطار تراخيص العمل المتفق عليها.' : 'At YOUMI Technologies, we prioritize user credential protection and source code safety. No local template structure is shared with third-party platforms.'}</p>
              <h3 className="text-xs font-black text-white uppercase">{language === 'ar' ? 'البيانات التي نقوم بجمعها' : '1. Information We Collect'}</h3>
              <p>{language === 'ar' ? 'عند المزامنة مع سحابة يومي، نقوم بحفظ ملف template.json الذي يحتوي على نصوص وعناوين المتجر والألوان فقط. لا يتم تخزين أي تفاصيل حساسة مثل كلمات مرور أو أرقام بطاقات دفع بشكل غير مشفر.' : 'We store simple structural definitions (color palettes, text alignments, product listings) in encrypted databases to support cloud loading.'}</p>
            </div>
          </div>
        )}

        {/* VIEW 8: TERMS OF SERVICE */}
        {authView === 'terms' && (
          <div className="space-y-6 max-w-3xl mx-auto py-4 text-start leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{language === 'ar' ? 'اتفاقية وشروط الاستخدام' : 'Terms of Service Agreement'}</h2>
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4 text-xs text-slate-400">
              <p>{language === 'ar' ? 'باستخدامك لمنصة يومي بيلدر، فإنك تقر وتوافق على شروط الترخيص التجاري المحددة لباقة اشتراكك الحالي.' : 'By accessing YOUMI Builder, you agree to comply with standard licensing matrices corresponding to your plan.'}</p>
              <h3 className="text-xs font-black text-white uppercase">{language === 'ar' ? 'الترخيص الفردي وإعادة البيع' : '1. Commercial Usage License'}</h3>
              <p>{language === 'ar' ? 'تمنحك الباقة المجانية رخصة للاستخدام الشخصي غير التجاري. لبيع وتوزيع قوالب المتاجر لعملائك، يرجى تفعيل باقة Pro أو باقة Enterprise لضمان سلامة التراخيص القانونية.' : 'Free accounts are granted personal workspace licensing only. Reselling compiled ZIP storefronts is strictly governed by Pro/Enterprise subscription scopes.'}</p>
            </div>
          </div>
        )}

        {/* AUTHENTICATION VIEW: SIGN IN */}
        {authView === 'signin' && (
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-white">{language === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign in to Workspace'}</h2>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'أدخل تفاصيل حسابك للولوج لبيئة العمل' : 'Enter credentials to synchronize project configs'}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 text-red-400 text-xs text-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-2 text-emerald-400 text-xs text-start">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-start"
                    placeholder="e.g. name@youmi.com"
                  />
                </div>
              </div>

              <div className="space-y-1 text-start">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                  <button
                    type="button"
                    onClick={() => handleToggleMode('forgot')}
                    className="text-xs text-teal-400 hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-start"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-start select-none">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 text-teal-500 bg-slate-900 focus:ring-0"
                  />
                  <span className="text-xs text-slate-400">{language === 'ar' ? 'تذكرني على هذا الجهاز' : 'Remember me on this session'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>

              <div className="text-center pt-2 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => handleToggleMode('signup')}
                  className="text-xs text-teal-400 hover:underline font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'New to YOUMI? Create an account'}
                </button>
              </div>
            </form>

            {/* SSO providers */}
            <div className="border-t border-slate-800/80 pt-4 space-y-3">
              <div className="relative flex items-center justify-center">
                <span className="absolute bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  {language === 'ar' ? 'أو سجل الدخول عبر' : 'Or Sync via SSO'}
                </span>
                <div className="w-full border-t border-slate-800" />
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                >
                  <Chrome className="w-3.5 h-3.5 text-red-400" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                >
                  <Github className="w-3.5 h-3.5 text-indigo-400" />
                  <span>GitHub</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('microsoft')}
                  className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                >
                  <Database className="w-3.5 h-3.5 text-sky-400" />
                  <span>Microsoft</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AUTHENTICATION VIEW: RESTRICTED ADMIN SIGN IN */}
        {authView === 'admin-signin' && (
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-1 shadow-lg shadow-rose-500/5">
                <Shield className="w-8 h-8 text-rose-500 animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
                <span>{language === 'ar' ? 'بوابة تسجيل دخول مسؤول المنصة' : 'Platform Administrator Portal'}</span>
              </h2>
              <p className="text-xs text-rose-400 font-bold">
                {language === 'ar' ? 'منطقة محمية خاصة بإدارة المنصة والمشتركين' : 'Restricted security zone for Platform Admins only'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-2 text-red-400 text-xs text-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex gap-2 text-emerald-400 text-xs text-start">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="p-5 bg-slate-950/90 border border-rose-900/40 rounded-2xl space-y-4 shadow-2xl relative overflow-hidden text-start">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500" />

              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-300 block">{language === 'ar' ? 'بريد المسؤول الإلكتروني' : 'Admin Email Address'}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-start"
                    placeholder="ar.sarl.usine@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-300 block">{language === 'ar' ? 'رمز الأمان / كلمة مرور المسؤول' : 'Admin Security Key / Password'}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-start"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-start select-none">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 text-rose-500 bg-slate-900 focus:ring-0"
                  />
                  <span className="text-xs text-slate-400">{language === 'ar' ? 'حفظ جلسة الإدارة الآمنة' : 'Keep secure admin session active'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                <span>{language === 'ar' ? 'الولوج إلى لوحة إدارة المنصة' : 'Authenticate & Enter Admin Portal'}</span>
              </button>

              {/* Demo Fill Button for easy testing */}
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center space-y-1.5">
                <span className="text-[10px] text-slate-400 block font-bold">
                  {language === 'ar' ? '⚡ تجربة فورية كمدير منصة (تعبئة تلقائية):' : '⚡ Quick Admin Autofill Demo:'}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('ar.sarl.usine@gmail.com');
                      setPassword('/ay72874722');
                    }}
                    className="flex-1 py-1 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 rounded text-[10px] font-bold transition cursor-pointer"
                  >
                    Sarl Usine Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('guest@youmi.com');
                      setPassword('password');
                    }}
                    className="flex-1 py-1 bg-teal-950/60 hover:bg-teal-900/60 border border-teal-800/40 text-teal-300 rounded text-[10px] font-bold transition cursor-pointer"
                  >
                    Guest Admin
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-900 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleMode('signin')}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {language === 'ar' ? '← دخول المستخدمين العاديين' : '← Standard User Login'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleMode('welcome')}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {language === 'ar' ? 'الرئيسية' : 'Home'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* AUTHENTICATION VIEW: SIGN UP */}
        {authView === 'signup' && (
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-white">{language === 'ar' ? 'إنشاء حساب جديد' : 'Create Free Workspace Account'}</h2>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'سجل حسابك للوصول إلى أدوات توليد المتاجر بالكامل' : 'Start modeling custom packs immediately'}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 text-red-400 text-xs text-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-2 text-emerald-400 text-xs text-start">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 text-start"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 text-start"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'صلاحيات الحساب' : 'Default Role'}</label>
                <select
                  value={role}
                  disabled={isLoading}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                >
                  <option value="Admin">{language === 'ar' ? 'مدير' : 'Admin'}</option>
                  <option value="Editor">{language === 'ar' ? 'محرر' : 'Editor'}</option>
                  <option value="Viewer">{language === 'ar' ? 'مستعرض' : 'Viewer'}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-start">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                  <input
                    type="password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'تأكيد المرور' : 'Confirm'}</label>
                  <input
                    type="password"
                    required
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                <span>{language === 'ar' ? 'تأكيد إنشاء الحساب' : 'Create Free Account'}</span>
              </button>

              <div className="text-center pt-2 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => handleToggleMode('signin')}
                  className="text-xs text-teal-400 hover:underline font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'لديك حساب بالفعل؟ سجل الدخول فورا' : 'Already have an account? Sign In'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EMAIL VERIFICATION VIEW */}
        {authView === 'verify-email' && (
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-white">
                {language === 'ar' ? 'تأكيد البريد الإلكتروني' : 'Verify Your Email'}
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                {language === 'ar' ? `لقد أرسلنا رمز تحقق إلى ${email}` : `We sent a 6-digit verification code to ${email}`}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 text-red-400 text-xs text-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-2 text-emerald-400 text-xs text-start">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleVerifyEmailSubmit} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
              <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 rounded-xl space-y-1 text-center">
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block">
                  {language === 'ar' ? 'بيئة المحاكاة السحابية' : 'Sandbox Simulated Environment'}
                </span>
                <p className="text-[11px] text-slate-300">
                  {language === 'ar'
                    ? 'في هذا الإصدار التجريبي، تم إرسال رمز التحقق: '
                    : 'For instant verification in this playground, use code: '}
                  <span className="font-mono text-xs font-black text-white px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">123456</span>
                </p>
              </div>

              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-400 block">
                  {language === 'ar' ? 'رمز التحقق (6 أرقام)' : 'Verification Code (6-digits)'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  disabled={isLoading}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full tracking-[0.5em] text-center py-3 bg-slate-900 border border-slate-800 rounded-xl text-lg font-black text-white focus:outline-none focus:border-teal-500"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{language === 'ar' ? 'تأكيد الرمز وتفعيل الحساب' : 'Verify & Activate Account'}</span>
              </button>

              <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSuccess(language === 'ar' ? 'تم إعادة إرسال رمز التحقق: 123456' : 'Simulated verification code resent: 123456');
                  }}
                  className="text-xs text-teal-400 hover:underline font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleMode('signin')}
                  className="text-xs text-slate-400 hover:underline font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {authView === 'forgot' && (
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-white">{language === 'ar' ? 'استرجاع كلمة المرور' : 'Password Recovery'}</h2>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'أدخل بريدك الإلكتروني لإرسال رابط إعادة الضبط سحابياً' : 'Request secure recovery email'}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 text-red-400 text-xs text-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-2 text-emerald-400 text-xs text-start">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 text-start"
                    placeholder="e.g. name@youmi.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                <span>{language === 'ar' ? 'إرسال رابط استعادة كلمة المرور' : 'Send Recovery Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleMode('signin')}
                className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء والعودة' : 'Cancel'}
              </button>
            </form>
          </div>
        )}

        {/* PASSWORD RESET SUBMIT VIEW */}
        {authView === 'reset' && (
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold text-white">{language === 'ar' ? 'إعادة ضبط كلمة المرور' : 'Set New Password'}</h2>
              <p className="text-xs text-slate-400">{language === 'ar' ? 'أدخل كلمة المرور الجديدة الآمنة لحسابك' : 'Secure your workspace login credentials'}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 text-red-400 text-xs text-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-2 text-emerald-400 text-xs text-start">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1 text-start">
                <label className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'تأكيد المرور' : 'Confirm New Password'}</label>
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{language === 'ar' ? 'تحديث كلمة المرور' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        )}

      </main>

      {/* 3. FOOTER SECTION WITH CORPORATE QUICK LINKS */}
      <footer className="w-full bg-slate-950/90 border-t border-slate-800/60 py-8 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-400">YOUMI Technologies © 2026</span>
            <span className="font-mono text-slate-700">|</span>
            <span className="text-[10px] text-slate-500 font-mono">Status: Connected (Vercel Core Node)</span>
          </div>

          {/* Bottom Legal Quick Links (which switch authView) */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {[
              { id: 'privacy', label: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' },
              { id: 'terms', label: language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service' },
              { id: 'about', label: language === 'ar' ? 'عن الشركة' : 'Company Bio' },
              { id: 'contact', label: language === 'ar' ? 'الدعم والمبيعات' : 'Contact Sales' },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleToggleMode(link.id as any)}
                className="hover:text-slate-300 font-bold hover:underline transition cursor-pointer text-[11px]"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
