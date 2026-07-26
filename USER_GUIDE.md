# YOUMI Builder RC1 - Enterprise Visual Application Builder

Welcome to **YOUMI Builder RC1**, the professional enterprise-grade visual application builder engineered to construct modern, high-performance, responsive web, mobile-web, and desktop applications.

YOUMI Builder allows developers, designers, and agencies to accelerate development from visual concept to production-ready deployments. Through modular, reusable **PACK Modules**, custom layout tools, a fully integrated **Asset Manager**, multi-device responsive simulation, and advanced code exporters (React, Next.js, and Electron-ready configs), you can build complex systems in a fraction of the time.

---

## 📖 Table of Contents
1. [Platform Overview & Philosophy](#1-platform-overview--philosophy)
2. [Supported Application Templates & Archetypes](#2-supported-application-templates--archetypes)
3. [The Workspace Interface](#3-the-workspace-interface)
4. [Enterprise-Grade Features](#4-enterprise-grade-features)
   - [Drag & Drop Asset Uploader](#drag--drop-asset-uploader)
   - [Device-Viewport Simulator & Click-to-Focus](#device-viewport-simulator--click-to-focus)
   - [Layers & Visual ordering Panel](#layers--visual-ordering-panel)
   - [Unified Property Inspector](#unified-property-inspector)
5. [The Modular PACK System](#5-the-modular-pack-system)
6. [Multi-Framework Project Generation](#6-multi-framework-project-generation)
   - [React + Vite SPA Export](#react--vite-spa-export)
   - [Next.js App Router (SSR) Export](#nextjs-app-router-ssr-export)
7. [Progress Recovery, Backups & Shortcuts](#7-progress-recovery-backups--shortcuts)
8. [Local Booting & Launch Instructions](#8-local-booting--launch-instructions)

---

## 1. Platform Overview & Philosophy

YOUMI Builder is built upon the core philosophy of **"No Limits, Zero Clutter."** Rather than restricting builders to a single country, language, industry, or business model, YOUMI is a generic, enterprise-ready visual playground. It excels at rapid prototyping and production code-scaffolding with native support for:
- **Multilingual localization** (RTL/LTR toggles, Multi-language label inputs).
- **Global currencies & layout parameters**.
- **Clean Tailwind CSS styling outputs**.

---

## 2. Supported Application Templates & Archetypes

YOUMI Builder ships with robust layout structures, templates, and customizable modules targeting several commercial application categories:
- **E-Commerce & Multi-Vendor Marketplaces**: Multi-category, product grids, search parameters, shopping carts, and checkouts.
- **SaaS Platforms**: Subscription matrices, hero copy boards, call-to-actions, and interactive widgets.
- **Admin Dashboards & Portals**: Stat grids, section views, category indexes, and list managers.
- **Business Websites & Portals**: Profile headers, service modules, social proofs, contact parameters, and footer blocks.
- **Landing Pages & Blogs**: Single-view high-impact copy, newsletter call-outs, media integrations, and content feeds.
- **CRM / ERP & Custom Web Applications**: Fully extensible form layouts, navigation controls, and API hook mappings.

---

## 3. The Workspace Interface

The visual IDE is balanced into a three-pane high-efficiency grid:
1. **Left Panel (Pack Configurator)**: Dynamic contextual menus for visual configuration. From header banners and sliders to catalog collections and button themes, changes here synchronize reactively.
2. **Center Stage (Interactive Simulator)**: Represents the layout output. You can switch viewports, change visual zoom levels, and inspect spacing live.
3. **Right Panel (Unified Inspector Hub)**: Contains:
   - **Packs Checklist**: Toggle component inclusion in active bundles.
   - **Layers Manager**: Interactive visual layout re-ordering (`Move Up / Move Down`) and toggle visual bounds.
   - **Property Inspector**: Global properties like site branding names, themes, contact information, and default currencies.

---

## 4. Enterprise-Grade Features

### Drag & Drop Asset Uploader
Fully integrated in the **Asset Manager** toolbar and media inputs:
- Drag-and-drop local PNG, JPG, WEBP, or SVG files directly onto the dropzone. Files are converted into compressed Base64 strings immediately.
- Browse local directories using a standard native file selection window.
- Dynamically inject remote URL anchors.
- Search and insert high-contrast icons instantly from the complete Lucide Library.

### Device-Viewport Simulator & Click-to-Focus
- Simulate realistic layouts on **Desktop**, **Tablet**, and **Mobile** screen scopes.
- Scale workspace zooming (from 50% up to 125%) to inspect complex alignments without scroll constraints.
- Hover over any component inside the live simulator to reveal an editable boundary. Click it to automatically focus the left configuration panel to that block's settings.

### Layers & Visual Ordering Panel
Accessible on the Right Sidebar under the **الأقسام / Layers** tab:
- Move individual page sections up or down instantly.
- Toggle visibility of elements on the fly. Invisible elements are pruned during code export.

### Unified Property Inspector
Accessible on the Right Sidebar under the **المفتش / Inspector** tab:
- Modify store credentials, system colors, currencies, phone mappings, and address configurations at a global level.

---

## 5. The Modular PACK System

Visual scaffolding is split into 10 highly optimized, responsive **PACK Modules**:
- **PACK-001 (Site Info)**: General metadata, SEO titles, email, and currency identifiers.
- **PACK-002 (Colors & Themes)**: Complete brand palette customization.
- **PACK-003 (Fonts & Typography)**: Configures typography pairs (e.g. Cairo, Amiri, Inter, JetBrains Mono) for display texts and body copy.
- **PACK-004 (Action Buttons)**: Button radius (rounded-full, rounded-md, flat-square) and visual shadow depth settings.
- **PACK-005 (Header)**: Sliding top banners, text alignments, search bar configurations, and action indicators.
- **PACK-006 (Mega Menu & Navs)**: Custom links, highlighted product tags, and dynamic badges.
- **PACK-007 (Hero Slider)**: Parallax visual slides, title overlays, subtext fields, and call-to-action anchors.
- **PACK-008 (Categories Directory)**: Curated collection grid cells with customizable thumbnail coverage.
- **PACK-009 (Products Inventory)**: Inventory management. Setup product names, pricing tags, discounts, catalog associations, and item details.
- **PACK-010 (Footer)**: Multi-column link sections, copyright notes, and social handles.

---

## 6. Multi-Framework Project Generation

Clicking **Export** compiles full, standalone codebase archives instantly inside browser memory via `JSZip`.

### React + Vite SPA Export
- Delivers a complete, high-performance, client-side Single Page Application.
- Fully configured with standard dependency manifests, layout assets, responsive grids, and clean component definitions.
- Ideal for super-fast delivery on static web hosting platforms (GitHub Pages, Netlify, Cloudflare Pages, S3).

### Next.js App Router (SSR) Export
- Delivers a production-ready Next.js 15 SSR-enabled architecture.
- Full folder structure including layout configurations, theme definitions, dynamic client component boundaries, and hydration utilities.
- Ideal for enterprise projects requiring SEO optimization, server-side data fetching, and deployment to Vercel or cloud container instances.

---

## 7. Progress Recovery, Backups & Shortcuts

All development states are auto-saved locally inside the browser's `localStorage` to avoid data loss.

### Power Keyboard Shortcuts:
* **Undo Last Step**: `Ctrl + Z` (or `Cmd + Z` on Mac)
* **Redo Next Step**: `Ctrl + Y` (or `Cmd + Shift + Z` on Mac)
* **Save State manually**: `Ctrl + S` (or `Cmd + S` on Mac)
* **Export Project JSON**: `Ctrl + E` (or `Cmd + E` on Mac)

---

## 8. Local Booting & Launch Instructions

To spin up your exported code bundles:
1. Extract the compiled `.zip` file.
2. In your terminal of choice, run:
   ```bash
   npm install
   ```
3. Start the local server:
   ```bash
   npm run dev
   ```
4. Access your application at `http://localhost:3000`.

---
*YOUMI Builder v2.6.0-RC1. Certified Production Ready.*
