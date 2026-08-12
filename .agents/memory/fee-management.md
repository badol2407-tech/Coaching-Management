---
name: Fee Management implementation
description: Details of the fee management feature added to artifacts/web — data model, hooks, and pages
---

# Fee Management

## Data model (Firestore: organizations/{orgId}/fees/{feeId})

```
{
  studentId: string,
  studentName: string,
  className: string,
  section: string,
  batch: string,
  amount: number,          // total fee amount
  month: string,           // YYYY-MM
  status: "pending" | "partial" | "paid",
  createdAt: Timestamp,
  paidAt: Timestamp | null,
  installments: [{         // array on the doc (not subcollection)
    amount: number,
    note: string,
    paidAt: ISO string,
    collectedBy: string,
  }],
  totalPaid: number,       // sum of installments
}
```

Old fee records (before this update) lack installments/totalPaid fields.
- Read totalPaid as: `r.totalPaid ?? (r.status === "paid" ? r.amount : 0)`
- installments defaults to []

## Hooks added to lib/hooks.ts

- `useAddInstallment()` — records a partial or full payment, updates status automatically
- `useBulkCreateFees()` — creates fee records for all students in a class/section/batch at once
- `useGetIncomeSummary()` — monthly grouped totals (billed, collected, pending, paid/partial/pending counts)

## Pages / components

- `artifacts/web/src/pages/Fees.tsx` — full rewrite with 4 tabs: Collect, Due List, Payment History, Income Summary
- `artifacts/web/src/components/FeeReceiptDialog.tsx` — printable receipt modal using window.open + innerHTML

**Why:** Status "partial" was added for installment support; existing code only had "pending"/"paid". Reads must handle both old and new records.
