/**
 * Academic document upload pipeline.
 *
 * Flow:
 * validate → Cloudinary raw upload → return { url, publicId }
 *
 * This is intentionally separate from image-upload.ts.
 * Student photos must continue using the existing image pipeline.
 */

import { auth } from "@/lib/firebase";

export const MAX_ACADEMIC_DOCUMENT_MB = 25;

const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

const ACADEMIC_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_ACADEMIC_UPLOAD_PRESET as string;

const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_RETRIES = 3;

const ACCEPTED_DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export type AcademicDocumentValidationError =
  | "type"
  | "size";

export interface AcademicDocumentUploadOptions {
  onProgress?: (percent: number) => void;
  maxMB?: number;
  maxRetries?: number;
  timeoutMs?: number;
}

export interface AcademicDocumentUploadResult {
  url: string;
  publicId: string;
}

export function validateAcademicDocumentFile(
  file: File,
  maxMB = MAX_ACADEMIC_DOCUMENT_MB,
): AcademicDocumentValidationError | null {
  const mime = file.type.toLowerCase();

  if (!ACCEPTED_DOCUMENT_MIME_TYPES.has(mime)) {
    return "type";
  }

  if (file.size > maxMB * 1024 * 1024) {
    return "size";
  }

  return null;
}

export function academicDocumentValidationMessage(
  error: AcademicDocumentValidationError,
): string {
  if (error === "type") {
    return "Unsupported file type. Please use PDF, JPEG, PNG, or WEBP.";
  }

  if (error === "size") {
    return `File too large. Maximum is ${MAX_ACADEMIC_DOCUMENT_MB} MB.`;
  }

  return "Invalid document.";
}

async function uploadDocumentToCloudinary(
  file: File,
  folder: string,
  options: AcademicDocumentUploadOptions,
): Promise<AcademicDocumentUploadResult> {
  const {
    onProgress,
    maxRetries = DEFAULT_MAX_RETRIES,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  let lastError: unknown = new Error("upload");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await new Promise<AcademicDocumentUploadResult>(
        (resolve, reject) => {
          const formData = new FormData();

          formData.append("file", file);
          formData.append("upload_preset", ACADEMIC_UPLOAD_PRESET);
          formData.append("folder", folder);

          const xhr = new XMLHttpRequest();

          const timer = setTimeout(() => {
            xhr.abort();
            reject(new Error("timeout"));
          }, timeoutMs);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              onProgress?.(
                Math.round((event.loaded / event.total) * 100),
              );
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

                if (!data.secure_url || !data.public_id) {
                  reject(new Error("parse"));
                  return;
                }

                resolve({
                  url: data.secure_url,
                  publicId: data.public_id,
                });
              } catch {
                reject(new Error("parse"));
              }

              return;
            }

            let detail = "";

            try {
              const data = JSON.parse(xhr.responseText) as {
                error?: { message?: string };
                message?: string;
              };

              detail =
                data.error?.message ||
                data.message ||
                "";
            } catch {
              detail = xhr.responseText || "";
            }

            reject(
              new Error(
                detail
                  ? `cloudinary_${xhr.status}:${detail}`
                  : `http_${xhr.status}`,
              ),
            );
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
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          );

          xhr.send(formData);
        },
      );

      return result;
    } catch (error: unknown) {
      lastError = error;

      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1_000 * attempt),
        );
      }
    }
  }

  throw lastError;
}

/**
 * Upload an academic document to Cloudinary.
 *
 * The returned URL/publicId can then be stored in academicDocuments.
 * This function does not create or modify any Firestore record.
 */
export async function uploadAcademicDocument(
  file: File,
  orgId: string,
  documentType: "syllabus" | "result_card",
  options: AcademicDocumentUploadOptions = {},
): Promise<AcademicDocumentUploadResult> {
  const validationError = validateAcademicDocumentFile(
    file,
    options.maxMB ?? MAX_ACADEMIC_DOCUMENT_MB,
  );

  if (validationError) {
    throw new Error(validationError);
  }

  if (!orgId) {
    throw new Error("Organization not found.");
  }

  if (!auth.currentUser) {
    throw new Error("Authentication required.");
  }

  const folder =
    `organizations/${orgId}/academic-documents/${documentType}`;

  return uploadDocumentToCloudinary(file, folder, options);
}

export function academicDocumentUploadErrorMessage(
  error: unknown,
): string {
  if (!(error instanceof Error)) {
    return "Document upload failed.";
  }

  if (error.message === "type") {
    return "Unsupported file type. Please use PDF, JPEG, PNG, or WEBP.";
  }

  if (error.message === "size") {
    return `File too large. Maximum is ${MAX_ACADEMIC_DOCUMENT_MB} MB.`;
  }

  if (error.message === "timeout") {
    return "Upload timed out. Please try again.";
  }

  if (error.message === "network") {
    return "Network error during upload. Please try again.";
  }

  if (error.message === "parse") {
    return "Cloudinary returned an invalid upload response.";
  }

  if (error.message.startsWith("cloudinary_")) {
    return error.message.replace(
      /^cloudinary_\\d+:/,
      "",
    );
  }

  if (error.message.startsWith("http_")) {
    return "Cloudinary rejected the document upload.";
  }

  if (error.message === "upload") {
    return "Document upload failed.";
  }

  return error.message || "Document upload failed.";
}
