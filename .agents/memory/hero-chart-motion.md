---
name: Hero chart motion
description: Motion and readability rules for the Flowora-inspired landing-page data widgets
---

Hero data widgets should use layered motion: keep attendance peak points visible while the line grows, draw the radar path progressively with a counterclockwise vertex orbit/glint, and rotate only the fee sunburst while keeping its external Bengali labels readable.

**Why:** Motion adds the desired premium feel, but rotating text-heavy labels makes the mini-windows difficult to scan and undermines the transparent-glass reference style.

**How to apply:** Keep label groups outside rotating SVG groups, make the wheel rotation slow and continuous, keep attendance dots present from the first frame, use a short navigator vibration on touch for all four cards, and disable chart/orbit/entrance motion under reduced motion.

The four hero windows should stay hidden below the stage until the first-session promotion is dismissed, then enter together from below, rotate anticlockwise briefly, and settle into their existing floating positions. Store the completion in session storage so refreshes do not replay it.

**Why:** The landing hero needs one intentional reveal tied to the promotion interaction without making repeat visits feel like an onboarding loop.

**How to apply:** Let the promotion component notify the landing page exactly once on dismiss, start the shared entrance phase from React state, and treat either the promotion session marker or the entrance marker as proof that repeat sessions can start settled.