import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export type AdmissionStatus = "pending" | "approved" | "rejected";

export interface AdmissionRequest {
  id: string;
  uid?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  className?: string | null;
  section?: string | null;
  batch?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  address?: string | null;
  status: AdmissionStatus;
  createdAt: string;
  reviewedAt?: string | null;
}

function toIsoString(value: unknown) {
  if (value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return new Date(0).toISOString();
}

function admissionCollection(orgId: string) {
  return collection(db, "organizations", orgId, "admission_requests");
}

export const getStaffAdmissionRequestsQueryKey = (orgId?: string | null) => [
  orgId,
  "administrative_staff",
  "admission_requests",
];

export function useStaffAdmissionRequests() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;

  return useQuery({
    queryKey: getStaffAdmissionRequestsQueryKey(orgId),
    queryFn: async () => {
      if (!orgId) return [] as AdmissionRequest[];

      const snapshot = await getDocs(admissionCollection(orgId));
      return snapshot.docs
        .map((request) => {
          const data = request.data();
          return {
            id: request.id,
            uid: (data.uid as string | null | undefined) ?? null,
            name: String(data.name ?? "Unnamed applicant"),
            email: (data.email as string | null | undefined) ?? null,
            phone: (data.phone as string | null | undefined) ?? null,
            className: (data.className as string | null | undefined) ?? null,
            section: (data.section as string | null | undefined) ?? null,
            batch: (data.batch as string | null | undefined) ?? null,
            guardianName: (data.guardianName as string | null | undefined) ?? null,
            guardianPhone: (data.guardianPhone as string | null | undefined) ?? null,
            address: (data.address as string | null | undefined) ?? null,
            status: (data.status as AdmissionStatus | undefined) ?? "pending",
            createdAt: toIsoString(data.createdAt),
            reviewedAt: data.reviewedAt ? toIsoString(data.reviewedAt) : null,
          } satisfies AdmissionRequest;
        })
        .sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    },
    enabled: Boolean(orgId),
    staleTime: 30_000,
  });
}

export function useDecideAdmission() {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      request,
      decision,
    }: {
      request: AdmissionRequest;
      decision: Exclude<AdmissionStatus, "pending">;
    }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No organization is associated with this account.");

      const batch = writeBatch(db);
      const requestRef = doc(db, "organizations", orgId, "admission_requests", request.id);

      if (decision === "approved") {
        const studentRef = doc(collection(db, "organizations", orgId, "students"));
        batch.set(studentRef, {
          uid: request.uid ?? null,
          name: request.name,
          email: request.email ?? null,
          phone: request.phone ?? null,
          className: request.className ?? null,
          section: request.section ?? null,
          batch: request.batch ?? null,
          guardianName: request.guardianName ?? null,
          guardianPhone: request.guardianPhone ?? null,
          address: request.address ?? null,
          enrolledAt: new Date().toISOString().split("T")[0],
          createdAt: serverTimestamp(),
          source: "admission_request",
          status: "active",
          hasFirebaseAuth: Boolean(request.uid),
          rollNumber: null,
          emergencyContact: null,
          emergencyPhone: null,
          photoUrl: null,
        });

        if (request.uid) {
          batch.set(
            doc(db, "users", request.uid),
            {
              role: "student",
              orgId,
              name: request.name,
              email: request.email ?? "",
              mustChangePassword: false,
              createdByAdmin: false,
              createdAt: serverTimestamp(),
            },
            { merge: true },
          );
        }
      }

      batch.update(requestRef, {
        status: decision,
        reviewedAt: serverTimestamp(),
        reviewedBy: userProfile?.name ?? "Administrative staff",
      });
      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getStaffAdmissionRequestsQueryKey(userProfile?.orgId),
      });
      queryClient.invalidateQueries({
        queryKey: [userProfile?.orgId, "students"],
      });
    },
  });
}

export interface StaffIdCard {
  id: string;
  studentId: string;
  studentName: string;
  className?: string | null;
  section?: string | null;
  batch?: string | null;
  cardNumber: string;
  status: "active" | "inactive";
  issuedAt: string;
  updatedAt?: string | null;
}

export interface CertificateRecord {
  id: string;
  studentId: string;
  studentName: string;
  className?: string | null;
  certificateNumber: string;
  title: string;
  issueDate: string;
  description?: string | null;
  status: "issued" | "revoked";
  createdAt: string;
}

function organizationCollection(orgId: string, collectionName: string) {
  return collection(db, "organizations", orgId, collectionName);
}

