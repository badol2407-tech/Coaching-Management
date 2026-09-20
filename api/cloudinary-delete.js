/**
 * Vercel serverless function — delete a Cloudinary image by public_id.
 * Deletion is limited to authenticated Firebase users who can manage student
 * records in the organization encoded in the public_id.
 */

const { createHash, createVerify } = require("node:crypto");

const FIREBASE_PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID || "coaching-management-d2d0f";
const FIREBASE_ISSUER = "https://securetoken.google.com/" + FIREBASE_PROJECT_ID;
const FIREBASE_CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let firebaseCertsCache = null;
let firebaseCertsExpiresAt = 0;

function decodeJwtSegment(segment) {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8"));
}

async function getFirebaseCerts(forceRefresh = false) {
  if (!forceRefresh && firebaseCertsCache && Date.now() < firebaseCertsExpiresAt) {
    return firebaseCertsCache;
  }
  const response = await fetch(FIREBASE_CERTS_URL);
  if (!response.ok) throw new Error("Unable to load Firebase signing certificates");
  const cacheControl = response.headers.get("cache-control") || "";
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] || 3600);
  firebaseCertsCache = await response.json();
  firebaseCertsExpiresAt = Date.now() + maxAge * 1000;
  return firebaseCertsCache;
}

async function verifyFirebaseIdToken(idToken) {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("Malformed Firebase token");
  const encodedHeader = parts[0];
  const encodedPayload = parts[1];
  const encodedSignature = parts[2];
  const header = decodeJwtSegment(encodedHeader);
  const payload = decodeJwtSegment(encodedPayload);
  if (header.alg !== "RS256" || !header.kid) throw new Error("Unsupported Firebase token");
  let certs = await getFirebaseCerts();
  let certificate = certs[header.kid];
  if (!certificate) {
    certs = await getFirebaseCerts(true);
    certificate = certs[header.kid];
  }
  if (!certificate) throw new Error("Unknown Firebase signing key");
  const verifier = createVerify("RSA-SHA256");
  verifier.update(encodedHeader + "." + encodedPayload);
  verifier.end();
  if (!verifier.verify(certificate, Buffer.from(encodedSignature, "base64url"))) {
    throw new Error("Invalid Firebase token signature");
  }
  const now = Math.floor(Date.now() / 1000);
  if (
    payload.aud !== FIREBASE_PROJECT_ID ||
    payload.iss !== FIREBASE_ISSUER ||
    typeof payload.sub !== "string" ||
    payload.sub.length === 0 ||
    typeof payload.exp !== "number" ||
    payload.exp <= now ||
    typeof payload.iat !== "number" ||
    payload.iat > now + 60
  ) {
    throw new Error("Invalid Firebase token claims");
  }
  return payload;
}

function firestoreFieldValue(value) {
  if (!value || typeof value !== "object") return undefined;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(firestoreFieldValue);
  return undefined;
}

async function getUserProfile(uid, idToken) {
  const path =
    "https://firestore.googleapis.com/v1/projects/" +
    encodeURIComponent(FIREBASE_PROJECT_ID) +
    "/databases/(default)/documents/users/" + encodeURIComponent(uid);
  const response = await fetch(path, {
    headers: { Authorization: "Bearer " + idToken },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to load Firebase user profile");
  const document = await response.json();
  const fields = document.fields || {};
  return {
    orgId: firestoreFieldValue(fields.orgId),
    role: firestoreFieldValue(fields.role),
    status: firestoreFieldValue(fields.status),
    permissions: firestoreFieldValue(fields.permissions),
  };
}

function getBearerToken(req) {
  const value = req.headers.authorization;
  const match = typeof value === "string" ? value.match(/^Bearer\s+(.+)$/i) : null;
  return match?.[1] || null;
}

function isAllowedPublicId(publicId, orgId, isSuperAdmin) {
  if (publicId.includes("..")) return false;
  const match = publicId.match(/^organizations\/([^/]+)\/student-photos\/[A-Za-z0-9._/-]+$/);
  if (!match) return false;
  return isSuperAdmin || match[1] === orgId;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Vary", "Origin");
  const origin = req.headers.origin;
  if (origin && process.env.FRONTEND_ORIGIN === origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const idToken = getBearerToken(req);
  if (!idToken) return res.status(401).json({ error: "Authentication required" });
  const body =
    typeof req.body === "string"
      ? (() => {
          try { return JSON.parse(req.body); } catch { return {}; }
        })()
      : req.body || {};
  const { publicId } = body;
  if (typeof publicId !== "string" || publicId.length === 0 || publicId.length > 500) {
    return res.status(400).json({ error: "Valid publicId is required" });
  }

  let token;
  let profile;
  try {
    token = await verifyFirebaseIdToken(idToken);
    profile = await getUserProfile(token.sub, idToken);
  } catch (err) {
    console.error("Firebase authentication failed:", err);
    return res.status(401).json({ error: "Invalid authentication" });
  }

  const isSuperAdmin = profile?.role === "super_admin" && token.admin === true;
  const canManageStudents =
    isSuperAdmin ||
    profile?.role === "org_admin" ||
    profile?.role === "teacher" ||
    (profile?.role === "administrative_staff" &&
      Array.isArray(profile.permissions) &&
      profile.permissions.includes("students.write"));
  if (!profile || profile.status === "inactive" || !canManageStudents) {
    return res.status(403).json({ error: "Not authorized" });
  }
  if (!isAllowedPublicId(publicId, profile.orgId, isSuperAdmin)) {
    return res.status(403).json({ error: "Image is outside your organization" });
  }

  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = "public_id=" + publicId + "&timestamp=" + timestamp + apiSecret;
  const signature = createHash("sha1").update(signatureString).digest("hex");
  const formBody = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey,
    timestamp: String(timestamp),
    signature,
  });

  try {
    const cloudinaryRes = await fetch(
      "https://api.cloudinary.com/v1_1/" + cloudName + "/image/destroy",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      }
    );
    const result = await cloudinaryRes.json();
    if (result.result === "ok" || result.result === "not found") {
      return res.status(200).json({ success: true, result: result.result });
    }
    console.error("Cloudinary destroy failed:", result);
    return res.status(502).json({ error: "Cloudinary deletion failed" });
  } catch (err) {
    console.error("Cloudinary deletion request failed:", err);
    return res.status(502).json({ error: "Cloudinary service unavailable" });
  }
};
