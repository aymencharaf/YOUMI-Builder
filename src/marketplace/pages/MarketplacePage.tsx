import React from 'react';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { MarketplaceCard } from '../components/MarketplaceCard';
import { MarketplaceDetailModal } from '../components/MarketplaceDetailModal';
import { useMarketplace } from '../hooks/useMarketplace';
import { Box, Loader2 } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { items, loading } = useMarketplace();

  return (
    <div className="flex flex-col h-full w-full bg-[#09090b] text-zinc-100 overflow-hidden">
      <MarketplaceHeader />

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            <p className="text-xs font-mono">Loading marketplace catalog...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-center text-zinc-500">
            <Box className="w-8 h-8 text-zinc-600" />
            <p className="text-sm font-medium text-zinc-300">No matching packs found</p>
            <p className="text-xs text-zinc-500 max-w-sm">
              Try adjusting your search query or selecting a different category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <MarketplaceCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <MarketplaceDetailModal />
    </div>
  );
};
