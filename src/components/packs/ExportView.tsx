import React, { useState } from 'react';
import { ProjectConfig } from '../../types';
import { Download, CheckSquare, FileCode, CheckCircle, Settings, Star } from 'lucide-react';
import { generateProjectZip, generateNextjsProjectZip } from '../../utils/projectGenerator';
import { useTranslation } from '../../utils/i18n';

interface ExportViewProps {
  config: ProjectConfig;
  includedPacks: string[];
  togglePackSelection: (packId: string) => void;
  packNames: Record<string, string>;
}

export default function ExportView({ config, includedPacks, togglePackSelection, packNames }: ExportViewProps) {
  const { t, dir } = useTranslation();
  const [projectName, setProjectName] = useState('youmi-marketplace');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportFormat, setExportFormat] = useState<'react-vite' | 'nextjs-app'>('react-vite');

  const handleExportZip = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    try {
      if (exportFormat === 'nextjs-app') {
        await generateNextjsProjectZip(projectName, config, includedPacks);
      } else {
        await generateProjectZip(projectName, config, includedPacks);
      }
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000); // clear banner after 5s
    } catch (err) {
      console.error('ZIP generation failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const packList = [
    { id: 'siteInfo' },
    { id: 'header' },
    { id: 'menu' },
    { id: 'hero' },
    { id: 'categories' },
    { id: 'footer' },
    { id: 'colors' },
    { id: 'fonts' },
    { id: 'buttons' },
  ];

  return (
    <div className="space-y-6 text-start font-sans" dir={dir}>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-500" />
          {t('exp_config_title')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('exp_config_desc')}
        </p>
      </div>

      {/* Target Export Architecture Tab Selector */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setExportFormat('react-vite')}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            exportFormat === 'react-vite'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <FileCode className="w-4 h-4 text-teal-500" />
          {t('exp_tab_react')}
        </button>
        <button
          type="button"
          onClick={() => setExportFormat('nextjs-app')}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            exportFormat === 'nextjs-app'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          {t('exp_tab_nextjs')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pack Selector & Config */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {t('exp_sec_project')}
            </span>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">
                {t('exp_lbl_repo')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-start"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="youmi-marketplace"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {t('exp_sec_packs')}
            </span>
            <div className="space-y-1.5">
              {packList.map((pack) => {
                const isActive = includedPacks.includes(pack.id);
                // Try translating pack names directly or fallback to standard ones
                const displayName = packNames[pack.id] || pack.id;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => togglePackSelection(pack.id)}
                    className={`w-full p-2.5 rounded-lg border text-start flex items-center justify-between text-xs transition cursor-pointer ${
                      isActive
                        ? 'border-indigo-200 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-semibold">{displayName}</span>
                    {isActive ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic ZIP Content Directory Structure Preview */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {exportFormat === 'nextjs-app' ? t('exp_sec_structure_nextjs') : t('exp_sec_structure')}
            </span>
            {exportFormat === 'nextjs-app' ? (
              <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1.5 text-start">
                <div>📁 {projectName}/</div>
                <div className="pl-4">├── 📁 src/</div>
                <div className="pl-8">├── 📁 app/</div>
                <div className="pl-12">├── 📄 layout.tsx (Next.js Root Layout)</div>
                <div className="pl-12">├── 📄 page.tsx (Dynamic Main Page)</div>
                <div className="pl-12">└── 📄 globals.css (Tailwind Directives)</div>
                <div className="pl-4">├── 📄 config.json (Seeded Pack Data)</div>
                <div className="pl-4">├── 📄 package.json (Next.js scripts)</div>
                <div className="pl-4">├── 📄 next.config.js</div>
                <div className="pl-4">├── 📄 postcss.config.js</div>
                <div className="pl-4">└── 📄 README.md (Spin Up Steps)</div>
              </div>
            ) : (
              <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1.5 text-start">
                <div>📁 {projectName}/</div>
                <div className="pl-4">├── 📁 src/</div>
                <div className="pl-8">├── 📁 components/</div>
                <div className="pl-12">├── 📄 Header.tsx {includedPacks.includes('header') ? '✅' : '❌'}</div>
                <div className="pl-12">├── 📄 Hero.tsx {includedPacks.includes('hero') ? '✅' : '❌'}</div>
                <div className="pl-12">├── 📄 Categories.tsx {includedPacks.includes('categories') ? '✅' : '❌'}</div>
                <div className="pl-12">└── 📄 Footer.tsx {includedPacks.includes('footer') ? '✅' : '❌'}</div>
                <div className="pl-8">├── 📄 App.tsx</div>
                <div className="pl-8">├── 📄 index.css (Tailwind Directives)</div>
                <div className="pl-8">├── 📄 main.tsx</div>
                <div className="pl-8">└── 📄 types.ts</div>
                <div className="pl-4">├── 📄 index.html (Responsive Frame)</div>
                <div className="pl-4">├── 📄 config.json (Seeded Pack Data)</div>
                <div className="pl-4">├── 📄 package.json</div>
                <div className="pl-4">├── 📄 vite.config.ts</div>
                <div className="pl-4">└── 📄 README.md (Spin Up Steps)</div>
              </div>
            )}
          </div>

          {/* Trigger compilation */}
          <button
            type="button"
            onClick={handleExportZip}
            disabled={isExporting}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-indigo-500/20 transition flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>
              {isExporting
                ? t('exp_btn_packaging')
                : exportFormat === 'nextjs-app'
                ? t('exp_btn_generate_nextjs')
                : t('exp_btn_generate')}
            </span>
          </button>

          {exportSuccess && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400 text-xs">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>{t('exp_msg_success')}</span>
            </div>
          )}

          {/* Local Spinup Guidance instructions */}
          <div className="bg-slate-50 dark:bg-slate-800/20 p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" />
              <span>{t('exp_sec_guidelines')}</span>
            </span>
            <ol className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside leading-relaxed text-start">
              <li>
                {t('exp_guide_1')}{' '}
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{projectName}.zip</span>
              </li>
              <li>{t('exp_guide_2')}</li>
              <li>
                {t('exp_guide_3')}{' '}
                <span className="font-mono text-indigo-600 dark:text-indigo-400">npm install</span>
              </li>
              <li>
                {t('exp_guide_4')}{' '}
                <span className="font-mono text-indigo-600 dark:text-indigo-400">npm run dev</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
