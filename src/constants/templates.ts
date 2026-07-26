import { ProjectConfig, ProjectType } from '../types';
import logoImg from '../assets/images/youmi_app_logo_1784978064845.jpg';

export interface ProjectTypeMetadata {
  id: ProjectType;
  nameAr: string;
  nameEn: string;
  category: 'commerce' | 'business' | 'services' | 'management';
  iconName: string;
  descriptionAr: string;
  descriptionEn: string;
  badge: string;
  color: string;
}

export const PROJECT_TYPES_LIST: ProjectTypeMetadata[] = [
  {
    id: 'marketplace',
    nameAr: 'سوق متعدد البائعين (Marketplace)',
    nameEn: 'Multi-Vendor Marketplace',
    category: 'commerce',
    iconName: 'ShoppingBag',
    descriptionAr: 'منصة تجارية متكاملة لربط البائعين والمشترين مع عربة تسوق وإدارة منتجات.',
    descriptionEn: 'Full e-commerce platform linking vendors and buyers with product grids and cart.',
    badge: 'تجارة إلكترونية',
    color: '#0F766E'
  },
  {
    id: 'landing',
    nameAr: 'صفحة هبوط تسويقية (Landing Page)',
    nameEn: 'Marketing Landing Page',
    category: 'business',
    iconName: 'Sparkles',
    descriptionAr: 'صفحة عالية التحويل لعرض منتج، خدمة أو حملة إعلانية مخصصة.',
    descriptionEn: 'High-converting promotional landing page for products, apps, or campaigns.',
    badge: 'تسويق',
    color: '#3B82F6'
  },
  {
    id: 'company',
    nameAr: 'موقع تعريف بشركة (Company Website)',
    nameEn: 'Corporate Company Website',
    category: 'business',
    iconName: 'Building2',
    descriptionAr: 'موقع تعريفي احترافي للشركات والمؤسسات يعرض الخدمات ورؤية الشركة.',
    descriptionEn: 'Professional corporate presence highlighting services, team, and company vision.',
    badge: 'أعمال',
    color: '#1E293B'
  },
  {
    id: 'portfolio',
    nameAr: 'معرض أعمال شخصي (Portfolio)',
    nameEn: 'Personal Portfolio',
    category: 'business',
    iconName: 'UserCheck',
    descriptionAr: 'عرض المشاريع الشخصية والسيرة الذاتية للمصممين والمهندسين والفريلانسين.',
    descriptionEn: 'Showcase personal projects, creative work, and resume for freelancers.',
    badge: 'شخصي',
    color: '#8B5CF6'
  },
  {
    id: 'blog',
    nameAr: 'مدونة ومجلة إلكترونية (Blog)',
    nameEn: 'Editorial Blog & Magazine',
    category: 'services',
    iconName: 'BookOpen',
    descriptionAr: 'منصة نشر مقالات وأخبار وتقارير مصنفة مع محرك بحث وتصنيفات.',
    descriptionEn: 'Content publishing portal with categorized articles, stories, and reader interaction.',
    badge: 'محتوى',
    color: '#EC4899'
  },
  {
    id: 'cms',
    nameAr: 'نظام إدارة المحتوى (CMS Portal)',
    nameEn: 'Content Management System',
    category: 'management',
    iconName: 'LayoutGrid',
    descriptionAr: 'نظام إدارة محتوى ديناميكي مع أدوات تحرير ومكتبة وسائط متعددة.',
    descriptionEn: 'Full dynamic content management system with visual editors and asset library.',
    badge: 'إدارة',
    color: '#6366F1'
  },
  {
    id: 'saas',
    nameAr: 'لوحة برمجيات كخدمة (SaaS Dashboard)',
    nameEn: 'SaaS App Dashboard',
    category: 'management',
    iconName: 'Activity',
    descriptionAr: 'واجهة برمجية وتطبيق سحابي مع الاشتراكات والإحصائيات والتحليلات.',
    descriptionEn: 'Cloud software interface featuring subscriptions, analytics, and metrics.',
    badge: 'برمجيات',
    color: '#0284C7'
  },
  {
    id: 'restaurant',
    nameAr: 'مطعم وقائمة طعام (Restaurant & Menu)',
    nameEn: 'Restaurant & Digital Menu',
    category: 'services',
    iconName: 'Utensils',
    descriptionAr: 'منيو إلكتروني تفاعلي مع طلب المأكولات وحجز الطاولات مباشرة.',
    descriptionEn: 'Digital interactive food menu with online ordering and table booking.',
    badge: 'مطاعم',
    color: '#D97706'
  },
  {
    id: 'clinic',
    nameAr: 'عيادة طبية ومواعيد (Medical Clinic)',
    nameEn: 'Medical Clinic & Care',
    category: 'services',
    iconName: 'Stethoscope',
    descriptionAr: 'منصة طبية لحجز المواعيد وعرض التخصصات وخدمات الاستشارة الطبية.',
    descriptionEn: 'Healthcare booking, doctor profiles, specialties, and online consultation.',
    badge: 'صحة',
    color: '#0D9488'
  },
  {
    id: 'school',
    nameAr: 'مدرسة وأكاديمية (School & Academy)',
    nameEn: 'School & Learning Platform',
    category: 'services',
    iconName: 'GraduationCap',
    descriptionAr: 'موقع تعليمي يعرض الدورات، البرامج الأكاديمية ونظام التسجيل الدراسي.',
    descriptionEn: 'Educational portal showcasing courses, academic programs, and enrollment.',
    badge: 'تعليم',
    color: '#2563EB'
  },
  {
    id: 'hotel',
    nameAr: 'فندق وحجوزات إقامة (Hotel & Resort)',
    nameEn: 'Hotel & Luxury Resort',
    category: 'services',
    iconName: 'Hotel',
    descriptionAr: 'عرض الغرف والأجنحة الفندقية مع نظام حجز الإقامة والخدمات السياحية.',
    descriptionEn: 'Luxury hotel suite showcase, room booking, and guest amenities.',
    badge: 'سياحة',
    color: '#059669'
  },
  {
    id: 'realestate',
    nameAr: 'وكالة عقارات (Real Estate Agency)',
    nameEn: 'Real Estate Listings',
    category: 'services',
    iconName: 'Home',
    descriptionAr: 'عرض الفلل، الشقق والعقارات للبيع أو للكراء مع فلترة وحجز المعاينة.',
    descriptionEn: 'Property listings for sale and rent with interactive filtering and tours.',
    badge: 'عقارات',
    color: '#4F46E5'
  },
  {
    id: 'booking',
    nameAr: 'منصة حجوزات وخدمات (Booking Platform)',
    nameEn: 'Appointment & Booking',
    category: 'services',
    iconName: 'CalendarCheck',
    descriptionAr: 'جدولة المواعيد وحجز الخدمات الاستشارية، القاعات أو الأنشطة.',
    descriptionEn: 'Appointment scheduling and booking engine for consultation and services.',
    badge: 'حجوزات',
    color: '#F59E0B'
  },
  {
    id: 'erp',
    nameAr: 'نظام تخطيط الموارد (ERP System)',
    nameEn: 'ERP Enterprise System',
    category: 'management',
    iconName: 'Cpu',
    descriptionAr: 'نظام إدارة المخزون، المشتريات، الموارد البشرية والعمليات المالية.',
    descriptionEn: 'Comprehensive Enterprise Resource Planning for inventory, HR, and finance.',
    badge: 'أنظمة',
    color: '#475569'
  },
  {
    id: 'crm',
    nameAr: 'نظام إدارة علاقات العملاء (CRM)',
    nameEn: 'CRM Customer System',
    category: 'management',
    iconName: 'Users',
    descriptionAr: 'متابعة المبيعات، الصفقات، خدمة العملاء والتحليلات البيعية.',
    descriptionEn: 'Customer Relationship Management for pipelines, leads, and sales support.',
    badge: 'مبيعات',
    color: '#DC2626'
  }
];

