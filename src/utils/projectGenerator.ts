import JSZip from 'jszip';
import { ProjectConfig } from '../types';

export async function generateProjectZip(projectName: string, config: ProjectConfig, includedPacks: string[]) {
  const zip = new JSZip();

  // 1. package.json
  const packageJson = {
    name: projectName,
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'lucide-react': '^0.468.0'
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      '@vitejs/plugin-react': '^4.3.4',
      typescript: '^5.6.3',
      vite: '^6.0.1',
      tailwindcss: '^4.0.0'
    }
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // 2. vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`;
  zip.file('vite.config.ts', viteConfig);

  // 3. index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.siteInfo.siteName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&family=Roboto:wght@400;500;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
  </head>
  <body style="background-color: ${config.colors.background}; color: ${config.colors.text}; font-family: 'Inter', sans-serif;">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  zip.file('index.html', indexHtml);

  // 4. README.md
  const readme = `# ${config.siteInfo.siteName} - YOUMI Generated Multi-Vendor Marketplace

This React marketplace application was visually designed and generated with **YOUMI Builder**.

## Live Customized Pack Configurations Included:
${includedPacks.map((pack) => `- **${pack.toUpperCase()}**`).join('\n')}

## Quick Start Guidelines
1. Ensure you have **Node.js (v18+)** installed.
2. Run command to install all dependency node modules:
   \`\`\`bash
   npm install
   \`\`\`
3. Launch development workspace playground:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open the displayed local development link in your browser.

## Project Structure
- \`src/App.tsx\` Main layout and dynamic components pipeline.
- \`config.json\` Raw custom pack configurations.
- \`src/index.css\` Custom global styles applying Tailwind and fonts variables.
`;
  zip.file('README.md', readme);

  // 5. Raw config.json
  zip.file('config.json', JSON.stringify(config, null, 2));

  // 6. Create src directory
  const src = zip.folder('src')!;

  // 7. src/main.tsx
  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`;
  src.file('main.tsx', mainTsx);

  // 8. src/index.css
  const indexCss = `@import "tailwindcss";

@theme {
  --color-brand-primary: ${config.colors.primary};
  --color-brand-secondary: ${config.colors.secondary};
  --color-brand-accent: ${config.colors.accent};
  
  --font-heading: "${config.fonts.headingFont}", serif;
  --font-body: "${config.fonts.bodyFont}", sans-serif;
}`;
  src.file('index.css', indexCss);

  // 9. src/types.ts (simplify or export)
  const typesTs = `export interface MenuItem {
  id: string;
  label: string;
  url: string;
  isFeatured: boolean;
  badgeText?: string;
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  badgeText?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  itemCount: number;
  isActive: boolean;
  icon: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  isFeatured: boolean;
  isNew?: boolean;
}
`;
  src.file('types.ts', typesTs);

  // 10. src/App.tsx
  const appTsx = `import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

const CONFIG = ${JSON.stringify(config, null, 2)};

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  // Resolve Custom Button style variables
  const buttonStyle = {
    backgroundColor: CONFIG.colors.primary,
    color: '#ffffff',
    borderRadius: CONFIG.buttons.borderRadius === 'none' ? '0px' : CONFIG.buttons.borderRadius === 'sm' ? '4px' : CONFIG.buttons.borderRadius === 'md' ? '8px' : CONFIG.buttons.borderRadius === 'lg' ? '16px' : '9999px',
    padding: CONFIG.buttons.buttonPadding === 'compact' ? '6px 14px' : CONFIG.buttons.buttonPadding === 'spacious' ? '12px 32px' : '8px 20px',
    fontFamily: CONFIG.fonts.bodyFont,
  };

  const textHeadingStyle = {
    fontFamily: CONFIG.fonts.headingFont,
  };

  const textBodyStyle = {
    fontFamily: CONFIG.fonts.bodyFont,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: CONFIG.colors.background, color: CONFIG.colors.text, ...textBodyStyle }}>
      
      {/* 1. NOTIFICATION BANNER */}
      {CONFIG.header.showNotificationBanner && (
        <div className="py-2 px-4 text-center text-xs font-semibold text-white transition-all" style={{ backgroundColor: CONFIG.colors.accent }}>
          <a href={CONFIG.header.notificationLink} className="hover:underline">{CONFIG.header.notificationText}</a>
        </div>
      )}

      {/* 2. HEADER HEADER */}
      <header className="border-b transition" style={{ backgroundColor: CONFIG.colors.headerBg, borderColor: CONFIG.colors.secondary + '20' }}>
        <div className={\`mx-auto px-4 py-4 flex items-center justify-between gap-4 \${CONFIG.header.layoutStyle === 'fullwidth' ? 'w-full' : 'max-w-7xl'}\`}>
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            {CONFIG.siteInfo.logoUrl && (
              <img src={CONFIG.siteInfo.logoUrl} alt={CONFIG.siteInfo.siteName} className="h-8 w-auto object-contain" />
            )}
            <span className="text-xl font-bold tracking-tight uppercase" style={{ ...textHeadingStyle, color: CONFIG.colors.primary }}>
              {CONFIG.siteInfo.siteName}
            </span>
          </div>

          {/* Search Box */}
          {CONFIG.header.showSearchBar && (
            <div className="hidden md:flex flex-1 max-w-md relative">
              <input 
                type="text" 
                placeholder={CONFIG.header.searchPlaceholder} 
                className="w-full pl-10 pr-4 py-1.5 rounded-full border text-xs focus:outline-none focus:ring-1"
                style={{ borderColor: CONFIG.colors.secondary + '40' }}
              />
              <Lucide.Search className="w-4 h-4 absolute left-3.5 top-2 text-slate-400" />
            </div>
          )}

          {/* Cart & Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2" onClick={() => setCartCount(c => c + 1)}>
              {CONFIG.header.cartIconStyle === 'bag' ? <Lucide.ShoppingBag className="w-5 h-5" /> : <Lucide.ShoppingCart className="w-5 h-5" />}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] text-white w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: CONFIG.colors.accent }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. MENU NAVIGATION */}
        <nav className="border-t border-b py-2.5" style={{ borderColor: CONFIG.colors.secondary + '10' }}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-xs font-semibold uppercase tracking-wider">
            {CONFIG.menu.items.map((item: any) => (
              <a key={item.id} href={item.url} className={\`hover:underline flex items-center gap-1.5 \${item.isFeatured ? 'font-bold' : ''}\`} style={{ color: item.isFeatured ? CONFIG.colors.accent : CONFIG.colors.text }}>
                <span>{item.label}</span>
                {item.badgeText && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded text-white font-bold" style={{ backgroundColor: CONFIG.colors.accent }}>
                    {item.badgeText}
                  </span>
                )}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* 4. HERO SLIDER */}
      {CONFIG.hero.slides.length > 0 && (
        <section className="relative overflow-hidden border-b" style={{ height: '420px', borderColor: CONFIG.colors.secondary + '20' }}>
          {CONFIG.hero.slides.map((slide: any, idx: number) => {
            if (idx !== 0) return null; // Static rendering on simple app for showcase
            return (
              <div key={slide.id} className="absolute inset-0 flex items-center">
                <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover brightness-50" />
                <div className="relative max-w-7xl mx-auto px-4 w-full z-10 text-white space-y-4">
                  {slide.badgeText && (
                    <span className="text-xs px-2.5 py-1 text-white uppercase tracking-widest font-bold bg-slate-900/80 rounded">
                      {slide.badgeText}
                    </span>
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl" style={textHeadingStyle}>
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-slate-200 max-w-xl">
                    {slide.subtitle}
                  </p>
                  <div>
                    <button style={buttonStyle}>
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* 5. CATEGORIES & PRODUCTS */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight" style={textHeadingStyle}>{CONFIG.categories.sectionTitle}</h2>
          <p className="text-xs text-slate-500" style={textBodyStyle}>{CONFIG.categories.sectionSubtitle}</p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CONFIG.categories.categories.filter((c: any) => c.isActive).map((cat: any) => (
            <div key={cat.id} className="relative rounded-lg overflow-hidden h-32 group cursor-pointer border shadow-sm">
              <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105 brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                <span className="font-bold text-xs uppercase tracking-wide">{cat.name}</span>
                <span className="text-[10px] text-slate-300">{cat.itemCount || 0} Products</span>
              </div>
            </div>
          ))}
        </div>

        {/* Products grid */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: CONFIG.colors.primary }}>Seeded Shop Items</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONFIG.categories.products.map((p: any) => (
              <div key={p.id} className="border rounded-lg overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition">
                <div className="relative h-48 bg-slate-50">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  {p.isNew && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold text-white px-2 py-0.5 rounded uppercase" style={{ backgroundColor: CONFIG.colors.accent }}>
                      New Vendor
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">{p.category}</span>
                    <h3 className="font-semibold text-xs text-slate-900 truncate">{p.name}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-900">\${p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs line-through text-slate-400 ml-1">\${p.originalPrice}</span>
                      )}
                    </div>
                    <button style={{ ...buttonStyle, padding: '4px 10px', fontSize: '11px' }} onClick={() => setCartCount(c => c + 1)}>
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 6. FOOTER */}
      <footer className="py-12 text-xs" style={{ backgroundColor: CONFIG.colors.footerBg, color: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b pb-8" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div>
            <span className="font-bold uppercase tracking-wider block mb-3 text-white" style={textHeadingStyle}>{CONFIG.siteInfo.siteName}</span>
            <p className="text-slate-400 leading-relaxed max-w-xs">{CONFIG.siteInfo.description}</p>
          </div>
          {CONFIG.footer.columns.map((col: any) => (
            <div key={col.id}>
              <span className="font-bold uppercase tracking-wider block mb-3 text-white" style={textHeadingStyle}>{col.title}</span>
              <ul className="space-y-1.5">
                {col.links.map((l: any, lIdx: number) => (
                  <li key={lIdx}>
                    <a href={l.url} className="text-slate-400 hover:text-white transition">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <span>{CONFIG.footer.copyrightText}</span>
          <span>Contact: {CONFIG.siteInfo.contactEmail} | {CONFIG.siteInfo.contactPhone}</span>
        </div>
      </footer>
    </div>
  );
}`;
  src.file('App.tsx', appTsx);

  // Generate and download zip
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName}-react-vite.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateNextjsProjectZip(projectName: string, config: ProjectConfig, includedPacks: string[]) {
  const zip = new JSZip();

  // 1. package.json for Next.js App Router
  const packageJson = {
    name: projectName,
    private: true,
    version: '1.0.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      next: '^15.1.0',
      'lucide-react': '^0.468.0'
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      typescript: '^5.6.3',
      tailwindcss: '^4.0.0',
      postcss: '^8.4.49'
    }
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // 2. next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;`;
  zip.file('next.config.js', nextConfig);

  // 3. postcss.config.js (or let Tailwind handle it if using CSS imports)
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
  },
};`;
  zip.file('postcss.config.js', postcssConfig);

  // 4. README.md
  const readme = `# ${config.siteInfo.siteName} - YOUMI Next.js App Router Template

