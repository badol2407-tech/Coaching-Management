---
name: OpenAPI + Orval + Zod v3 quirks
description: Two sharp edges when using Orval v8 with zod v3 in this workspace
---

## zod.int() incompatibility

Orval v8.23+ generates `zod.int()` for `type: integer` fields. This is zod v4 syntax. The project uses zod v3 (3.25.x), which does not have `zod.int()`.

**Why:** Orval upgraded to zod v4 API in v8.23; workspace is pinned to zod v3.

**How to apply:** Always use `type: number` instead of `type: integer` in `lib/api-spec/openapi.yaml`. The semantic loss is acceptable — Drizzle still enforces integer types at the DB layer.

## TS2308 params name collision

When an endpoint has BOTH path params (e.g. `{id}`) AND query params, Orval emits:
- `<OperationIdPascal>Params` Zod schema in `generated/api.ts` (for path params)
- `<OperationIdPascal>Params` TypeScript interface in `generated/types/` (for query params)

The `lib/api-zod` barrel does `export * from` both files → TS2308 duplicate export error.

**Why:** Orval uses the same `<OperationId>Params` name for both path and query param types when both are present.

**How to apply:** For endpoints that need both path and query params, move the path identifier to a query param instead (e.g. `GET /attendance/student-summary?studentId=&month=` instead of `GET /students/{id}/attendance-summary?month=`). This ensures only query params are generated as a type (no Zod schema for path params), avoiding the collision.
