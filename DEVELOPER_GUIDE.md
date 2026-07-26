# YOUMI Builder RC1 - Enterprise Developer & Engineering Guide

This guide is designed for software architects, systems engineers, full-stack developers, and DevOps specialists maintaining or extending **YOUMI Builder**. It provides a comprehensive analysis of the tech stack, directory layouts, data-flow models, state machines, layout compilers, and local container/desktop compilation flows.

---

## 📖 Table of Contents
1. [Enterprise Stack & System Prerequisites](#1-enterprise-stack--system-prerequisites)
2. [Unified Directory Topology](#2-unified-directory-topology)
3. [Centralized State Machine & Undo/Redo Queue](#3-centralized-state-machine--undoredo-queue)
4. [Creating Custom PACK Components & Editors](#4-creating-custom-pack-components--editors)
5. [The Live Simulation Engine & Click-to-Focus](#5-the-live-simulation-engine--click-to-focus)
6. [Client-Side ZIP Compiler Architectures](#6-client-side-zip-compiler-architectures)
7. [Electron Security & Desktop Integration Best Practices](#7-electron-security--desktop-integration-best-practices)
8. [DevOps Pipelines, Quality Gates, & Build Testing](#8-devops-pipelines-quality-gates--build-testing)

---

## 1. Enterprise Stack & System Prerequisites

- **Frontend Core**: React 19 / TypeScript 5.8 / Vite 6.
- **Styling Architecture**: Tailwind CSS (Tailwind v4 CSS variables compilation).
- **Icons Engine**: Lucide React.
- **Archive Bundling**: JSZip v3.
- **Server Utility**: Express (for local container assets / proxy handlers).
- **Language Compiler**: TypeScript Compiler (`tsc --noEmit`), esbuild (CJS bundles compile).
- **Environment Support**: Compatible with Node.js v18.x up to v22.x.

---

## 2. Unified Directory Topology

The project structure is organized for maximum scalability and decoupling:

```
├── .env.example                # Blueprint for system environment keys
├── package.json                # Project script registry & dependency tree
├── server.ts                   # Custom Express server with Vite middleware integration
├── src/
│   ├── App.tsx                 # Main application state hub & toolbar layout
│   ├── types.ts                # Strict TypeScript types & schemas
│   ├── index.css               # Tailwind CSS theme declarations & base imports
│   ├── main.tsx                # Client application bootloader entrypoint
│   ├── components/             # Reusable UI component workspace
│   │   ├── AIBuilder.tsx       # AI prompt agent with server-side proxy
│   │   ├── AssetManager.tsx    # Drag-and-drop file uploader & icon search
│   │   ├── CodeViewer.tsx      # VS-Code style JSON & layout viewer
│   │   ├── LayoutArranger.tsx  # Fallback section visual grid manager
│   │   ├── LivePreview.tsx     # Device viewport simulator canvas
│   │   ├── PackMarketplace.tsx # Plugin registry & marketplace simulation
│   │   ├── PluginSystem.tsx    # Custom JS injector and analytics platform
│   │   ├── TemplateLibrary.tsx # Direct layout preset templates registry
│   │   └── packs/              # Granular visual layout config editors
│   │       ├── SiteInfoEditor.tsx
│   │       ├── ColorsEditor.tsx
│   │       ├── FontsEditor.tsx
│   │       ├── ButtonsEditor.tsx
│   │       ├── HeaderEditor.tsx
│   │       ├── MenuEditor.tsx
│   │       ├── HeroEditor.tsx
│   │       ├── CategoriesEditor.tsx
│   │       ├── FooterEditor.tsx
│   │       └── ExportView.tsx
│   └── utils/
│       └── projectGenerator.ts # JSZip compiler engine (Vite & Next.js compiler)
```

---

## 3. Centralized State Machine & Undo/Redo Queue

State is centralized in `/src/App.tsx` inside a core React State Hook (`config`).

```typescript
// Unified Project Config schema
export interface ProjectConfig {
  siteInfo: SiteInfo;
  colors: ColorsConfig;
  fonts: FontsConfig;
  buttons: ButtonsConfig;
  header: HeaderConfig;
  menu: MenuConfig;
  hero: HeroConfig;
  categories: CategoriesConfig;
  footer: FooterConfig;
  sectionOrder: string[];
}
```

### Symmetric History Tracker
To support immediate visual rollback capabilities, we maintain double historical stack queues:
- `history`: Array containing the last 50 states of `ProjectConfig`.
- `redoStack`: Array containing cancelled forward states.

Whenever an editor commits a change, we check for visual differences. If the configuration has evolved:
1. Push the previous state into `history`.
2. Limit `history` length to 50 items to optimize active browser memory.
3. Update `config` state.
4. Clear `redoStack`.
5. Write the configuration to browser `localStorage` as an active restore point.

---

## 4. Creating Custom PACK Components & Editors

To extend YOUMI Builder with a custom module (e.g., "PACK-011: Client Testimonials"):
1. **Define Schema**: In `/src/types.ts`, declare the visual interface structures for `TestimonialsConfig`.
2. **Set Defaults**: Register the default layout options under `YOUMI_ARABIC_TEMPLATE` inside `types.ts`.
3. **Build Editor**: Create `/src/components/packs/TestimonialsEditor.tsx` using Tailwind styles and Lucide Icons.
4. **Mount Component**: Import your editor and place it in the Left Menu Switch-Case inside `/src/App.tsx`.
5. **Connect Core Hooks**: Pipe `config.testimonials` and `onChange` hooks to link changes directly to the simulator.

---

## 5. The Live Simulation Engine & Click-to-Focus

The central simulator (`/src/components/LivePreview.tsx`) translates the active configuration into standard Tailwind-styled visual nodes inside an interactive sandbox.

To support seamless visual focus:
- Wrap each layout component with a relative-positioned overlay.
- Hook an `onClick` event to dispatch a `'set_active_panel'` action:
  ```tsx
  <div 
    onClick={() => onFocusPack('hero')} 
    className="relative group hover:ring-2 hover:ring-teal-500 transition cursor-pointer"
  >
    {/* Real component cards and titles */}
    <span className="hidden group-hover:inline-block absolute top-2 right-2 text-white bg-teal-600 text-[10px] py-1 px-2 rounded shadow">
      Edit Hero Section
    </span>
  </div>
  ```

---

## 6. Client-Side ZIP Compiler Architectures

The build compilation pipeline (`/src/utils/projectGenerator.ts`) uses **JSZip** to generate structured project archives instantly inside browser memory.

### React SPA Template Engine
- Bundles complete standalone HTML structures with integrated stylesheets.
- Generates configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`, `.env.example`).
- Compiles modular React components corresponding to your active visual configurations.

### Next.js App Router Engine
- Scaffolds a complete Next.js 15 project structure.
- Builds app layouts (`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`).
- Implements hydration safety and modern metadata routing, and structures code block components cleanly inside modular source folders.

---

## 7. Electron Security & Desktop Integration Best Practices

To package YOUMI Builder as a secure desktop application with Electron, enforce these production gates:

1. **Enable Web Sandbox Protocols**: Disable Direct Node process access in renderer frames. Keep `contextIsolation: true` and `nodeIntegration: false`.
2. **Establish Safe IPC Bridge**: Expose system functions (such as file exporting or saving) via a designated `preload.js` script using `contextBridge.exposeInMainWorld`.
3. **Block Unwanted Redirects**: Block internal links or advertisements from navigating away from the workspace. Always listen to `will-navigate` inside Electron's main process and spawn external links in default external system browsers instead.
4. **Strict CSP headers**: Define content security policies (CSP) inside `index.html` to prevent inline scripts from executing unauthorized API calls.

---

## 8. DevOps Pipelines, Quality Gates, & Build Testing

Before certifying any build as an official Release Candidate (RC):
- **Syntactic Lint Checks**: Run `npm run lint` (`tsc --noEmit`) to verify zero TypeScript compilation warnings or syntax errors.
- **Production Build Simulation**: Run `npm run build` to verify standard esbuild and Vite bundle optimization success.
- **Local Sandbox Execution**: Keep port `3000` clear to run the Express dev server and test real-time asset injections.

---
*YOUMI Builder v2.6.0-RC1. Certified Production Ready.*