// Base default template
export const YOUMI_ARABIC_TEMPLATE: ProjectConfig = {
  siteInfo: {
    siteName: 'YOUMI Marketplace',
    projectType: 'marketplace',
    description: 'منصة متعددة البائعين في الجزائر والوطن العربي',
    logoUrl: logoImg,
    contactEmail: 'ar.sarl.usine@gmail.com',
    contactPhone: '0550000000',
    currency: 'DZD',
    supportHours: '7 أيام - 24 ساعة',
    activeTaxRate: 19.0,
  },
  header: {
    layoutStyle: 'centered',
    showSearchBar: true,
    searchPlaceholder: 'ابحث عن منتجات، علامات تجارية، متاجر...',
    cartIconStyle: 'bag',
    showNotificationBanner: true,
    notificationText: 'التوصيل لجميع الولايات • الدفع عند الاستلام • إرجاع مجاني خلال 7 أيام',
    notificationLink: '#promo',
  },
  menu: {
    items: [
      { id: 'm1', label: 'الرئيسية', url: '#home', isFeatured: true, badgeText: 'رائجة' },
      { id: 'm2', label: 'الأقسام', url: '#categories', isFeatured: false },
      { id: 'm3', label: 'العروض', url: '#offers', isFeatured: false },
      { id: 'm4', label: 'المتاجر', url: '#stores', isFeatured: false, badgeText: 'جديد' },
      { id: 'm5', label: 'الأكثر مبيعاً', url: '#bestsellers', isFeatured: false },
      { id: 'm6', label: 'اتصل بنا', url: '#contact', isFeatured: false },
    ],
  },
  hero: {
    autoPlay: true,
    slideInterval: 5000,
    slides: [
      {
        id: 's1',
        title: 'أفضل المنتجات بأفضل الأسعار',
        subtitle: 'اكتشف آلاف المنتجات من أفضل المتاجر مع توصيل سريع إلى باب منزلك',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
        buttonText: 'تسوق الآن',
        buttonUrl: '#shop',
        badgeText: 'مجموعة الصيف الخاصة',
      },
      {
        id: 's2',
        title: 'عالم التقنية الذكية',
        subtitle: 'أفضل السماعات، الساعات الذكية والكاميرات من علامات عالمية بأسعار تنافسية',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200&auto=format&fit=crop',
        buttonText: 'تصفح التقنية',
        buttonUrl: '#tech',
      }
    ],
  },
  categories: {
    sectionTitle: 'أقسام مميزة',
    sectionSubtitle: 'تسوق أفضل المجموعات المختارة بعناية من بائعينا المعتمدين',
    categories: [
      { id: 'c1', name: 'الإلكترونيات', imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=400&auto=format&fit=crop', itemCount: 1420, isActive: true, icon: 'Cpu' },
      { id: 'c2', name: 'الهواتف', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop', itemCount: 320, isActive: true, icon: 'Smartphone' },
      { id: 'c3', name: 'الأزياء', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop', itemCount: 512, isActive: true, icon: 'Shirt' },
      { id: 'c4', name: 'المنزل والمطبخ', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop', itemCount: 815, isActive: true, icon: 'Home' },
      { id: 'c5', name: 'الجمال والعناية', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop', itemCount: 412, isActive: true, icon: 'Sparkles' },
    ],
    products: [
      { id: 'p1', name: 'سماعة رأس لاسلكية إلغاء الضوضاء', price: 14500, originalPrice: 19500, category: 'الإلكترونيات', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop', rating: 4.8, isFeatured: true, isNew: true },
      { id: 'p2', name: 'ساعة يد ذكية بلس', price: 9500, category: 'الإلكترونيات', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop', rating: 4.9, isFeatured: true },
      { id: 'p3', name: 'هاتف ذكي برو الترا', price: 85000, originalPrice: 95000, category: 'الهواتف', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop', rating: 4.7, isFeatured: true },
    ],
  },
  footer: {
    copyrightText: '© 2026 جميع الحقوق محفوظة لـ يومي.',
    showSocialLinks: true,
    socialLinks: { facebook: '#', instagram: '#', twitter: '#', linkedin: '#' },
    columns: [
      { id: 'col1', title: 'روابط هامة', links: [{ label: 'الأسئلة الشائعة', url: '#faq' }, { label: 'شروط الاستخدام', url: '#terms' }] },
      { id: 'col2', title: 'المتاجر', links: [{ label: 'سجل كبائع معنا', url: '#register' }, { label: 'دليل البائعين', url: '#seller-guide' }] }
    ],
  },
  colors: {
    primary: '#0F766E',
    secondary: '#F59E0B',
    accent: '#0F766E',
    background: '#ffffff',
    text: '#1f2937',
    headerBg: '#ffffff',
    footerBg: '#0f172a',
  },
  fonts: { headingFont: 'Cairo', bodyFont: 'Cairo', fontSizeBase: 'medium' },
  buttons: { borderRadius: 'md', buttonPadding: 'normal', buttonShadow: 'md', hoverEffect: 'scale' },
  sectionOrder: ['header', 'menu', 'hero', 'categories', 'footer'],
};

// 2. LANDING PAGE
export const LANDING_PAGE_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'ProLaunch App',
    projectType: 'landing',
    description: 'صفحة هبوط احترافية لترويج المبادرات وتطبيقات الجوال',
  },
  hero: {
    autoPlay: true,
    slideInterval: 6000,
    slides: [
      {
        id: 's-landing',
        title: 'ضاعف مبيعاتك بنسبة 300% مع منصتنا الذكية',
        subtitle: 'الحل الأسرع لإطلاق منتجاتك وحملاتك التسويقية في دقائق معدودة.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
        buttonText: 'جرب الميزة مجاناً',
        buttonUrl: '#trial',
        badgeText: 'إطلاق عام 2026'
      }
    ]
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#2563EB', secondary: '#38BDF8', headerBg: '#0F172A', footerBg: '#020617' }
};

// 3. COMPANY WEBSITE
export const COMPANY_WEBSITE_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'المؤسسة الوطنية للتكنولوجيا',
    projectType: 'company',
    description: 'موقع تعريفي بشركة نماء للخدمات الهندسية والاستشارات',
  },
  menu: {
    items: [
      { id: 'm1', label: 'الرئيسية', url: '#home', isFeatured: true },
      { id: 'm2', label: 'عن الشركة', url: '#about', isFeatured: false },
      { id: 'm3', label: 'خدماتنا', url: '#services', isFeatured: false },
      { id: 'm4', label: 'مشاريعنا', url: '#projects', isFeatured: false },
      { id: 'm5', label: 'تواصل معنا', url: '#contact', isFeatured: false }
    ]
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#1E293B', secondary: '#0EA5E9' }
};

// 4. PORTFOLIO
export const PORTFOLIO_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'معرض أعمال أحمد | مصمم واجهات',
    projectType: 'portfolio',
    description: 'استعراض أفضل التصاميم وتطبيقات الجوال والمشاريع الإبداعية',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#7C3AED', secondary: '#F43F5E' }
};

// 5. BLOG
export const BLOG_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'مجلة الفكر التقني',
    projectType: 'blog',
    description: 'مقالات وأخبار التكنولوجيا، الذكاء الاصطناعي وريادة الأعمال',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#DB2777', secondary: '#818CF8' }
};

// 6. CMS
export const CMS_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'نظام CMS المحتوى المتقدم',
    projectType: 'cms',
    description: 'بوابة ديناميكية لإدارة المقالات والأوراق العلمية والوسائط',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#4F46E5', secondary: '#10B981' }
};

// 7. SAAS DASHBOARD
export const SAAS_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'YOUMI Cloud Analytics SaaS',
    projectType: 'saas',
    description: 'لوحة قيادة السحابة لتحليل البيانات والاشتراكات الشهرية',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#0284C7', secondary: '#06B6D4' }
};

// 8. RESTAURANT
export const RESTAURANT_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'مطعم الأطباق الذهبية 🍲',
    projectType: 'restaurant',
    description: 'قائمة طعام إلكترونية تفاعلية وحجز طاولات الأكل الفاخر',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#B45309', secondary: '#F59E0B' }
};

// 9. MEDICAL CLINIC
export const CLINIC_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'مجمع العيادات التخصصية 🩺',
    projectType: 'clinic',
    description: 'حجز مواعيد الأطباء والاستشارات الطبية والفحوصات',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#0D9488', secondary: '#14B8A6' }
};

