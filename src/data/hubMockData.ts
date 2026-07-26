import { Resource } from '../types/hub';

export const INITIAL_HUB_RESOURCES: Resource[] = [
  {
    id: 'hub-1',
    name: 'Luxury Boutique Fashion Template',
    titleAr: 'قالب بوتيك الموضة الفاخرة',
    category: 'templates',
    price: 0,
    rating: 4.8,
    downloads: 1240,
    favorites: 342,
    author: {
      name: 'YOUMI Team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      verified: true,
      badge: 'Pro'
    },
    version: '1.2.0',
    description: 'A breathtakingly elegant template designed for high-end boutique stores and fashion retailers. Features high-contrast typography, seamless section animations, and a polished presentation grid.',
    descriptionAr: 'قالب أنيق للغاية ومصمم لعلامات الموضة الراقية وبوتيكات الأزياء. يتميز بخطوط متباينة وتأثيرات حركية انسيابية للأقسام.',
    documentation: '### Installation\nClick "Install Now" to apply to your current storefront workspace.\n\n### Customization\n- Go to **Colors Pack** to customize primary/secondary palettes\n- Go to **Fonts Pack** to toggle serif/sans headings.',
    changelog: [
      { version: '1.2.0', date: '2026-07-10', notes: ['Added RTL compatibility for Arabic storefronts', 'Improved mobile slider response'] },
      { version: '1.0.0', date: '2026-05-15', notes: ['Initial release of boutique template'] }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600'
    ],
    tags: ['boutique', 'fashion', 'luxury', 'free'],
    compatibility: 'v3.0.0+',
    status: 'approved',
    reviews: [
      { id: 'rev-1', author: 'Sarah K.', rating: 5, comment: 'Perfect layout for my high-end dress business! Installs in one click.', date: '2026-07-18' }
    ],
    reportsCount: 0,
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'hub-2',
    name: 'Dahabia & CIB Payment Gateway Pro',
    titleAr: 'بوابة الدفع الإلكتروني الذهبية و CIB',
    category: 'plugins',
    price: 49,
    rating: 4.9,
    downloads: 850,
    favorites: 289,
    author: {
      name: 'Algerian Devs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
      verified: true,
      badge: 'Verified'
    },
    version: '2.4.1',
    description: 'The ultimate payment plugin connecting your YOUMI Builder storefront with Chargily Pay for secure credit card processing of Dahabia and CIB cards.',
    descriptionAr: 'الملحق البرمجي النهائي لربط متجر يومي مع خدمة شارجيل باي لاستقبال المدفوعات الآمنة عبر البطاقة الذهبية وبطاقة CIB.',
    documentation: '### Configuration\n1. Register on Chargily Pay developer portal\n2. Copy your **API Key** and **Secret Key**\n3. Paste them into the plugin settings panel in YOUMI Builder.',
    changelog: [
      { version: '2.4.1', date: '2026-06-28', notes: ['Fixed redirect callback on mobile devices', 'Added multi-currency support'] }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=600',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600'
    ],
    tags: ['chargily', 'dahabia', 'payments', 'premium'],
    compatibility: 'v3.0.0+',
    status: 'approved',
    reviews: [
      { id: 'rev-2', author: 'Karim Alg', rating: 5, comment: 'Best integration! Tested and verified in 10 minutes.', date: '2026-07-20' }
    ],
    reportsCount: 0,
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: 'hub-3',
    name: 'Yalidine Express Shipping Pack',
    titleAr: 'حزمة شحن يالدين إكسبريس',
    category: 'packs',
    price: 29,
    rating: 4.7,
    downloads: 940,
    favorites: 184,
    author: {
      name: 'LogiDz Solutions',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
      verified: true,
      badge: 'Top Seller'
    },
    version: '1.8.0',
    description: 'Automates Yalidine order dispatching, prints professional thermal address labels and tracks shipping status across 58 Algerian wilayas.',
    descriptionAr: 'حزمة برمجة لتصدير الطلبات تلقائياً لشركة يالدين الجزائر، وطباعة بوالص الشحن الحرارية وتتبع الطرود.',
    documentation: '### Settings\nEnter your Yalidine Api ID and Token. You can define specific Home Delivery vs Desk Delivery prices per Wilaya.',
    changelog: [
      { version: '1.8.0', date: '2026-07-02', notes: ['Added 58-Wilayas pricing overrides', 'Thermal print layout optimization'] }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600'
    ],
    tags: ['yalidine', 'shipping', 'dz', 'logistics'],
    compatibility: 'v2.8.0+',
    status: 'approved',
    reviews: [
      { id: 'rev-3', author: 'Riad D.', rating: 4, comment: 'Saves hours of manual shipping entry every day.', date: '2026-07-15' }
    ],
    reportsCount: 0,
    isTrending: true,
    isRecentlyUpdated: true
  },
  {
    id: 'hub-4',
    name: 'Premium Dark Luxury Theme Pack',
    titleAr: 'مظهر الفخامة الداكن المتميز',
    category: 'themes',
    price: 0,
    rating: 4.6,
    downloads: 1450,
    favorites: 412,
    author: {
      name: 'YOUMI Team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      verified: true,
      badge: 'Pro'
    },
    version: '1.0.5',
    description: 'Give your store a premium dark ambiance inspired by Apple and luxury watch brands. Hand-crafted color system with elegant contrast highlights.',
    descriptionAr: 'امنح متجرك لمسة فخامة داكنة مستوحاة من آبل وماركات الساعات الفاخرة. نظام ألوان فريد ومدروس بعناية.',
    documentation: 'Activate the theme under the Themes selector. Ensure you use high-quality, transparent product photos for maximum visual depth.',
    changelog: [
      { version: '1.0.5', date: '2026-04-10', notes: ['Optimized button hover states', 'Improved text contrasts'] }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600'
    ],
    tags: ['dark', 'luxury', 'free', 'theme'],
    compatibility: 'v3.0.0+',
    status: 'approved',
    reviews: [],
    reportsCount: 0,
    isNewRelease: true
  },
  {
    id: 'hub-5',
    name: 'Neon Cyberpunk UI Components Kit',
    titleAr: 'مجموعة مكونات واجهات النيون سايبربانك',
    category: 'components',
    price: 15,
    rating: 4.5,
    downloads: 320,
    favorites: 98,
    author: {
      name: 'PixelCraft',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150',
      verified: false
    },
    version: '1.0.0',
    description: 'An eye-catching collection of buttons, interactive sliders, and glow cards designed for gaming, tech, and digital assets sellers.',
    descriptionAr: 'مجموعة من الأزرار وعناصر التصفح والبطاقات المتوهجة والمصممة لمتاجر الألعاب والتكنولوجيا والمنتجات الرقمية.',
    documentation: 'Simply install to append neon elements inside your component list.',
    changelog: [
      { version: '1.0.0', date: '2026-07-01', notes: ['First public release'] }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600'
    ],
    tags: ['neon', 'cyberpunk', 'ui', 'components'],
    compatibility: 'v3.0.0+',
    status: 'approved',
    reviews: [],
    reportsCount: 0,
    isNewRelease: true
  },
  {
    id: 'hub-6',
    name: 'Animated Sales Proof Toast',
    titleAr: 'إشعارات المبيعات الحية التفاعلية',
    category: 'sections',
    price: 0,
    rating: 4.4,
    downloads: 2100,
    favorites: 310,
    author: {
      name: 'YOUMI Team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      verified: true,
      badge: 'Pro'
    },
    version: '2.0.1',
    description: 'Increases conversion rate by showing random recent purchases as discrete, elegant popup notifications on the bottom corner of your page.',
    descriptionAr: 'تزيد من ثقة الزوار عبر إظهار نوافذ منبثقة تفيد بحدوث عمليات شراء لمنتجات مختلفة مؤخراً.',
    documentation: 'Allows setting random Algerian names (e.g. Karim from Algiers) and intervals.',
    changelog: [{ version: '2.0.1', date: '2026-03-01', notes: ['Added Arabic localization names list'] }],
    gallery: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600'],
    tags: ['social-proof', 'sales', 'conversion', 'free'],
    compatibility: 'all',
    status: 'approved',
    reviews: [],
    reportsCount: 0,
    isTrending: true
  }
];