This professional Next.js App Router application was visually engineered with **YOUMI Builder**.

## Live Customized Pack Configurations Included:
${includedPacks.map((pack) => `- **${pack.toUpperCase()}**`).join('\n')}

## Quick Start Guidelines
1. Ensure you have **Node.js (v18+)** installed.
2. Run command to install all dependency node modules:
   \`\`\`bash
   npm install
   \`\`\`
3. Launch development workspace playground:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open the displayed local development link (usually \`http://localhost:3000\`) in your browser.

## Next.js Project Structure
- \`src/app/page.tsx\` Main layout and dynamic components pipeline.
- \`src/app/layout.tsx\` Base Next.js HTML and font integrations.
- \`src/app/globals.css\` Global Tailwind configuration.
- \`config.json\` Raw custom pack configurations.
`;
  zip.file('README.md', readme);

  // 5. Raw config.json
  zip.file('config.json', JSON.stringify(config, null, 2));

  // 6. Create src/app directory
  const src = zip.folder('src')!;
  const app = src.folder('app')!;

  // 7. src/app/layout.tsx
  const nextLayout = `import React from 'react';
import './globals.css';

export const metadata = {
  title: '${config.siteInfo.siteName}',
  description: '${config.siteInfo.description || 'YOUMI Generated Multi-Vendor Marketplace'}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ backgroundColor: '${config.colors.background}', color: '${config.colors.text}' }}>
        {children}
      </body>
    </html>
  );
}`;
  app.file('layout.tsx', nextLayout);

  // 8. src/app/globals.css
  const indexCss = `@import "tailwindcss";

@theme {
  --color-brand-primary: ${config.colors.primary};
  --color-brand-secondary: ${config.colors.secondary};
  --color-brand-accent: ${config.colors.accent};
  
  --font-heading: "${config.fonts.headingFont}", serif;
  --font-body: "${config.fonts.bodyFont}", sans-serif;
}`;
  app.file('globals.css', indexCss);

  // 9. src/app/page.tsx
  const appTsx = `'use client';

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

const CONFIG = ${JSON.stringify(config, null, 2)};

export default function Page() {
  const [cartCount, setCartCount] = useState(0);

  // Resolve Custom Button style variables
  const buttonStyle = {
    backgroundColor: CONFIG.colors.primary,
    color: '#ffffff',
    borderRadius: CONFIG.buttons.borderRadius === 'none' ? '0px' : CONFIG.buttons.borderRadius === 'sm' ? '4px' : CONFIG.buttons.borderRadius === 'md' ? '8px' : CONFIG.buttons.borderRadius === 'lg' ? '16px' : '9999px',
    padding: CONFIG.buttons.buttonPadding === 'compact' ? '6px 14px' : CONFIG.buttons.buttonPadding === 'spacious' ? '12px 32px' : '8px 20px',
    fontFamily: CONFIG.fonts.bodyFont,
  };

  const textHeadingStyle = {
    fontFamily: CONFIG.fonts.headingFont,
  };

  const textBodyStyle = {
    fontFamily: CONFIG.fonts.bodyFont,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: CONFIG.colors.background, color: CONFIG.colors.text, ...textBodyStyle }}>
      
      {/* 1. NOTIFICATION BANNER */}
      {CONFIG.header.showNotificationBanner && (
        <div className="py-2 px-4 text-center text-xs font-semibold text-white transition-all" style={{ backgroundColor: CONFIG.colors.accent }}>
          <a href={CONFIG.header.notificationLink} className="hover:underline">{CONFIG.header.notificationText}</a>
        </div>
      )}

      {/* 2. HEADER HEADER */}
      <header className="border-b transition" style={{ backgroundColor: CONFIG.colors.headerBg, borderColor: CONFIG.colors.secondary + '20' }}>
        <div className={\`mx-auto px-4 py-4 flex items-center justify-between gap-4 \${CONFIG.header.layoutStyle === 'fullwidth' ? 'w-full' : 'max-w-7xl'}\`}>
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            {CONFIG.siteInfo.logoUrl && (
              <img src={CONFIG.siteInfo.logoUrl} alt={CONFIG.siteInfo.siteName} className="h-8 w-auto object-contain" />
            )}
            <span className="text-xl font-bold tracking-tight uppercase" style={{ ...textHeadingStyle, color: CONFIG.colors.primary }}>
              {CONFIG.siteInfo.siteName}
            </span>
          </div>

          {/* Search Box */}
          {CONFIG.header.showSearchBar && (
            <div className="hidden md:flex flex-1 max-w-md relative">
              <input 
                type="text" 
                placeholder={CONFIG.header.searchPlaceholder} 
                className="w-full pl-10 pr-4 py-1.5 rounded-full border text-xs focus:outline-none focus:ring-1"
                style={{ borderColor: CONFIG.colors.secondary + '40' }}
              />
              <Lucide.Search className="w-4 h-4 absolute left-3.5 top-2 text-slate-400" />
            </div>
          )}

          {/* Cart & Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2" onClick={() => setCartCount(c => c + 1)}>
              {CONFIG.header.cartIconStyle === 'bag' ? <Lucide.ShoppingBag className="w-5 h-5" /> : <Lucide.ShoppingCart className="w-5 h-5" />}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] text-white w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: CONFIG.colors.accent }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. MENU NAVIGATION */}
        <nav className="border-t border-b py-2.5" style={{ borderColor: CONFIG.colors.secondary + '10' }}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-xs font-semibold uppercase tracking-wider">
            {CONFIG.menu.items.map((item: any) => (
              <a key={item.id} href={item.url} className={\`hover:underline flex items-center gap-1.5 \${item.isFeatured ? 'font-bold' : ''}\`} style={{ color: item.isFeatured ? CONFIG.colors.accent : CONFIG.colors.text }}>
                <span>{item.label}</span>
                {item.badgeText && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded text-white font-bold" style={{ backgroundColor: CONFIG.colors.accent }}>
                    {item.badgeText}
                  </span>
                )}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* 4. HERO SLIDER */}
      {CONFIG.hero.slides.length > 0 && (
        <section className="relative overflow-hidden border-b" style={{ height: '420px', borderColor: CONFIG.colors.secondary + '20' }}>
          {CONFIG.hero.slides.map((slide: any, idx: number) => {
            if (idx !== 0) return null; // Static rendering on simple app for showcase
            return (
              <div key={slide.id} className="absolute inset-0 flex items-center">
                <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover brightness-50" />
                <div className="relative max-w-7xl mx-auto px-4 w-full z-10 text-white space-y-4">
                  {slide.badgeText && (
                    <span className="text-xs px-2.5 py-1 text-white uppercase tracking-widest font-bold bg-slate-900/80 rounded">
                      {slide.badgeText}
                    </span>
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl" style={textHeadingStyle}>
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-slate-200 max-w-xl">
                    {slide.subtitle}
                  </p>
                  <div>
                    <button style={buttonStyle}>
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* 5. CATEGORIES & PRODUCTS */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight" style={textHeadingStyle}>{CONFIG.categories.sectionTitle}</h2>
          <p className="text-xs text-slate-500" style={textBodyStyle}>{CONFIG.categories.sectionSubtitle}</p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CONFIG.categories.categories.filter((c: any) => c.isActive).map((cat: any) => (
            <div key={cat.id} className="relative rounded-lg overflow-hidden h-32 group cursor-pointer border shadow-sm">
              <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105 brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                <span className="font-bold text-xs uppercase tracking-wide">{cat.name}</span>
                <span className="text-[10px] text-slate-300">{cat.itemCount || 0} Products</span>
              </div>
            </div>
          ))}
        </div>

        {/* Products grid */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: CONFIG.colors.primary }}>Seeded Shop Items</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONFIG.categories.products.map((p: any) => (
              <div key={p.id} className="border rounded-lg overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition">
                <div className="relative h-48 bg-slate-50">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  {p.isNew && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold text-white px-2 py-0.5 rounded uppercase" style={{ backgroundColor: CONFIG.colors.accent }}>
                      New Vendor
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">{p.category}</span>
                    <h3 className="font-semibold text-xs text-slate-900 truncate">{p.name}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-900">\${p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs line-through text-slate-400 ml-1">\${p.originalPrice}</span>
                      )}
                    </div>
                    <button style={{ ...buttonStyle, padding: '4px 10px', fontSize: '11px' }} onClick={() => setCartCount(c => c + 1)}>
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 6. FOOTER */}
      <footer className="py-12 text-xs" style={{ backgroundColor: CONFIG.colors.footerBg, color: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b pb-8" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div>
            <span className="font-bold uppercase tracking-wider block mb-3 text-white" style={textHeadingStyle}>{CONFIG.siteInfo.siteName}</span>
            <p className="text-slate-400 leading-relaxed max-w-xs">{CONFIG.siteInfo.description}</p>
          </div>
          {CONFIG.footer.columns.map((col: any) => (
            <div key={col.id}>
              <span className="font-bold uppercase tracking-wider block mb-3 text-white" style={textHeadingStyle}>{col.title}</span>
              <ul className="space-y-1.5">
                {col.links.map((l: any, lIdx: number) => (
                  <li key={lIdx}>
                    <a href={l.url} className="text-slate-400 hover:text-white transition">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <span>{CONFIG.footer.copyrightText}</span>
          <span>Contact: {CONFIG.siteInfo.contactEmail} | {CONFIG.siteInfo.contactPhone}</span>
        </div>
      </footer>
    </div>
  );
}`;
  app.file('page.tsx', appTsx);

  // Generate and download zip
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName}-nextjs-app.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

