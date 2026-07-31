/**
 * Vercel serverless function — delete a Cloudinary image by public_id.
 *
 * POST /api/cloudinary-delete
 * Body: { publicId: string }
 *
 * Uses CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET (server-side secrets only)
 * and VITE_CLOUDINARY_CLOUD_NAME (non-secret, shared with frontend).
 */

const { createHash } = require("node:crypto");

module.exports = async function handler(req, res) {
  // CORS — allow same-origin calls from Vercel-hosted frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse body — Vercel auto-parses JSON when Content-Type is application/json
  const body =
    typeof req.body === "string"
      ? (() => {
          try {
            return JSON.parse(req.body);
          } catch {
            return {};
          }
        })()
      : req.body || {};

  const { publicId } = body;

  if (!publicId || typeof publicId !== "string" || !publicId.trim()) {
    return res.status(400).json({ error: "publicId is required" });
  }

  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Build Cloudinary Admin API signature
  // Params sorted alphabetically (excluding api_key), then append api_secret
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signatureString).digest("hex");

  const formBody = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey,
    timestamp: String(timestamp),
    signature,
  });

  try {
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      }
    );

    const result = await cloudinaryRes.json();

    // "ok" = deleted, "not found" = already gone — both are fine
    if (result.result === "ok" || result.result === "not found") {
      return res.status(200).json({ success: true, result: result.result });
    }

    console.error("Cloudinary destroy failed:", result);
    return res.status(500).json({ error: "Cloudinary deletion failed", detail: result });
  } catch (err) {
    console.error("Error calling Cloudinary API:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
