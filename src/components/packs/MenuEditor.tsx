import React, { useState } from 'react';
import { MenuConfig, MenuItem } from '../../types';
import { Menu, Plus, Trash2, Star, MoveUp, MoveDown } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface MenuEditorProps {
  config: MenuConfig;
  onChange: (updates: Partial<MenuConfig>) => void;
}

export default function MenuEditor({ config, onChange }: MenuEditorProps) {
  const { t, dir } = useTranslation();
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('#');
  const [newItemFeatured, setNewItemFeatured] = useState(false);
  const [newItemBadge, setNewItemBadge] = useState('');

  const addItem = () => {
    if (!newItemLabel.trim()) return;
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      label: newItemLabel.trim(),
      url: newItemUrl.trim() || '#',
      isFeatured: newItemFeatured,
      badgeText: newItemBadge.trim() || undefined,
    };
    onChange({ items: [...config.items, newItem] });
    setNewItemLabel('');
    setNewItemUrl('#');
    setNewItemFeatured(false);
    setNewItemBadge('');
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    const updated = config.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    onChange({ items: updated });
  };

  const deleteItem = (id: string) => {
    onChange({ items: config.items.filter((item) => item.id !== id) });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === config.items.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...config.items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange({ items: updated });
  };

  return (
    <div className="space-y-6 text-start" dir={dir}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Menu className="w-5 h-5 text-indigo-500" />
          {t('menu_config_title')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
          {t('menu_config_desc')}
        </p>
      </div>

      {/* Item List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {config.items.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400">
            <Menu className="w-8 h-8 mx-auto mb-2 stroke-1" />
            <span className="text-xs">{t('menu_no_links')}</span>
          </div>
        ) : (
          config.items.map((item, index) => (
            <div
              key={item.id}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-lg flex flex-col gap-2 shadow-sm relative group"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none rounded font-medium text-slate-900 dark:text-white text-start"
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  placeholder={t('menu_field_label')}
                />
                <input
                  type="text"
                  className="w-24 px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none rounded text-slate-500 dark:text-slate-400 text-start"
                  value={item.url}
                  onChange={(e) => updateItem(item.id, { url: e.target.value })}
                  placeholder={t('menu_field_url')}
                />
                <input
                  type="text"
                  className="w-16 px-2 py-1 text-[10px] bg-amber-50 dark:bg-amber-950/20 border border-transparent hover:border-amber-200 focus:border-amber-500 focus:outline-none rounded font-semibold text-amber-700 dark:text-amber-400 text-start"
                  value={item.badgeText || ''}
                  onChange={(e) => updateItem(item.id, { badgeText: e.target.value || undefined })}
                  placeholder={t('menu_field_badge')}
                />
                
                <button
                  type="button"
                  onClick={() => updateItem(item.id, { isFeatured: !item.isFeatured })}
                  title={t('menu_field_featured')}
                  className={`p-1 rounded transition ${
                    item.isFeatured
                      ? 'text-amber-500 hover:text-amber-600'
                      : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === config.items.length - 1}
                    className="p-1 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="p-1 text-slate-400 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Item */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-900 dark:text-white block">{t('menu_add_link')}</span>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-500">{t('menu_field_label')}</label>
            <input
              type="text"
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder={t('menu_field_label_placeholder')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-500">{t('menu_field_url')}</label>
            <input
              type="text"
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
              value={newItemUrl}
              onChange={(e) => setNewItemUrl(e.target.value)}
              placeholder="#promo"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-500">{t('menu_field_badge')}</label>
            <input
              type="text"
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
              value={newItemBadge}
              onChange={(e) => setNewItemBadge(e.target.value)}
              placeholder={t('menu_field_badge_placeholder')}
            />
          </div>
          <div className="flex items-center justify-between pt-5 px-1">
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={newItemFeatured}
                onChange={(e) => setNewItemFeatured(e.target.checked)}
              />
              <span>{t('menu_field_featured')}</span>
            </label>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('menu_add_btn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
