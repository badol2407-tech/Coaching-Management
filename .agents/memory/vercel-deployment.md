---
name: Vercel deployment approach
description: How EduTrack deploys to Vercel — what works and what doesn't
---

# Vercel Deployment

## Project
- Project ID: `prj_wS8nOI5dtrAgTygcqEmWbJFwYvCO`
- Name: `coaching-management`
- Production alias: `coaching-management-three.vercel.app`

## What works
File-upload deployment via Vercel REST API (`POST /v13/deployments` with `files` array).
Build the app locally first (`pnpm --filter @workspace/web run build`),
then upload all files from `artifacts/web/dist/public/` using the `/v2/files` endpoint
and reference their SHAs in the deployment body.

**Why:** The Vercel project has no GitHub Login Connection, so gitSource deployments fail.
The Vercel CLI (`pnpm dlx vercel`) is blocked by Replit's package firewall (tar@7.x.x forbidden).

## What doesn't work
- `gitSource` deployment: requires GitHub OAuth linked to Vercel account (error: "Login Connection")
- Vercel CLI via pnpm dlx: blocked by Replit package firewall (ERR_PNPM_FETCH_403 on tar)
- File upload with `teamId` = userId: returns 403 Forbidden — use no teamId for personal accounts

## Verification note
- The deployment-specific Vercel URL may redirect to Vercel SSO when checked without a browser session. Verify public production releases through `coaching-management-three.vercel.app`; compare the deployed entry and lazy landing-page bundle hashes/content.

## vercel.json
Points to `artifacts/web` build: `pnpm --filter @workspace/web run build`, output `artifacts/web/dist/public`.