export const getStaffIdCardsQueryKey = (orgId?: string | null) => [
  orgId,
  "administrative_staff",
  "id_cards",
];

export function useStaffIdCards() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;

  return useQuery({
    queryKey: getStaffIdCardsQueryKey(orgId),
    queryFn: async () => {
      if (!orgId) return [] as StaffIdCard[];
      const snapshot = await getDocs(organizationCollection(orgId, "id_cards"));
      return snapshot.docs
        .map((card) => {
          const data = card.data();
          return {
            id: card.id,
            studentId: String(data.studentId ?? card.id),
            studentName: String(data.studentName ?? "Unnamed student"),
            className: (data.className as string | null | undefined) ?? null,
            section: (data.section as string | null | undefined) ?? null,
            batch: (data.batch as string | null | undefined) ?? null,
            cardNumber: String(data.cardNumber ?? "Not assigned"),
            status: (data.status as StaffIdCard["status"] | undefined) ?? "active",
            issuedAt: toIsoString(data.issuedAt),
            updatedAt: data.updatedAt ? toIsoString(data.updatedAt) : null,
          } satisfies StaffIdCard;
        })
        .sort((a, b) => a.studentName.localeCompare(b.studentName));
    },
    enabled: Boolean(orgId),
    staleTime: 30_000,
  });
}

export function useIssueIdCard() {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      student,
      status = "active",
    }: {
      student: {
        id: string;
        name?: string | null;
        className?: string | null;
        section?: string | null;
        batch?: string | null;
      };
      status?: StaffIdCard["status"];
    }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No organization is associated with this account.");

      const cardRef = doc(db, "organizations", orgId, "id_cards", student.id);
      const cardNumber = `EDU-${student.id.slice(0, 6).toUpperCase()}-${new Date().getFullYear()}`;
      await setDoc(
        cardRef,
        {
          studentId: student.id,
          studentName: student.name ?? "Unnamed student",
          className: student.className ?? null,
          section: student.section ?? null,
          batch: student.batch ?? null,
          cardNumber,
          status,
          issuedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          issuedBy: userProfile?.name ?? userProfile?.email ?? "Administrative staff",
        },
        { merge: true },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getStaffIdCardsQueryKey(userProfile?.orgId) });
    },
  });
}

export const getStaffCertificatesQueryKey = (orgId?: string | null) => [
  orgId,
  "administrative_staff",
  "certificates",
];

export function useStaffCertificates() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;

  return useQuery({
    queryKey: getStaffCertificatesQueryKey(orgId),
    queryFn: async () => {
      if (!orgId) return [] as CertificateRecord[];
      const snapshot = await getDocs(organizationCollection(orgId, "certificates"));
      return snapshot.docs
        .map((certificate) => {
          const data = certificate.data();
          return {
            id: certificate.id,
            studentId: String(data.studentId ?? ""),
            studentName: String(data.studentName ?? "Unnamed student"),
            className: (data.className as string | null | undefined) ?? null,
            certificateNumber: String(data.certificateNumber ?? "Not assigned"),
            title: String(data.title ?? "Certificate"),
            issueDate: String(data.issueDate ?? ""),
            description: (data.description as string | null | undefined) ?? null,
            status: (data.status as CertificateRecord["status"] | undefined) ?? "issued",
            createdAt: toIsoString(data.createdAt),
          } satisfies CertificateRecord;
        })
        .sort((a, b) => new Date(b.issueDate || b.createdAt).getTime() - new Date(a.issueDate || a.createdAt).getTime());
    },
    enabled: Boolean(orgId),
    staleTime: 30_000,
  });
}

export function useCreateCertificate() {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      student,
      title,
      issueDate,
      description,
    }: {
      student: { id: string; name?: string | null; className?: string | null };
      title: string;
      issueDate: string;
      description?: string;
    }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No organization is associated with this account.");
      const certificateRef = doc(organizationCollection(orgId, "certificates"));
      await setDoc(certificateRef, {
        studentId: student.id,
        studentName: student.name ?? "Unnamed student",
        className: student.className ?? null,
        certificateNumber: `CERT-${certificateRef.id.slice(0, 8).toUpperCase()}`,
        title,
        issueDate,
        description: description?.trim() || null,
        status: "issued",
        createdAt: serverTimestamp(),
        issuedBy: userProfile?.name ?? userProfile?.email ?? "Administrative staff",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getStaffCertificatesQueryKey(userProfile?.orgId) });
    },
  });
}