import React, { useState, useEffect, useCallback } from 'react';
import { MarketplaceContext, MarketplaceContextValue } from './MarketplaceContext';
import { MarketplaceItem, MarketplaceFilter, InstallationStatus, DownloadProgress } from '../types';
import { fetchMarketplaceItems } from '../api/marketplaceApi';
import { PackageInstaller } from '../installer/packageInstaller';

interface MarketplaceProviderProps {
  children: React.ReactNode;
  onNotification?: (msg: string) => void;
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({
  children,
  onNotification,
}) => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  const [filter, setFilter] = useState<MarketplaceFilter>({
    query: '',
    category: 'all',
    providerSource: 'all',
    priceType: 'all',
    sortBy: 'popular',
    onlyVerified: false,
  });

  const [installedRegistry, setInstalledRegistry] = useState<Record<string, InstallationStatus>>(() =>
    PackageInstaller.getInstalledRegistry()
  );

  const [downloadProgressMap, setDownloadProgressMap] = useState<Record<string, DownloadProgress>>({});

  const refreshCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMarketplaceItems(filter);
      setItems(data);
    } catch (e) {
      console.error('Failed to load marketplace catalog', e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const installItemHandler = async (item: MarketplaceItem) => {
    try {
      setDownloadProgressMap((prev) => ({
        ...prev,
        [item.id]: {
          itemId: item.id,
          bytesDownloaded: 0,
          totalBytes: 100,
          percentage: 10,
          status: 'downloading',
        },
      }));

      await PackageInstaller.installItem(item, (msg) => {
        if (onNotification) onNotification(`${item.displayName}: ${msg}`);
      });

      setInstalledRegistry(PackageInstaller.getInstalledRegistry());
      if (onNotification) onNotification(`Successfully installed ${item.displayName}!`);
    } catch (err: any) {
      if (onNotification) onNotification(`Installation failed: ${err.message || String(err)}`);
    } finally {
      setDownloadProgressMap((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }
  };

  const toggleItemHandler = (itemId: string, enable: boolean) => {
    PackageInstaller.toggleItemEnabled(itemId, enable);
    setInstalledRegistry(PackageInstaller.getInstalledRegistry());
    if (onNotification) {
      onNotification(`Pack ${enable ? 'enabled' : 'disabled'}.`);
    }
  };

  const uninstallItemHandler = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    const name = item ? item.displayName : itemId;
    PackageInstaller.uninstallItem(itemId);
    setInstalledRegistry(PackageInstaller.getInstalledRegistry());
    if (onNotification) {
      onNotification(`Uninstalled ${name}.`);
    }
  };

  const contextValue: MarketplaceContextValue = {
    items,
    loading,
    filter,
    setFilter,
    installedRegistry,
    downloadProgressMap,
    selectedItem,
    setSelectedItem,
    installItem: installItemHandler,
    toggleItem: toggleItemHandler,
    uninstallItem: uninstallItemHandler,
    refreshCatalog,
  };

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {children}
    </MarketplaceContext.Provider>
  );
};
