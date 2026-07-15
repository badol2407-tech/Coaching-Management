---
name: Pricing single-source-of-truth pattern
description: How landing-page/admin pricing displays stay in sync with plan-config.ts in the Coaching Manager app
---

Landing page, Subscription page, and Super Admin pages (PricingPlans, ManageOrganizations)
must never hardcode a tier's price/savings/regular-price as a literal string — always derive
from `artifacts/web/src/lib/plan-config.ts`.

**Why:** a prior version had the landing-page promo banner (`promotionData.ts`) and several
Super Admin selects hardcoding tier prices as literal Bengali-numeral strings (e.g. "৳749/month",
"৳0 / 7 days"). When the Founder Launch price changed from ৳499→৳749 in `plan-config.ts`, these
literals silently went stale and disagreed with the real config.

**How to apply:** `plan-config.ts` exports display helpers — `formatBnTaka(n)`, `toBnNumber(n)`,
`getPricingDisplay(tier)` (price/regularPrice/savings/monthlyEquivalent for landing cards), and
`getTierPriceLabel(tier)` (short "price/cadence" label for admin selects/tables). Any new UI that
shows a tier's price must call one of these instead of writing a new literal. Also watch for dead
duplicate data arrays (e.g. an unused `plans` array) left behind after a refactor — remove them
rather than leaving two sources of truth even if only one is wired up.
