import React from 'react';
import { ButtonsConfig } from '../../types';
import { Square } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface ButtonsEditorProps {
  config: ButtonsConfig;
  onChange: (updates: Partial<ButtonsConfig>) => void;
  brandPrimaryColor: string;
}

export default function ButtonsEditor({ config, onChange, brandPrimaryColor }: ButtonsEditorProps) {
  const { t, dir } = useTranslation();

  return (
    <div className="space-y-6 text-start font-sans" dir={dir}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Square className="w-5 h-5 text-indigo-500" />
          {t('btn_config_title')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('btn_config_desc')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Border Radius */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('btn_shape_label')}
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'none', labelKey: 'shape_boxy' },
              { id: 'sm', labelKey: 'shape_sharp' },
              { id: 'md', labelKey: 'shape_soft' },
              { id: 'lg', labelKey: 'shape_round' },
              { id: 'full', labelKey: 'shape_pill' },
            ].map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => onChange({ borderRadius: shape.id as any })}
                className={`py-2 px-1 text-center border rounded-lg transition text-xs font-medium cursor-pointer ${
                  config.borderRadius === shape.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {t(shape.labelKey as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Padding */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('btn_padding_label')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'compact', labelKey: 'pad_compact', descKey: 'pad_compact_desc' },
              { id: 'normal', labelKey: 'pad_normal', descKey: 'pad_normal_desc' },
              { id: 'spacious', labelKey: 'pad_spacious', descKey: 'pad_spacious_desc' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ buttonPadding: p.id as any })}
                className={`p-3 text-start border rounded-lg transition text-xs flex flex-col justify-between cursor-pointer ${
                  config.buttonPadding === p.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="font-semibold block mb-0.5">{t(p.labelKey as any)}</span>
                <span className="text-[9px] text-slate-400 leading-normal">{t(p.descKey as any)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Button Shadow */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('btn_shadow_label')}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'none', labelKey: 'sh_flat' },
              { id: 'sm', labelKey: 'sh_raised' },
              { id: 'md', labelKey: 'sh_floating' },
              { id: 'lg', labelKey: 'sh_deep' },
            ].map((sh) => (
              <button
                key={sh.id}
                type="button"
                onClick={() => onChange({ buttonShadow: sh.id as any })}
                className={`py-2 text-center border rounded-lg transition text-xs font-medium cursor-pointer ${
                  config.buttonShadow === sh.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t(sh.labelKey as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Hover Micro-Effects */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('btn_hover_label')}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'none', labelKey: 'hover_none' },
              { id: 'scale', labelKey: 'hover_scale' },
              { id: 'fade', labelKey: 'hover_fade' },
            ].map((eff) => (
              <button
                key={eff.id}
                type="button"
                onClick={() => onChange({ hoverEffect: eff.id as any })}
                className={`py-2 text-center border rounded-lg transition text-xs font-medium col-span-1 cursor-pointer ${
                  eff.id === 'none' ? 'col-span-2' : ''
                } ${
                  config.hoverEffect === eff.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t(eff.labelKey as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Button Specimen preview card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('btn_preview_title')}
          </span>
          <div className="p-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex justify-center items-center">
            <button
              type="button"
              className="text-white font-semibold transition-all cursor-pointer flex items-center gap-2 active:scale-95 select-none"
              style={{
                backgroundColor: brandPrimaryColor,
                borderRadius:
                  config.borderRadius === 'none'
                    ? '0px'
                    : config.borderRadius === 'sm'
                    ? '4px'
                    : config.borderRadius === 'md'
                    ? '8px'
                    : config.borderRadius === 'lg'
                    ? '16px'
                    : '9999px',
                padding:
                  config.buttonPadding === 'compact'
                    ? '6px 16px'
                    : config.buttonPadding === 'spacious'
                    ? '14px 32px'
                    : '10px 24px',
                boxShadow:
                  config.buttonShadow === 'none'
                    ? 'none'
                    : config.buttonShadow === 'sm'
                    ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                    : config.buttonShadow === 'md'
                    ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                    : '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                transform: config.hoverEffect === 'scale' ? 'scale(1)' : undefined,
                opacity: 1,
              }}
              onMouseEnter={(e) => {
                if (config.hoverEffect === 'scale') {
                  e.currentTarget.style.transform = 'scale(1.04)';
                } else if (config.hoverEffect === 'fade') {
                  e.currentTarget.style.opacity = '0.85';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <span>{t('btn_preview_btn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
