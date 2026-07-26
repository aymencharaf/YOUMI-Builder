import { MarketplaceItem, MarketplaceFilter } from '../types';
import { OpenVSXProvider } from '../providers/OpenVSXProvider';

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'pack-auth-pro',
    name: 'pack-auth-pro',
    displayName: 'YOUMI Auth Pro Pack',
    version: '2.1.0',
    description: 'Complete Authentication Suite with OAuth, JWT, Magic Links, MFA, and User Management Panel.',
    summary: 'OAuth, JWT, Magic Links, MFA & User Control Panel for YOUMI Builder apps.',
    provider: 'youmi',
    author: {
      name: 'YOUMI Official',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      verified: true,
    },
    category: 'packs',
    icon: 'Shield',
    bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    tags: ['Auth', 'OAuth', 'JWT', 'Security', 'User Management'],
    rating: 4.9,
    ratingCount: 342,
    downloadsCount: 18450,
    priceType: 'free',
    isOfficial: true,
    isVerified: true,
    minBuilderVersion: '1.0.0',
    createdAt: '2026-01-15',
    updatedAt: '2026-07-10',
    downloadUrl: 'https://cdn.youmibuilder.com/packs/pack-auth-pro-2.1.0.ypk',
    readmeMarkdown: `# YOUMI Auth Pro Pack\n\nFull security and authentication pack for YOUMI Builder applications.\n\n## Features\n- 🔐 Social logins (Google, GitHub, Apple)\n- 🔑 JWT & Refresh Token storage\n- 📱 Two-Factor Authentication (TOTP)\n- 🛡️ Role-based Access Control (RBAC)`,
    changelogMarkdown: `### v2.1.0\n- Added WebAuthn Passkeys support\n- Improved Session management`,
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    ],
    permissions: ['auth:read', 'auth:write', 'user:profile'],
    dependencies: {},
  },
  {
    id: 'pack-ai-copilot',
    name: 'pack-ai-copilot',
    displayName: 'Gemini AI Assistant & Copilot Pack',
    version: '3.0.4',
    description: 'Server-side Gemini AI integration for smart code generation, content creation, and real-time page optimization.',
    summary: 'Smart Gemini AI Copilot for automatic layout suggestions and auto-content.',
    provider: 'youmi',
    author: {
      name: 'YOUMI AI Labs',
      verified: true,
    },
    category: 'ai',
    icon: 'Sparkles',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    tags: ['AI', 'Gemini', 'Copilot', 'Content Generator', 'SEO AI'],
    rating: 4.95,
    ratingCount: 890,
    downloadsCount: 42100,
    priceType: 'free',
    isOfficial: true,
    isVerified: true,
    minBuilderVersion: '1.0.0',
    createdAt: '2026-02-01',
    updatedAt: '2026-07-22',
    downloadUrl: 'https://cdn.youmibuilder.com/packs/pack-ai-copilot-3.0.4.ypk',
    readmeMarkdown: `# Gemini AI Assistant Pack\n\nIntegrate Google Gemini 3.5/3.6 Flash & Pro directly into your YOUMI canvas.`,
    changelogMarkdown: `### v3.0.4\n- Multimodal layout parsing\n- Enhanced prompt completion speed`,
    screenshots: [],
    permissions: ['ai:generate', 'editor:modify'],
    dependencies: {},
  },
  {
    id: 'pack-ecommerce-store',
    name: 'pack-ecommerce-store',
    displayName: 'E-Commerce Storefront & Checkout Pack',
    version: '1.8.2',
    description: 'Turn any YOUMI layout into a complete online store with cart, checkout, Stripe payment gateways, and inventory controls.',
    summary: 'Turn your design into a high-converting e-commerce shop with cart & Stripe checkout.',
    provider: 'youmi',
    author: {
      name: 'CommercePulse Studio',
      verified: true,
    },
    category: 'cms',
    icon: 'ShoppingBag',
    bannerUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
    tags: ['E-commerce', 'Shopify Alternative', 'Stripe', 'Shopping Cart', 'Inventory'],
    rating: 4.8,
    ratingCount: 156,
    downloadsCount: 9230,
    priceType: 'freemium',
    priceUSD: 19,
    isOfficial: false,
    isVerified: true,
    minBuilderVersion: '1.0.0',
    createdAt: '2026-03-10',
    updatedAt: '2026-07-18',
    downloadUrl: 'https://cdn.youmibuilder.com/packs/pack-ecommerce-store-1.8.2.ypk',
    readmeMarkdown: `# E-Commerce Storefront Pack\n\nFull shopping cart & order fulfillment flow.`,
    changelogMarkdown: `### v1.8.2\n- Fixed coupon discount calculations\n- Added multi-currency switcher`,
    screenshots: [],
    permissions: ['storage:products', 'payments:stripe'],
    dependencies: {},
  },
  {
    id: 'pack-seo-booster',
    name: 'pack-seo-booster',
    displayName: 'SEO Pro & Schema Markup Pack',
    version: '1.4.0',
    description: 'Automated Meta tag generator, OpenGraph image creator, XML Sitemap compiler, and Structured Data JSON-LD generator.',
    summary: 'Automate XML sitemaps, Meta tags, and Structured Schema JSON-LD.',
    provider: 'youmi',
    author: {
      name: 'SearchEngineCraft',
      verified: true,
    },
    category: 'seo',
    icon: 'Search',
    tags: ['SEO', 'Meta Tags', 'Sitemap', 'Google Rank', 'JSON-LD'],
    rating: 4.7,
    ratingCount: 94,
    downloadsCount: 12400,
    priceType: 'free',
    isOfficial: false,
    isVerified: true,
    minBuilderVersion: '1.0.0',
    createdAt: '2026-04-05',
    updatedAt: '2026-06-30',
    downloadUrl: 'https://cdn.youmibuilder.com/packs/pack-seo-booster-1.4.0.ypk',
    readmeMarkdown: `# SEO Pro Booster Pack\n\nBoost search engine rankings with automatic metadata.`,
    changelogMarkdown: `### v1.4.0\n- Dynamic OpenGraph image generator`,
    screenshots: [],
    permissions: ['seo:write', 'sitemap:generate'],
    dependencies: {},
  },
  {
    id: 'pack-vs-code-theme',
    name: 'pack-vs-code-theme',
    displayName: 'VS Code Dark Modern Theme Pack',
    version: '1.2.0',
    description: 'Transforms YOUMI Builder workspace skin into authentic Visual Studio Code dark modern theme with glowing activity highlights.',
    summary: 'Authentic VS Code Dark Modern workspace styling & syntax highlights.',
    provider: 'youmi',
    author: {
      name: 'YOUMI UI Team',
      verified: true,
    },
    category: 'themes',
    icon: 'Palette',
    tags: ['VS Code', 'Theme', 'Dark Mode', 'Developer UI'],
    rating: 4.98,
    ratingCount: 520,
    downloadsCount: 31000,
    priceType: 'free',
    isOfficial: true,
    isVerified: true,
    minBuilderVersion: '1.0.0',
    createdAt: '2026-01-20',
    updatedAt: '2026-07-01',
    downloadUrl: 'https://cdn.youmibuilder.com/packs/pack-vs-code-theme-1.2.0.ypk',
    readmeMarkdown: `# VS Code Dark Modern Theme Pack\n\nDeveloper-focused IDE layout experience.`,
    changelogMarkdown: `### v1.2.0\n- Added high-contrast color scheme toggle`,
    screenshots: [],
    permissions: ['theme:apply'],
    dependencies: {},
  }
];

