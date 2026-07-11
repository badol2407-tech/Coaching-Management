---
name: Vercel monorepo deploy CLI, and screenshotting apps with intro splash/popups
description: Two reusable gotchas — vercel CLI binary vs npx, and how to screenshot a page that always shows a timed splash screen or session-gated popup on load.
---

## Vercel CLI not on PATH
`vercel` may not be installed globally even after earlier setup. Use `npx --yes vercel@latest ...` instead of assuming the bare `vercel` binary is present — avoids a failed deploy step for a trivial reason.

## Screenshotting a page that always shows a splash/popup on load
The Screenshot tool does a fresh page load every call — it cannot "wait out" a timed intro (e.g. a 3-4s branded splash animation) or dismiss a session-gated popup, because there's no way to inject wait time or interact between load and capture.
**Why:** repeatedly re-screenshotting just re-triggers the same intro state; the capture always lands mid-animation or behind the popup overlay.
**How to apply:** temporarily force the gating state off in code (e.g. flip the initial `useState` for "splash done" to `true`, or wrap a popup render in `{false && <Popup/>}`), take the screenshot(s), then revert both edits before committing. Do this deliberately as a paired edit/revert, not left in place.
