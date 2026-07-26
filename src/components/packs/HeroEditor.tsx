import React, { useState } from 'react';
import { HeroSliderConfig, SlideItem, Asset } from '../../types';
import { Sliders, Plus, Trash2, ImageIcon, Sparkles } from 'lucide-react';
import { useTranslation } from '../../utils/i18n';

interface HeroEditorProps {
  config: HeroSliderConfig;
  onChange: (updates: Partial<HeroSliderConfig>) => void;
  assets: Asset[];
  openAssetManager: (category: 'logo' | 'hero' | 'product' | 'category', onSelect: (url: string) => void) => void;
}

export default function HeroEditor({ config, onChange, openAssetManager }: HeroEditorProps) {
  const { t, dir } = useTranslation();
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const addSlide = () => {
    const newSlide: SlideItem = {
      id: `slide-${Date.now()}`,
      title: 'New Slider Headline',
      subtitle: 'Write a compelling subheadline showing your custom discounts or product vendors here.',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
      buttonText: 'Shop the Collection',
      buttonUrl: '#shop',
      badgeText: 'SEASON EXCLUSIVE',
    };
    onChange({ slides: [...config.slides, newSlide] });
    setActiveSlideIdx(config.slides.length);
  };

  const deleteSlide = (id: string, index: number) => {
    if (config.slides.length <= 1) return; // Prevent deleting the last slide
    const updated = config.slides.filter((slide) => slide.id !== id);
    onChange({ slides: updated });
    setActiveSlideIdx(Math.max(0, index - 1));
  };

  const updateSlide = (id: string, updates: Partial<SlideItem>) => {
    const updated = config.slides.map((slide) =>
      slide.id === id ? { ...slide, ...updates } : slide
    );
    onChange({ slides: updated });
  };

  const activeSlide = config.slides[activeSlideIdx] || config.slides[0];

  return (
    <div className="space-y-6 text-start" dir={dir}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-500" />
            {t('hero_config_title')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('hero_config_desc')}
          </p>
        </div>
        <button
          type="button"
          onClick={addSlide}
          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md flex items-center gap-1 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('hero_add_slide')}</span>
        </button>
      </div>

      {/* Slide Navigation Tab Header */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-px overflow-x-auto">
        {config.slides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveSlideIdx(idx)}
            className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
              activeSlideIdx === idx
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {t('hero_slide_num')} {idx + 1}
          </button>
        ))}
      </div>

      {/* Slide Details Form */}
      {activeSlide && (
        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('hero_slide_settings')} {activeSlideIdx + 1}
            </span>
            <button
              type="button"
              onClick={() => deleteSlide(activeSlide.id, activeSlideIdx)}
              disabled={config.slides.length <= 1}
              className="text-xs text-red-500 hover:text-red-600 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('hero_remove_slide')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slide Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {t('hero_headline')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
                value={activeSlide.title}
                onChange={(e) => updateSlide(activeSlide.id, { title: e.target.value })}
                placeholder="e.g. Vintage Apparel Summer Sale"
              />
            </div>

            {/* Slide Badge */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {t('hero_tagline')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
                value={activeSlide.badgeText || ''}
                onChange={(e) => updateSlide(activeSlide.id, { badgeText: e.target.value })}
                placeholder="e.g. NEW MARKETS"
              />
            </div>

            {/* Slide Subtitle */}
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {t('hero_subheadline')}
              </label>
              <textarea
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[50px] text-start"
                value={activeSlide.subtitle}
                onChange={(e) => updateSlide(activeSlide.id, { subtitle: e.target.value })}
                placeholder="Description detailing products, shipping offers, or vendors"
              />
            </div>

            {/* Image URL with asset browser */}
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {t('hero_bg_image')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
                  value={activeSlide.imageUrl}
                  onChange={(e) => updateSlide(activeSlide.id, { imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
                <button
                  type="button"
                  onClick={() => openAssetManager('hero', (url) => updateSlide(activeSlide.id, { imageUrl: url }))}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1 transition cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{t('hero_browse')}</span>
                </button>
              </div>
            </div>

            {/* Button Label */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {t('hero_btn_label')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
                value={activeSlide.buttonText}
                onChange={(e) => updateSlide(activeSlide.id, { buttonText: e.target.value })}
                placeholder="e.g. Shop Now"
              />
            </div>

            {/* Button URL */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {t('hero_btn_url')}
              </label>
              <input
                type="text"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-start"
                value={activeSlide.buttonUrl}
                onChange={(e) => updateSlide(activeSlide.id, { buttonUrl: e.target.value })}
                placeholder="e.g. #categories"
              />
            </div>
          </div>
        </div>
      )}

      {/* Autoplay & Timing controls */}
      <div className="p-4 bg-slate-100/50 dark:bg-slate-800/20 rounded-lg border border-slate-200/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-500" />
          <div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white block">
              {t('hero_auto_play')}
            </span>
            <span className="text-[10px] text-slate-500">
              {t('hero_auto_play_desc')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.autoPlay}
              onChange={(e) => onChange({ autoPlay: e.target.checked })}
            />
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>

          {config.autoPlay && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">{t('hero_interval')}</span>
              <select
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none"
                value={config.slideInterval}
                onChange={(e) => onChange({ slideInterval: parseInt(e.target.value, 10) })}
              >
                <option value="3000">3s</option>
                <option value="4000">4s</option>
                <option value="5000">5s</option>
                <option value="6000">6s</option>
                <option value="8000">8s</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
