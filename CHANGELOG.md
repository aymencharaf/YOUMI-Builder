# YOUMI Builder Changelog

All notable changes and milestones for the **YOUMI Builder** workspace environment are documented here.

---

## [v2.6.0] - 2026-07-16

### Added
- **Integrated Workspace Panels**: Divided Column 3 into three highly focused tabs: **Packs**, **Layers**, and **Property Inspector** for faster catalog configuration and color modifications.
- **Physical Save & Open System**: Empowered users to backup their full project configs as a structured JSON file and load them instantly to restore their work.
- **HTML5 Drag-and-Drop Uploader**: Upgraded the local `AssetManager` with direct file Drag & Drop zones and local file selector integrations that convert images to Base64 in state.
- **Multi-Device Live Preview**: Implemented an interactive viewport simulator (Desktop, Tablet, Mobile) with real-time style inheritance and dynamic workspace zooming (50% to 125%).
- **Interactive Focus-Edit Bounds**: Integrated responsive visual overlays on the simulator so clicking any section immediately focuses the corresponding configuration panel.
- **Full History Undo & Redo Stack**: Installed a full rollback history tracking system with dedicated keyboard bindings (`Ctrl + Z` / `Ctrl + Y`) and main workspace buttons.
- **Next.js App Router Support**: Built an automated directory bundler inside `src/utils/projectGenerator.ts` to export fully ready SSR Next.js structures with hydration boundaries and Tailwind configuration.

### Fixed
- **Widget Escape Overlaps**: Resolved a floating preview overlapping bug by changing the WhatsApp floating chat widget from fixed to absolute container positioning, keeping visual elements neatly enclosed.
- **Strict Quality Compliance**: Certified the workspace with zero TypeScript compile warnings and verified absolute layout compatibility under production build scripts.

---

## [v2.5.0] - 2026-07-16

### Added
- **Physical Save & Open System**: Completed professional file-based project management. Added "Export JSON" and "Import JSON" actions directly onto the main workspace toolbar. Users can now download their complete configured state as a structured `youmi-project-config.json` file and reload it into the builder at any time, allowing seamless backup, sharing, and off-line workspace restoration.
- **Enterprise Product & Catalog Synchronization**: Audited the custom `CategoriesEditor` and verified absolute real-time state synchronization. Ensured catalog product additions, custom rating sliders, price formats, and status toggles update instantly across both the live preview simulator and exported React structures.

### Fixed
- **Clean Dev Builds**: Ran comprehensive compiler verification ensuring zero TypeScript compile warnings and zero placeholder-related errors across all 10 active YOUMI commerce builder PACK editors.

---

## [v2.4.0] - 2026-07-16

### Added
- **Full-Stack YOUMI AI Co-Pilot**: Replaced mock layouts with direct, live streaming generation from our Node.js server via our secure AI connector on the `/api/ai/generate` API endpoint.
- **Dynamic Multi-file Code Generation & ZIP Packager**: Refactored the template compiler inside `src/utils/projectGenerator.ts` to build and output high-fidelity, standalone, complete React + Vite + Tailwind CSS structures. This includes `App.tsx`, `index.html`, `vite.config.ts`, `package.json`, asset folders, and custom CSS setups, which package directly as a downloadable ZIP.
- **Extended Modular Pack System**: Expanded the active PACK selectors to support more than 100 modular packages (102 granular commerce adapters, tracking pixels, local shipping integrations, and security systems).
- **Interactive Multi-Device Live Preview**: Embedded a responsive layout simulator enabling developers to scale, zoom (50% to 125%), and toggle viewport containers (Desktop, Tablet, Mobile) with real-time style inheritance.
- **Pixel & Code Injection Systems**: Integrated custom configuration fields for Yalidine Track, Facebook Pixels, and WhatsApp Chat floating anchors.

### Fixed
- **Type Safety & Prop Matching**: Resolved TypeScript compiler and layout prop mismatches on `LayoutArranger`, `PackMarketplace`, and `PluginSystem` components in `src/App.tsx`.
- **Dynamic Asset Loader**: Prevented broken layout states in the live preview when applying custom images and lucide icon names from the local `AssetManager`.

---
*Created for YOUMI Workspace by ar.sarl.usine@gmail.com.*