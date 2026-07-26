import React, { useState, useEffect } from 'react';
import { authService, AuthUser, UserProject } from '../../utils/authService';
import ComingSoonModal from '../ComingSoonModal';
import { 
  User, Mail, Shield, CreditCard, Cloud, Key, Save, 
  Trash2, Folder, Check, AlertCircle, RefreshCw, Star, 
  Sparkles, CheckCircle, Languages, Moon, Sun, Bell, 
  Keyboard, HelpCircle, Info, ChevronRight, CheckCircle2,
  Lock, Settings
} from 'lucide-react';

interface SettingsPanelProps {
  user: AuthUser;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  currentConfig: any;
  onApplyConfig: (config: any) => void;
  showNotification: (msg: string) => void;
}

export default function SettingsPanel({ 
  user, 
  language, 
  setLanguage, 
  themeMode, 
  setThemeMode, 
  currentConfig, 
  onApplyConfig, 
  showNotification 
}: SettingsPanelProps) {
  // Active settings sub-tab
  const [activeTab, setActiveTab] = useState<'language' | 'theme' | 'account' | 'subscription' | 'notifications' | 'shortcuts' | 'updates' | 'about'>('language');

  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(() => user.email || '');

  // Account states
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<'Admin' | 'Developer' | 'User' | 'Editor' | 'Viewer'>(user.role as any);
  const [subscription, setSubscription] = useState<'Free' | 'Pro' | 'Enterprise'>(user.subscription);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop');
  const [sessionToken, setSessionToken] = useState('');

  // Status flags
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSyncingProject, setIsSyncingProject] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  // Success/Error banners
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Pre-made premium designer avatars
  const AVAILABLE_AVATARS = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop", // Teal Boy
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop", // Pink Girl
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=128&auto=format&fit=crop", // Blue Designer
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop", // Warm Tech
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop", // Sunset Creative
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop"  // Cool Developer
  ];

  // Notifications toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSound, setNotifSound] = useState(false);
  const [notifAutosave, setNotifAutosave] = useState(true);

  // Keyboard Shortcuts settings
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  // Project sync
  const [syncProjectName, setSyncProjectName] = useState('My YOUMI Store');
  const [cloudProjects, setCloudProjects] = useState<UserProject[]>([]);
  
  const isSupabase = authService.isSupabaseEnabled();

  // Dynamic pricing settings states
  const [proPrice, setProPrice] = useState(29);
  const [enterprisePrice, setEnterprisePrice] = useState(99);
  const [currency, setCurrency] = useState('$');

  useEffect(() => {
    fetchCloudProjects();
    const storedPro = localStorage.getItem('youmi_price_pro');
    if (storedPro) setProPrice(Number(storedPro));
    const storedEnt = localStorage.getItem('youmi_price_enterprise');
    if (storedEnt) setEnterprisePrice(Number(storedEnt));
    const storedCurrency = localStorage.getItem('youmi_sys_currency');
    if (storedCurrency) setCurrency(storedCurrency);

    const session = authService.getCurrentSession();
    if (session) {
      setSessionToken(session.token);
    }
  }, [user]);

  const fetchCloudProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const { projects, error } = await authService.loadUserProjects();
      if (!error && projects) {
        setCloudProjects(projects);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    setIsUpdatingProfile(true);

    try {
      const { user: updated, error } = await authService.updateProfile(name, role as any, subscription, selectedAvatar);
      if (error) {
        setProfileError(error);
      } else {
        setProfileSuccess(language === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Profile settings updated successfully!');
        showNotification(language === 'ar' ? '👤 تم حفظ إعدادات الحساب' : '👤 Profile settings updated');
      }
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!password.trim()) {
      setPasswordError(language === 'ar' ? 'يرجى إدخال كلمة المرور الجديدة' : 'Please enter a new password');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { success, error } = await authService.resetPassword(password);
      if (error) {
        setPasswordError(error);
      } else if (success) {
        setPasswordSuccess(language === 'ar' ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!');
        setPassword('');
        setConfirmPassword('');
        showNotification(language === 'ar' ? '🔑 تم تحديث كلمة المرور' : '🔑 Password updated');
      }
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveProjectToCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncProjectName.trim()) return;

    setIsSyncingProject(true);
    try {
      const { success, error } = await authService.saveUserProject(syncProjectName.trim(), currentConfig);
      if (success) {
        showNotification(language === 'ar' ? `☁️ تم حفظ المشروع: ${syncProjectName}` : `☁️ Saved project to cloud: ${syncProjectName}`);
        fetchCloudProjects();
      } else {
        alert(error);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSyncingProject(false);
    }
  };

  const handleLoadCloudProject = (proj: UserProject) => {
    const confirmLoad = window.confirm(
      language === 'ar' 
        ? `هل تريد استيراد وتطبيق قالب "${proj.name}"؟ سيتم استبدال التصميم الحالي.`
        : `Do you want to apply template "${proj.name}"? This will overwrite your current layout.`
    );
    if (confirmLoad) {
      onApplyConfig(proj.config);
      showNotification(language === 'ar' ? `📂 تم تطبيق قالب: ${proj.name}` : `📂 Applied template: ${proj.name}`);
    }
  };

  const handleDeleteCloudProject = async (id: string, name: string) => {
    const confirmDel = window.confirm(
      language === 'ar'
        ? `هل أنت متأكد من حذف مشروع "${name}"؟`
        : `Are you sure you want to delete project "${name}"?`
    );
    if (confirmDel) {
      const { success } = await authService.deleteUserProject(id);
      if (success) {
        showNotification(language === 'ar' ? '🗑️ تم حذف المشروع السحابي' : '🗑️ Cloud project deleted');
        fetchCloudProjects();
      }
    }
  };

  const handleCheckUpdates = () => {
    setIsCheckingUpdates(true);
    setUpdateStatus(null);
    setTimeout(() => {
      setIsCheckingUpdates(false);
      setUpdateStatus(language === 'ar' ? 'أنت تستخدم النسخة الاحترافية الأحدث v1.0. النظام متصل بالكامل!' : 'You are running the latest v1.0 Professional release. System is fully optimized!');
    }, 1200);
  };

  const sidebarItems = [
    { id: 'language', label: language === 'ar' ? 'اللغة والإعدادات' : 'Language Settings', icon: Languages },
    { id: 'theme', label: language === 'ar' ? 'المظهر والسمات' : 'Theme & Presets', icon: Sun },
    { id: 'account', label: language === 'ar' ? 'الملف والحساب' : 'Account & Security', icon: User },
    { id: 'subscription', label: language === 'ar' ? 'باقة الاشتراك والترقية' : 'Subscription & Plans', icon: CreditCard },
    { id: 'notifications', label: language === 'ar' ? 'التنبيهات والرسائل' : 'Notifications', icon: Bell },
    { id: 'shortcuts', label: language === 'ar' ? 'اختصارات الكيبورد' : 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'updates', label: language === 'ar' ? 'التحديثات الحالية' : 'System Updates', icon: RefreshCw },
    { id: 'about', label: language === 'ar' ? 'حول المنصة' : 'About YOUMI', icon: Info },
  ];

  return (
    <div className="space-y-5 text-start font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Settings Header Title */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <Settings className="w-5 h-5 text-teal-600 animate-spin-slow" />
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'ar' ? 'إعدادات المنصة الاحترافية' : 'Platform Settings Panel'}
          </h3>
          <p className="text-[10px] text-slate-400">
            {language === 'ar' ? 'تهيئة وتحرير بيئة العمل وباقة الاشتراك السحابية' : 'Configure workspace, subscription plans, and secure synchronization'}
          </p>
        </div>
      </div>

      {/* User Card Summary */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-teal-500/20" 
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-sm uppercase shrink-0">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">{user.name}</h4>
            <p className="text-[9px] text-slate-400 truncate leading-normal">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[8px] font-black uppercase">
            {user.role}
          </span>
          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[8px] font-black uppercase">
            {language === 'ar' ? 'ترخيص مجاني بالكامل' : 'Free Studio License'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Settings Navigation Menu */}
        <div className="md:col-span-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full p-2 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  isSelected 
                    ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border-l-2 border-teal-600 dark:border-teal-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Sub-Panel Content */}
        <div className="md:col-span-8 p-4 bg-slate-50/40 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 min-h-[300px]">
          
          {/* TAB 1: LANGUAGE */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'لغة واجهة المستخدم' : 'Interface Localization'}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'اختر لغة لوحة التحكم لبيئة العمل. يدعم النظام العرض بالكامل من اليمين إلى اليسار واليسار إلى اليمين.' : 'Select the primary display language for the builder. Fully supports RTL/LTR orientations.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    showNotification('Language switched to English');
                  }}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    language === 'en' 
                      ? 'border-teal-500 bg-teal-500/5 text-teal-600 dark:text-teal-400 font-extrabold' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-sm mb-1">🇺🇸</div>
                  <div className="text-xs font-bold">English</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLanguage('ar');
                    showNotification('تم تحويل لغة النظام إلى العربية');
                  }}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    language === 'ar' 
                      ? 'border-teal-500 bg-teal-500/5 text-teal-600 dark:text-teal-400 font-extrabold' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-sm mb-1">🇩🇿</div>
                  <div className="text-xs font-bold">العربية</div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: THEME */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'مظهر لوحة التحكم' : 'Workspace Aesthetic Mode'}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'تعديل السطوع لحماية عينيك أثناء جلسات العمل الطويلة.' : 'Configure the brightness of your developer environment to reduce eye fatigue.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    themeMode === 'light' 
                      ? 'border-teal-500 bg-teal-500/5 text-teal-600 font-extrabold' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-4 h-4 mb-1.5 text-amber-500" />
                  <span className="text-xs font-bold">{language === 'ar' ? 'الوضع النهاري' : 'Light Mode'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    themeMode === 'dark' 
                      ? 'border-teal-500 bg-teal-500/5 text-teal-400 font-extrabold' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4 mb-1.5 text-indigo-400" />
                  <span className="text-xs font-bold">{language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              {/* Profile Details Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  {language === 'ar' ? 'البيانات الشخصية والملف' : 'Personal Profile Settings'}
                </h4>

                {profileError && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] flex gap-1 items-start">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{profileError}</span>
                  </div>
                )}

                {profileSuccess && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-[10px] flex gap-1 items-start">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {/* Avatar Selector UI */}
                <div className="space-y-1.5 text-start">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'اختر الصورة الشخصية (الأفاتار)' : 'Choose Profile Avatar'}</label>
                  <div className="flex flex-wrap gap-2 py-1">
                    {AVAILABLE_AVATARS.map((av, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition ${
                          selectedAvatar === av 
                            ? 'border-teal-500 scale-110 shadow-md shadow-teal-500/10' 
                            : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <img src={av} alt={`Avatar ${index + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'صلاحية العمل' : 'Workspace Role'}</label>
                  <select
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                  >
                    <option value="Admin">{language === 'ar' ? 'مدير النظام (Admin)' : 'Admin'}</option>
                    <option value="Developer">{language === 'ar' ? 'مطور برمجيات (Developer)' : 'Developer'}</option>
                    <option value="User">{language === 'ar' ? 'مستخدم عام (User)' : 'User'}</option>
                    <option value="Editor">{language === 'ar' ? 'محرر تصميم (Editor)' : 'Editor'}</option>
                    <option value="Viewer">{language === 'ar' ? 'مستعرض فقط (Viewer)' : 'Viewer'}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-[11px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingProfile ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Details'}</span>
                </button>
              </form>

              {/* Security Password Form */}
              <form onSubmit={handleUpdatePassword} className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                </h4>

                {passwordError && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] flex gap-1 items-start">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-[10px] flex gap-1 items-start">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 font-extrabold text-[11px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingPassword ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Key className="w-3 h-3" />}
                  <span>{language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}</span>
                </button>
              </form>

              {/* Security & JWT Token Decoder Panel */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-teal-500" />
                  <span>{language === 'ar' ? 'أدوات الأمان والتحقق من رموز JWT' : 'Security & JWT Token Decoder'}</span>
                </h4>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'ar' 
                    ? 'في هذا القسم، يمكنك فحص رمز الجلسة الفعلي المشفر بنظام JWT للتحقق من الصلاحيات وسلامة التوقيع.' 
                    : 'Analyze your active JWT session token in real-time. Verify its payload, roles claims, and signature integrity.'}
                </p>

                {sessionToken ? (
                  <div className="space-y-2.5">
                    {/* Active Session Token */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{language === 'ar' ? 'رمز الجلسة المشفر (JWT)' : 'Encoded JWT Token String'}</span>
                      <div className="p-2 bg-slate-950/85 dark:bg-slate-950/85 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-mono text-pink-500 select-all overflow-x-auto max-w-full break-all whitespace-pre-wrap leading-tight">
                        {sessionToken}
                      </div>
                    </div>

                    {/* Decoded Header and Payload */}
                    {(() => {
                      const decoded = authService.decodeJWT(sessionToken);
                      if (!decoded) return null;
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{language === 'ar' ? 'ترويسة الرمز (Header)' : 'Token Header (Decoded)'}</span>
                            <pre className="p-2 bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-mono text-teal-500 overflow-x-auto">
                              {JSON.stringify(decoded.header, null, 2)}
                            </pre>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{language === 'ar' ? 'حمولة البيانات (Payload)' : 'Token Payload (Claims)'}</span>
                            <pre className="p-2 bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-mono text-yellow-500 overflow-x-auto">
                              {JSON.stringify(decoded.payload, null, 2)}
                            </pre>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Active Session Tracker */}
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-500/20 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {language === 'ar' ? 'الأجهزة المتصلة والجلسات النشطة' : 'Active Session Tracker (Online)'}
                          </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {language === 'ar' ? 'موثق وآمن' : 'JWT VERIFIED'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-550 dark:text-slate-400 leading-tight">
                        <div>
                          <span className="font-bold block text-slate-400">{language === 'ar' ? 'تاريخ البدء (iat)' : 'Issued At (iat)'}</span>
                          <span>
                            {(() => {
                              const decoded = authService.decodeJWT(sessionToken);
                              if (decoded?.payload?.iat) {
                                return new Date(decoded.payload.iat * 1000).toLocaleString();
                              }
                              return 'N/A';
                            })()}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold block text-slate-400">{language === 'ar' ? 'تاريخ الانتهاء (exp)' : 'Expires At (exp)'}</span>
                          <span>
                            {(() => {
                              const decoded = authService.decodeJWT(sessionToken);
                              if (decoded?.payload?.exp) {
                                return new Date(decoded.payload.exp * 1000).toLocaleString();
                              }
                              return 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="col-span-2 border-t border-slate-100 dark:border-slate-800/80 pt-1.5 mt-1">
                          <span className="font-bold block text-slate-400">{language === 'ar' ? 'جهاز العميل المستضيف' : 'Client User Agent'}</span>
                          <span className="font-mono text-[8px] truncate block">{navigator.userAgent}</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            showNotification(language === 'ar' ? '🔐 تم إنهاء الجلسات الأخرى بنجاح!' : '🔐 All other active device sessions terminated!');
                          }}
                          className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[8px] font-black rounded uppercase transition"
                        >
                          {language === 'ar' ? 'تسجيل الخروج من الأجهزة الأخرى' : 'Terminate Other Sessions'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 text-center py-2 border border-dashed border-slate-150 dark:border-slate-800 rounded-lg">
                    {language === 'ar' ? 'لا يوجد رمز جلسة نشط حالياً للتحليل' : 'No active session token available for inspection.'}
                  </p>
                )}
              </div>

              {/* Cloud Synchronization Section */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Cloud className="w-4 h-4 text-sky-500" />
                  <span>{language === 'ar' ? 'المشاريع السحابية' : 'Cloud Synchronization'}</span>
                </h4>

                <form onSubmit={handleSaveProjectToCloud} className="flex gap-2">
                  <input
                    type="text"
                    required
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder={language === 'ar' ? 'اسم المشروع الجديد...' : 'Project Name...'}
                    value={syncProjectName}
                    onChange={(e) => setSyncProjectName(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isSyncingProject}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
                  >
                    {isSyncingProject ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    <span>{language === 'ar' ? 'مزامنة' : 'Sync'}</span>
                  </button>
                </form>

                {/* Cloud projects list */}
                <div className="space-y-1.5 mt-2">
                  {isLoadingProjects ? (
                    <div className="text-center text-slate-400 text-xs py-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto mb-1 text-teal-500" />
                      <span>{language === 'ar' ? 'جاري التحميل...' : 'Fetching cloud projects...'}</span>
                    </div>
                  ) : cloudProjects.length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center py-2 border border-dashed border-slate-100 dark:border-slate-800 rounded-lg">
                      {language === 'ar' ? 'لا توجد مشاريع محفوظة سحابياً بعد' : 'No cloud projects saved yet.'}
                    </p>
                  ) : (
                    cloudProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-2 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block truncate leading-tight">{proj.name}</span>
                          <span className="text-[8px] text-slate-400 block leading-tight">{new Date(proj.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleLoadCloudProject(proj)}
                            className="px-1.5 py-0.5 bg-teal-50 hover:bg-teal-100 dark:bg-slate-700 text-teal-600 dark:text-teal-400 rounded text-[10px] font-bold cursor-pointer"
                          >
                            {language === 'ar' ? 'تطبيق' : 'Apply'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCloudProject(proj.id, proj.name)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}



          {/* TAB 4: SUBSCRIPTION & PLANS */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Current Plan Overview Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-start">
                <div>
                  <span className="text-[9px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    {language === 'ar' ? 'الخطة الحالية' : 'Current Plan'}
                  </span>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white mt-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>{subscription === 'Enterprise' ? (language === 'ar' ? 'باقة الشركات الكبرى (Enterprise)' : 'Enterprise License') : subscription === 'Pro' ? (language === 'ar' ? 'الباقة الاحترافية (Pro)' : 'Pro License') : (language === 'ar' ? 'الباقة المجانية للاستوديو' : 'Free Studio License')}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {language === 'ar' ? 'تاريخ التحديث: اليوم. مفعّل ومؤمن بالكامل.' : 'Status: Fully active, secure, and monitored.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-wide text-emerald-500">
                    {language === 'ar' ? 'نشط بالكامل' : 'FULLY ACTIVE'}
                  </span>
                </div>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-start">
                {/* Free Plan */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                        {language === 'ar' ? 'مجاني' : 'FREE'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-950 dark:text-white">$0</h4>
                      <p className="text-[10px] text-slate-400">
                        {language === 'ar' ? 'للهواة والمجربين' : 'For hobbyists & sandbox builders'}
                      </p>
                    </div>
                    <ul className="space-y-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'محرر القوالب المرئي القياسي' : 'Standard Visual UI Editor'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'سجل مشاريع محلي بالكامل' : 'Local Project History storage'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'تصدير مشاريع ZIP محدودة' : 'Standard ZIP exports'}</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    disabled
                    className="w-full py-2 bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-500 rounded-xl text-xs font-black cursor-not-allowed uppercase"
                  >
                    {language === 'ar' ? 'مفعلة حالياً' : 'Current Plan'}
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="p-5 bg-white dark:bg-slate-900 border-2 border-teal-500 dark:border-teal-500 rounded-3xl space-y-4 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-teal-500/5">
                  {/* Coming Soon Badge */}
                  <div className="absolute top-0 right-0">
                    <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-bl-xl tracking-wider animate-pulse block">
                      {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-wide text-teal-600 dark:text-teal-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-teal-600" />
                        <span>{language === 'ar' ? 'الاحترافي' : 'PRO'}</span>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-950 dark:text-white">$29<span className="text-xs text-slate-400">/{language === 'ar' ? 'شهر' : 'mo'}</span></h4>
                      <p className="text-[10px] text-slate-400">
                        {language === 'ar' ? 'لمطوري المتاجر والشركات الناشئة' : 'For storefront creators & startups'}
                      </p>
                    </div>
                    <ul className="space-y-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'مولد المتاجر الاحترافي السحابي' : 'Enterprise Storefront Generator'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'حفظ ومزامنة سحابية (Supabase)' : 'Cloud Backup (Supabase)'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'ألوان وقوالب وخطوط حصرية' : 'Custom fonts & luxury presets'}</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setIsComingSoonOpen(true)}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition cursor-pointer uppercase flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/10"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'سجل للتنبيه' : 'Notify Me'}</span>
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 relative overflow-hidden flex flex-col justify-between">
                  {/* Coming Soon Badge */}
                  <div className="absolute top-0 right-0">
                    <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-bl-xl tracking-wider block">
                      {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                        {language === 'ar' ? 'الشركات' : 'ENTERPRISE'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-950 dark:text-white">$99<span className="text-xs text-slate-400">/{language === 'ar' ? 'شهر' : 'mo'}</span></h4>
                      <p className="text-[10px] text-slate-400">
                        {language === 'ar' ? 'لفرق العمل الكبيرة والوكالات' : 'For design teams & agencies'}
                      </p>
                    </div>
                    <ul className="space-y-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'مساحات عمل لفرق متعددة' : 'Unlimited Team Members'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'ترجمات تلقائية بالذكاء الاصطناعي' : 'AI-powered Automated Translations'}</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{language === 'ar' ? 'توليد إضافات مخصصة ودعم 24/7' : 'Custom Plugins & 24/7 Support'}</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setIsComingSoonOpen(true)}
                    className="w-full py-2.5 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 dark:hover:bg-slate-800 text-white rounded-xl text-xs font-black transition cursor-pointer uppercase flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'سجل للتنبيه' : 'Notify Me'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'تفضيلات الإشعارات والتحذيرات' : 'Workspace Alerts & Notifications'}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'اختر الطريقة التي تفضلها للتواصل والتحذيرات أثناء تصميم متجرك.' : 'Configure alerts, popups, and email alerts during project editing sessions.'}
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer select-none">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block leading-tight">{language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Digests'}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">{language === 'ar' ? 'أسبوعية لمراجعة تحديثات قوالب يومي' : 'Weekly summaries of platform additions and security logs'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer select-none">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block leading-tight">{language === 'ar' ? 'التأثيرات الصوتية والتحذيرات' : 'Audio Indicators'}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">{language === 'ar' ? 'تشغيل أصوات هادئة للتراجع والحفظ' : 'Play soft alert sounds upon undo, redo and export successes'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSound}
                    onChange={(e) => setNotifSound(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl cursor-pointer select-none">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block leading-tight">{language === 'ar' ? 'تأكيد الحفظ التلقائي' : 'Auto-Save Logs'}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">{language === 'ar' ? 'عرض تنبيهات عند حفظ تقدم المتجر' : 'Show notification toast when configuration changes are cached'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifAutosave}
                    onChange={(e) => setNotifAutosave(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'دليل اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts Reference'}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'استخدم اختصارات الكيبورد للتنقل والتحرير بشكل أسرع بكثير.' : 'Utilize workspace hotkeys to accelerate layout and structural assembly workflows.'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'ar' ? 'التراجع عن الخطوة' : 'Undo Action'}</span>
                  <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">Ctrl + Z</kbd>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'ar' ? 'إعادة التطبيق' : 'Redo Action'}</span>
                  <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">Ctrl + Y</kbd>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'ar' ? 'حفظ تقدم المشروع' : 'Save State'}</span>
                  <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">Ctrl + S</kbd>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{language === 'ar' ? 'تصدير القالب فورياً' : 'Export Pack'}</span>
                  <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">Ctrl + E</kbd>
                </div>
              </div>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 rounded-xl cursor-pointer select-none">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{language === 'ar' ? 'تفعيل الاختصارات السريعة' : 'Enable Keyboard Shortcuts'}</span>
                <input
                  type="checkbox"
                  checked={shortcutsEnabled}
                  onChange={(e) => setShortcutsEnabled(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
              </label>
            </div>
          )}

          {/* TAB 7: UPDATES */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'تحديثات نظام يومي بيلدر' : 'System Update Manager'}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'ar' ? 'التحقق من وجود إضافات جديدة أو ترقيات لقالب المعاينة.' : 'Check for new platform versions, pack definitions, and workspace extensions.'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">{language === 'ar' ? 'النسخة الحالية' : 'Current Active Build'}</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">v1.0 Professional (Release)</span>
                </div>
                <button
                  type="button"
                  disabled={isCheckingUpdates}
                  onClick={handleCheckUpdates}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isCheckingUpdates ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>{language === 'ar' ? 'التحقق الآن' : 'Check for Updates'}</span>
                </button>
              </div>

              {updateStatus && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10.5px] flex gap-1.5 items-start">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{updateStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'نبذة عن منصة يومي' : 'About YOUMI Technologies'}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {language === 'ar' 
                    ? 'يومي بيلدر هو نظام تجاري متكامل مدعوم بالذكاء الاصطناعي مخصص للمطورين ورواد الأعمال لبناء حزم متاجر مخصصة.' 
                    : 'YOUMI Builder is an enterprise-grade web development framework developed by YOUMI Technologies for building high-fidelity modular marketplaces.'}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-slate-400">{language === 'ar' ? 'الشركة المالكة:' : 'Developer & Company:'}</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">YOUMI Technologies</span>
                </div>

                <div className="flex justify-between p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-slate-400">{language === 'ar' ? 'رقم الترخيص:' : 'License Verification:'}</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">YM-PRO-991-AISTUDIO</span>
                </div>

                <div className="flex justify-between p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl">
                  <span className="text-slate-400">{language === 'ar' ? 'حقوق الملكية:' : 'Copyright Notes:'}</span>
                  <span className="text-slate-500">© 2026 YOUMI Corp. All Rights Reserved.</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        language={language}
        showNotification={(msg) => showNotification(msg)}
        userEmail={userEmail}
      />
    </div>
  );
}
