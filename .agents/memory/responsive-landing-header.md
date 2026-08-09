---
name: Responsive landing header
description: The public landing header keeps its Flowora-style navigation visible from tablet/medium widths upward
---

The landing header shows the full Features/Solutions/Pricing/Resources/About navigation and auth actions from the `md` breakpoint upward; the hamburger menu is reserved for narrower mobile widths.

**Why:** A large-screen-only (`lg`) breakpoint made the new header appear missing in common tablet and medium laptop previews even though the bundle contained the correct labels.

**How to apply:** When changing the public landing header, validate at mobile, tablet/medium, and desktop widths. Keep the logo compact enough for the `md` layout and do not hide the main tabs until the mobile breakpoint.