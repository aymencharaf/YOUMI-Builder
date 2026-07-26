import React from 'react';
import { ColorsConfig } from '../../types';
import { Palette, Sparkles } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface ColorsEditorProps {
  config: ColorsConfig;
  onChange: (updates: Partial<ColorsConfig>) => void;
}

const PRESET_PALETTES = [
  {
    nameKey: 'preset_carbon',
    colors: {
      primary: '#171717',
      secondary: '#44403c',
      accent: '#b45309',
      background: '#fafaf9',
      text: '#1c1917',
      headerBg: '#ffffff',
      footerBg: '#1c1917',
    },
  },
  {
    nameKey: 'preset_cyber',
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#06b6d4',
      background: '#0f172a',
      text: '#f8fafc',
      headerBg: '#1e293b',
      footerBg: '#020617',
    },
  },
  {
    nameKey: 'preset_forest',
    colors: {
      primary: '#15803d',
      secondary: '#166534',
      accent: '#ca8a04',
      background: '#f0fdf4',
      text: '#14532d',
      headerBg: '#ffffff',
      footerBg: '#14532d',
    },
  },
  {
    nameKey: 'preset_berry',
    colors: {
      primary: '#9d174d',
      secondary: '#be185d',
      accent: '#db2777',
      background: '#fdf2f8',
      text: '#831843',
      headerBg: '#ffffff',
      footerBg: '#831843',
    },
  },
  {
    nameKey: 'preset_slate',
    colors: {
      primary: '#334155',
      secondary: '#475569',
      accent: '#6366f1',
      background: '#f8fafc',
      text: '#0f172a',
      headerBg: '#ffffff',
      footerBg: '#0f172a',
    },
  },
];

export default function ColorsEditor({ config, onChange }: ColorsEditorProps) {
  const { t, dir } = useTranslation();

  return (
    <div className="space-y-6 text-start font-sans" dir={dir}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          {t('color_config_title')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('color_config_desc')}
        </p>
      </div>

      {/* Preset Palettes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t('color_preset_title')}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_PALETTES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset.colors)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-start flex items-center justify-between hover:border-indigo-500 transition group cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 block">
                  {t(preset.nameKey as any)}
                </span>
                <span className="text-[10px] text-slate-400">{t('color_preset_desc')}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                {[
                  preset.colors.primary,
                  preset.colors.accent,
                  preset.colors.background,
                  preset.colors.footerBg,
                ].map((color, cIdx) => (
                  <span
                    key={cIdx}
                    className="w-3 h-3 rounded-full border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Swatches */}
      <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
          {t('color_fine_tune_title')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primary Color */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {t('color_primary')}
              </span>
              <span className="text-[10px] text-slate-400">{t('color_primary_desc')}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="color"
                className="w-7 h-7 rounded-md cursor-pointer border border-slate-200 shrink-0"
                value={config.primary}
                onChange={(e) => onChange({ primary: e.target.value })}
              />
              <input
                type="text"
                className="w-16 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded py-0.5 text-slate-700 dark:text-slate-300 uppercase"
                value={config.primary}
                onChange={(e) => onChange({ primary: e.target.value })}
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {t('color_secondary')}
              </span>
              <span className="text-[10px] text-slate-400">{t('color_secondary_desc')}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="color"
                className="w-7 h-7 rounded-md cursor-pointer border border-slate-200 shrink-0"
                value={config.secondary}
                onChange={(e) => onChange({ secondary: e.target.value })}
              />
              <input
                type="text"
                className="w-16 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded py-0.5 text-slate-700 dark:text-slate-300 uppercase"
                value={config.secondary}
                onChange={(e) => onChange({ secondary: e.target.value })}
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {t('color_accent')}
              </span>
              <span className="text-[10px] text-slate-400">{t('color_accent_desc')}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="color"
                className="w-7 h-7 rounded-md cursor-pointer border border-slate-200 shrink-0"
                value={config.accent}
                onChange={(e) => onChange({ accent: e.target.value })}
              />
              <input
                type="text"
                className="w-16 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded py-0.5 text-slate-700 dark:text-slate-300 uppercase"
                value={config.accent}
                onChange={(e) => onChange({ accent: e.target.value })}
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {t('color_background')}
              </span>
              <span className="text-[10px] text-slate-400">{t('color_background_desc')}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="color"
                className="w-7 h-7 rounded-md cursor-pointer border border-slate-200 shrink-0"
                value={config.background}
                onChange={(e) => onChange({ background: e.target.value })}
              />
              <input
                type="text"
                className="w-16 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded py-0.5 text-slate-700 dark:text-slate-300 uppercase"
                value={config.background}
                onChange={(e) => onChange({ background: e.target.value })}
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {t('color_text')}
              </span>
              <span className="text-[10px] text-slate-400">{t('color_text_desc')}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="color"
                className="w-7 h-7 rounded-md cursor-pointer border border-slate-200 shrink-0"
                value={config.text}
                onChange={(e) => onChange({ text: e.target.value })}
              />
              <input
                type="text"
                className="w-16 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded py-0.5 text-slate-700 dark:text-slate-300 uppercase"
                value={config.text}
                onChange={(e) => onChange({ text: e.target.value })}
              />
            </div>
          </div>

          {/* Header Background */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {t('color_header_bg')}
              </span>
              <span className="text-[10px] text-slate-400">{t('color_header_bg_desc')}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="color"
                className="w-7 h-7 rounded-md cursor-pointer border border-slate-200 shrink-0"
                value={config.headerBg}
                onChange={(e) => onChange({ headerBg: e.target.value })}
              />
              <input
                type="text"
                className="w-16 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded py-0.5 text-slate-700 dark:text-slate-300 uppercase"
                value={config.headerBg}
                onChange={(e) => onChange({ headerBg: e.target.value })}
              />
            </div>
          </div>

          {/* Footer Background */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 rounded-lg col-span-1 sm:col-span-2">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {t('color_footer_bg')}
              </span>
              <span className="text-[10px] text-slate-400">{t('color_footer_bg_desc')}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="color"
                className="w-7 h-7 rounded-md cursor-pointer border border-slate-200 shrink-0"
                value={config.footerBg}
                onChange={(e) => onChange({ footerBg: e.target.value })}
              />
              <input
                type="text"
                className="w-16 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded py-0.5 text-slate-700 dark:text-slate-300 uppercase"
                value={config.footerBg}
                onChange={(e) => onChange({ footerBg: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
