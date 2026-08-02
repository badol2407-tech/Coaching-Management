---
title: EduTrack Design Tokens
purpose: Define the canonical semantic token registry and token-only rules for the entire EduTrack product.
scope: Color, typography, spacing, radius, elevation, border, motion, icons, grid, breakpoints, opacity, z-index, and accessibility tokens.
audience: Product Design, Design Systems, Engineering, QA, Accessibility, and AI implementation contributors.
related_documents:
  - ./UI_MASTER_RULES.md
  - ./DESIGN_SYSTEM_GUIDE.md
  - ./COMPONENT_STANDARDS.md
  - ./COLOR_SYSTEM.md
  - ./TYPOGRAPHY_SYSTEM.md
  - ./SPACING_SYSTEM.md
  - ./LAYOUT_GRID.md
  - ./ELEVATION_SYSTEM.md
  - ./ICONOGRAPHY.md
  - ./MOTION_GUIDELINES.md
  - ./RESPONSIVE_SYSTEM.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./QUALITY_GATES.md
  - ./PRODUCT_GOVERNANCE.md
review_frequency: Quarterly and before any system-wide token change
owner: Product Design and Design Systems
version: 2.1.0
status: Canonical single source of truth for design tokens
last_updated: 2026-08-02
normative_level: Binding token standard
canonical_terms: design token, semantic token, primitive, alias, theme, mode, color, typography, spacing, radius, elevation, border, motion, icon, grid, breakpoint, opacity, z-index, lifecycle, versioning, mapping, accessibility
---

# EduTrack Design Tokens

This is the **single source of truth for all EduTrack design tokens**. It defines token names, canonical scales, semantic roles, mode mappings, and token governance. It does not define component implementation or behavior; those rules belong in [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md).

## 1. Scope and authority

| This document owns | This document does not own |
| --- | --- |
| Token names, values, aliases, modes, scales, and validation rules | Component structure, states, interaction behavior, or composition |
| Color, type, spacing, radius, elevation, border, icon, motion, responsive, grid, and accessibility tokens | Page or component-specific styling |
| Token lifecycle, deprecation, and migration rules | Product-level UI/UX precedence, which remains in [UI_MASTER_RULES.md](./UI_MASTER_RULES.md) |

Specialized foundation handbooks explain rationale and evidence for their domain. They must reference this registry and must not introduce competing token names or values. If a foundation handbook conflicts with this registry, this document owns the token decision and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) owns escalation.

## 2. Philosophy

1. **Single source of truth:** every visual value has one canonical token and one owner.
2. **Token-first architecture:** design and code select semantic tokens before layout or styling decisions are implemented.
3. **No hardcoded values:** product consumers never place raw color, spacing, type, radius, shadow, or animation values in page or component styles.
4. **Semantic naming only:** names describe purpose, role, or relationship—not hue, pixel value, component, or visual accident.
5. **Immutable primitives:** a token is a stable contract. Changing its value is a system-wide change; changing its meaning requires a new token and a migration path.
6. **Mode-safe meaning:** light and dark modes swap token values, not markup, components, or semantics.

## 3. Token architecture

The architecture is:

**Primitive Tokens → Semantic Tokens → Component Tokens**

| Layer | Definition | Rule in this document |
| --- | --- | --- |
| Primitive Tokens | Verified low-level values from the controlled source, such as existing CSS variables for theme channels, spacing base, radius base, and font families. | Reference verified primitives only. Do not invent or promote an unverified value. |
| Semantic Tokens | Stable product meanings such as `color-primary`, `color-surface`, `font-body`, and `space-4`. | Define and govern these tokens here. Consumers use semantic names. |
| Component Tokens | Out of scope for this registry. | No component token names, values, or implementation are defined here; use [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md). |

Primitive tokens are source material; semantic tokens are the product contract. A primitive may change between themes, but its semantic meaning must remain stable. A component must not bypass the semantic layer to consume an arbitrary primitive.

## 4. Allowed token categories

Only these shared token categories are allowed:

