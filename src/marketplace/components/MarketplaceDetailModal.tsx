import React, { useState } from 'react';
import { X, Shield, Star, Download, ShieldCheck, Check, FileText, History, Lock, Layers } from 'lucide-react';
import { useMarketplace } from '../hooks/useMarketplace';

export const MarketplaceDetailModal: React.FC = () => {
  const { selectedItem, setSelectedItem, installedRegistry, installItem, toggleItem, uninstallItem } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'readme' | 'changelog' | 'permissions'>('readme');

  if (!selectedItem) return null;

  const installedInfo = installedRegistry[selectedItem.id];
  const isInstalled = !!installedInfo;
  const isEnabled = installedInfo?.enabled ?? false;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-[#27272a] rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#27272a] flex items-start justify-between gap-4 bg-[#18181b]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-xl">
              {selectedItem.displayName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-100">{selectedItem.displayName}</h2>
                {selectedItem.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-blue-400" title="Verified Pack" />
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                by <span className="text-zinc-200">{selectedItem.author.name}</span> • Version {selectedItem.version}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-amber-400 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {selectedItem.rating} ({selectedItem.ratingCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Download className="w-3.5 h-3.5" />
                  {selectedItem.downloadsCount.toLocaleString()} downloads
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedItem(null)}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Navigation */}
        <div className="flex items-center gap-2 border-b border-[#27272a] px-5 bg-[#09090b]">
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'readme'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Overview & Readme
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'changelog'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Changelog
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3 py-2.5 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'permissions'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Permissions ({selectedItem.permissions.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-zinc-300 leading-relaxed font-sans space-y-4">
          {activeTab === 'readme' && (
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans bg-[#09090b] p-4 rounded-lg border border-[#27272a] text-zinc-300 text-xs leading-relaxed">
                {selectedItem.readmeMarkdown}
              </pre>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="bg-[#09090b] p-4 rounded-lg border border-[#27272a]">
              <pre className="whitespace-pre-wrap font-mono text-zinc-300 text-xs">
                {selectedItem.changelogMarkdown}
              </pre>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400 mb-2">
                This pack requests the following platform capabilities:
              </p>
              {selectedItem.permissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2 bg-[#09090b] p-2.5 rounded border border-[#27272a]">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-emerald-300">{perm}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-[#27272a] bg-[#18181b] flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Category: <span className="text-zinc-200 font-medium capitalize">{selectedItem.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {isInstalled ? (
              <>
                <button
                  onClick={() => toggleItem(selectedItem.id, !isEnabled)}
                  className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                    isEnabled
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isEnabled ? 'Disable Pack' : 'Enable Pack'}
                </button>
                <button
                  onClick={() => {
                    uninstallItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md text-xs font-medium transition-colors"
                >
                  Uninstall
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  installItem(selectedItem);
                }}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition-colors shadow-lg shadow-emerald-950/40"
              >
                <Download className="w-4 h-4" />
                Install Pack ({selectedItem.priceType === 'free' ? 'Free' : `$${selectedItem.priceUSD}`})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
