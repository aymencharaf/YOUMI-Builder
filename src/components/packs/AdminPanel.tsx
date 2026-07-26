import React, { useState, useEffect } from 'react';
import { authService, AuthUser } from '../../utils/authService';
import { 
  Users, Shield, CreditCard, Activity, DollarSign, Settings, 
  Trash2, Search, Check, X, RefreshCw, AlertCircle, Save, 
  Star, Crown, Mail, Calendar, Key, AlertTriangle, Play, Pause
} from 'lucide-react';

interface AdminPanelProps {
  user: AuthUser;
  language: 'ar' | 'en';
  showNotification: (msg: string) => void;
}

export default function AdminPanel({ user, language, showNotification }: AdminPanelProps) {
  const [usersList, setUsersList] = useState<AuthUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Selected user for quick edit
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [editSub, setEditSub] = useState<'Free' | 'Pro' | 'Enterprise'>('Free');

  // Platform wide variables
  const [systemCurrency, setSystemCurrency] = useState('$');
  const [geminiStatus, setGeminiStatus] = useState<'active' | 'inactive'>('active');
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [proPrice, setProPrice] = useState<number>(29);
  const [enterprisePrice, setEnterprisePrice] = useState<number>(99);

  useEffect(() => {
    loadUsers();
    // Load stored settings if any
    const storedCurrency = localStorage.getItem('youmi_sys_currency');
    if (storedCurrency) setSystemCurrency(storedCurrency);
    
    const storedPro = localStorage.getItem('youmi_price_pro');
    if (storedPro) setProPrice(Number(storedPro));
    
    const storedEnt = localStorage.getItem('youmi_price_enterprise');
    if (storedEnt) setEnterprisePrice(Number(storedEnt));
  }, []);

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const all = authService.getAllUsers();
      setUsersList(all);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (targetId: string) => {
    setIsLoading(true);
    try {
      const { success, error } = await authService.updateUserByAdmin(targetId, editRole, editSub);
      if (success) {
        showNotification(language === 'ar' ? '👤 تم تحديث عضوية المستخدم بنجاح!' : '👤 User membership updated successfully!');
        setEditingUserId(null);
        loadUsers();
      } else {
        alert(error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePricing = () => {
    localStorage.setItem('youmi_price_pro', String(proPrice));
    localStorage.setItem('youmi_price_enterprise', String(enterprisePrice));
    localStorage.setItem('youmi_sys_currency', systemCurrency);
    showNotification(language === 'ar' ? '💳 تم حفظ أسعار الاشتراكات الجديدة' : '💳 Subscription pricing updated successfully');
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPro = usersList.filter(u => u.subscription === 'Pro').length;
  const totalEnterprise = usersList.filter(u => u.subscription === 'Enterprise').length;
  const totalFree = usersList.filter(u => u.subscription === 'Free').length;

  return (
    <div className="space-y-6 text-start" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* 1. Header with Admin Role details */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-500 animate-pulse" />
            <span>{language === 'ar' ? 'لوحة تحكم المسؤول المتقدمة' : 'Advanced Admin Control Panel'}</span>
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
            {language === 'ar' 
              ? 'إدارة حسابات الأعضاء بالكامل، ترقية وتعديل باقات الاشتراك، وتغيير تسعير المنصة والتحكم في الميزات.'
              : 'Full administrator authorization to manage users, customize plans, update system rates and platform features.'}
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition cursor-pointer"
          title={language === 'ar' ? 'تحديث البيانات' : 'Refresh list'}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 2. Platform Stats Cards (Bento-Grid style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-teal-500/5 dark:bg-teal-950/20 border border-teal-500/20 rounded-xl text-start">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">{language === 'ar' ? 'إجمالي الأعضاء' : 'Total Users'}</span>
            <Users className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <span className="text-xl font-black text-teal-600 dark:text-teal-400">{usersList.length}</span>
          <span className="text-[8px] text-slate-400 block mt-0.5">{language === 'ar' ? 'مستخدم مسجل بالنظام' : 'Active registered users'}</span>
        </div>

        <div className="p-3 bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 rounded-xl text-start">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">{language === 'ar' ? 'المدراء' : 'Administrators'}</span>
            <Shield className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <span className="text-xl font-black text-rose-600 dark:text-rose-400">{usersList.filter(u => u.role === 'Admin').length}</span>
          <span className="text-[8px] text-slate-400 block mt-0.5">{language === 'ar' ? 'حسابات إدارة المنصة' : 'Platform system admins'}</span>
        </div>

        <div className="p-3 bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-start">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">{language === 'ar' ? 'المصممون والمحررون' : 'Designers & Editors'}</span>
            <Star className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{usersList.filter(u => u.role === 'Editor').length}</span>
          <span className="text-[8px] text-slate-400 block mt-0.5">{language === 'ar' ? 'صلاحيات تعديل وتصميم' : 'Storefront editors & layout creators'}</span>
        </div>

        <div className="p-3 bg-slate-500/5 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl text-start">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">{language === 'ar' ? 'المستعرضون' : 'Viewers'}</span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-xl font-black text-slate-700 dark:text-slate-300">{usersList.filter(u => u.role === 'Viewer').length}</span>
          <span className="text-[8px] text-slate-400 block mt-0.5">{language === 'ar' ? 'عرض مشاريع فقط' : 'Read-only viewer accounts'}</span>
        </div>
      </div>

      {/* 3. System Controls & Preferences */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-slate-400" />
          <span>{language === 'ar' ? 'إعدادات المنصة والعملة الرسمية' : 'Platform Preferences & System Currency'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Workspace Brand Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 block">
              {language === 'ar' ? 'عنوان المنصة الرسمي' : 'Platform Workspace Title'}
            </label>
            <input 
              type="text"
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold"
              value="YOUMI Builder"
              disabled
            />
          </div>

          {/* System Currency */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 block">
              {language === 'ar' ? 'رمز عملة المنصة الرسمية' : 'Platform Currency Symbol'}
            </label>
            <input 
              type="text"
              maxLength={4}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold"
              value={systemCurrency}
              onChange={(e) => setSystemCurrency(e.target.value)}
            />
          </div>
        </div>

        {/* Global Switches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          
          {/* YOUMI AI Switch */}
          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
            <div>
              <span className="text-xs font-bold block">{language === 'ar' ? 'مساعد الذكاء الاصطناعي (YOUMI AI)' : 'YOUMI AI Integration'}</span>
              <span className="text-[9px] text-slate-400 block">{language === 'ar' ? 'تفعيل مساعد الذكاء الاصطناعي لتوليد المتاجر' : 'Toggle AI capability globally'}</span>
            </div>
            <button
              onClick={() => {
                setGeminiStatus(prev => prev === 'active' ? 'inactive' : 'active');
                showNotification(language === 'ar' ? '🤖 تم تعديل حالة الذكاء الاصطناعي' : '🤖 AI service state changed');
              }}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                geminiStatus === 'active' 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}
            >
              {geminiStatus === 'active' ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{geminiStatus === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'معطل' : 'Paused')}</span>
            </button>
          </div>

          {/* Maintenance Switch */}
          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
            <div>
              <span className="text-xs font-bold block">{language === 'ar' ? 'وضع الصيانة للمنصة' : 'System Maintenance Mode'}</span>
              <span className="text-[9px] text-slate-400 block">{language === 'ar' ? 'تعليق تعديل المتاجر مؤقتاً للصيانة' : 'Freeze store operations for routine upkeep'}</span>
            </div>
            <button
              onClick={() => {
                setMaintenanceMode(!maintenanceMode);
                showNotification(language === 'ar' ? '⚠️ تم تبديل وضع الصيانة' : '⚠️ Maintenance mode toggled');
              }}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                maintenanceMode 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-300 border border-transparent'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{maintenanceMode ? (language === 'ar' ? 'مفعل ⚠️' : 'Active ⚠️') : (language === 'ar' ? 'مغلق' : 'Inactive')}</span>
            </button>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('youmi_sys_currency', systemCurrency);
              showNotification(language === 'ar' ? '⚙️ تم حفظ إعدادات المنصة بنجاح' : '⚙️ Configurations updated successfully');
            }}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-teal-500/10"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'حفظ إعدادات المنصة' : 'Save Configurations'}</span>
          </button>
        </div>

      </div>

      {/* 4. Active User Management List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{language === 'ar' ? 'قائمة حسابات المشتركين والعضويات' : 'Database Users & Subscriptions List'}</span>
          </h3>
          
          {/* Quick search input */}
          <div className="relative max-w-xs w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input 
              type="text"
              placeholder={language === 'ar' ? 'بحث باسم المشترك أو البريد...' : 'Search name or email...'}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Users list list-view */}
        <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
              {language === 'ar' ? 'لا يوجد نتائج للبحث المكتوب' : 'No users found matching query.'}
            </div>
          ) : (
            filteredUsers.map((item) => {
              const isEditing = editingUserId === item.id;
              
              return (
                <div 
                  key={item.id} 
                  className={`p-3 bg-white dark:bg-slate-900/80 border rounded-xl flex flex-col sm:flex-row justify-between gap-3 transition-all ${
                    isEditing 
                      ? 'border-teal-500 dark:border-teal-400 ring-1 ring-teal-500/20' 
                      : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* User profile abbreviation */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm uppercase shrink-0 ${
                      item.role === 'Admin'
                        ? 'bg-rose-500/15 text-rose-500'
                        : item.role === 'Editor'
                        ? 'bg-teal-500/10 text-teal-500'
                        : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {item.name.charAt(0)}
                    </div>
                    
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-none">{item.name}</span>
                        
                        {/* Role badge */}
                        <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded ${
                          item.role === 'Admin'
                            ? 'bg-rose-500/10 text-rose-500'
                            : item.role === 'Editor'
                            ? 'bg-teal-500/10 text-teal-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
                        }`}>
                          {item.role === 'Admin' ? (language === 'ar' ? 'مدير' : 'Admin') : item.role === 'Editor' ? (language === 'ar' ? 'محرر' : 'Editor') : (language === 'ar' ? 'مستعرض' : 'Viewer')}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{item.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex-wrap">
                        {/* select role */}
                        <select
                          className="bg-white dark:bg-slate-900 text-[10px] font-bold border border-slate-200 dark:border-slate-800 px-1.5 py-1 rounded"
                          value={editRole}
                          onChange={(e) => {
                            setEditRole(e.target.value as any);
                            setEditSub('Pro');
                          }}
                        >
                          <option value="Admin">{language === 'ar' ? 'مدير' : 'Admin'}</option>
                          <option value="Editor">{language === 'ar' ? 'محرر' : 'Editor'}</option>
                          <option value="Viewer">{language === 'ar' ? 'مستعرض' : 'Viewer'}</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleUpdateUser(item.id)}
                          className="p-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-[10px]"
                          title={language === 'ar' ? 'حفظ التغييرات' : 'Save user updates'}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUserId(null)}
                          className="p-1 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded text-[10px]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUserId(item.id);
                          setEditRole(item.role);
                          setEditSub('Pro');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-teal-600 dark:bg-slate-800 hover:dark:bg-teal-500 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white rounded-lg text-[10px] font-extrabold transition cursor-pointer"
                      >
                        {language === 'ar' ? 'تعديل صلاحيات الحساب' : 'Configure Role'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
