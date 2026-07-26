export interface ResourceReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ResourceChangelog {
  version: string;
  date: string;
  notes: string[];
}

export interface Resource {
  id: string;
  name: string;
  titleAr?: string;
  category: 'templates' | 'packs' | 'themes' | 'plugins' | 'components' | 'sections' | 'blocks' | 'ui-kits' | 'icons' | 'fonts' | 'images' | 'videos' | 'ai-assets';
  price: number; // 0 for free
  rating: number;
  downloads: number;
  favorites: number;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
    badge?: 'Pro' | 'Top Seller' | 'Verified';
  };
  version: string;
  description: string;
  descriptionAr?: string;
  documentation: string;
  changelog: ResourceChangelog[];
  gallery: string[];
  tags: string[];
  compatibility: string;
  status: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string;
  reviews: ResourceReview[];
  reportsCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewRelease?: boolean;
  isRecentlyUpdated?: boolean;
}

export interface DeveloperProfile {
  name: string;
  avatar: string;
  bio: string;
  website: string;
  isRegistered: boolean;
  verified: boolean;
  balance: number;
  salesCount: number;
}

export interface SalesReport {
  id: string;
  date: string;
  productName: string;
  buyer: string;
  price: number;
  commission: number;
  net: number;
}

export interface UserReport {
  id: string;
  resourceId: string;
  resourceName: string;
  reporter: string;
  reason: string;
  date: string;
}
