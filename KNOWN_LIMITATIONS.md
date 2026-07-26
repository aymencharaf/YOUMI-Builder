# Known Limitations & Workspace Trade-offs - YOUMI Builder RC1

This document details the architectural boundaries, security policies, and known visual trade-offs within the sandboxed web visual IDE of **YOUMI Builder RC1**.

---

## 1. Browser Sandbox & Storage Limits
- **LocalStorage Storage Eviction**: Global states are stored inside standard browser `localStorage` as an active restore cache. Clearing browser history, using incognito modes, or cache evictions can reset local progress.
  - **Workaround**: Regularly use the "Export JSON" tool on the top toolbar to download physical backups of your configuration (`youmi-project-config.json`) to your local machine.
- **Iframe Sandboxing**: External link interactions (such as WhatsApp redirects or external product tracking hooks) within the interactive simulator are constrained by standard browser iframe sandboxing policies.
  - **Workaround**: These constraints are visual-only. All links function natively inside the exported React and Next.js projects.

## 2. Dynamic Asset Upload Constraints
- **Base64 Active Memory Limits**: High-resolution image files uploaded using the Drag & Drop area are converted into Base64 data strings. Multiple high-resolution images (>10MB each) can slow down browser tab performance or exceed local storage capacities (typically limited by browsers to 5MB - 10MB).
  - **Workaround**: Use compressed web formats (WEBP, PNG, JPG) under 1MB each, or link remote CDN URLs using the "Inject Custom Link" input field.

## 3. CSS Transform Scaling Whitespace
- **Transform Scale Alignments**: Applying multiscale zoom scales (50%, 75%, 125%) to the Live Preview Simulator utilizes native CSS `transform: scale()`. Scale calculations might produce empty whitespace gaps at the bottom of the scroll frame.
  - **Workaround**: This is an artifact of the visual simulation layout; the actual compiled and exported React and Next.js applications have fluid, natural layouts on all screen resolutions.

## 4. SSR Styling Hydration
- **Tailwind Version Requirements**: Next.js App Router exports compile layouts using modern Tailwind CSS directives. Local environments compiling under Node.js versions below v18 may require upgrading to Node.js v20+ or utilizing custom postcss layers.
  - **Workaround**: Ensure Node.js v20.x or higher is installed inside your local developer workspace.

---
*If you encounter any unexpected behaviors, please export your project backup configuration via "Export JSON" and refresh your browser tab.*
