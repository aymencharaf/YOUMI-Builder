import React, { useState } from 'react';
import { ProjectConfig } from '../types';
import { Sparkles, Send, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../utils/i18n';

interface AIBuilderProps {
  onApplyConfig: (config: ProjectConfig) => void;
  language: 'ar' | 'en';
}

export default function AIBuilder({ onApplyConfig, language }: AIBuilderProps) {
  const { t, dir } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const PRESET_PROMPTS = [
    { label: t('ai_preset_1_label'), text: t('ai_preset_1_text') },
    { label: t('ai_preset_2_label'), text: t('ai_preset_2_text') },
    { label: t('ai_preset_3_label'), text: t('ai_preset_3_text') },
    { label: t('ai_preset_4_label'), text: t('ai_preset_4_text') }
  ];

  const handleGenerate = async (textToUse: string) => {
    const promptText = textToUse.trim();
    if (!promptText) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          language: language === 'ar' ? 'Arabic' : 'English'
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'فشل توليد القالب عبر الذكاء الاصطناعي');
      }

      if (data.config) {
        // Enforce sectionOrder and plugins if they are missing
        const completeConfig: ProjectConfig = {
          ...data.config,
          sectionOrder: data.config.sectionOrder || ['header', 'menu', 'hero', 'categories', 'footer'],
          plugins: data.config.plugins || [
            {
              id: 'pl-wa',
              name: 'زر واتساب العائم (WhatsApp Float)',
              description: 'أضف زر واتساب عائم للتواصل السريع مع الزوار بضغطة واحدة',
              type: 'whatsapp',
              code: '0550000000',
              isActive: false,
              location: 'body'
            },
            {
              id: 'pl-fb',
              name: 'فيسبوك بيكسل (Facebook Pixel)',
              description: 'تتبع التحويلات وحملاتك الإعلانية على فيسبوك تلقائياً',
              type: 'facebook_pixel',
              code: '1234567890',
              isActive: false,
              location: 'header'
            },
            {
              id: 'pl-yal',
              name: 'تتبع شحنات يالدين (Yalidine Express)',
              description: 'أداة ذكية لتسهيل تتبع طرود زبائنك عبر شركة الشحن يالدين',
              type: 'yalidine',
              code: 'https://yalidine.com/track',
              isActive: false,
              location: 'footer'
            }
          ]
        };

        onApplyConfig(completeConfig);
        setSuccess(true);
        setPrompt('');
      } else {
        throw new Error('لم يتم إرجاع التكوين المناسب للمتجر');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ غير متوقع أثناء توليد التكوين');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-start" dir={dir}>
      <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
          {t('ai_builder_title')}
        </h3>
        <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
          {t('ai_builder_desc')}
        </p>
      </div>

      {/* Input area */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder={t('ai_builder_placeholder')}
            className="w-full p-3 border rounded-xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none border-slate-200 dark:border-slate-800 resize-none leading-relaxed text-start"
          />
        </div>

        <button
          type="button"
          disabled={isLoading || !prompt.trim()}
          onClick={() => handleGenerate(prompt)}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{t('ai_builder_generating')}</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>{t('ai_builder_generate_btn')}</span>
            </>
          )}
        </button>
      </div>

      {/* Prompt Presets */}
      <div className="space-y-2.5">
        <span className="text-[10px] text-slate-400 font-extrabold block">
          {t('ai_builder_presets_title')}
        </span>
        <div className="grid grid-cols-1 gap-2">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleGenerate(preset.text)}
              className="text-[10px] text-start p-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer leading-normal block"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Success / Error Banners */}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-3 flex gap-2.5 items-start">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10.5px] font-black text-emerald-800 dark:text-emerald-400 block">
              {t('ai_builder_success_title')}
            </span>
            <p className="text-[9.5px] text-emerald-600 dark:text-emerald-500 leading-normal">
              {t('ai_builder_success_desc')}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl p-3 flex gap-2.5 items-start">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10.5px] font-black text-rose-800 dark:text-rose-400 block">
              {t('ai_builder_fail_title')}
            </span>
            <p className="text-[9.5px] text-rose-600 dark:text-rose-500 leading-normal">
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
