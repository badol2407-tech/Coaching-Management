/**
 * Production image upload pipeline for Firebase Storage.
 *
 * Flow: validate → compress (canvas → Blob) → upload with progress/timeout/retry
 *       → return downloadURL (never stores Base64/Data URLs in Firestore)
 */

import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

// ── Constants ──────────────────────────────────────────────────────────────────

export const MAX_FILE_MB = 10;
/** Max pixel length on the longest side after compression */
const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.85;
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 3;

const ACCEPTED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);

// ── Types ──────────────────────────────────────────────────────────────────────

export interface UploadOptions {
  /** Called with 0-100 during upload. */
  onProgress?: (percent: number) => void;
  /** Max file size in MB. Default: 10 */
  maxMB?: number;
  /** Upload attempt limit. Default: 3 */
  maxRetries?: number;
  /** Per-attempt timeout in ms. Default: 30 000 */
  timeoutMs?: number;
}

// ── Validation ─────────────────────────────────────────────────────────────────

export type ImageValidationError = "type" | "size";

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
  if (error === "type") return "Only JPEG and PNG files are supported.";
  if (error === "size") return `File too large. Maximum is ${MAX_FILE_MB} MB.`;
  return "Invalid file.";
}

// ── Compression ────────────────────────────────────────────────────────────────

/**
 * Compress an image File to a JPEG Blob client-side.
 * Returns a Blob — NOT a Data URL — safe to upload to Firebase Storage.
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
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("compress"));
          }
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

// ── Upload ─────────────────────────────────────────────────────────────────────

async function uploadBlobWithRetry(
  path: string,
  blob: Blob,
  options: UploadOptions
): Promise<string> {
  const {
    onProgress,
    maxRetries = DEFAULT_MAX_RETRIES,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  let lastError: unknown = new Error("upload");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const downloadUrl = await new Promise<string>((resolve, reject) => {
        const sRef = storageRef(storage, path);
        const task = uploadBytesResumable(sRef, blob, {
          contentType: "image/jpeg",
        });

        const timer = setTimeout(() => {
          task.cancel();
          reject(new Error("timeout"));
        }, timeoutMs);

        task.on(
          "state_changed",
          (snapshot) => {
            const pct = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            onProgress?.(pct);
          },
          (err) => {
            clearTimeout(timer);
            reject(err);
          },
          async () => {
            clearTimeout(timer);
            try {
              resolve(await getDownloadURL(task.snapshot.ref));
            } catch (err) {
              reject(err);
            }
          }
        );
      });

      return downloadUrl;
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
 * Validate, compress, upload a student photo to Firebase Storage, and return
 * the permanent downloadURL. The URL is what you save to Firestore — never
 * a Base64/Data URL.
 *
 * @throws Error with `.message` of "type" | "size" | "compress" | "load" |
 *   "timeout" | a Firebase StorageError code on upload failure.
 */
export async function uploadStudentPhoto(
  file: File,
  orgId: string,
  options: UploadOptions = {}
): Promise<string> {
  // 1. Validate + compress (client-side, canvas → Blob, NOT Data URL)
  const blob = await compressImageToBlob(file, options.maxMB ?? MAX_FILE_MB);

  // 2. Unique, safe storage path
  const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `organizations/${orgId}/student-photos/${Date.now()}_${safeFilename}`;

  // 3. Upload with progress, timeout, retry → return downloadURL
  return uploadBlobWithRetry(path, blob, options);
}

/**
 * Human-readable error message for upload failures.
 */
export function uploadErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === "type") return "Only JPEG and PNG files are supported.";
    if (err.message === "size") return `File too large. Maximum is ${MAX_FILE_MB} MB.`;
    if (err.message === "compress") return "Could not compress the image. Try a different file.";
    if (err.message === "load") return "Could not read the image. Try a different file.";
    if (err.message === "timeout") return "Upload timed out. Check your connection and try again.";
    // Firebase Storage errors
    const code = (err as any)?.code ?? "";
    if (code === "storage/unauthorized") return "Upload blocked by Storage security rules. Contact support.";
    if (code === "storage/canceled") return "Upload was cancelled.";
    if (code === "storage/unknown") return "An unknown storage error occurred. Try again.";
  }
  return "Photo upload failed. Please try again.";
}
