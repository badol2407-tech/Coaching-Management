---
name: Redesigning shared UI primitives safely
description: How to restyle a shared component (e.g. Button) used across many pages without breaking call sites.
---

When redesigning a shared primitive (e.g. a shadcn-style `Button` with a `cva` variant/size API) that's used throughout an existing app:

- Preserve the exact variant and size names (`default`/`destructive`/`outline`/`secondary`/`ghost`/`link`, `default`/`sm`/`lg`/`icon`, etc.) so every existing call site keeps compiling and keeps its intended semantic meaning. Only change the underlying Tailwind classes per variant.
- Prefer building the new look from the project's existing CSS custom properties/theme tokens (e.g. `--primary-border`, `--secondary-border`) rather than hardcoded colors, so the component still respects the app's light/dark theming automatically.
- `cn()` built on `twMerge` means later classes in an inline `className` prop correctly override same-property base classes from `cva`. This means call sites that pass explicit overrides (e.g. a button rendered on a dark hero section overriding `border`/`text` colors) will still work — but you must check they also override `background`, since a new default background (e.g. `bg-background/60`) added to a variant can silently show through as an unwanted light overlay on dark sections if the call site's override didn't anticipate it. Grep all usages of the variant after redesign and check dark-background call sites specifically.
