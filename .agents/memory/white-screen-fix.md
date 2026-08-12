---
name: White screen root causes and fixes
description: What caused the Vercel white screen and how each was fixed
---

# White Screen Root Causes (Vercel)

## ✅ ROOT CAUSE (definitive — confirmed by curl inspection)

### `scripts/deploy-vercel.mjs` — catch-all route intercepted JS/CSS assets

**Problem:** The `routes` array in the deployment body was:
```js
routes: [{ src: "/(.*)", dest: "/index.html" }]
```
This matched **every** request — including `/assets/index-*.js` and `/assets/index-*.css` — and returned the HTML page body with `content-type: text/html`. Browsers received HTML when expecting JavaScript, so the JS bundle never executed → white screen.

**Confirmed:** `curl -sI https://coaching-management-three.vercel.app/assets/index-CmhCVFcF.js` returned `content-type: text/html` before the fix, and `content-type: application/javascript` after.

**Fix:** Added `{ handle: "filesystem" }` before the catch-all:
```js
routes: [
  { handle: "filesystem" },  // serve real files first
  { src: "/(.*)", dest: "/index.html" },  // SPA fallback for unknown paths
]
```

---

## Secondary fixes (also applied — prevent future issues)

### 1. `vite.config.ts` — static import of Replit-specific plugin
**Problem:** `import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal'` was a static top-level import. Ran unconditionally even in production builds.
**Fix:** Changed all three Replit plugins to dynamic imports behind `isProduction` check.

### 2. `App.tsx` — literal text `null` rendered as JSX text node (historical)
**Fix:** Removed the text node and the `inert` div.

### 3. `vite.config.ts` — throws if PORT or BASE_PATH env vars are missing (historical)
**Fix:** Replaced throws with `?? '3000'` and `?? '/'` defaults.

### 4. `firebase.ts` — no guard against re-initialisation on HMR (historical)
**Fix:** Used `getApps().length ? getApps()[0] : initializeApp(config)` pattern.

**Why the filesystem handle is the most important:** Without it, the SPA deploy
pattern on Vercel file-upload API completely breaks — every JS/CSS file is served
as HTML and the app never boots.
