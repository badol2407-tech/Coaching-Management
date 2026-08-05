---
name: Hero chart motion
description: Motion and readability rules for the Flowora-inspired landing-page data widgets
---

Hero data widgets should use layered motion: draw attendance and radar paths progressively, reveal their points after the line finishes, and rotate only the fee sunburst while keeping its external Bengali labels readable.

**Why:** Motion adds the desired premium feel, but rotating text-heavy labels makes the mini-windows difficult to scan and undermines the transparent-glass reference style.

**How to apply:** Keep label groups outside rotating SVG groups, make the wheel rotation slow and continuous, sequence graph line/area/point reveals, use a short navigator vibration on touch for all four cards, and disable all motion/haptics-safe visual effects under reduced motion where applicable.