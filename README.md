# YOUMI Builder — Visual Template Builder for Multi-Vendor Marketplaces

YOUMI Builder is a professional, high-fidelity visual template builder and customizer workspace engineered for multi-vendor marketplaces. Built with React 19, TypeScript, Vite, and Tailwind CSS, the application offers an interactive mockup preview, granular configuration editors, a live asset manager library, and a client-side project ZIP compiler.

---

## 🛠️ Modular PACK System Architecture

The builder uses a clean, package-based (PACK) architecture to customize separate modules of the marketplace:

- **PACK-001: Site Information** — Branding metadata, logo image URLs, contact endpoints, support hours, and tax rates.
- **PACK-002: Header** — Toggle notification banners, layout alignments (minimalist, centered, full width), and search input specifications.
- **PACK-003: Menu** — Header navigations item manager, complete with URL anchors, highlight stars, and floating deal badges.
- **PACK-004: Hero / Slider** — Homepage visual stage slider slides with headlines, buttons, and custom background images.
- **PACK-005: Categories & Products** — Sourcing and seeding custom category directories and vendor catalog items with pricing tags.
- **PACK-006: Footer** — Directory navigation links, social handle paths, and copyright blocks.
- **PACK-007: Colors & Themes** — Preset color templates (e.g. Carbon Noir, Cyber Turquoise, Forest Harvest) and hex code customizers.
- **PACK-008: Fonts & Typography** — Font family pairings (e.g., Space Grotesk, Playfair Display) and base size managers.
- **PACK-009: Action Buttons** — Physically styling corner shapes (Boxy, Soft, Pill), depths, shadows, and cursor micro-interactions.
- **PACK-010: Compile & Export** — Packaging active PACK selections, naming local folder repositories, and downloading production-ready static React/Tailwind codebundles in a `.zip` archive.

---

## 🚀 Key Features

1. **Preset Layout Libraries** — Seamlessly load pre-configured marketplace designs with one click, including *Boutique Fashion Hub*, *Tech & Hardware Outlet*, and *Organic Groceries Cooperative*.
2. **Interactive Live Preview** — View website layout changes instantaneously. Switch fluidly between **Desktop**, **Tablet**, and **Mobile** viewports.
3. **Physical Project Save & Open** — Save your progress to your browser cache, or export and import physical configuration `.json` files directly to move between environments or backup your projects.
4. **Dynamic JSON Config & Code Viewers** — Access raw structured configurations or review production-ready codeblocks (e.g., `App.tsx`, `config.json`, `README.md`) in a VSCode-themed editor environment.
5. **Central Media Asset Manager** — Select from curated placeholder resources or add custom image web anchors.
6. **No-build client ZIP compilation** — Integrated client-side packaging compiles static components and bundles them directly for immediate local extraction.

---

## 💻 Local Workspace Launching

Follow these steps to run the YOUMI Builder application on your own workspace:

1. Clone or extract the repository content.
2. Install all required package dependencies:
   ```bash
   npm install
   ```
3. Boot up the local development playground:
   ```bash
   npm run dev
   ```
4. Access the builder at `http://localhost:3000` inside your browser.

---

*Authored by ar.sarl.usine@gmail.com for YOUMI Workspace, July 2026.*
