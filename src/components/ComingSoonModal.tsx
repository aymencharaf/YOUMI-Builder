import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { authService } from '../utils/authService';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  showNotification: (msg: string) => void;
  userEmail?: string;
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  language,
  showNotification,
  userEmail = ''
}: ComingSoonModalProps) {
  const [email, setEmail] = useState(userEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-fill email if user logging state changes
  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg(language === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { success, error } = await authService.saveAnnouncementEmail(email.trim());
      if (success) {
        setIsSuccess(true);
        showNotification(
          language === 'ar' 
            ? '🚀 تم تسجيل بريدك الإلكتروني بنجاح! سنقوم بإعلامك فور الإطلاق.' 
            : '🚀 Email registered successfully! We will notify you once available.'
        );
      } else {
        setErrorMsg(error || (language === 'ar' ? 'حدث خطأ أثناء التسجيل، يرجى المحاولة لاحقًا' : 'Failed to register, please try again later'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in font-sans">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 relative shadow-2xl animate-scale-in text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close button */}
        <button 
          onClick={handleModalClose} 
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-300 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'شكراً لاهتمامك!' : 'Subscription Recorded!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                {language === 'ar' 
                  ? `لقد تم تسجيل البريد (${email}) بنجاح لتلقي الإشعارات حول YOUMI Pro.` 
                  : `We have registered your interest (${email}) for the upcoming YOUMI Pro launch.`}
              </p>
            </div>
            <button
              onClick={handleModalClose}
              className="px-6 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Visual Icon Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-teal-500 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  {language === 'ar' ? 'قريبًا' : 'Coming Soon'}
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                  {language === 'ar' ? 'باقة YOUMI Pro قادمة قريبًا' : 'YOUMI Pro is Coming Soon'}
                </h3>
              </div>
            </div>

            {/* Description Message */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'ar' 
                ? 'نحن نجهز لكم تجربة اشتراك مميزة واستثنائية لتوليد وتطوير المتاجر الرقمية السحابية بمرونة لا تضاهى. اترك بريدك الإلكتروني لتصلك التنبيهات فور إطلاق الباقة الاحترافية.' 
                : 'We are preparing an amazing premium experience. Leave your email to be notified when subscriptions become available.'}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">
                  {language === 'ar' ? 'البريد الإلكتروني للتنبيهات' : 'Notification Email Address'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. hello@youmi-store.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25 transition"
                  />
                </div>
                {errorMsg && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">⚠️ {errorMsg}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/10 disabled:opacity-50"
                >
                  {isSubmitting && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{language === 'ar' ? 'سجل للتنبيه' : 'Notify Me'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
