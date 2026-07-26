import React, { useState } from 'react';
import { ProjectConfig, PluginItem } from '../types';
import { 
  Smartphone, Tablet, Monitor, ShoppingBag, ShoppingCart, Search, 
  Menu as Hamburger, Star, ShieldCheck, Truck, CreditCard, Headphones, 
  Heart, User, CheckCircle2, MessageSquare, Tag, Eye, Info, HelpCircle
} from 'lucide-react';
import * as Lucide from 'lucide-react';

interface LivePreviewProps {
  config: ProjectConfig;
  includedPacks: string[];
  onSectionClick?: (sectionId: string) => void;
  language?: 'ar' | 'en';
}

export default function LivePreview({ config, includedPacks, onSectionClick, language = 'ar' }: LivePreviewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomScale, setZoomScale] = useState<'50' | '75' | '100' | '125'>('100');
  const [cartCount, setCartCount] = useState(0);

  // Helper selectors
  const isSiteInfoActive = includedPacks.includes('siteInfo');
  const isHeaderActive = includedPacks.includes('header');
  const isMenuActive = includedPacks.includes('menu');
  const isHeroActive = includedPacks.includes('hero');
  const isCategoriesActive = includedPacks.includes('categories');
  const isFooterActive = includedPacks.includes('footer');
  const isColorsActive = includedPacks.includes('colors');
  const isFontsActive = includedPacks.includes('fonts');
  const isButtonsActive = includedPacks.includes('buttons');

  // Colors config
  const colors = isColorsActive
    ? config.colors
    : {
        primary: '#0F766E',
        secondary: '#F59E0B',
        accent: '#0F766E',
        background: '#ffffff',
        text: '#1f2937',
        headerBg: '#ffffff',
        footerBg: '#0f172a',
      };

  // Font families
  const fontHeadingFamily = isFontsActive ? `'${config.fonts.headingFont}', sans-serif` : "'Cairo', sans-serif";
  const fontBodyFamily = isFontsActive ? `'${config.fonts.bodyFont}', sans-serif` : "'Cairo', sans-serif";

  // Buttons border radius & padding
  const buttonBorderRadius = isButtonsActive
    ? config.buttons.borderRadius === 'none'
      ? '0px'
      : config.buttons.borderRadius === 'sm'
      ? '4px'
      : config.buttons.borderRadius === 'md'
      ? '8px'
      : config.buttons.borderRadius === 'lg'
      ? '16px'
      : '9999px'
    : '8px';

  const orderOfSections = config.sectionOrder || ['header', 'menu', 'hero', 'categories', 'footer'];

  const renderCategoryIcon = (iconName: string) => {
    const IconComp = (Lucide as any)[iconName];
    if (IconComp) {
      return <IconComp className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
    }
    return <Tag className="w-5 h-5 text-slate-400" />;
  };

  // Find active WhatsApp plugin
  const activeWhatsApp = config.plugins?.find(p => p.type === 'whatsapp' && p.isActive);
  const activeYalidine = config.plugins?.find(p => p.type === 'yalidine' && p.isActive);

  // Layout widths mapping
  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]'
  };

  // Zoom styles mapping
  const zoomStyles = {
    '50': 'scale-50 origin-top',
    '75': 'scale-75 origin-top',
    '100': 'scale-100',
    '125': 'scale-125 origin-top'
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm font-sans">
      
      {/* 1. TOP RESPONSIVE PREVIEW CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 select-none">
        <span className="text-[11.5px] font-black text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse inline-block" />
          <span>{language === 'ar' ? 'محرك المعاينة الحية التفاعلي (Interactive Live Preview Engine)' : 'Interactive Live Preview Engine'}</span>
        </span>

        <div className="flex items-center gap-3">
          {/* Zoom Scaling selector */}
          <div className="flex items-center gap-1.5" dir="rtl">
            <span className="text-[10px] font-bold text-slate-400">زوم:</span>
            <select
              value={zoomScale}
              onChange={(e) => setZoomScale(e.target.value as any)}
              className="text-[10.5px] font-bold bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
            </select>
          </div>

          {/* Responsive device simulator */}
          <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-600">
            {[
              { id: 'desktop', icon: Monitor, label: language === 'ar' ? 'كمبيوتر' : 'Desktop' },
              { id: 'tablet', icon: Tablet, label: language === 'ar' ? 'تابلت' : 'Tablet' },
              { id: 'mobile', icon: Smartphone, label: language === 'ar' ? 'جوال' : 'Mobile' },
            ].map((device) => {
              const Icon = device.icon;
              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => setViewport(device.id as any)}
                  className={`px-2 py-1 text-[10.5px] rounded-md transition flex items-center gap-1 font-bold cursor-pointer ${
                    viewport === device.id
                      ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title={device.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{device.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Helper click-to-edit banner hint */}
      <div className="bg-teal-50/50 dark:bg-teal-950/10 px-4 py-1 border-b border-slate-200/40 dark:border-slate-800 text-center text-[10px] text-teal-700 dark:text-teal-400 flex items-center justify-center gap-1.5">
        <Info className="w-3.5 h-3.5" />
        <span>{language === 'ar' ? '💡 انقر على أي قسم داخل المعاينة لفتحه وتعديله مباشرة في القائمة الجانبية!' : '💡 Click any section inside the preview to modify its properties instantly!'}</span>
      </div>

      {/* 2. LIVE PREVIEW CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start bg-slate-100/30 dark:bg-slate-950/20">
        <div
          style={{ fontFamily: fontBodyFamily }}
          dir="rtl"
          className={`bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-800 transition-all duration-300 w-full flex flex-col relative ${viewportWidths[viewport]} ${zoomStyles[zoomScale]}`}
        >
          
          {orderOfSections.map((sectionKey) => {
            if (sectionKey === 'header' && isHeaderActive) {
              return (
                <div 
                  key="header-block" 
                  onClick={() => onSectionClick && onSectionClick('header')}
                  className="group relative cursor-pointer border-2 border-transparent hover:border-teal-500 hover:bg-teal-50/10 transition-all"
                  title="انقر لتعديل الهيدر"
                >
                  {/* Visual edit overlay banner */}
                  <span className="absolute top-2 right-2 bg-teal-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-50 shadow-sm flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    <span>تعديل الهيدر (PACK-002)</span>
                  </span>

                  {/* Notification Announcement Bar */}
                  {config.header.showNotificationBanner && (
                    <div
                      className="py-1.5 px-3 text-center text-[10px] font-bold text-white truncate transition"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <span>{config.header.notificationText || 'شحن مجاني لكافة الولايات'}</span>
                    </div>
                  )}

                  {/* Header Row */}
                  <div className="bg-white p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold" style={{ backgroundColor: colors.primary }}>
                          🛒
                        </div>
                        <span
                          style={{ fontFamily: fontHeadingFamily, color: colors.primary }}
                          className="font-black text-base tracking-tight block"
                        >
                          {isSiteInfoActive ? config.siteInfo.siteName : 'YOUMI'}
                        </span>
                      </div>

                      {/* Header Search bar if active */}
                      {config.header.showSearchBar && viewport !== 'mobile' && (
                        <div className="flex-1 max-w-xs relative flex items-center">
                          <input
                            disabled
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200/70 pl-3 pr-4 py-1.5 rounded-r-lg text-xs focus:outline-none text-right placeholder:text-slate-400"
                            placeholder={config.header.searchPlaceholder || 'ابحث...'}
                          />
                          <button
                            disabled
                            className="px-3 py-1.5 text-white text-xs font-bold rounded-l-lg"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Search className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-400" />
                        
                        <button
                          type="button"
                          className="relative p-1.5 text-slate-700 hover:text-emerald-600 transition cursor-pointer"
                        >
                          {config.header.cartIconStyle === 'bag' ? (
                            <ShoppingBag className="w-4 h-4 text-slate-700" />
                          ) : (
                            <ShoppingCart className="w-4 h-4 text-slate-700" />
                          )}
                          <span
                            className="absolute -top-1 -right-1 text-[8px] font-bold text-white w-3.5 h-3.5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            {cartCount}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (sectionKey === 'menu' && isMenuActive) {
              return (
                <div 
                  key="menu-block"
                  onClick={() => onSectionClick && onSectionClick('menu')}
                  className="group relative cursor-pointer border-2 border-transparent hover:border-teal-500 hover:bg-teal-50/10 transition"
                  title="انقر لتعديل الروابط"
                >
                  <span className="absolute top-1 right-2 bg-teal-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-50 shadow-sm flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    <span>تعديل المنيو (PACK-003)</span>
                  </span>

                  <div className="bg-slate-50 border-b border-slate-100 py-2 px-3 flex items-center gap-4 text-[11px] font-bold justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                      {config.menu.items.map((item) => (
                        <a
                          key={item.id}
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          style={{ color: item.isFeatured ? colors.primary : '#374151' }}
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{item.label}</span>
                          {item.badgeText && (
                            <span
                              className="text-[7px] text-white px-1 py-0.2 rounded font-black uppercase"
                              style={{ backgroundColor: colors.secondary }}
                            >
                              {item.badgeText}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            if (sectionKey === 'hero' && isHeroActive) {
              const activeSlide = config.hero.slides[0];
              return (
                <div 
                  key="hero-block"
                  onClick={() => onSectionClick && onSectionClick('hero')}
                  className="group relative cursor-pointer border-2 border-transparent hover:border-teal-500 transition-all"
                  title="انقر لتعديل السلايدر"
                >
                  <span className="absolute top-3 right-3 bg-teal-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-50 shadow-sm flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    <span>تعديل السلايدر (PACK-004)</span>
                  </span>

                  {activeSlide ? (
                    <div
                      className="relative overflow-hidden h-[200px] flex items-center bg-cover bg-center"
                      style={{ 
                        backgroundImage: `linear-gradient(to right, ${colors.primary}ee, ${colors.primary}bb), url(${activeSlide.imageUrl})` 
                      }}
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2/5 h-4/5 flex items-center justify-center">
                        <img
                          src={activeSlide.imageUrl}
                          alt="Banner Product"
                          className="max-h-full max-w-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="relative px-6 py-4 w-full z-10 text-white space-y-1.5 max-w-[55%]">
                        {activeSlide.badgeText && (
                          <span
                            className="text-[8px] font-black text-white uppercase px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            {activeSlide.badgeText}
                          </span>
                        )}
                        <h2
                          style={{ fontFamily: fontHeadingFamily }}
                          className="text-sm md:text-lg font-black leading-snug"
                        >
                          {activeSlide.title || 'أفضل عروض متجرنا'}
                        </h2>
                        <p className="text-[10px] text-slate-100 line-clamp-2">
                          {activeSlide.subtitle}
                        </p>
                        <div className="pt-1">
                          <button
                            type="button"
                            style={{
                              backgroundColor: colors.secondary,
                              borderRadius: buttonBorderRadius,
                              color: '#000000',
                            }}
                            className="font-bold text-[9px] px-4 py-1.5 hover:opacity-90 active:scale-95 transition cursor-pointer"
                          >
                            {activeSlide.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                      لم يتم تعيين أي سلايدر ترويجي
                    </div>
                  )}
                </div>
              );
            }

            if (sectionKey === 'categories' && isCategoriesActive) {
              return (
                <div 
                  key="categories-block"
                  onClick={() => onSectionClick && onSectionClick('categories')}
                  className="group relative cursor-pointer border-2 border-transparent hover:border-teal-500 p-4 bg-slate-50/50 space-y-4 transition"
                  title="انقر لتعديل المنتجات والأقسام"
                >
                  <span className="absolute top-2 right-2 bg-teal-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-50 shadow-sm flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    <span>تعديل الأقسام والمنتجات (PACK-005)</span>
                  </span>

                  <div className="space-y-4">
                    {/* Header values */}
                    <div className="text-right">
                      <h3 style={{ fontFamily: fontHeadingFamily }} className="text-xs font-black text-slate-900">
                        {config.categories.sectionTitle || 'الأقسام الرئيسية'}
                      </h3>
                      <p className="text-[9px] text-slate-400">{config.categories.sectionSubtitle}</p>
                    </div>

                    {/* Circles Categories Horizontal Rail */}
                    <div className="grid grid-cols-5 gap-2.5">
                      {config.categories.categories.filter(c => c.isActive).map((cat) => (
                        <div key={cat.id} className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden relative shadow-xs bg-white flex items-center justify-center">
                            {cat.imageUrl ? (
                              <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              renderCategoryIcon(cat.icon || 'Tag')
                            )}
                          </div>
                          <span className="text-[9px] font-black text-slate-700 text-center truncate max-w-full">
                            {cat.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Products list */}
                    <div className="space-y-2 pt-2 border-t border-slate-100/70">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-400">{language === 'ar' ? 'أقوى الصفقات' : 'Deals'}</span>
                        <span className="text-[10px] font-black text-teal-700" style={{ color: colors.primary }}>
                          {language === 'ar' ? 'المنتجات المميزة 🌟' : 'Featured Products'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {config.categories.products.filter(p => p.isFeatured).map((product) => (
                          <div key={product.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                            <div className="aspect-square bg-slate-100 relative">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {product.isNew && (
                                <span 
                                  className="absolute top-1 right-1 text-[7px] font-black text-slate-900 px-1 py-0.5 rounded"
                                  style={{ backgroundColor: colors.secondary }}
                                >
                                  {language === 'ar' ? 'جديد' : 'NEW'}
                                </span>
                              )}
                            </div>
                            <div className="p-2 space-y-1">
                              <span className="text-[7.5px] text-slate-400 block font-bold">{product.category}</span>
                              <h4 className="text-[9.5px] font-black text-slate-800 truncate">{product.name}</h4>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] font-black text-slate-900">{product.price} {isSiteInfoActive ? config.siteInfo.currency : 'د.ج'}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCartCount(c => c + 1);
                                  }}
                                  style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: buttonBorderRadius
                                  }}
                                  className="text-white text-[8px] font-bold px-2 py-0.5 cursor-pointer"
                                >
                                  + سلّة
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (sectionKey === 'footer' && isFooterActive) {
              return (
                <div 
                  key="footer-block"
                  onClick={() => onSectionClick && onSectionClick('footer')}
                  className="group relative cursor-pointer border-2 border-transparent hover:border-teal-500 transition-all"
                  title="انقر لتعديل الفوتر"
                >
                  <span className="absolute bottom-2 right-2 bg-teal-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-50 shadow-sm flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    <span>تعديل التذييل (PACK-006)</span>
                  </span>

                  <footer
                    className="p-4 text-[9px] text-slate-300"
                    style={{ backgroundColor: colors.footerBg }}
                  >
                    <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-2 mb-2 text-right">
                      <div className="space-y-1">
                        <span style={{ fontFamily: fontHeadingFamily }} className="font-extrabold text-white block">
                          {isSiteInfoActive ? config.siteInfo.siteName : 'YOUMI'}
                        </span>
                        <p className="text-slate-400 text-[8.5px] leading-normal line-clamp-2">
                          {isSiteInfoActive ? config.siteInfo.description : 'متجر الكتروني متكامل'}
                        </p>
                      </div>

                      {config.footer.columns.slice(0, 1).map((col) => (
                        <div key={col.id} className="space-y-1">
                          <span className="font-bold text-white block">{col.title}</span>
                          <ul className="space-y-0.5 text-slate-400">
                            {col.links.slice(0, 3).map((link, lidx) => (
                              <li key={lidx}>
                                <a href="#" onClick={e => e.preventDefault()} className="hover:text-white">{link.label}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[8px] text-slate-400">
                      <span>{config.footer.copyrightText}</span>
                      {isSiteInfoActive && (
                        <span className="text-[7.5px] font-mono text-slate-500">
                          {config.siteInfo.contactEmail} • {config.siteInfo.contactPhone}
                        </span>
                      )}
                    </div>
                  </footer>
                </div>
              );
            }

            return null;
          })}

          {/* Floating WhatsApp Widget simulation if WhatsApp plugin is active */}
          {activeWhatsApp && (
            <a
              href={`https://wa.me/${activeWhatsApp.code}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 left-4 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition duration-200 z-[999] hover:scale-110 flex items-center justify-center cursor-pointer"
              title="تواصل معنا عبر واتساب"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          )}

          {/* Floating Yalidine shipment bubble notification */}
          {activeYalidine && (
            <div className="absolute bottom-4 right-4 bg-slate-900 text-white p-2 rounded-xl text-[9px] shadow-lg flex items-center gap-2 border border-slate-700 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>Yalidine Track Active</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
