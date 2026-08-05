---
name: Hero chart motion
description: Motion and readability rules for the Flowora-inspired landing-page data widgets
---

Hero data widgets should use layered motion: draw attendance paths progressively, but rotate only the fee wheel while keeping its external Bengali labels and internal amounts legible in the resting composition.

**Why:** Motion adds the desired premium feel, but rotating text-heavy labels makes the mini-windows difficult to scan and undermines the transparent-glass reference style.

**How to apply:** Keep label groups outside rotating SVG groups, make the wheel rotation slow and continuous, sequence graph line/area/point reveals, and disable all of these animations under `prefers-reduced-motion: reduce`.