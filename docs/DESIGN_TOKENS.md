---
title: EduTrack Design Tokens
purpose: Define the canonical semantic token registry and token-only rules for the entire EduTrack product.
scope: Color, typography, spacing, radius, elevation, border, icon, motion, responsive, grid, and accessibility tokens.
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
review_frequency: Quarterly and before any system-wide token change
owner: Product Design and Design Systems
version: 2.0.0
status: Canonical single source of truth for design tokens
last_updated: 2026-08-02
normative_level: Binding token standard
canonical_terms: design token, semantic token, primitive, alias, theme, mode, color, typography, spacing, radius, elevation, border, icon, motion, breakpoint, grid, accessibility
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

## 3. AI token rules

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

## 4. Token naming rules

### 4.1 Canonical naming

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

### 4.2 Naming constraints

- Name by meaning: `color-danger`, not a color hue.
- Name by role: `font-body`, not a component name.
- Name by scale: `space-4`, not a pixel value.
- Keep one canonical spelling; aliases must point to it and must not create a second value.
- Do not encode mode in semantic consumer names. Use `color-surface` in both modes, not `color-surface-dark`.
- Do not use page, component, brand-campaign, or one-off names in the shared registry.
- Every token has a purpose, type, owner, supported mode, fallback, and deprecation status.

## 5. Color tokens

The color token is the consumer-facing contract. The light and dark columns record the current private theme-source values or semantic aliases; they are not values to copy into UI code. Product consumers must never use HEX, RGB, or HSL directly. Literal theme values belong only in the controlled token source.

| Token | Semantic purpose | Light value | Dark value |
| --- | --- | --- | --- |
| `color-primary` | Primary brand and main action | `221 83% 53%` | `224 76% 58%` |
| `color-secondary` | Secondary action or supporting emphasis | `210 40% 96%` | `217 33% 18%` |
| `color-accent` | Limited emphasis or highlighted information | `217 91% 96%` | `217 33% 18%` |
| `color-background` | Application canvas behind all surfaces | `0 0% 100%` | `222 47% 9%` |
| `color-surface` | Card, panel, field, and grouped content surface | `0 0% 100%` | `222 47% 11%` |
| `color-border` | Default structural boundary and divider | `214 32% 91%` | `215 28% 18%` |
| `color-success` | Confirmed, complete, or healthy state | `142 71% 45%` | `142 71% 45%` |
| `color-warning` | Caution requiring attention but not failure | `36 100% 50%` | `36 100% 50%` |
| `color-danger` | Destructive, failed, invalid, or high-risk state | `0 72% 51%` | `0 63% 46%` |
| `color-info` | Neutral informative state or guidance | `color-primary` | `color-primary` |
| `color-text-primary` | Main readable content and headings | `222 47% 11%` | `213 31% 91%` |
| `color-text-secondary` | Supporting content and metadata | `215 16% 47%` | `215 20% 55%` |
| `color-text-disabled` | Inactive content that remains discoverable | `color-text-secondary / 60%` | `color-text-secondary / 60%` |
| `color-hover` | Hover or pointer-preview state | `color-accent` | `color-accent` |
| `color-pressed` | Active press or committed pointer state | `color-secondary` | `color-secondary` |
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

## 6. Typography tokens

### 6.1 Family and fallback

| Token | Canonical value |
| --- | --- |
| `font-family-base` | `Hind Siliguri` |
| `font-family-fallback` | `ui-sans-serif, system-ui, sans-serif` |
| `font-family-mono` | `ui-monospace, SFMono-Regular, monospace` |

### 6.2 Type roles

| Token | Size | Weight | Line height | Letter spacing | Use |
| --- | ---: | ---: | ---: | ---: | --- |
| `font-heading-xl` | `2rem` | `700` | `1.2` | `-0.02em` | Rare page or product-level heading |
| `font-heading-lg` | `1.5rem` | `700` | `1.25` | `-0.01em` | Page title or major section |
| `font-heading-md` | `1.25rem` | `600` | `1.3` | `0` | Section heading |
| `font-heading-sm` | `1.125rem` | `600` | `1.35` | `0` | Subsection heading |
| `font-body` | `1rem` | `400` | `1.5` | `0` | Operational copy and instructions |
| `font-subtitle` | `0.9375rem` | `500` | `1.45` | `0` | Supporting lead or summary |
| `font-caption` | `0.8125rem` | `400` | `1.35` | `0.01em` | Non-critical metadata |
| `font-label` | `0.875rem` | `600` | `1.3` | `0.01em` | Field, metric, and status label |
| `font-button` | `0.875rem` | `600` | `1.2` | `0.01em` | Action label |
| `font-input` | `1rem` | `400` | `1.4` | `0` | User-entered value |
| `font-table` | `0.875rem` | `400` | `1.4` | `0` | Tabular records and supporting values |

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

## 7. Spacing tokens

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

## 8. Radius tokens

| Token | Value | Semantic use |
| --- | ---: | --- |
| `radius-xs` | `2px` | Minimal restraint for compact controls or data surfaces |
| `radius-sm` | `4px` | Small fields, tags, and compact controls |
| `radius-md` | `6px` | Default fields, buttons, cards, and panels |
| `radius-lg` | `8px` | Prominent cards and grouped surfaces |
| `radius-xl` | `12px` | Large containers and intentional emphasis |
| `radius-full` | `9999px` | Pills, circular controls, and status badges |

Radius rules:

- Never allow a custom radius outside this scale.
- Use the least rounded token that expresses the intended relationship.
- Do not encode component names into radius tokens.
- A radius change is a system change; update the token, not every consumer.

## 9. Elevation tokens

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

## 10. Border tokens

