import React from 'react';
import { FontsConfig } from '../../types';
import { Type } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface FontsEditorProps {
  config: FontsConfig;
  onChange: (updates: Partial<FontsConfig>) => void;
}

export default function FontsEditor({ config, onChange }: FontsEditorProps) {
  const { t, dir } = useTranslation();

  return (
    <div className="space-y-6 text-start font-sans" dir={dir}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-5 h-5 text-indigo-500" />
          {t('font_config_title')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('font_config_desc')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Heading Font Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            {t('font_heading_label')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { font: 'Inter', descKey: 'desc_swiss' },
              { font: 'Space Grotesk', descKey: 'desc_tech' },
              { font: 'Playfair Display', descKey: 'desc_elegant' },
              { font: 'Outfit', descKey: 'desc_modern' },
              { font: 'Plus Jakarta Sans', descKey: 'desc_friendly' },
            ].map((f) => (
              <button
                key={f.font}
                type="button"
                onClick={() => onChange({ headingFont: f.font as any })}
                className={`p-3 text-start border rounded-lg transition cursor-pointer ${
                  config.headingFont === f.font
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span
                  className="text-sm font-bold block mb-0.5"
                  style={{
                    fontFamily:
                      f.font === 'Inter'
                        ? 'Inter, sans-serif'
                        : f.font === 'Space Grotesk'
                        ? '"Space Grotesk", sans-serif'
                        : f.font === 'Playfair Display'
                        ? '"Playfair Display", serif'
                        : f.font === 'Outfit'
                        ? 'Outfit, sans-serif'
                        : '"Plus Jakarta Sans", sans-serif',
                  }}
                >
                  {f.font}
                </span>
                <span className="text-[10px] text-slate-400 block">{t(f.descKey as any)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body Font Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            {t('font_body_label')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { font: 'Inter', descKey: 'desc_max_legibility' },
              { font: 'Roboto', descKey: 'desc_muted_sans' },
              { font: 'Plus Jakarta Sans', descKey: 'desc_clean_premium' },
              { font: 'Lora', descKey: 'desc_warm_serif' },
            ].map((f) => (
              <button
                key={f.font}
                type="button"
                onClick={() => onChange({ bodyFont: f.font as any })}
                className={`p-3 text-start border rounded-lg transition cursor-pointer ${
                  config.bodyFont === f.font
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span
                  className="text-xs font-medium block mb-0.5"
                  style={{
                    fontFamily:
                      f.font === 'Inter'
                        ? 'Inter, sans-serif'
                        : f.font === 'Roboto'
                        ? 'Roboto, sans-serif'
                        : f.font === 'Plus Jakarta Sans'
                        ? '"Plus Jakarta Sans", sans-serif'
                        : 'Lora, serif',
                  }}
                >
                  {f.font}
                </span>
                <span className="text-[10px] text-slate-400 block">{t(f.descKey as any)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Base Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            {t('font_size_label')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'small', labelKey: 'size_compact', descKey: 'size_compact_desc' },
              { id: 'medium', labelKey: 'size_standard', descKey: 'size_standard_desc' },
              { id: 'large', labelKey: 'size_spacious', descKey: 'size_spacious_desc' },
            ].map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => onChange({ fontSizeBase: size.id as any })}
                className={`p-3 text-start border rounded-lg transition text-xs flex flex-col justify-between cursor-pointer ${
                  config.fontSizeBase === size.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="font-semibold block mb-0.5">{t(size.labelKey as any)}</span>
                <span className="text-[9px] text-slate-400 leading-normal">{t(size.descKey as any)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Font Sandbox Preview card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('font_preview_title')}
          </span>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
            <h4
              className="font-bold tracking-tight text-slate-900 dark:text-white mb-1.5"
              style={{
                fontSize: config.fontSizeBase === 'small' ? '1.125rem' : config.fontSizeBase === 'large' ? '1.5rem' : '1.25rem',
                fontFamily:
                  config.headingFont === 'Inter'
                    ? 'Inter, sans-serif'
                    : config.headingFont === 'Space Grotesk'
                    ? '"Space Grotesk", sans-serif'
                    : config.headingFont === 'Playfair Display'
                    ? '"Playfair Display", serif'
                    : config.headingFont === 'Outfit'
                    ? 'Outfit, sans-serif'
                    : '"Plus Jakarta Sans", sans-serif',
              }}
            >
              {t('font_preview_heading')}
            </h4>
            <p
              className="text-slate-600 dark:text-slate-400 leading-relaxed"
              style={{
                fontSize: config.fontSizeBase === 'small' ? '0.75rem' : config.fontSizeBase === 'large' ? '0.95rem' : '0.85rem',
                fontFamily:
                  config.bodyFont === 'Inter'
                    ? 'Inter, sans-serif'
                    : config.bodyFont === 'Roboto'
                    ? 'Roboto, sans-serif'
                    : config.bodyFont === 'Plus Jakarta Sans'
                    ? '"Plus Jakarta Sans", sans-serif'
                    : 'Lora, serif',
              }}
            >
              {t('font_preview_body')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
