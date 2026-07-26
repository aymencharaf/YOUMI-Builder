import React, { useState } from 'react';
import { PluginItem } from '../types';
import { ToggleLeft, ToggleRight, MessageSquare, ShieldAlert, Truck, Code, HelpCircle, Save } from 'lucide-react';

interface PluginSystemProps {
  plugins: PluginItem[];
  onChange: (newPlugins: PluginItem[]) => void;
  language: 'ar' | 'en';
}

export default function PluginSystem({ plugins, onChange, language }: PluginSystemProps) {
  const [editingPluginId, setEditingPluginId] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState('');

  const togglePlugin = (id: string) => {
    const updated = plugins.map((p) => {
      if (p.id === id) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    onChange(updated);
  };

  const savePluginCode = (id: string) => {
    const updated = plugins.map((p) => {
      if (p.id === id) {
        return { ...p, code: editingCode };
      }
      return p;
    });
    onChange(updated);
    setEditingPluginId(null);
  };

  const startEditing = (p: PluginItem) => {
    setEditingPluginId(p.id);
    setEditingCode(p.code);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'yalidine':
        return <Truck className="w-5 h-5 text-red-500 shrink-0" />;
      case 'facebook_pixel':
        return <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0" />;
      default:
        return <Code className="w-5 h-5 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-4 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Code className="w-4 h-4 text-purple-500" />
          {language === 'ar' ? 'نظام الملحقات البرمجية والبيكسل' : 'E-commerce Plugin & Tracking Hub'}
        </h3>
        <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
          {language === 'ar'
            ? 'قم بتفعيل الملحقات وأدوات تتبع الشحن والتحليلات لزيادة مبيعات متجرك وتجهيزه للتصدير.'
            : 'Toggle and configure powerful marketing pixels, freight calculators, and script customizers.'}
        </p>
      </div>

      <div className="space-y-3">
        {plugins.map((p) => {
          const isEditing = editingPluginId === p.id;

          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-xl border transition-all ${
                p.isActive
                  ? 'bg-purple-50/20 border-purple-200 dark:border-purple-950 dark:bg-purple-950/10'
                  : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {getIcon(p.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => togglePlugin(p.id)}
                  className="text-slate-400 hover:text-purple-600 transition cursor-pointer"
                >
                  {p.isActive ? (
                    <ToggleRight className="w-8 h-8 text-purple-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  )}
                </button>
              </div>

              {p.isActive && (
                <div className="mt-3.5 pt-3.5 border-t border-dashed border-slate-100 dark:border-slate-800/80 space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 block">
                        {p.type === 'whatsapp'
                          ? (language === 'ar' ? 'رقم الهاتف (مثال: 0550000000)' : 'Phone Number (e.g. 0550000000)')
                          : p.type === 'facebook_pixel'
                          ? (language === 'ar' ? 'معرّف البيكسل (Pixel ID)' : 'Pixel ID Value')
                          : (language === 'ar' ? 'رابط التتبع أو الرمز المخصص' : 'Custom Action URL')}
                      </label>
                      <input
                        type="text"
                        value={editingCode}
                        onChange={(e) => setEditingCode(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none border-slate-200 dark:border-slate-800 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => savePluginCode(p.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] px-3 py-1 rounded-md transition flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'حفظ التغييرات' : 'Save Config'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-[9.5px] font-mono text-purple-700 dark:text-purple-400 truncate max-w-[180px]">
                        {p.type === 'whatsapp' ? `WhatsApp Phone: ` : p.type === 'facebook_pixel' ? `FB Pixel ID: ` : `Config: `}
                        {p.code || 'Not Configured'}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEditing(p)}
                        className="text-[9px] font-bold text-slate-600 hover:text-purple-600 dark:text-slate-300 transition cursor-pointer underline"
                      >
                        {language === 'ar' ? 'تعديل المعامل' : 'Edit Param'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl flex gap-2.5">
        <HelpCircle className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-[9.5px] text-indigo-700 dark:text-indigo-400 leading-normal">
          {language === 'ar'
            ? 'ملاحظة: الملحقات النشطة يتم تشغيلها ومحاكاة مظهرها مباشرة في نافذة المعاينة المباشرة وتضمينها كود كامل في ZIP التصدير.'
            : 'Operational Notice: Activated tracking pixels and dynamic modules execute seamlessly inside the sandbox preview and compile to output builds.'}
        </p>
      </div>
    </div>
  );
}
