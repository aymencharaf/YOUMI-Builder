import React, { useState } from 'react';
import { ProjectConfig, ProjectType } from '../types';
import { PROJECT_TYPES_LIST, TEMPLATE_MAP } from '../constants/templates';
import { Sparkles, Layout, CheckCircle, Search, Layers } from 'lucide-react';

interface TemplateLibraryProps {
  currentConfig: ProjectConfig;
  onApplyConfig: (config: ProjectConfig) => void;
  language: 'ar' | 'en';
}

export default function TemplateLibrary({ currentConfig, onApplyConfig, language }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'commerce' | 'business' | 'services' | 'management'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTypes = PROJECT_TYPES_LIST.filter(pt => {
    const matchesCategory = activeCategory === 'all' || pt.category === activeCategory;
    const matchesSearch = pt.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pt.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pt.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          {language === 'ar' ? 'مكتبة القوالب الـ 15 المتكاملة' : '15 Full Project Type Templates'}
        </h3>
        <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
          {language === 'ar'
            ? 'منصة يومي تدعم بناء جميع أنواع المشاريع: المتاجر، صفحات الهبوط، المواقع التعريفية، المدارس، العيادات، الفنادق، العقارات وأنظمة ERP وCRM.'
            : 'YOUMI supports creating all project types: Marketplaces, Landing Pages, Company Sites, Clinics, Schools, Hotels, Real Estate, ERPs, and CRMs.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-2.5 py-1 rounded-lg shrink-0 transition cursor-pointer ${
            activeCategory === 'all' 
              ? 'bg-teal-600 text-white shadow' 
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          {language === 'ar' ? 'الكل (15)' : 'All (15)'}
        </button>
        <button
          onClick={() => setActiveCategory('commerce')}
          className={`px-2.5 py-1 rounded-lg shrink-0 transition cursor-pointer ${
            activeCategory === 'commerce' 
              ? 'bg-teal-600 text-white shadow' 
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          {language === 'ar' ? 'التجارة والمتاجر' : 'Commerce'}
        </button>
        <button
          onClick={() => setActiveCategory('business')}
          className={`px-2.5 py-1 rounded-lg shrink-0 transition cursor-pointer ${
            activeCategory === 'business' 
              ? 'bg-teal-600 text-white shadow' 
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          {language === 'ar' ? 'شركات وبورتفوليو' : 'Business'}
        </button>
        <button
          onClick={() => setActiveCategory('services')}
          className={`px-2.5 py-1 rounded-lg shrink-0 transition cursor-pointer ${
            activeCategory === 'services' 
              ? 'bg-teal-600 text-white shadow' 
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          {language === 'ar' ? 'خدمات وحجوزات' : 'Services'}
        </button>
        <button
          onClick={() => setActiveCategory('management')}
          className={`px-2.5 py-1 rounded-lg shrink-0 transition cursor-pointer ${
            activeCategory === 'management' 
              ? 'bg-teal-600 text-white shadow' 
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          {language === 'ar' ? 'أنظمة ERP/CRM' : 'ERP/CRM'}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'ar' ? 'تصفية القوالب بالاسم...' : 'Search template...'}
          className="w-full pr-8 pl-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredTypes.map((tpl) => {
          const isCurrentType = currentConfig.siteInfo.projectType === tpl.id;
          const templateData = TEMPLATE_MAP[tpl.id] || TEMPLATE_MAP['marketplace'];

          return (
            <div
              key={tpl.id}
              className={`p-3.5 rounded-xl border transition-all text-right ${
                isCurrentType
                  ? 'bg-teal-50/40 border-teal-300 dark:bg-teal-950/20 dark:border-teal-800 ring-1 ring-teal-500/30'
                  : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: tpl.color }} 
                    />
                    <h4 className="text-xs font-black text-slate-800 dark:text-white">
                      {language === 'ar' ? tpl.nameAr : tpl.nameEn}
                    </h4>
                    {isCurrentType && (
                      <span className="text-[9px] bg-teal-500 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'ar' ? tpl.descriptionAr : tpl.descriptionEn}
                  </p>
                </div>

                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono shrink-0">
                  {tpl.badge}
                </span>
              </div>

              <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[9.5px] text-slate-400 font-mono">
                  ID: {tpl.id}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updatedConfig: ProjectConfig = {
                      ...templateData,
                      siteInfo: {
                        ...templateData.siteInfo,
                        siteName: currentConfig.siteInfo.siteName !== 'YOUMI' ? currentConfig.siteInfo.siteName : templateData.siteInfo.siteName,
                        projectType: tpl.id
                      }
                    };
                    onApplyConfig(updatedConfig);
                  }}
                  className={`text-[10px] font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                    isCurrentType
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isCurrentType ? (language === 'ar' ? 'المشروع الحالي' : 'Active Project') : (language === 'ar' ? 'تطبيق هذا النوع' : 'Apply Project Type')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Level Styling Presets */}
      <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-xl p-3 space-y-2 mt-3">
        <h4 className="text-[10.5px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-indigo-400" />
          <span>{language === 'ar' ? 'تنسيق أجزاء الواجهة' : 'Layout Controls'}</span>
        </h4>

        <div className="grid grid-cols-2 gap-2 text-center">
          <button
            type="button"
            onClick={() => {
              onApplyConfig({
                ...currentConfig,
                header: { ...currentConfig.header, layoutStyle: 'centered' }
              });
            }}
            className="p-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[9.5px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {language === 'ar' ? 'هيدر متمركز (Centered)' : 'Centered Header'}
          </button>
          <button
            type="button"
            onClick={() => {
              onApplyConfig({
                ...currentConfig,
                header: { ...currentConfig.header, layoutStyle: 'fullwidth' }
              });
            }}
            className="p-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[9.5px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {language === 'ar' ? 'هيدر كامل (Fullwidth)' : 'Fullwidth Header'}
          </button>
        </div>
      </div>
    </div>
  );
}
