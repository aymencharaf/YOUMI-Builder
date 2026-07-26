import React from 'react';
import { SiteInfoConfig, ColorsConfig, FontsConfig, Asset } from '../../types';
import { Globe, Upload } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface SiteInfoEditorProps {
  config: SiteInfoConfig;
  onChange: (updates: Partial<SiteInfoConfig>) => void;
  colorsConfig: ColorsConfig;
  onColorsChange: (updates: Partial<ColorsConfig>) => void;
  fontsConfig: FontsConfig;
  onFontsChange: (updates: Partial<FontsConfig>) => void;
  assets: Asset[];
  openAssetManager: (category: 'logo' | 'hero' | 'product' | 'category', onSelect: (url: string) => void) => void;
}

export default function SiteInfoEditor({
  config,
  onChange,
  colorsConfig,
  onColorsChange,
  fontsConfig,
  onFontsChange,
  openAssetManager,
}: SiteInfoEditorProps) {
  const { t, dir } = useTranslation();

  return (
    <div className="space-y-5 text-start font-sans" dir={dir}>
      {/* Title Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <span className="text-xs font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">
            PACK-001
          </span>
          <h3 className="text-sm font-bold">{t('site_info_title')}</h3>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-normal">
          {t('site_info_desc')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Site Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            {t('site_name_label')}
          </label>
          <input
            type="text"
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={config.siteName}
            onChange={(e) => onChange({ siteName: e.target.value })}
            placeholder={t('site_name_placeholder')}
          />
        </div>

        {/* Site Logo */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            {t('site_logo_label')}
          </label>
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Globe className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="text-start">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                  {config.siteName || 'YOUMI'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate max-w-[150px] font-mono">
                  {config.logoUrl ? t('logo_custom_active') : t('logo_not_selected')}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAssetManager('logo', (url) => onChange({ logoUrl: url }))}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('change_logo_btn')}</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            {t('site_desc_label')}
          </label>
          <textarea
            rows={2}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-start"
            value={config.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder={t('site_desc_placeholder')}
          />
        </div>

        {/* Currency */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            {t('site_currency_label')}
          </label>
          <input
            type="text"
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-start"
            value={config.currency || ''}
            onChange={(e) => onChange({ currency: e.target.value })}
            placeholder={t('site_currency_placeholder')}
          />
        </div>

        {/* Primary Colors Customizer */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 block">
            {t('primary_colors_label')}
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {/* Main color */}
            <div className="flex items-center justify-between gap-3 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700/60">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t('main_color_label')}
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  className="w-20 px-1.5 py-1 text-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[11px] font-mono text-slate-700 dark:text-white uppercase"
                  value={colorsConfig.primary}
                  onChange={(e) => onColorsChange({ primary: e.target.value, accent: e.target.value })}
                />
                <input
                  type="color"
                  className="w-7 h-7 rounded border-0 p-0 cursor-pointer overflow-hidden shrink-0"
                  value={colorsConfig.primary}
                  onChange={(e) => onColorsChange({ primary: e.target.value, accent: e.target.value })}
                />
              </div>
            </div>

            {/* Secondary color */}
            <div className="flex items-center justify-between gap-3 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700/60">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t('secondary_color_label')}
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  className="w-20 px-1.5 py-1 text-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[11px] font-mono text-slate-700 dark:text-white uppercase"
                  value={colorsConfig.secondary}
                  onChange={(e) => onColorsChange({ secondary: e.target.value })}
                />
                <input
                  type="color"
                  className="w-7 h-7 rounded border-0 p-0 cursor-pointer overflow-hidden shrink-0"
                  value={colorsConfig.secondary}
                  onChange={(e) => onColorsChange({ secondary: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Base Font Selector */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            {t('base_font_label')}
          </label>
          <select
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            value={fontsConfig.headingFont}
            onChange={(e) => onFontsChange({ headingFont: e.target.value as any, bodyFont: e.target.value as any })}
          >
            <option value="Cairo">Cairo (القاهرة)</option>
            <option value="Tajawal">Tajawal (تجول)</option>
            <option value="Almarai">Almarai (المراعي)</option>
            <option value="Inter">Inter</option>
            <option value="Outfit">Outfit</option>
          </select>
        </div>

        {/* Favicon */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            {t('favicon_label')}
          </label>
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt="Favicon"
                    className="w-5 h-5 object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Globe className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="text-start">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t('favicon_sub_label')}
                </span>
                <span className="text-[9px] text-slate-400 block">
                  {t('favicon_desc')}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAssetManager('logo', (url) => onChange({ logoUrl: url }))}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('change_favicon_btn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