| Category | Namespace | Status |
| --- | --- | --- |
| Colors | `color-*` | Registered |
| Typography | `font-*` | Registered |
| Spacing | `space-*` | Registered |
| Radius | `radius-*` | Registered |
| Elevation | `elevation-*` | Registered |
| Border | `border-*` | Registered |
| Motion | `motion-*` | Registered |
| Icons | `icon-*` | Registered |
| Grid | `grid-*`, `container-*`, `gutter-*`, `margin-*` | Registered |
| Breakpoints | `breakpoint-*` | Semantic category allowed; only verified source values may be registered |
| Opacity | `opacity-*` | Allowed category; `TODO: verify a controlled project token source before registering values` |
| Z-index | `z-index-*` | Allowed category; `TODO: verify a controlled project token source before registering values` |

Do not add a new category as a workaround for a missing semantic role. If a value does not fit an allowed category, record a governance decision before creating a token.

## 5. Token mapping

This table maps the semantic design token to the verified project CSS variable and the applicable Tailwind token or utility. The Tailwind theme bridge is defined in [`artifacts/web/src/index.css`](../artifacts/web/src/index.css). A dash means no direct project mapping is verified; a TODO is a deliberate reference gap, not permission to invent a value.

### 5.1 Verified mappings

| Design token | CSS variable | Tailwind token or utility |
| --- | --- | --- |
| `color-background` | `--background` | `bg-background` |
| `color-surface` | `--card` | `bg-card` |
| `color-border` | `--border` | `border-border` |
| `color-primary` | `--primary` | `bg-primary`, `text-primary`, `border-primary` |
| `color-secondary` | `--secondary` | `bg-secondary`, `text-secondary`, `border-secondary` |
| `color-accent` | `--accent` | `bg-accent`, `text-accent`, `border-accent` |
| `color-danger` | `--destructive` | `bg-destructive`, `text-destructive`, `border-destructive` |
| `color-text-primary` | `--foreground` | `text-foreground` |
| `color-text-secondary` | `--muted-foreground` | `text-muted-foreground` |
| `color-focus` | `--ring` | `ring-ring` |
| `font-family-base` | `--app-font-sans` → `--font-sans` | `font-sans` |
| `font-family-mono` | `--app-font-mono` → `--font-mono` | `font-mono` |
| `font-heading-lg` size | `--text-2xl` | `text-2xl` |
| `font-heading-md` size | `--text-xl` | `text-xl` |
| `font-heading-sm` size | `--text-lg` | `text-lg` |
| `font-body` size | `--text-base` | `text-base` |
| `font-label` and `font-button` size | `--text-sm` | `text-sm` |
| `space-1` | `--spacing` × 1 | `p-1`, `m-1`, `gap-1` |
| `space-2` | `--spacing` × 2 | `p-2`, `m-2`, `gap-2` |
| `space-3` | `--spacing` × 3 | `p-3`, `m-3`, `gap-3` |
| `space-4` | `--spacing` × 4 | `p-4`, `m-4`, `gap-4` |
| `space-5` | `--spacing` × 5 | `p-5`, `m-5`, `gap-5` |
| `space-6` | `--spacing` × 6 | `p-6`, `m-6`, `gap-6` |
| `space-7` | `--spacing` × 7 | `p-7`, `m-7`, `gap-7` |
| `space-8` | `--spacing` × 8 | `p-8`, `m-8`, `gap-8` |
| `radius-sm` | `--radius-sm` | `rounded-sm` |
| `radius-md` | `--radius-md` | `rounded-md` |
| `radius-lg` | `--radius-lg` | `rounded-lg` |
| `radius-xl` | `--radius-xl` | `rounded-xl` |
| `border-color-default` | `--border` | `border-border` |
| `focus-ring-color` | `--ring` | `ring-ring` |

Typography rows marked “size” map only the size utility. Weight, line-height, and letter-spacing remain semantic token properties and must not be inferred from a utility name.

### 5.2 Mapping gaps that require verification

