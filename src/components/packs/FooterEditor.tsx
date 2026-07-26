import React, { useState } from 'react';
import { FooterConfig, FooterColumn } from '../../types';
import { ListCollapse, Plus, Trash2, Globe, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface FooterEditorProps {
  config: FooterConfig;
  onChange: (updates: Partial<FooterConfig>) => void;
}

export default function FooterEditor({ config, onChange }: FooterEditorProps) {
  const { t, dir } = useTranslation();
  const [activeColIdx, setActiveColIdx] = useState(0);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('#');

  const updateColumnTitle = (colId: string, title: string) => {
    const updated = config.columns.map((col) =>
      col.id === colId ? { ...col, title } : col
    );
    onChange({ columns: updated });
  };

  const addLinkToColumn = (colId: string) => {
    if (!newLinkLabel.trim()) return;
    const updated = config.columns.map((col) => {
      if (col.id === colId) {
        return {
          ...col,
          links: [...col.links, { label: newLinkLabel.trim(), url: newLinkUrl.trim() || '#' }],
        };
      }
      return col;
    });
    onChange({ columns: updated });
    setNewLinkLabel('');
    setNewLinkUrl('#');
  };

  const removeLinkFromColumn = (colId: string, linkIdx: number) => {
    const updated = config.columns.map((col) => {
      if (col.id === colId) {
        const remaining = [...col.links];
        remaining.splice(linkIdx, 1);
        return { ...col, links: remaining };
      }
      return col;
    });
    onChange({ columns: updated });
  };

  const addColumn = () => {
    const newCol: FooterColumn = {
      id: `col-${Date.now()}`,
      title: 'New Column',
      links: [{ label: 'Custom Anchor', url: '#' }],
    };
    onChange({ columns: [...config.columns, newCol] });
    setActiveColIdx(config.columns.length);
  };

  const removeColumn = (colId: string) => {
    if (config.columns.length <= 1) return;
    const updated = config.columns.filter((col) => col.id !== colId);
    onChange({ columns: updated });
    setActiveColIdx(Math.max(0, activeColIdx - 1));
  };

  const activeCol = config.columns[activeColIdx];

  return (
    <div className="space-y-6 text-start" dir={dir}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ListCollapse className="w-5 h-5 text-indigo-500" />
            {t('footer_config_title')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('footer_config_desc')}
          </p>
        </div>
        <button
          type="button"
          onClick={addColumn}
          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md flex items-center gap-1 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('footer_add_column')}</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Copyright Text */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('footer_copyright_label')}
          </label>
          <input
            type="text"
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none text-start"
            value={config.copyrightText}
            onChange={(e) => onChange({ copyrightText: e.target.value })}
            placeholder="e.g. © 2026 My Bazaar. All rights reserved."
          />
        </div>

        {/* Footer Columns Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('footer_edit_cols_label')}
          </label>
          <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-px overflow-x-auto">
            {config.columns.map((col, idx) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveColIdx(idx)}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                  activeColIdx === idx
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                {col.title || `${t('footer_col_default_title')} ${idx + 1}`}
              </button>
            ))}
          </div>

          {activeCol && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('footer_col_editor_title')}
                </span>
                <button
                  type="button"
                  onClick={() => removeColumn(activeCol.id)}
                  disabled={config.columns.length <= 1}
                  className="text-[11px] text-red-500 hover:text-red-600 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('footer_remove_col')}</span>
                </button>
              </div>

              {/* Column Title Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500">{t('footer_col_title_label')}</label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none text-start"
                  value={activeCol.title}
                  onChange={(e) => updateColumnTitle(activeCol.id, e.target.value)}
                  placeholder="e.g. Products Directory"
                />
              </div>

              {/* Links under active column */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-500 block">{t('footer_col_links_label')}</label>
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {activeCol.links.map((link, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2.5 py-1 rounded text-xs"
                    >
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {link.label} → <span className="font-mono text-[10px] text-slate-400">{link.url}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLinkFromColumn(activeCol.id, lIdx)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Link inside Column */}
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg space-y-2">
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">
                  {t('footer_add_link_to_col')} {activeCol.title}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-start"
                    placeholder={t('footer_link_label_placeholder')}
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                  />
                  <input
                    type="text"
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-start"
                    placeholder={t('footer_link_url_placeholder')}
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => addLinkToColumn(activeCol.id)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t('footer_insert_link')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Links Panel */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  {t('footer_social_title')}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {t('footer_social_desc')}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={config.showSocialLinks}
                onChange={(e) => onChange({ showSocialLinks: e.target.checked })}
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {config.showSocialLinks && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <Facebook className="w-3 h-3 text-blue-600" />
                  <span>{t('footer_fb_url')}</span>
                </label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-start"
                  value={config.socialLinks.facebook}
                  onChange={(e) =>
                    onChange({ socialLinks: { ...config.socialLinks, facebook: e.target.value } })
                  }
                  placeholder="#"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <Instagram className="w-3 h-3 text-pink-500" />
                  <span>{t('footer_ig_url')}</span>
                </label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-start"
                  value={config.socialLinks.instagram}
                  onChange={(e) =>
                    onChange({ socialLinks: { ...config.socialLinks, instagram: e.target.value } })
                  }
                  placeholder="#"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <Twitter className="w-3 h-3 text-sky-400" />
                  <span>{t('footer_tw_url')}</span>
                </label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-start"
                  value={config.socialLinks.twitter}
                  onChange={(e) =>
                    onChange({ socialLinks: { ...config.socialLinks, twitter: e.target.value } })
                  }
                  placeholder="#"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <Linkedin className="w-3 h-3 text-blue-700" />
                  <span>{t('footer_li_url')}</span>
                </label>
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-start"
                  value={config.socialLinks.linkedin}
                  onChange={(e) =>
                    onChange({ socialLinks: { ...config.socialLinks, linkedin: e.target.value } })
                  }
                  placeholder="#"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
