import React from 'react';
import { Search, Shield, Sparkles, RefreshCw, Globe, Layers, Code2 } from 'lucide-react';
import { useMarketplace } from '../hooks/useMarketplace';
import { ExtensionProviderSource } from '../types';

export const MarketplaceHeader: React.FC = () => {
  const { filter, setFilter, refreshCatalog, loading } = useMarketplace();

  const providers: { id: 'all' | ExtensionProviderSource; label: string; icon: any }[] = [
    { id: 'all', label: 'All Sources', icon: Layers },
    { id: 'youmi', label: 'YOUMI Packs', icon: Sparkles },
    { id: 'openvsx', label: 'Open VSX Registry', icon: Code2 },
  ];

  const categories = [
    { id: 'all', label: 'All Packs' },
    { id: 'packs', label: 'Builder Packs' },
    { id: 'ai', label: 'AI & Copilot' },
    { id: 'cms', label: 'CMS & E-Commerce' },
    { id: 'seo', label: 'SEO & Rank' },
    { id: 'themes', label: 'IDE Themes' },
  ];

  return (
    <div className="bg-[#18181b] border-b border-[#27272a] p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              YOUMI Marketplace & Open VSX Ecosystem
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                v2.5
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Discover, install, and manage extensible modular packs and Open VSX extensions.
            </p>
          </div>
        </div>

        {/* Provider Source Bar */}
        <div className="flex items-center gap-1 bg-[#09090b] border border-[#27272a] p-1 rounded-lg text-xs">
          {providers.map((p) => {
            const Icon = p.icon;
            const isActive = filter.providerSource === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setFilter((prev) => ({ ...prev, providerSource: p.id }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshCatalog()}
            disabled={loading}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search packs, VS Code extensions, or tags..."
            value={filter.query}
            onChange={(e) => setFilter((prev) => ({ ...prev, query: e.target.value }))}
            className="w-full bg-[#09090b] text-zinc-100 placeholder-zinc-500 text-xs pl-9 pr-3 py-2 rounded-md border border-[#27272a] focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#09090b] border border-[#27272a] p-1 rounded-md text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter((prev) => ({ ...prev, category: cat.id }))}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter.category === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFilter((prev) => ({ ...prev, onlyVerified: !prev.onlyVerified }))}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs transition-colors ${
            filter.onlyVerified
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-zinc-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Verified Only
        </button>
      </div>
    </div>
  );
};