| Design token or category | CSS variable | Tailwind token or utility | Required next step |
| --- | --- | --- | --- |
| `color-info` | `TODO: verify semantic source variable` | — | Reconcile with the approved informational color role before mapping |
| `color-hover` | `TODO: verify semantic source variable` | — | Reconcile state treatment before mapping |
| `color-pressed` | `TODO: verify semantic source variable` | — | Reconcile state treatment before mapping |
| `color-text-disabled` | `TODO: verify semantic source variable` | — | Reconcile disabled-content treatment before mapping |
| `radius-xs` | `TODO: no verified CSS variable` | — | Do not add a value until the source registry defines it |
| `radius-full` | `TODO: no verified CSS variable` | — | Do not add a value until the source registry defines it |
| `elevation-*` | `TODO: verify semantic shadow mapping` | — | Map only after elevation levels are tied to existing shadow variables |
| `motion-*` | `TODO: no verified CSS duration variable` | — | Do not invent a CSS duration variable |
| `breakpoint-*` | `TODO: verify CSS token source; mobile threshold is currently defined in code` | — | Reconcile responsive source before adding mappings |
| `opacity-*` | `TODO: no verified project token source` | — | Register only after a controlled source exists |
| `z-index-*` | `TODO: no verified project token source` | — | Register only after a controlled source exists |

### 5.3 Mapping rules

- A mapping must point to an existing project variable or an existing Tailwind theme token.
- A missing mapping is not a reason to create a new value.
- A CSS variable and a Tailwind utility may be mapped only when their semantics and value source match.
- Mapping documentation must be updated when a source variable is renamed, deprecated, or removed.
- Component code consumes the semantic token; this table does not define component implementation.

## 6. AI token rules

AI-assisted design and implementation must follow every rule below:

| Rule | Required behavior |
| --- | --- |
| Never invent tokens | Search this registry and existing approved aliases before proposing a token. |
| Never hardcode HEX/RGB/HSL | Consume a registered semantic color token; never place a raw color in generated or edited UI code. |
| Never hardcode spacing | Use `space-1` through `space-8` or an approved semantic alias. |
| Never hardcode typography | Use the approved family and type-role tokens. |
| Never hardcode radius | Use `radius-xs` through `radius-full`. |
| Never hardcode shadows | Use `elevation-0` through `elevation-3`. |
| Never hardcode animation duration | Use only the registered motion duration tokens. |
| Always reuse existing tokens | Prefer an existing role over a new alias or near-duplicate. |
| Components consume tokens only | Component behavior belongs in [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md); component styling consumes this registry. |

AI must stop and request human review when no existing token expresses the intended meaning. It must not silently create, rename, delete, or reinterpret a token.

## 7. Token naming rules

### 7.1 Canonical naming

Use lowercase semantic names with stable hyphen-separated roles:

`<category>-<semantic-role>[-<variant>]`

| Allowed | Forbidden |
| --- | --- |
| `color-primary` | `blue1` |
| `color-surface` | `red-dark` |
| `color-success` | `success-green` |
| `space-4` | `padding16` |
| `radius-md` | `radius7` |
| `font-body` | `text-normal-16` |
| `elevation-2` | `card-shadow` |
| `motion-duration-standard` | `fast-animation` |

### 7.2 Naming constraints

- Name by meaning: `color-danger`, not a color hue.
- Name by role: `font-body`, not a component name.
- Name by scale: `space-4`, not a pixel value.
- Keep one canonical spelling; aliases must point to it and must not create a second value.
- Do not encode mode in semantic consumer names. Use `color-surface` in both modes, not `color-surface-dark`.
- Do not use page, component, brand-campaign, or one-off names in the shared registry.
- Every token has a purpose, type, owner, supported mode, fallback, and deprecation status.

## 8. Color tokens

The color token is the consumer-facing contract. The light and dark columns record the current private theme-source values or semantic aliases; they are not values to copy into UI code. Product consumers must never use HEX, RGB, or HSL directly. Literal theme values belong only in the controlled token source.

