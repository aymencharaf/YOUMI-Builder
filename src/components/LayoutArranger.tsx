import React, { useState } from 'react';
import { ArrowUp, ArrowDown, GripVertical, CheckCircle2, RefreshCw } from 'lucide-react';

interface LayoutArrangerProps {
  sectionOrder: string[];
  onChange: (newOrder: string[]) => void;
  language: 'ar' | 'en';
}

export default function LayoutArranger({ sectionOrder, onChange, language }: LayoutArrangerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const labels: Record<string, { ar: string; en: string }> = {
    header: { ar: 'الرأس والشريط الإعلاني (Header)', en: 'Header & Announcement Bar' },
    menu: { ar: 'شريط التنقل والقائمة (Mega Menu)', en: 'Navigation Menu & Categories' },
    hero: { ar: 'السلايدر والعروض الرئيسية (Hero Slider)', en: 'Hero Banner Slider' },
    categories: { ar: 'شبكة الأقسام والمنتجات (Catalog)', en: 'Categories Grid & Products' },
    footer: { ar: 'تذييل الصفحة والروابط (Footer)', en: 'Footer Links & Copyright' },
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    const newOrder = [...sectionOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    onChange(newOrder);
    setDraggedIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    onChange(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === sectionOrder.length - 1) return;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    onChange(newOrder);
  };

  const resetDefault = () => {
    onChange(['header', 'menu', 'hero', 'categories', 'footer']);
  };

  return (
    <div className="space-y-4 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-teal-600 rounded-xs inline-block" />
          {language === 'ar' ? 'ترتيب أقسام المتجر (سحب وإفلات)' : 'Store Section Arranger (Drag & Drop)'}
        </h3>
        <button
          type="button"
          onClick={resetDefault}
          className="text-[10px] bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{language === 'ar' ? 'إعادة التعيين' : 'Reset Default'}</span>
        </button>
      </div>

      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-relaxed">
        {language === 'ar'
          ? 'اسحب وأفلت لترتيب ترتيب ظهور الأقسام على الصفحة الرئيسية، أو استخدم الأسهم للتحريك السريع.'
          : 'Drag & drop block items to rearrange their vertical rendering order on the homepage, or use arrow keys for quick swaps.'}
      </p>

      <div className="space-y-2">
        {sectionOrder.map((section, idx) => {
          const isDragging = draggedIndex === idx;
          const sectionLabel = labels[section]?.[language] || section;

          return (
            <div
              key={section}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isDragging
                  ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800 scale-[0.98]'
                  : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400 px-1.5 py-0.5 rounded font-bold uppercase">
                    PACK-{idx + 1 < 10 ? `00${idx + 1}` : `0${idx + 1}`}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mt-1">
                    {sectionLabel}
                  </span>
                </div>
              </div>

              {/* swap actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                  title={language === 'ar' ? 'تحريك لأعلى' : 'Move Up'}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx === sectionOrder.length - 1}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                  title={language === 'ar' ? 'تحريك لأسفل' : 'Move Down'}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 flex gap-2.5 items-start">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-normal">
          {language === 'ar'
            ? 'تحديث فوري! تتم محاكاة ترتيب الأقسام تلقائياً في نافذة المعاينة المباشرة وفي حزم التصدير البرمجية لـ React و Next.js.'
            : 'Instant sync! The order is updated dynamically in the live preview and compiles cleanly into both React and Next.js exports.'}
        </p>
      </div>
    </div>
  );
}
