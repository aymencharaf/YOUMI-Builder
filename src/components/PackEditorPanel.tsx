import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, RotateCcw, Save, Ban } from 'lucide-react';

interface Pack {
  id: string;
  code: string;
  name: string;
  desc: string;
  icon: React.ComponentType<any>;
}

interface PackEditorPanelProps {
  activePackId: string;
  packs: Pack[];
  language: string;
  dir: 'rtl' | 'ltr';
  children: React.ReactNode;
  
  // Footer actions
  onReset: () => void;
  onSave: () => void;
  onCancel: () => void;
  
  // Advanced options integration
  isIncluded: boolean;
  onToggleIncluded: () => void;
}

export default function PackEditorPanel({
  activePackId,
  packs,
  language,
  dir,
  children,
  onReset,
  onSave,
  onCancel,
  isIncluded,
  onToggleIncluded,
}: PackEditorPanelProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const activePack = packs.find((p) => p.id === activePackId);
  const IconComponent = activePack?.icon || Sliders;

  const isRtl = dir === 'rtl' || language === 'ar';

  return (
    <div 
      className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-start"
      dir={dir}
    >
      {/* Sticky Header inside the editor */}
      <div className="sticky top-0 z-10 p-4 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-start justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {activePack?.code || 'PACK-SET'}
              </span>
              {isIncluded && (
                <span className="text-[8px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1 py-0.2 rounded">
                  {language === 'ar' ? 'مضمن' : 'Active'}
                </span>
              )}
            </div>
            <h2 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
              {activePack?.name || 'PACK Editor'}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal max-w-xs">
              {activePack?.desc || 'Configure options for this template component.'}
            </p>
          </div>
        </div>
      </div>

      {/* Body: Scrollable, containing active editor & collapsible advanced settings */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar min-h-0">
        {/* Core Active Editor Children */}
        <div className="pb-1">
          {children}
        </div>

        {/* Advanced Settings (Collapsible Accordion) */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              {language === 'ar' ? '⚙️ إعدادات متقدمة' : '⚙️ Advanced Settings'}
            </span>
            {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isAdvancedOpen && (
            <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-3 text-xs">
              {/* Include in Build Switch */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300 block text-[11px]">
                    {language === 'ar' ? 'تضمين المكون في القالب' : 'Include component in layout'}
                  </span>
                  <span className="text-[9px] text-slate-400 block leading-tight">
                    {language === 'ar' 
                      ? 'حدد ما إذا كان هذا القسم سيظهر للمشترين.'
                      : 'Control if this component is rendered on live template.'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isIncluded}
                    onChange={onToggleIncluded}
                  />
                  <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Developer Meta info */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[9px] text-slate-400 font-mono">
                <div>
                  <span className="block font-bold">{language === 'ar' ? 'معرف العنصر:' : 'Element Alias:'}</span>
                  <span className="block mt-0.5 text-slate-600 dark:text-slate-300 font-bold">{activePackId}</span>
                </div>
                <div>
                  <span className="block font-bold">{language === 'ar' ? 'نسخة المكون:' : 'Package Version:'}</span>
                  <span className="block mt-0.5 text-slate-600 dark:text-slate-300 font-bold">v1.4.2-stable</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer inside the editor */}
      <div className="sticky bottom-0 z-10 p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 shrink-0 flex items-center justify-between gap-2">
        {/* Reset Pack Button */}
        <button
          type="button"
          onClick={onReset}
          className="px-2.5 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
          title={language === 'ar' ? 'إعادة تعيين هذا القسم فقط' : 'Reset this section only'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{language === 'ar' ? 'إعادة تعيين' : 'Reset'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200/50 dark:border-slate-700"
          >
            <Ban className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={onSave}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-teal-500/10"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'حفظ' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