| Token | Semantic purpose | Light value | Dark value |
| --- | --- | --- | --- |
| `color-primary` | Primary brand and main action | `221 83% 53%` | `224 76% 58%` |
| `color-secondary` | Secondary action or supporting emphasis | `210 40% 96%` | `217 33% 18%` |
| `color-accent` | Limited emphasis or highlighted information | `217 91% 96%` | `217 33% 18%` |
| `color-background` | Application canvas behind all surfaces | `0 0% 100%` | `222 47% 9%` |
| `color-surface` | Card, panel, field, and grouped content surface | `0 0% 100%` | `222 47% 11%` |
| `color-border` | Default structural boundary and divider | `214 32% 91%` | `215 28% 18%` |
| `color-success` | Confirmed, complete, or healthy state | `TODO: verify semantic source variable` | `TODO: verify semantic source variable` |
| `color-warning` | Caution requiring attention but not failure | `TODO: verify semantic source variable` | `TODO: verify semantic source variable` |
| `color-danger` | Destructive, failed, invalid, or high-risk state | `0 72% 51%` | `0 63% 46%` |
| `color-info` | Neutral informative state or guidance | `TODO: verify semantic source variable` | `TODO: verify semantic source variable` |
| `color-text-primary` | Main readable content and headings | `222 47% 11%` | `213 31% 91%` |
| `color-text-secondary` | Supporting content and metadata | `215 16% 47%` | `215 20% 55%` |
| `color-text-disabled` | Inactive content that remains discoverable | `TODO: verify semantic source variable` | `TODO: verify semantic source variable` |
| `color-hover` | Hover or pointer-preview state | `TODO: verify semantic source variable` | `TODO: verify semantic source variable` |
| `color-pressed` | Active press or committed pointer state | `TODO: verify semantic source variable` | `TODO: verify semantic source variable` |
| `color-focus` | Keyboard, switch, or programmatic focus indication | `221 83% 53%` | `224 76% 48%` |

### Color rules

- Dark mode swaps values for the same semantic tokens only; never duplicate components or create dark-mode component variants.
- Apply the 60-30-10 composition rule as a planning guide: approximately 60% background/surface, 30% supporting surface or secondary treatment, and 10% accent/action emphasis.
- Accessibility comes first: meet WCAG 2.2 AA contrast and preserve visible focus.
- Never use raw colors in product code.
- Never use color as the only signal for success, warning, danger, selection, disabled, or focus.
- Pair status colors with text, labels, icons, patterns, or programmatic state.
- `color-danger` is reserved for real risk, destructive action, invalid input, or failure.
- Theme values must remain distinguishable in grayscale, high contrast, and dark mode.

See [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) for color meaning and evidence requirements.

## 9. Typography tokens

### 9.1 Family and fallback

| Token | Canonical value |
| --- | --- |
| `font-family-base` | `Hind Siliguri` |
| `font-family-fallback` | `sans-serif` |
| `font-family-mono` | `'JetBrains Mono', Menlo, monospace` |

### 9.2 Type roles

| Token | Size | Weight | Line height | Letter spacing | Use |
| --- | ---: | ---: | ---: | ---: | --- |
| `font-heading-xl` | `TODO: verify source role scale` | `TODO: verify source role weight` | `TODO: verify source role line-height` | `TODO: verify source role tracking` | Rare page or product-level heading |
| `font-heading-lg` | 1.5rem; CSS variable `--text-2xl` | `TODO: verify source role weight` | `--text-2xl--line-height` | `TODO: verify source role tracking` | Page title or major section |
| `font-heading-md` | 1.25rem; CSS variable `--text-xl` | `TODO: verify source role weight` | `--text-xl--line-height` | `TODO: verify source role tracking` | Section heading |
| `font-heading-sm` | 1.125rem; CSS variable `--text-lg` | `TODO: verify source role weight` | `--text-lg--line-height` | `TODO: verify source role tracking` | Subsection heading |
| `font-body` | 1rem; CSS variable `--text-base` | `TODO: verify source role weight` | `--text-base--line-height` | `TODO: verify source role tracking` | Operational copy and instructions |
| `font-subtitle` | `TODO: verify source role scale` | `TODO: verify source role weight` | `TODO: verify source role line-height` | `TODO: verify source role tracking` | Supporting lead or summary |
| `font-caption` | `TODO: verify source role scale` | `TODO: verify source role weight` | `TODO: verify source role line-height` | `TODO: verify source role tracking` | Non-critical metadata |
| `font-label` | 0.875rem; CSS variable `--text-sm` | `TODO: verify source role weight` | `--text-sm--line-height` | `TODO: verify source role tracking` | Field, metric, and status label |
| `font-button` | 0.875rem; CSS variable `--text-sm` | `TODO: verify source role weight` | `--text-sm--line-height` | `TODO: verify source role tracking` | Action label |
| `font-input` | 1rem; CSS variable `--text-base` | `TODO: verify source role weight` | `--text-base--line-height` | `TODO: verify source role tracking` | User-entered value |
| `font-table` | 0.875rem; CSS variable `--text-sm` | `TODO: verify source role weight` | `--text-sm--line-height` | `TODO: verify source role tracking` | Tabular records and supporting values |

