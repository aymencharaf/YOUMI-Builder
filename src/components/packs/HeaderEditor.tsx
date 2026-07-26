import React from 'react';
import { HeaderConfig } from '../../types';
import { Layout, Search, ShoppingBag, Bell, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface HeaderEditorProps {
  config: HeaderConfig;
  onChange: (updates: Partial<HeaderConfig>) => void;
}

export default function HeaderEditor({ config, onChange }: HeaderEditorProps) {
  const { t, dir } = useTranslation();

  return (
    <div className="space-y-6 text-start" dir={dir}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Layout className="w-5 h-5 text-indigo-500" />
          {t('header_config_title')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('header_config_desc')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Header Layout Style */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">{t('header_layout_style')}</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'minimal', label: t('header_style_minimal'), desc: t('header_style_minimal_desc') },
              { id: 'centered', label: t('header_style_centered'), desc: t('header_style_centered_desc') },
              { id: 'fullwidth', label: t('header_style_full'), desc: t('header_style_full_desc') },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ layoutStyle: opt.id as any })}
                className={`p-3 text-start border rounded-lg transition text-xs flex flex-col justify-between ${
                  config.layoutStyle === opt.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className="font-semibold block capitalize mb-1">{opt.label}</span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] leading-normal">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Settings */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">{t('header_search_title')}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{t('header_search_desc')}</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={config.showSearchBar}
                onChange={(e) => onChange({ showSearchBar: e.target.checked })}
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {config.showSearchBar && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{t('header_search_placeholder_label')}</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={config.searchPlaceholder}
                onChange={(e) => onChange({ searchPlaceholder: e.target.value })}
                placeholder="Search products..."
              />
            </div>
          )}
        </div>

        {/* Cart Icon Vibe */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">{t('header_cart_icon_label')}</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChange({ cartIconStyle: 'bag' })}
              className={`p-3 flex items-center gap-3 border rounded-lg text-xs font-medium transition ${
                config.cartIconStyle === 'bag'
                  ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              <div className="text-start">
                <span className="block font-semibold">{t('header_cart_bag')}</span>
                <span className="text-[10px] text-slate-400">{t('header_cart_bag_desc')}</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange({ cartIconStyle: 'cart' })}
              className={`p-3 flex items-center gap-3 border rounded-lg text-xs font-medium transition ${
                config.cartIconStyle === 'cart'
                  ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500 rotate-90" /> {/* Mimic grocery shopping cart wheel or just use shopping cart shape */}
              <div className="text-start">
                <span className="block font-semibold">{t('header_cart_cart')}</span>
                <span className="text-[10px] text-slate-400">{t('header_cart_cart_desc')}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">{t('header_banner_title')}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{t('header_banner_desc')}</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={config.showNotificationBanner}
                onChange={(e) => onChange({ showNotificationBanner: e.target.checked })}
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {config.showNotificationBanner && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{t('header_banner_msg_label')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={config.notificationText}
                  onChange={(e) => onChange({ notificationText: e.target.value })}
                  placeholder="e.g. Free shipping on orders over $50!"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{t('header_banner_link_label')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={config.notificationLink}
                  onChange={(e) => onChange({ notificationLink: e.target.value })}
                  placeholder="e.g. #promo"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