| Token | Canonical value or reference | Semantic use |
| --- | --- | --- |
| `border-width-default` | `1px` | Standard structural boundary |
| `border-width-strong` | `2px` | Emphasis, selected boundary, or critical separation |
| `border-color-default` | `color-border` | Default border and divider color |
| `border-color-focus` | `color-focus` | Focus boundary and focus-ring companion |
| `border-style-default` | `solid` | Default border style |
| `border-focus-width` | `2px` | Minimum visible focus boundary |

Border rules:

- Borders must support grouping and state; they must not replace accessible labels or status text.
- Focus borders must remain visible against every supported surface.
- Use `color-border` or a semantic state color, never a raw color.
- Do not create one-off border widths or styles in consumer code.

## 11. Icon tokens

| Token | Value | Semantic use |
| --- | ---: | --- |
| `icon-size-xs` | `12px` | Dense metadata or inline status support |
| `icon-size-sm` | `16px` | Compact labels and secondary controls |
| `icon-size-md` | `20px` | Default inline and control icon |
| `icon-size-lg` | `24px` | Navigation and primary action icon |
| `icon-size-xl` | `32px` | Prominent empty, status, or orientation icon |
| `icon-stroke-default` | `2` | Default outline stroke |
| `icon-stroke-emphasis` | `2.5` | Emphasis where the icon remains legible |
| `icon-gap-inline` | `space-2` | Icon-to-label relationship |
| `icon-gap-control` | `space-2` | Icon-to-control text relationship |
| `icon-gap-status` | `space-2` | Status icon-to-status text relationship |

Icon rules:

- Use the approved icon registry and semantic size token.
- Do not use an icon as the only label or status signal.
- Preserve optical alignment and stroke consistency through tokens.
- Never hardcode icon dimensions or spacing in consumer code.

See [ICONOGRAPHY.md](./ICONOGRAPHY.md) for icon meaning and accessibility evidence.

## 12. Motion tokens

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

## 13. Responsive tokens

Breakpoints are behavior thresholds, not device-brand assumptions. Components and pages reflow when content or task needs require it.

| Token | Threshold or range | Primary mode |
| --- | --- | --- |
| `breakpoint-mobile` | `0–767px` | Single-column task flow and touch-first controls |
| `breakpoint-tablet` | `768px` | Two-region composition and 8-column layout |
| `breakpoint-laptop` | `1024px` | Expanded work area and desktop navigation threshold |
| `breakpoint-desktop` | `1280px` | Full 12-column composition |
| `breakpoint-large-desktop` | `1536px` | Wider container with stable reading measure |

Responsive rules:

- Start from mobile content and task order, then enhance available space.
- Preserve scope, hierarchy, labels, status, primary actions, and recovery across modes.
- Use content-driven thresholds when a component needs a more specific reflow point.
- Never hide required work, rely on hover, or add horizontal scrolling for an essential task.
- Use these tokens for responsive behavior; do not hardcode device widths in component styles or business logic.

See [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) for reflow and platform evidence.

## 14. Grid tokens

### 14.1 Columns

| Token | Value | Use |
| --- | ---: | --- |
| `grid-columns-mobile` | `4` | Mobile composition |
| `grid-columns-tablet` | `8` | Tablet composition |
| `grid-columns-desktop` | `12` | Laptop, desktop, and large desktop composition |

### 14.2 Containers, gutters, and margins

| Token | Value | Use |
| --- | ---: | --- |
| `container-mobile` | `100%` | Full available width within mobile inset |
| `container-tablet` | `720px` | Centered tablet content limit |
| `container-laptop` | `960px` | Centered laptop content limit |
| `container-desktop` | `1200px` | Centered desktop content limit |
| `container-large-desktop` | `1440px` | Centered large desktop content limit |
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

## 15. Accessibility tokens

These tokens are minimum release requirements. [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) remains the evidence and release gate.

| Token | Canonical value | Requirement |
| --- | --- | --- |
| `focus-ring-color` | `color-focus` | Visible against every supported surface |
| `focus-ring-width` | `3px` | Minimum visible focus indicator |
| `focus-ring-offset` | `space-1` | Separates focus from the control boundary |
| `touch-target-min` | `44×44 CSS px` | Minimum operable target with safe separation |
| `touch-target-primary` | `48×48 CSS px` | Preferred size for primary mobile actions |
| `contrast-text-normal` | `4.5:1 minimum` | WCAG 2.2 AA normal text |
| `contrast-text-large` | `3:1 minimum` | WCAG 2.2 AA large text |
| `contrast-non-text` | `3:1 minimum` | Meaningful controls, focus, and graphical boundaries |
| `font-size-accessible-min` | `14px` | Minimum functional interface text |
| `reflow-zoom` | `200%` | Required zoom and text enlargement condition |

Accessibility rules:

- Every UI must preserve visible focus, keyboard operation, semantic state, non-color meaning, and 200% reflow.
- Touch targets must use the minimum or preferred size token; do not reduce them to fit a layout.
- Contrast tokens are minimums, not targets to work around.
- Reduced motion, high contrast, text enlargement, localization, and assistive technology are supported token conditions.

## 16. Validation rules

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

## 17. Maintenance rules

- Design tokens may evolve through a reviewed, versioned change.
- Component implementations MUST NOT encode token values or change merely because a token value changes.
- Changing one token should update the entire system through its consumers.
- A token meaning must not be mutated. Create a new token when the purpose changes.
- Every new token requires a semantic purpose, owner, type, supported modes, fallback, usage evidence, accessibility review, and migration note.
- Deprecate before removal; provide an approved replacement and migration mapping.
- Remove duplicate aliases only after all consumers have migrated.
- Keep token source, generated outputs, and consumer usage separately reviewable.
- Record system-wide token changes and evidence through [QUALITY_GATES.md](./QUALITY_GATES.md) and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md).

## 18. References and boundaries

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