// 10. SCHOOL
export const SCHOOL_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'أكاديمية المستقبل التعليمية 🎓',
    projectType: 'school',
    description: 'دورات دراسية، مسارات أكاديمية ونظام التسجيل المدرسي',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#1D4ED8', secondary: '#60A5FA' }
};

// 11. HOTEL
export const HOTEL_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'منتجع الأوراس الفندقي 🏨',
    projectType: 'hotel',
    description: 'حجز غرف وأجنحة فاخرة مع العروض السياحية المتميزة',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#047857', secondary: '#34D399' }
};

// 12. REAL ESTATE
export const REALESTATE_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'وكالة الأطلس للعقارات 🏡',
    projectType: 'realestate',
    description: 'عروض الفلل، الشقق، والأراضي للبيع أو الكراء في الجزائر',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#4338CA', secondary: '#818CF8' }
};

// 13. BOOKING
export const BOOKING_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'منصة احجز خدماتك 📅',
    projectType: 'booking',
    description: 'جدولة واستجابة لمواعيد الاستشارات والخدمات المنزلية',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#D97706', secondary: '#FBBF24' }
};

// 14. ERP
export const ERP_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'نظام YOUMI ERP للمؤسسات ⚙️',
    projectType: 'erp',
    description: 'إدارة المخزون والعمليات المالي وتخطيط موارد الشركات',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#334155', secondary: '#64748B' }
};

