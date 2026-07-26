export type ProjectType = 
  | 'marketplace'
  | 'landing'
  | 'company'
  | 'portfolio'
  | 'blog'
  | 'cms'
  | 'saas'
  | 'restaurant'
  | 'clinic'
  | 'school'
  | 'hotel'
  | 'realestate'
  | 'booking'
  | 'erp'
  | 'crm';

export interface SiteInfoConfig {
  siteName: string;
  projectType?: ProjectType;
  description: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  supportHours: string;
  activeTaxRate: number;
}

export interface HeaderConfig {
  layoutStyle: 'minimal' | 'centered' | 'fullwidth';
  showSearchBar: boolean;
  searchPlaceholder: string;
  cartIconStyle: 'bag' | 'cart';
  showNotificationBanner: boolean;
  notificationText: string;
  notificationLink: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  isFeatured: boolean;
  badgeText?: string;
}

export interface MenuConfig {
  items: MenuItem[];
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  badgeText?: string;
}

export interface HeroSliderConfig {
  slides: SlideItem[];
  autoPlay: boolean;
  slideInterval: number; // in ms
}

export interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  itemCount: number;
  isActive: boolean;
  icon: string; // lucide icon name
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  isFeatured: boolean;
  isNew?: boolean;
}

export interface CategoriesConfig {
  categories: CategoryItem[];
  products: ProductItem[];
  sectionTitle: string;
  sectionSubtitle: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: { label: string; url: string }[];
}

export interface FooterConfig {
  copyrightText: string;
  showSocialLinks: boolean;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  columns: FooterColumn[];
}

export interface ColorsConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  headerBg: string;
  footerBg: string;
}

export interface FontsConfig {
  headingFont: 'Inter' | 'Space Grotesk' | 'Playfair Display' | 'Outfit' | 'Plus Jakarta Sans' | 'Cairo';
  bodyFont: 'Inter' | 'Roboto' | 'Plus Jakarta Sans' | 'Lora' | 'Cairo';
  fontSizeBase: 'small' | 'medium' | 'large';
}

export interface ButtonsConfig {
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  buttonPadding: 'compact' | 'normal' | 'spacious';
  buttonShadow: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect: 'none' | 'scale' | 'fade';
}

export interface ExportConfig {
  selectedPacks: string[];
  projectName: string;
  includeMockData: boolean;
  targetFramework: 'react-vite-tailwind';
}

export interface PluginItem {
  id: string;
  name: string;
  description: string;
  type: 'html' | 'js' | 'yalidine' | 'whatsapp' | 'facebook_pixel';
  code: string;
  isActive: boolean;
  location: 'header' | 'footer' | 'body';
}

export interface ProjectConfig {
  siteInfo: SiteInfoConfig;
  header: HeaderConfig;
  menu: MenuConfig;
  hero: HeroSliderConfig;
  categories: CategoriesConfig;
  footer: FooterConfig;
  colors: ColorsConfig;
  fonts: FontsConfig;
  buttons: ButtonsConfig;
  sectionOrder?: string[];
  plugins?: PluginItem[];
}

export interface Asset {
  id: string;
  name: string;
  url: string;
  category: 'logo' | 'hero' | 'product' | 'category';
}

export interface BuilderState {
  config: ProjectConfig;
  selectedTemplate: string;
  activePackId: string;
  themeMode: 'light' | 'dark';
  assets: Asset[];
  includedPacks: string[]; // Pack IDs active for export
}
