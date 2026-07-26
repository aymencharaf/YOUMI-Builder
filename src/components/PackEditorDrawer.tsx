import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sliders, ChevronDown, ChevronUp, RotateCcw, Save, Check, Ban } from 'lucide-react';

interface Pack {
  id: string;
  code: string;
  name: string;
  desc: string;
  icon: React.ComponentType<any>;
}

interface PackEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePackId: string;
  packs: Pack[];
  language: string;
  dir: 'rtl' | 'ltr';
  children: React.ReactNode;
  
  // Footer actions
  onReset: () => void;
  onApply: () => void;
  onSave: () => void;
  onCancel: () => void;
  
  // Advanced options integration
  isIncluded: boolean;
  onToggleIncluded: () => void;
}

export default function PackEditorDrawer({
  isOpen,
  onClose,
  activePackId,
  packs,
  language,
  dir,
  children,
  onReset,
  onApply,
  onSave,
  onCancel,
  isIncluded,
  onToggleIncluded,
}: PackEditorDrawerProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Keyboard shortcut - Escape closes drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  // Prevent scrolling behind open drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activePack = packs.find((p) => p.id === activePackId);
  const IconComponent = activePack?.icon || Sliders;

  const isRtl = dir === 'rtl' || language === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle Backdrop Blur behind Drawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 cursor-pointer"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 h-full w-full sm:w-[480px] md:w-[500px] xl:w-[540px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden text-start"
            dir={dir}
          >
            {/* Header: PACK Icon, Name, Desc & Close Button */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {activePack?.code || 'PACK-SET'}
                    </span>
                    {isIncluded && (
                      <span className="text-[9px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                        {language === 'ar' ? 'مضمن بالنظام' : 'Active'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {activePack?.name || 'PACK Editor'}
                  </h2>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed max-w-xs sm:max-w-sm">
                    {activePack?.desc || 'Modify configuration options for this store template component.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCancel}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Section (Scrollable, containing active editor & collapsible advanced settings) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Core Active Editor Children */}
              <div className="pb-2">
                {children}
              </div>

              {/* Advanced Settings (Collapsible Accordion) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="w-full py-2 flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    {language === 'ar' ? '⚙️ إعدادات متقدمة للمكون' : '⚙️ Advanced Component Settings'}
                  </span>
                  {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isAdvancedOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-4 text-xs"
                  >
                    {/* Include in Build Switch */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-700 dark:text-slate-300 block">
                          {language === 'ar' ? 'تضمين المكون في القالب النهائي' : 'Include component in compiled layout'}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-relaxed">
                          {language === 'ar' 
                            ? 'حدد ما إذا كان هذا القسم سيظهر للمشترين في الواجهة الأمامية للمتجر.'
                            : 'Control if this component will be rendered on the storefront live template.'}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isIncluded}
                          onChange={onToggleIncluded}
                        />
                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    {/* Developer Meta info */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-[10px] text-slate-400 font-mono">
                      <div>
                        <span className="block font-bold">{language === 'ar' ? 'معرف العنصر:' : 'Element Alias:'}</span>
                        <span className="block mt-0.5 text-slate-600 dark:text-slate-300 font-bold">{activePackId}</span>
                      </div>
                      <div>
                        <span className="block font-bold">{language === 'ar' ? 'نسخة المكون:' : 'Package Version:'}</span>
                        <span className="block mt-0.5 text-slate-600 dark:text-slate-300 font-bold">v1.4.2-stable</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer: Reset, Apply, Save, Cancel */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 shrink-0 flex flex-wrap gap-2 justify-between items-center">
              {/* Reset Pack Button */}
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
                title={language === 'ar' ? 'إعادة تعيين هذا القسم فقط' : 'Reset this section only'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'إعادة تعيين' : 'Reset'}</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200/50 dark:border-slate-700"
                >
                  <Ban className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
                </button>

                {/* Apply Changes Button */}
                <button
                  type="button"
                  onClick={onApply}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/20 text-teal-600 dark:text-teal-400 hover:border-teal-300 dark:hover:border-teal-800 rounded-lg text-xs font-extrabold transition flex items-center gap-1 cursor-pointer border border-slate-200/50 dark:border-slate-700"
                  title={language === 'ar' ? 'حفظ التعديلات مؤقتاً بالواجهة' : 'Apply changes instantly'}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تطبيق' : 'Apply'}</span>
                </button>

                {/* Save & Close Button */}
                <button
                  type="button"
                  onClick={onSave}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-teal-500/10"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حفظ وإغلاق' : 'Save & Close'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
