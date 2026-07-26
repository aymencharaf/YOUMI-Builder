import { MarketplaceItem } from '../types';

export class OpenVSXProvider {
  private static BASE_URL = 'https://open-vsx.org/api';

  public static async searchExtensions(query: string = 'react'): Promise<MarketplaceItem[]> {
    try {
      const searchTerm = query.trim() || 'react';
      const response = await fetch(
        `${this.BASE_URL}/-/search?q=${encodeURIComponent(searchTerm)}&size=12`
      );

      if (!response.ok) {
        throw new Error(`Open VSX search error HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawList = data.extensions || [];

      return rawList.map((ext: any): MarketplaceItem => {
        const namespace = ext.namespace || 'openvsx';
        const name = ext.name || 'extension';
        const id = `openvsx-${namespace}.${name}`;

        return {
          id,
          name: `${namespace}.${name}`,
          displayName: ext.displayName || ext.name || 'VS Code Extension',
          version: ext.version || '1.0.0',
          description: ext.description || 'Open VSX Extension for developer toolset.',
          summary: ext.description || 'VS Code extension from Open VSX Registry.',
          provider: 'openvsx',
          author: {
            name: namespace,
            verified: ext.verified || false,
          },
          category: 'plugins',
          icon: ext.files?.icon || 'Box',
          tags: ['vs-code', 'open-vsx', namespace],
          rating: typeof ext.averageRating === 'number' ? Number(ext.averageRating.toFixed(1)) : 4.5,
          ratingCount: ext.reviewCount || 10,
          downloadsCount: ext.downloadCount || 1000,
          priceType: 'free',
          isOfficial: false,
          isVerified: ext.verified || false,
          minBuilderVersion: '1.0.0',
          createdAt: ext.timestamp || new Date().toISOString(),
          updatedAt: ext.timestamp || new Date().toISOString(),
          downloadUrl: ext.files?.download || `${this.BASE_URL}/${namespace}/${name}/${ext.version}/file/${namespace}.${name}-${ext.version}.vsix`,
          readmeMarkdown: `# ${ext.displayName || ext.name}\n\n${ext.description || ''}\n\nPublisher: **${namespace}**\nVersion: **${ext.version}**\n\nFetched live from Open VSX Registry.`,
          changelogMarkdown: `### v${ext.version}\n- Live package metadata from Open VSX.`,
          screenshots: [],
          permissions: ['editor:extension'],
          dependencies: {},
        };
      });
    } catch (err) {
      console.warn('Failed to fetch from Open VSX API, returning fallback list:', err);
      return [
        {
          id: 'openvsx-dbaeumer.vscode-eslint',
          name: 'dbaeumer.vscode-eslint',
          displayName: 'ESLint (Open VSX)',
          version: '2.4.4',
          description: 'Integrates ESLint JavaScript into VS Code & YOUMI Workspace.',
          summary: 'JavaScript and TypeScript Linter for code health.',
          provider: 'openvsx',
          author: { name: 'dbaeumer', verified: true },
          category: 'plugins',
          icon: 'Box',
          tags: ['eslint', 'lint', 'javascript', 'openvsx'],
          rating: 4.8,
          ratingCount: 1420,
          downloadsCount: 154000,
          priceType: 'free',
          isOfficial: false,
          isVerified: true,
          minBuilderVersion: '1.0.0',
          createdAt: '2026-01-01',
          updatedAt: '2026-07-01',
          downloadUrl: 'https://open-vsx.org/api/dbaeumer/vscode-eslint/2.4.4/file/dbaeumer.vscode-eslint-2.4.4.vsix',
          readmeMarkdown: '# ESLint for Open VSX\n\nIntegrates ESLint into YOUMI Builder workspace.',
          changelogMarkdown: '### v2.4.4\n- Updated ESLint ruleset support',
          screenshots: [],
          permissions: ['workspace:lint'],
          dependencies: {},
        },
        {
          id: 'openvsx-esbenp.prettier-vscode',
          name: 'esbenp.prettier-vscode',
          displayName: 'Prettier - Code Formatter (Open VSX)',
          version: '10.1.0',
          description: 'Code formatter using Prettier for HTML, CSS, JS, TS, and JSON.',
          summary: 'Opinionated code formatter for consistent code formatting.',
          provider: 'openvsx',
          author: { name: 'esbenp', verified: true },
          category: 'plugins',
          icon: 'Sparkles',
          tags: ['prettier', 'formatter', 'openvsx'],
          rating: 4.9,
          ratingCount: 2300,
          downloadsCount: 240000,
          priceType: 'free',
          isOfficial: false,
          isVerified: true,
          minBuilderVersion: '1.0.0',
          createdAt: '2026-01-01',
          updatedAt: '2026-07-01',
          downloadUrl: 'https://open-vsx.org/api/esbenp/prettier-vscode/10.1.0/file/esbenp.prettier-vscode-10.1.0.vsix',
          readmeMarkdown: '# Prettier Code Formatter\n\nAuto-format code files on save.',
          changelogMarkdown: '### v10.1.0\n- Format on save enhancements',
          screenshots: [],
          permissions: ['workspace:format'],
          dependencies: {},
        }
      ];
    }
  }
}