export async function fetchMarketplaceItems(filter?: MarketplaceFilter): Promise<MarketplaceItem[]> {
  let items: MarketplaceItem[] = [...MOCK_MARKETPLACE_ITEMS];

  if (filter?.providerSource === 'openvsx') {
    items = await OpenVSXProvider.searchExtensions(filter.query);
  } else if (filter?.providerSource === 'all') {
    const openVsxItems = await OpenVSXProvider.searchExtensions(filter.query || 'react');
    items = [...MOCK_MARKETPLACE_ITEMS, ...openVsxItems];
  }

  if (!filter) return items;

  if (filter.query.trim() && filter.providerSource !== 'openvsx') {
    const q = filter.query.toLowerCase();
    items = items.filter(
      (item) =>
        item.displayName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filter.category && filter.category !== 'all') {
    items = items.filter((item) => item.category === filter.category);
  }

  if (filter.priceType && filter.priceType !== 'all') {
    items = items.filter((item) => item.priceType === filter.priceType);
  }

  if (filter.onlyVerified) {
    items = items.filter((item) => item.isVerified);
  }

  if (filter.sortBy === 'popular') {
    items.sort((a, b) => b.downloadsCount - a.downloadsCount);
  } else if (filter.sortBy === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  } else if (filter.sortBy === 'newest') {
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (filter.sortBy === 'name') {
    items.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  return items;
}

export async function fetchMarketplaceItemById(id: string): Promise<MarketplaceItem | null> {
  if (id.startsWith('openvsx-')) {
    const list = await OpenVSXProvider.searchExtensions();
    return list.find((i) => i.id === id) || null;
  }
  return MOCK_MARKETPLACE_ITEMS.find((item) => item.id === id) || null;
}