### Typography rules

- Use semantic type roles, never page-local font values.
- `font-family-base` is the product family; always retain its fallback stack.
- Functional interface text must not be smaller than `14px`; `font-caption` is reserved for non-critical metadata and must remain readable.
- Keep paragraphs between 45 and 80 characters per line where space allows.
- Use `space-4` for normal paragraph separation; use a smaller or larger token only when grouping requires it.
- Align text according to meaning: left-align prose and mixed data, align comparable numbers consistently, and do not center long operational content.
- Use responsive scaling by type role at registered thresholds; never replace a semantic role with an arbitrary mobile or desktop size.
- Support localization, 200% zoom, text enlargement, and long names without clipping or overlap.

See [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md) for type rationale and review evidence.

## 10. Spacing tokens

EduTrack uses an 8pt system. The only base spacing values are 4, 8, 12, 16, 24, 32, 48, and 64. Product consumers use the semantic token, not a raw number.

| Token | Value | Primary use |
| --- | ---: | --- |
| `space-1` | `4px` | Icon-to-label micro gap and tight optical adjustment |
| `space-2` | `8px` | Inline control groups, compact metadata, and related elements |
| `space-3` | `12px` | Compact row padding, field internals, and short stack gaps |
| `space-4` | `16px` | Default field gap, mobile page inset, and paragraph rhythm |
| `space-5` | `24px` | Card sections, toolbar groups, and tablet gutters |
| `space-6` | `32px` | Major section separation and desktop gutters |
| `space-7` | `48px` | Page-level group separation |
| `space-8` | `64px` | Large page rhythm and major surface separation |

### Spacing rules

- Only the eight values above are allowed in the shared scale.
- Use the smallest token that preserves grouping and the largest token that preserves scanability.
- Equivalent relationships must use the same token across Dashboard, Students, Attendance, Fees, Exams, Reports, Search, and Settings.
- Do not use inline spacing, negative margins, or arbitrary gaps to repair a component relationship.
- Exceptions require an owner, reason, affected surfaces, accessibility review, and migration or expiry plan.

See [SPACING_SYSTEM.md](./SPACING_SYSTEM.md) for density and responsive spacing evidence.

## 11. Radius tokens

| Token | Value | Semantic use |
| --- | ---: | --- |
| `radius-xs` | `TODO: no verified CSS variable` | Minimal restraint for compact controls or data surfaces |
| `radius-sm` | `4px` | Small fields, tags, and compact controls |
| `radius-md` | `6px` | Default fields, buttons, cards, and panels |
| `radius-lg` | `8px` | Prominent cards and grouped surfaces |
| `radius-xl` | `12px` | Large containers and intentional emphasis |
| `radius-full` | `TODO: no verified CSS variable` | Pills, circular controls, and status badges |

Radius rules:

- Never allow a custom radius outside this scale.
- Use the least rounded token that expresses the intended relationship.
- Do not encode component names into radius tokens.
- A radius change is a system change; update the token, not every consumer.

## 12. Elevation tokens

Elevation tokens define semantic elevation only, not decoration. The shadow recipe for each level is maintained by the token source and is never written inline.

| Token | Semantic usage |
| --- | --- |
| `elevation-0` | Canvas, flat surfaces, and boundaries expressed by color or border |
| `elevation-1` | Quietly raised cards, panels, and grouped content |
| `elevation-2` | Popovers, menus, sticky regions, and focused transient surfaces |
| `elevation-3` | Dialogs and the highest intentional product layer |

Elevation rules:

- Use the lowest level that separates related surfaces.
- Do not use elevation to hide scope, navigation, status, or required context.
- Do not use shadows as the only boundary in high contrast or forced-colors modes.
- Never use inline shadows or arbitrary stacking values.

