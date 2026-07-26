export type ExtensionPriceType = 'free' | 'freemium' | 'premium';
export type ExtensionProviderSource = 'youmi' | 'openvsx' | 'github' | 'local' | 'custom';

export interface MarketplaceItem {
  id: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  summary: string;
  provider: ExtensionProviderSource;
  author: {
    name: string;
    avatarUrl?: string;
    verified: boolean;
  };
  category: 'packs' | 'plugins' | 'themes' | 'ai' | 'cms' | 'integrations' | 'seo' | 'builder';
  icon: string;
  bannerUrl?: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  downloadsCount: number;
  priceType: ExtensionPriceType;
  priceUSD?: number;
  isOfficial: boolean;
  isVerified: boolean;
  minBuilderVersion: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl: string;
  readmeMarkdown: string;
  changelogMarkdown: string;
  screenshots: string[];
  permissions: string[];
  dependencies: Record<string, string>;
}

export interface PackageManifest {
  manifestVersion: string;
  packId: string;
  name: string;
  version: string;
  entryPoint: string;
  assets: string[];
  styles?: string[];
  hooks?: string[];
  components?: string[];
  settingsSchema?: Record<string, any>;
  signature?: string;
}

export interface DownloadProgress {
  itemId: string;
  bytesDownloaded: number;
  totalBytes: number;
  percentage: number;
  status: 'idle' | 'downloading' | 'completed' | 'failed';
  error?: string;
}

export interface ExtractionResult {
  success: boolean;
  manifest?: PackageManifest;
  filesCount: number;
  extractedSizeKb: number;
  errors?: string[];
  warnings?: string[];
}

export interface InstallationStatus {
  itemId: string;
  installedVersion: string;
  enabled: boolean;
  installedAt: string;
  status: 'installing' | 'installed' | 'enabling' | 'disabling' | 'uninstalling' | 'uninstalled' | 'error';
  errorMessage?: string;
}

export interface MarketplaceFilter {
  query: string;
  category: string;
  providerSource: 'all' | ExtensionProviderSource;
  priceType: 'all' | 'free' | 'premium';
  sortBy: 'popular' | 'rating' | 'newest' | 'name';
  onlyVerified: boolean;
}
