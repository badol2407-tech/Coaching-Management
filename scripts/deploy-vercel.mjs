#!/usr/bin/env node
// Deploys artifacts/web/dist/public to Vercel via REST API (file upload approach)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import https from "node:https";

const ROOT_DIR = fileURLToPath(new URL("..", import.meta.url));
const DIST_DIR = join(ROOT_DIR, "artifacts/web/dist/public");
const PROJECT_ID = "prj_wS8nOI5dtrAgTygcqEmWbJFwYvCO";
const TOKEN = process.env.VERCEL_TOKEN;
if (!TOKEN) { console.error("VERCEL_TOKEN not set"); process.exit(1); }

function req(method, path, headers, body) {
  return new Promise((resolve, reject) => {
    const r = https.request({ hostname: "api.vercel.com", path, method, headers }, res => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
    });
    r.on("error", reject);
    if (body) r.write(body);
    r.end();
  });
}

console.log("Building web app before upload...");
execFileSync("pnpm", ["--filter", "@workspace/web", "run", "build"], {
  cwd: ROOT_DIR,
  stdio: "inherit",
});

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const allFiles = walk(DIST_DIR);
console.log(`Found ${allFiles.length} files`);

const fileRefs = [];
for (const fp of allFiles) {
  const buf = readFileSync(fp);
  const sha = createHash("sha1").update(buf).digest("hex");
  const rel = relative(DIST_DIR, fp);
  const r = await req("POST", "/v2/files", {
    "Authorization": `Bearer ${TOKEN}`,
    "Content-Type": "application/octet-stream",
    "x-vercel-digest": sha,
    "Content-Length": buf.length,
  }, buf);
  if (r.status !== 200 && r.status !== 409) {
    console.warn(`Upload warn ${rel}: ${r.status} ${r.body.slice(0, 80)}`);
  }
  fileRefs.push({ file: rel, sha, size: buf.length });
}
console.log(`Uploaded ${fileRefs.length} files`);

const bodyStr = JSON.stringify({
  name: "coaching-management",
  files: fileRefs,
  target: "production",
  routes: [
    // Serve real static files (JS, CSS, images, etc.) directly from the
    // uploaded file set. Without this, the catch-all below intercepts
    // every /assets/* request and returns index.html as text/javascript,
    // which prevents the app from booting (white screen).
    { handle: "filesystem" },
    // SPA fallback — unknown paths render index.html so client-side
    // routing can take over.
    { src: "/(.*)", dest: "/index.html" },
  ],
});

const dr = await req("POST", `/v13/deployments?projectId=${PROJECT_ID}`, {
  "Authorization": `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
  "Content-Length": Buffer.byteLength(bodyStr),
}, bodyStr);

console.log("HTTP:", dr.status);
let data;
try { data = JSON.parse(dr.body); } catch { console.error("Parse error:", dr.body.slice(0, 300)); process.exit(1); }

if (data.error) {
  console.error("Vercel error:", JSON.stringify(data.error, null, 2));
  process.exit(1);
}

console.log("Deployment ID:", data.id);
console.log("URL:", data.url);
console.log("readyState:", data.readyState);
console.log("Production alias: coaching-management-three.vercel.app");
