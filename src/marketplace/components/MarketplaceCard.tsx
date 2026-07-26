import React from 'react';
import { Star, Download, ShieldCheck, Check, Power, Trash2, Shield, Sparkles, Box, ShoppingBag, Search, Palette } from 'lucide-react';
import { MarketplaceItem } from '../types';
import { useMarketplace } from '../hooks/useMarketplace';

interface MarketplaceCardProps {
  item: MarketplaceItem;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ item }) => {
  const { installedRegistry, downloadProgressMap, installItem, toggleItem, uninstallItem, setSelectedItem } = useMarketplace();

  const installedInfo = installedRegistry[item.id];
  const isInstalled = !!installedInfo;
  const isEnabled = installedInfo?.enabled ?? false;
  const progress = downloadProgressMap[item.id];
  const isDownloading = !!progress;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-indigo-400" />;
      case 'Search': return <Search className="w-5 h-5 text-blue-400" />;
      case 'Palette': return <Palette className="w-5 h-5 text-purple-400" />;
      default: return <Box className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] hover:border-zinc-700 rounded-lg p-4 flex flex-col justify-between gap-3 transition-all group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              {getIconComponent(item.icon)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3
                  onClick={() => setSelectedItem(item)}
                  className="text-xs font-semibold text-zinc-100 hover:text-emerald-400 cursor-pointer transition-colors line-clamp-1"
                >
                  {item.displayName}
                </h3>
                {item.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" title="Verified Pack" />
                )}
              </div>
              <p className="text-[11px] text-zinc-400">
                by <span className="text-zinc-300 font-medium">{item.author.name}</span> • v{item.version}
              </p>
            </div>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            item.priceType === 'free' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {item.priceType === 'free' ? 'FREE' : `$${item.priceUSD}`}
          </span>
        </div>

        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-3">
          {item.summary || item.description}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            item.provider === 'openvsx'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {item.provider}
          </span>
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
            <Star className="w-3 h-3 fill-amber-400" />
            {item.rating} ({item.ratingCount})
          </span>
          <span className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]">
            <Download className="w-3 h-3" />
            {item.downloadsCount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isDownloading ? (
            <span className="text-xs text-emerald-400 animate-pulse font-mono">
              Downloading ({progress?.percentage || 0}%)...
            </span>
          ) : isInstalled ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleItem(item.id, !isEnabled)}
                className={`p-1.5 rounded transition-colors ${
                  isEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
                title={isEnabled ? 'Disable Pack' : 'Enable Pack'}
              >
                <Power className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => uninstallItem(item.id)}
                className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                title="Uninstall Pack"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => installItem(item)}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-md text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
