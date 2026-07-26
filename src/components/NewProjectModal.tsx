import React, { useState } from 'react';
import { ProjectConfig, ProjectType } from '../types';
import { PROJECT_TYPES_LIST, TEMPLATE_MAP } from '../constants/templates';
import { 
  ShoppingBag, 
  Sparkles, 
  Building2, 
  UserCheck, 
  BookOpen, 
  LayoutGrid, 
  Activity, 
  Utensils, 
  Stethoscope, 
  GraduationCap, 
  Hotel, 
  Home, 
  CalendarCheck, 
  Cpu, 
  Users, 
  CheckCircle2, 
  X, 
  Search, 
  Plus,
  ArrowRight,
  Layers
} from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProjectType: (type: ProjectType, config: ProjectConfig, projectName: string) => void;
  language: 'ar' | 'en';
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag,
  Sparkles,
  Building2,
  UserCheck,
  BookOpen,
  LayoutGrid,
  Activity,
  Utensils,
  Stethoscope,
  GraduationCap,
  Hotel,
  Home,
  CalendarCheck,
  Cpu,
  Users
};

export default function NewProjectModal({ isOpen, onClose, onSelectProjectType, language }: NewProjectModalProps) {
  const [selectedType, setSelectedType] = useState<ProjectType>('marketplace');
  const [customName, setCustomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'commerce' | 'business' | 'services' | 'management'>('all');

  if (!isOpen) return null;

  const filteredTypes = PROJECT_TYPES_LIST.filter(pt => {
    const matchesCategory = categoryFilter === 'all' || pt.category === categoryFilter;
    const matchesSearch = pt.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pt.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pt.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = () => {
    const templateConfig = TEMPLATE_MAP[selectedType] || TEMPLATE_MAP['marketplace'];
    const finalName = customName.trim() || (language === 'ar' ? `مشروع ${selectedType.toUpperCase()} جديد` : `New ${selectedType.toUpperCase()} Project`);
    
    const updatedConfig: ProjectConfig = {
      ...templateConfig,
      siteInfo: {
        ...templateConfig.siteInfo,
        siteName: finalName,
        projectType: selectedType
      }
    };

    onSelectProjectType(selectedType, updatedConfig, finalName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-start font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'إنشاء مشروع جديد (New Project)' : 'Create New Project'}</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-mono">
                  15 {language === 'ar' ? 'أنواع مشاريع' : 'Project Types'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'اختر نوع المشروع والمجال المناسب لبدء محرر YOUMI وتصميم واجهتك' : 'Select your desired project type to bootstrap your custom workspace'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar: Search & Category Filters */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${categoryFilter === 'all' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {language === 'ar' ? 'الكل (15)' : 'All (15)'}
            </button>
            <button
              onClick={() => setCategoryFilter('commerce')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${categoryFilter === 'commerce' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {language === 'ar' ? 'متاجر وتجارة' : 'Commerce'}
            </button>
            <button
              onClick={() => setCategoryFilter('business')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${categoryFilter === 'business' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {language === 'ar' ? 'شركات وأعمال' : 'Business'}
            </button>
            <button
              onClick={() => setCategoryFilter('services')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${categoryFilter === 'services' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {language === 'ar' ? 'خدمات وحجوزات' : 'Services'}
            </button>
            <button
              onClick={() => setCategoryFilter('management')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${categoryFilter === 'management' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              {language === 'ar' ? 'أنظمة وإدارة' : 'Management & ERP'}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث عن نوع مشروع...' : 'Search project type...'}
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs pr-9 pl-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Project Name Input */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/60 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <label className="text-xs font-bold text-slate-300 shrink-0">
            {language === 'ar' ? 'اسم المشروع الجديد:' : 'Project Name:'}
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={language === 'ar' ? 'مثال: منصة متجري الذهبي أو عيادة الشفاء...' : 'e.g., My Dream Store or Tech Academy...'}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-full"
          />
        </div>

        {/* 15 Project Types Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTypes.map((pt) => {
            const IconComp = ICON_MAP[pt.iconName] || Layers;
            const isSelected = selectedType === pt.id;

            return (
              <div
                key={pt.id}
                onClick={() => setSelectedType(pt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-950/30 border-teal-500 ring-2 ring-teal-500/30 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 left-3 text-teal-400">
                    <CheckCircle2 className="w-5 h-5 fill-teal-500/20 text-teal-400" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow"
                      style={{ backgroundColor: pt.color }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white leading-tight">
                        {language === 'ar' ? pt.nameAr : pt.nameEn}
                      </h3>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {pt.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    {language === 'ar' ? pt.descriptionAr : pt.descriptionEn}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>ID: {pt.id}</span>
                  <span className={isSelected ? 'text-teal-400 font-bold' : 'text-slate-400'}>
                    {isSelected ? (language === 'ar' ? 'محدد حالياً' : 'Selected') : (language === 'ar' ? 'انقر للاختيار' : 'Click to select')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 font-medium">
            {language === 'ar' ? 'النوع المحدد:' : 'Selected:'} <span className="text-teal-400 font-bold uppercase">{selectedType}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-teal-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{language === 'ar' ? 'إنشاء وتجهيز المشروع' : 'Initialize Project'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
