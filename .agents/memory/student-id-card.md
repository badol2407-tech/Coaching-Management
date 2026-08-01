---
name: Student ID Card feature
description: How the Student ID Card page works and what was changed to add it
---

## Feature
Route `/id-cards` — lists all students, click any to see a printable ID card.

## ID Card contents
- Organization logo (first letter of orgName in a circle + orgName text) from `userProfile.orgName`
- Student photo (`student.photoUrl`) with User icon fallback
- Student info: name, roll number, class/section, batch, phone, guardian, address
- QR code placeholder: deterministic 7×7 grid SVG derived from roll/id
- Barcode placeholder: deterministic bar pattern SVG derived from roll/id
- Print: `window.open` → inject card HTML → `window.print()`
- Download PDF: same as Print (browser's "Save as PDF" option)

## Files changed
- **New**: `artifacts/web/src/pages/StudentIdCard.tsx`
- **Modified**: `artifacts/web/src/App.tsx` — added lazy import + `/id-cards` route for org_admin, teacher, and both impersonation branches
- **Modified**: `artifacts/web/src/components/layout/AppLayout.tsx` — added `IdCard` icon import + nav item `{ title: "ID Cards", href: "/id-cards", icon: IdCard }`
- **Modified**: `artifacts/web/src/components/layout/TeacherLayout.tsx` — same

## Why no external deps
Using browser's native print-to-PDF avoids adding jsPDF/html2canvas (large bundles). The print window approach works without injecting global CSS overrides into the main app.

**How to apply:** Any future QR feature needing real scannable codes should add `qrcode.react` to artifacts/web/package.json; replace the `QrPlaceholder` component with `<QRCodeSVG>`.