// 15. CRM
export const CRM_TEMPLATE: ProjectConfig = {
  ...YOUMI_ARABIC_TEMPLATE,
  siteInfo: {
    ...YOUMI_ARABIC_TEMPLATE.siteInfo,
    siteName: 'نظام CRM لإدارة المبيعات 📈',
    projectType: 'crm',
    description: 'متابعة العملاء، صفقات المبيعات ودعم الخدمات الاحترافية',
  },
  colors: { ...YOUMI_ARABIC_TEMPLATE.colors, primary: '#991B1B', secondary: '#EF4444' }
};

export const MARKETPLACE_ALT_TEMPLATE = YOUMI_ARABIC_TEMPLATE;

// Complete Map for all 15 project types
export const TEMPLATE_MAP: Record<string, ProjectConfig> = {
  marketplace: YOUMI_ARABIC_TEMPLATE,
  landing: LANDING_PAGE_TEMPLATE,
  company: COMPANY_WEBSITE_TEMPLATE,
  portfolio: PORTFOLIO_TEMPLATE,
  blog: BLOG_TEMPLATE,
  cms: CMS_TEMPLATE,
  saas: SAAS_TEMPLATE,
  restaurant: RESTAURANT_TEMPLATE,
  clinic: CLINIC_TEMPLATE,
  school: SCHOOL_TEMPLATE,
  hotel: HOTEL_TEMPLATE,
  realestate: REALESTATE_TEMPLATE,
  booking: BOOKING_TEMPLATE,
  erp: ERP_TEMPLATE,
  crm: CRM_TEMPLATE,
  // Legacy aliases
  fashion: YOUMI_ARABIC_TEMPLATE,
  tech: SAAS_TEMPLATE,
  grocery: MARKETPLACE_ALT_TEMPLATE
};