See [ELEVATION_SYSTEM.md](./ELEVATION_SYSTEM.md) for layering and evidence requirements.

## 13. Border tokens

| Token | Canonical value or reference | Semantic use |
| --- | --- | --- |
| `border-width-default` | `TODO: verify source border-width token` | Standard structural boundary |
| `border-width-strong` | `TODO: verify source border-width token` | Emphasis, selected boundary, or critical separation |
| `border-color-default` | `color-border` | Default border and divider color |
| `border-color-focus` | `color-focus` | Focus boundary and focus-ring companion |
| `border-style-default` | `TODO: verify source border-style token` | Default border style |
| `border-focus-width` | `TODO: verify source focus-border token` | Minimum visible focus boundary |

Border rules:

- Borders must support grouping and state; they must not replace accessible labels or status text.
- Focus borders must remain visible against every supported surface.
- Use `color-border` or a semantic state color, never a raw color.
- Do not create one-off border widths or styles in consumer code.

## 14. Icon tokens

| Token | Value | Semantic use |
| --- | ---: | --- |
| `icon-size-xs` | `TODO: verify source icon-size token` | Dense metadata or inline status support |
| `icon-size-sm` | `TODO: verify source icon-size token` | Compact labels and secondary controls |
| `icon-size-md` | `TODO: verify source icon-size token` | Default inline and control icon |
| `icon-size-lg` | `TODO: verify source icon-size token` | Navigation and primary action icon |
| `icon-size-xl` | `TODO: verify source icon-size token` | Prominent empty, status, or orientation icon |
| `icon-stroke-default` | `TODO: verify source icon-stroke token` | Default outline stroke |
| `icon-stroke-emphasis` | `TODO: verify source icon-stroke token` | Emphasis where the icon remains legible |
| `icon-gap-inline` | `space-2` | Icon-to-label relationship |
| `icon-gap-control` | `space-2` | Icon-to-control text relationship |
| `icon-gap-status` | `space-2` | Status icon-to-status text relationship |

Icon rules:

- Use the approved icon registry and semantic size token.
- Do not use an icon as the only label or status signal.
- Preserve optical alignment and stroke consistency through tokens.
- Never hardcode icon dimensions or spacing in consumer code.

See [ICONOGRAPHY.md](./ICONOGRAPHY.md) for icon meaning and accessibility evidence.

## 15. Motion tokens

Only these animation durations are allowed:

| Token | Duration | Semantic use |
| --- | ---: | --- |
| `motion-duration-fast` | `150ms` | Immediate feedback and small state change |
| `motion-duration-standard` | `200ms` | Default enter, exit, or transition |
| `motion-duration-deliberate` | `250ms` | Meaningful content relationship or focus shift |
| `motion-duration-extended` | `300ms` | Maximum duration for a larger but still lightweight transition |

Motion rules:

- Never exceed `300ms`.
- Use motion only to orient, confirm, explain change, or direct attention to a real issue.
- Respect reduced-motion preferences and preserve all meaning without animation.
- Never use motion as the only signal for success, failure, warning, selection, or AI generation.
- Never hardcode animation duration or create a new duration token.

See [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) for behavior and reduced-motion evidence.

## 16. Responsive tokens

Breakpoints are behavior thresholds, not device-brand assumptions. Components and pages reflow when content or task needs require it.

| Token | Threshold or range | Primary mode |
| --- | --- | --- |
| `breakpoint-mobile` | `0–767px` | Single-column task flow and touch-first controls |
| `breakpoint-tablet` | `TODO: verify source threshold` | Two-region composition and 8-column layout |
| `breakpoint-laptop` | `TODO: verify source threshold` | Expanded work area and desktop navigation threshold |
| `breakpoint-desktop` | `TODO: verify source threshold` | Full 12-column composition |
| `breakpoint-large-desktop` | `TODO: verify source threshold` | Wider container with stable reading measure |

Responsive rules:

- Start from mobile content and task order, then enhance available space.
- Preserve scope, hierarchy, labels, status, primary actions, and recovery across modes.
- Use content-driven thresholds when a component needs a more specific reflow point.
- Never hide required work, rely on hover, or add horizontal scrolling for an essential task.
- Use these tokens for responsive behavior; do not hardcode device widths in component styles or business logic.

