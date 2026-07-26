import React, { useState } from 'react';
import { ProjectConfig } from '../types';
import { FileCode, Clipboard, CheckCircle, Copy } from 'lucide-react';
import { useTranslation } from '../utils/i18n';

interface CodeViewerProps {
  config: ProjectConfig;
}

export default function CodeViewer({ config }: CodeViewerProps) {
  const { t, dir } = useTranslation();
  const [activeTab, setActiveTab] = useState<'json' | 'app' | 'readme'>('json');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const rawContent = getActiveContent();
    navigator.clipboard.writeText(rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveContent = (): string => {
    switch (activeTab) {
      case 'json':
        return JSON.stringify(config, null, 2);
      case 'app':
        return `// Compiled React entry point incorporating active YOUMI packages
import React, { useState } from 'react';
import { ShoppingBag, Search, Star } from 'lucide-react';

const MARKETPLACE_CONFIG = ${JSON.stringify(config, null, 2)};

export default function App() {
  const [cartItems, setCartItems] = useState(0);
  
  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
      {/* 1. Brand Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-indigo-600 uppercase">
            {MARKETPLACE_CONFIG.siteInfo.siteName}
          </span>
          <nav className="flex gap-4 text-xs font-semibold uppercase">
            {MARKETPLACE_CONFIG.menu.items.map(item => (
              <a key={item.id} href={item.url} className="hover:underline">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}`;
      case 'readme':
        return `# YOUMI Marketplace - ${config.siteInfo.siteName}

Visually compiled multi-vendor marketplace template.

## Quick Install and Start:
1. Ensure Node.js v18+ is installed.
2. Run installation inside directory:
   \`\`\`bash
   npm install
   \`\`\`
3. Startup local development workspace:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Ready to build custom modules!`;
      default:
        return '';
    }
  };

  const codeLines = getActiveContent().split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800" dir={dir}>
      {/* Top Tabs panel */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-1">
          {[
            { id: 'json', label: 'config.json' },
            { id: 'app', label: 'App.tsx' },
            { id: 'readme', label: 'README.md' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Copy trigger */}
        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 text-[10px] font-semibold font-sans bg-slate-800 text-slate-300 hover:text-white rounded transition flex items-center gap-1 active:scale-95"
        >
          {copied ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('code_copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t('copy_code')}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text Grid */}
      <div className="flex-1 p-4 font-mono text-[11px] text-slate-300 overflow-auto bg-slate-950 leading-relaxed">
        <div className="flex">
          {/* Mock line numbers */}
          <div className="text-slate-600 text-end pr-4 select-none border-r border-slate-800/60 min-w-[28px] shrink-0">
            {codeLines.map((_, idx) => (
              <div key={idx}>{idx + 1}</div>
            ))}
          </div>

          {/* Actual raw codes */}
          <pre className="pl-4 text-start whitespace-pre text-emerald-400 select-all overflow-visible flex-1">
            <code>
              {codeLines.map((line, idx) => (
                <div key={idx} className="hover:bg-slate-900/60 transition-colors px-1">
                  {line || ' '}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
