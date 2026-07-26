# YOUMI Builder RC1 - Enterprise Workspace Architecture Blueprint

This document details the high-level architecture, module interaction models, state synchronization, security principles, and client-side compilation systems of the **YOUMI Builder** visual integrated development environment (IDE).

---

## 🎨 System Design Philosophy

YOUMI Builder is engineered as an **offline-first, client-driven visual integrated development environment (IDE)**. By avoiding unnecessary external network overhead, the builder provides instant user interactions. The application layers are cleanly divided into:
- **Models & Schemas**
- **Symmetric State Engine**
- **Visual Editing Modules (PACKs)**
- **Interactive Device Simulation**
- **Multi-Framework Code Compilers**

```
┌────────────────────────────────────────────────────────┐
│                      Global Toolbar                    │
│      Undo/Redo | Save/Open JSON | Languages | Views     │
└──────────────────────────┬─────────────────────────────┘
                           │ Dispatches actions
                           ▼
┌────────────────────────────────────────────────────────┐
│                     App State Hub                      │
│        ProjectConfig (siteInfo, colors, sections)       │
└──────┬───────────────────┬───────────────────┬─────────┘
       │ Reads/Writes      │ Distributes State │ Distributes State
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Pack Panels │    │ Live Preview │    │  Workspace   │
│ (10 Editors) │    │  Simulator   │    │  Right Tabs  │
└──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │ Initiates zip packaging
                           ▼
┌────────────────────────────────────────────────────────┐
│                JSZip Compiler Engine                   │
│          Exports React SPA & Next.js App               │
└────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architectural Core Layers

### 1. Schema & Models Layer (`src/types.ts`)
This layer defines the contract of the visual workspace. By declaring every configuration schema using strict TypeScript Interfaces and Enums, we eliminate runtime reference errors. It also houses default starting states so the workspace starts populated with rich, realistic content.

### 2. State & History Management Layer (`src/App.tsx`)
Acts as the central source of truth:
- **Local Cache Sync**: Reactively mirrors state changes to browser `localStorage` under `youmi_project_config`.
- **Symmetric History Store**: Leverages immutable state updates to record preceding configurations inside a shallow history queue, enabling instant Undo/Redo cycles.
- **Unified Action Dispatchers**: Clean updater functions (e.g. `updateSiteInfo`, `updateHeader`, `togglePackSelection`) that guarantee predictable transitions.

### 3. Visual Interface Layer
- **Pack Editors Panel (Left)**: Switched viewports dynamically focusing on active PACKs.
- **Live Preview Stage (Center)**: Renders a simulated CSS viewport supporting multi-resolution responsive simulations (desktop, tablet, mobile), zoom transformations (`transform: scale()`), and section interactive bindings.
- **Dynamic Layers & Inspector Panel (Right)**: Divided into lightweight sub-tab views to bypass sidebar clutter. Users can order, toggle, or inspect global properties.
- **Asset Manager**: Converts local file objects to Base64 data strings using `FileReader` API, allowing real-time injection without remote database assets.

### 4. Client-side Packaging Engine (`src/utils/projectGenerator.ts`)
- Leverages the `JSZip` library to compile complete production-ready folder trees inside browser memory.
- Pre-seeds optimized standard configurations:
  - **React SPA**: Sets up clean Vite bundling, Tailwind CSS entry points, and responsive layouts.
  - **Next.js App Router**: Creates ready-to-run Next.js 15 pages with hydration boundaries, SSR configurations, and metadata blocks.

---

## 🔒 Security Architecture & CSP
- **No Direct Remote Evaluations**: To ensure seamless compliance inside **Electron desktop wrappers** or container frames, YOUMI Builder avoids dynamic code execution (`eval` or `Function()`).
- **Sanitized Asset Processing**: Imported configurations are validated at parsing-time inside try/catch wrappers to protect against XSS injections.
- **Base64 Sanitization**: User uploaded files are strictly limited to valid image MIME-types during processing.

---
*Architected for speed and durability. YOUMI Builder is certified Production Ready.*