See [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) for reflow and platform evidence.

## 17. Grid tokens

### 17.1 Columns

| Token | Value | Use |
| --- | ---: | --- |
| `grid-columns-mobile` | `4` | Mobile composition |
| `grid-columns-tablet` | `8` | Tablet composition |
| `grid-columns-desktop` | `12` | Laptop, desktop, and large desktop composition |

### 17.2 Containers, gutters, and margins

| Token | Value | Use |
| --- | ---: | --- |
| `container-mobile` | `TODO: verify source container width` | Full available width within mobile inset |
| `container-tablet` | `TODO: verify source container width` | Centered tablet content limit |
| `container-laptop` | `TODO: verify source container width` | Centered laptop content limit |
| `container-desktop` | `TODO: verify source container width` | Centered desktop content limit |
| `container-large-desktop` | `TODO: verify source container width` | Centered large desktop content limit |
| `gutter-mobile` | `space-4` | Mobile column and page inset |
| `gutter-tablet` | `space-5` | Tablet column gutter and page inset |
| `gutter-laptop` | `space-5` | Laptop column gutter |
| `gutter-desktop` | `space-6` | Desktop column gutter |
| `gutter-large-desktop` | `space-6` | Large desktop column gutter |
| `margin-page-mobile` | `space-4` | Mobile outer page margin |
| `margin-page-tablet` | `space-5` | Tablet outer page margin |
| `margin-page-desktop` | `space-6` | Desktop outer page margin |

Grid rules:

- Use 12 columns on desktop, 8 columns on tablet, and 4 columns on mobile.
- Center containers when the viewport exceeds the token width; preserve the defined gutter.
- Align headings, primary actions, tables, charts, and supporting content to shared columns.
- Do not create page-specific grids or arbitrary container widths without a documented token change.

See [LAYOUT_GRID.md](./LAYOUT_GRID.md) for geometry and alignment evidence.

## 18. Accessibility tokens

These tokens are minimum release requirements. [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) remains the evidence and release gate.

| Token | Canonical value | Requirement |
| --- | --- | --- |
| `focus-ring-color` | `color-focus` | Visible against every supported surface |
| `focus-ring-width` | `TODO: verify source focus-ring width` | Minimum visible focus indicator |
| `focus-ring-offset` | `space-1` | Separates focus from the control boundary |
| `touch-target-min` | `44×44 CSS px` | Minimum operable target with safe separation |
| `touch-target-primary` | `48×48 CSS px` | Preferred size for primary mobile actions |
| `contrast-text-normal` | `4.5:1 minimum` | WCAG 2.2 AA normal text |
| `contrast-text-large` | `3:1 minimum` | WCAG 2.2 AA large text |
| `contrast-non-text` | `3:1 minimum` | Meaningful controls, focus, and graphical boundaries |
| `font-size-accessible-min` | `TODO: verify project minimum; see TYPOGRAPHY_SYSTEM.md` | Minimum functional interface text |
| `reflow-zoom` | `200%` | Required zoom and text enlargement condition |

Accessibility rules:

- Every UI must preserve visible focus, keyboard operation, semantic state, non-color meaning, and 200% reflow.
- Touch targets must use the minimum or preferred size token; do not reduce them to fit a layout.
- Contrast tokens are minimums, not targets to work around.
- Reduced motion, high contrast, text enlargement, localization, and assistive technology are supported token conditions.

## 19. Validation rules

Every UI must:

- use registered semantic tokens;
- avoid raw values in consumer code;
- support light and dark mode through token value swaps;
- meet accessibility tokens and [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md);
- remain responsive at the registered breakpoints and grid modes;
- pass token reference, contrast, focus, reflow, and visual regression checks where applicable.

### Forbidden in consumer code

| Forbidden | Required replacement |
| --- | --- |
| HEX values | `color-*` semantic token |
| RGB values | `color-*` semantic token |
| HSL values | `color-*` semantic token |
| Inline spacing | `space-*` token or spacing alias |
| Inline shadows | `elevation-*` token |
| Inline font sizes | `font-*` role token |
| Inline radius | `radius-*` token |
| Inline animation values | `motion-duration-*` token |
| Unregistered breakpoint or grid value | `breakpoint-*`, `grid-*`, `container-*`, or `gutter-*` token |

