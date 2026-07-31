/**
 * Cloudinary image upload pipeline.
 *
 * Flow: validate → compress (canvas → Blob) → XHR upload with progress/timeout/retry
 *       → return { url, publicId }  (never stores Base64/Data URLs in Firestore)
 *
 * Supported formats: JPEG, JPG, PNG, WEBP, GIF, BMP, TIFF, HEIC, HEIF, AVIF — up to 15 MB.
 */

// ── Constants ──────────────────────────────────────────────────────────────────

export const MAX_FILE_MB = 15;
/** Max pixel length on the longest side after compression */
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.88;
const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_MAX_RETRIES = 3;

const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/heic",
  "image/heif",
  "image/avif",
]);

// ── Cloudinary config (from environment variables — never hardcoded) ───────────

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

// ── Types ──────────────────────────────────────────────────────────────────────

export interface UploadOptions {
  /** Called with 0–100 during upload. */
  onProgress?: (percent: number) => void;
  /** Max file size in MB. Default: 15 */
  maxMB?: number;
  /** Upload attempt limit. Default: 3 */
  maxRetries?: number;
  /** Per-attempt timeout in ms. Default: 60 000 */
  timeoutMs?: number;
}

/** Returned by every upload function — save `url` to Firestore, keep `publicId` for deletion. */
export interface UploadResult {
  /** Cloudinary secure HTTPS URL — the value to store in Firestore. */
  url: string;
  /** Cloudinary public_id — store alongside url to enable deletion of old photos. */
  publicId: string;
}

export type ImageValidationError = "type" | "size";

// ── Validation ─────────────────────────────────────────────────────────────────

export function validateImageFile(
  file: File,
  maxMB = MAX_FILE_MB
): ImageValidationError | null {
  const mime = file.type.toLowerCase();
  if (!ACCEPTED_MIME_TYPES.has(mime)) return "type";
  if (file.size > maxMB * 1024 * 1024) return "size";
  return null;
}

export function imageValidationMessage(error: ImageValidationError): string {
  if (error === "type")
    return "Unsupported file type. Please use JPEG, PNG, WEBP, GIF, BMP, TIFF, HEIC, HEIF, or AVIF.";
  if (error === "size")
    return `File too large. Maximum is ${MAX_FILE_MB} MB.`;
  return "Invalid file.";
}

// ── Compression ────────────────────────────────────────────────────────────────

/**
 * Compress an image File to a JPEG Blob client-side.
 * Returns a Blob — NOT a Data URL — safe to upload to Cloudinary.
 */
export function compressImageToBlob(
  file: File,
  maxMB = MAX_FILE_MB
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const validationError = validateImageFile(file, maxMB);
    if (validationError) {
      reject(new Error(validationError));
      return;
    }

    const img = new Image();
    const blobUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(blobUrl);

      const scale = Math.min(
        1,
        MAX_DIMENSION / Math.max(img.width, img.height)
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("compress"));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("load"));
    };

    img.src = blobUrl;
  });
}

// ── Cloudinary XHR Upload ──────────────────────────────────────────────────────

async function uploadBlobToCloudinary(
  blob: Blob,
  folder: string,
  options: UploadOptions
): Promise<UploadResult> {
  const {
    onProgress,
    maxRetries = DEFAULT_MAX_RETRIES,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  let lastError: unknown = new Error("upload");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await new Promise<UploadResult>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", blob, "photo.jpg");
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", folder);

        const xhr = new XMLHttpRequest();

        const timer = setTimeout(() => {
          xhr.abort();
          reject(new Error("timeout"));
        }, timeoutMs);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress?.(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          clearTimeout(timer);
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText) as {
                secure_url: string;
                public_id: string;
              };
              resolve({ url: data.secure_url, publicId: data.public_id });
            } catch {
              reject(new Error("parse"));
            }
          } else {
            reject(new Error(`http_${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          clearTimeout(timer);
          reject(new Error("network"));
        };

        xhr.onabort = () => {
          clearTimeout(timer);
          reject(new Error("timeout"));
        };

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
        );
        xhr.send(formData);
      });

      return result;
    } catch (err: unknown) {
      lastError = err;
      if (attempt < maxRetries) {
        // Exponential back-off: 1 s, 2 s, …
        await new Promise((r) => setTimeout(r, 1_000 * attempt));
      }
    }
  }

  throw lastError;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Validate, compress, and upload a student photo to Cloudinary.
 * Returns { url, publicId } — store ONLY `url` in Firestore as photoUrl,
 * and store `publicId` as cloudinaryPublicId to enable deletion later.
 *
 * @throws Error with `.message` of "type" | "size" | "compress" | "load" |
 *   "timeout" | "network" | "parse" | "http_<status>" on upload failure.
 */
export async function uploadStudentPhoto(
  file: File,
  orgId: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // 1. Validate + compress (client-side, canvas → Blob, NOT Data URL)
  const blob = await compressImageToBlob(file, options.maxMB ?? MAX_FILE_MB);

  // 2. Upload to Cloudinary with progress, timeout, retry → return { url, publicId }
  const folder = `organizations/${orgId}/student-photos`;
  return uploadBlobToCloudinary(blob, folder, options);
}

/**
 * Delete a Cloudinary image by its publicId via the server-side deletion route.
 * Non-fatal — warns on failure but never throws (safe to fire-and-forget).
 */
export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  if (!publicId) return;
  try {
    const res = await fetch("/api/cloudinary-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
    if (!res.ok) {
      console.warn("Cloudinary delete returned non-OK status:", res.status);
    }
  } catch (err) {
    console.warn("Failed to delete old Cloudinary image:", err);
  }
}

/**
 * Human-readable error message for upload failures.
 */
export function uploadErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === "type")
      return "Unsupported file type. Please use JPEG, PNG, WEBP, GIF, BMP, TIFF, HEIC, HEIF, or AVIF.";
    if (err.message === "size")
      return `File too large. Maximum is ${MAX_FILE_MB} MB.`;
    if (err.message === "compress")
      return "Could not compress the image. Try a different file.";
    if (err.message === "load")
      return "Could not read the image. Try a different file.";
    if (err.message === "timeout")
      return "Upload timed out. Check your connection and try again.";
    if (err.message === "network")
      return "Network error. Check your connection and try again.";
    if (err.message === "parse")
      return "Unexpected response from upload server. Try again.";
    if (err.message.startsWith("http_"))
      return `Upload failed (error ${err.message.slice(5)}). Try again.`;
  }
  return "Photo upload failed. Please try again.";
}
