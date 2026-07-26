import { createContext, Dispatch, SetStateAction } from 'react';
import { MarketplaceItem, MarketplaceFilter, InstallationStatus, DownloadProgress } from '../types';

export interface MarketplaceContextValue {
  items: MarketplaceItem[];
  loading: boolean;
  filter: MarketplaceFilter;
  setFilter: Dispatch<SetStateAction<MarketplaceFilter>>;
  installedRegistry: Record<string, InstallationStatus>;
  downloadProgressMap: Record<string, DownloadProgress>;
  selectedItem: MarketplaceItem | null;
  setSelectedItem: (item: MarketplaceItem | null) => void;
  installItem: (item: MarketplaceItem) => Promise<void>;
  toggleItem: (itemId: string, enable: boolean) => void;
  uninstallItem: (itemId: string) => void;
  refreshCatalog: () => Promise<void>;
}

export const MarketplaceContext = createContext<MarketplaceContextValue | undefined>(undefined);