Validation fails when a consumer introduces an undefined token, raw value, duplicate alias, unowned token, unsupported mode, or token reference that cannot resolve.

## 20. Token lifecycle

Every token follows this lifecycle:

**Draft → Approved → Deprecated → Removed**

| Stage | Meaning | Required gate |
| --- | --- | --- |
| Draft | Proposed token or mapping under review; not available to product consumers. | Semantic purpose, source evidence, owner, and affected surfaces are recorded. |
| Approved | Registered token may be consumed by approved product code. | Naming, source mapping, accessibility, mode behavior, and usage evidence pass review. |
| Deprecated | Token remains available for backward compatibility but must not be used for new work. | Replacement token, migration mapping, owner, deprecation date, and consumer inventory are recorded. |
| Removed | Token is no longer available after migration is complete. | All consumers migrate, validation passes, release evidence is recorded, and governance approves removal. |

Lifecycle rules:

- A token cannot skip from Draft to Removed.
- A token is not Approved because it appears in a design file or generated output; it must be registered here.
- A TODO/reference value remains Draft until its source is verified.
- Lifecycle status must be reviewable without inspecting component implementation.

## 21. Deprecation rules

- Never delete tokens directly.
- Mark the token as Deprecated in this registry.
- Provide a replacement token with equivalent or intentionally documented semantics.
- Maintain backward compatibility while consumers migrate.
- Inventory and migrate every consumer before removal.
- Remove a token only after migration validation, release evidence, and governance approval.
- Do not repurpose a deprecated token for a new meaning.

## 22. Token versioning

Token registry versions use semantic versioning:

| Version change | Meaning | Examples |
| --- | --- | --- |
| Major | Breaking token changes | Rename, removal, changed meaning, incompatible value contract, or migration required |
| Minor | New tokens | New approved semantic token or non-breaking token category addition |
| Patch | Documentation/metadata updates | Clarification, mapping correction, source reference, lifecycle metadata, or typo fix |

Versioning rules:

- A major change requires a replacement mapping, migration plan, compatibility window, and release evidence.
- A minor change must not silently alter existing token meaning or values.
- A patch must not change token meaning, consumer behavior, or registered values.
- Update the version in this document with every approved registry change.

## 23. Maintenance rules

- Design tokens may evolve through a reviewed, versioned change.
- Component implementations MUST NOT encode token values or change merely because a token value changes.
- Changing one token should update the entire system through its consumers.
- A token meaning must not be mutated. Create a new token when the purpose changes.
- Every new token requires a semantic purpose, owner, type, supported modes, fallback, usage evidence, accessibility review, and migration note.
- Deprecate before removal; provide an approved replacement and migration mapping.
- Remove duplicate aliases only after all consumers have migrated.
- Keep token source, generated outputs, and consumer usage separately reviewable.
- Record system-wide token changes and evidence through [QUALITY_GATES.md](./QUALITY_GATES.md) and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md).

## 24. References and boundaries

| Need | Canonical reference |
| --- | --- |
| Product-wide UI/UX precedence | [UI_MASTER_RULES.md](./UI_MASTER_RULES.md) |
| Component behavior and implementation | [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) |
| Design-system contribution process | [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) |
| Color meaning and status evidence | [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) |
| Typography rationale and readability | [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md) |
| Spacing density and relationships | [SPACING_SYSTEM.md](./SPACING_SYSTEM.md) |
| Page geometry and alignment | [LAYOUT_GRID.md](./LAYOUT_GRID.md) |
| Surface depth and layering | [ELEVATION_SYSTEM.md](./ELEVATION_SYSTEM.md) |
| Icon meaning and accessibility | [ICONOGRAPHY.md](./ICONOGRAPHY.md) |
| Motion behavior and reduced motion | [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) |
| Responsive adaptation | [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) |
| Accessibility release gate | [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) |
| Evidence and release decision | [QUALITY_GATES.md](./QUALITY_GATES.md) |
| Token governance and escalation | [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) |