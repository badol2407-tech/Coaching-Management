---
name: Hero mini-window layout
description: Responsive positioning and tilt conventions for the Flowora-inspired public hero cards
---

The public hero’s floating mini-windows should use separate absolute-positioned motion wrappers and inner card elements. Desktop positions belong on the wrappers; tilt belongs on the cards. Mobile positioning should remain independently overridden so desktop grouping changes do not disturb the stacked mobile composition.

**Why:** Applying position and transform directly to a moving card wrapper caused desktop percentage placement and card tilt to interact unpredictably, while the mobile layout already had a separate stacking arrangement.

**How to apply:** For future hero visual changes, adjust desktop grouping on the `*-float` wrappers, adjust visual angle on the inner window, and preserve the mobile breakpoint overrides unless the mobile composition is intentionally redesigned.