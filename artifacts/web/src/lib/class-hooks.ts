import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, Timestamp, query, where,
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "@/contexts/AuthContext";

function ts(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  return String(val);
}

function mapDoc(d: any) {
  const data = d.data();
  return { id: d.id, ...data, createdAt: ts(data.createdAt) };
}

function orgCol(orgId: string, col: string) {
  return collection(db, "organizations", orgId, col);
}

function orgDocRef(orgId: string, col: string, id: string) {
  return doc(db, "organizations", orgId, col, id);
}

// ── Classes ────────────────────────────────────────────────────────────────────

export function useListClasses() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "classes"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "classes"));
      return snap.docs.map(mapDoc).sort((a: any, b: any) => a.name.localeCompare(b.name)) as any[];
    },
    enabled: !!orgId,
  });
}

export function useCreateClass() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      const ref = await addDoc(orgCol(orgId, "classes"), { ...data, createdAt: serverTimestamp() });
      return { id: ref.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "classes"] }),
  });
}

export function useUpdateClass() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await updateDoc(orgDocRef(orgId, "classes", id), data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "classes"] }),
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await deleteDoc(orgDocRef(orgId, "classes", id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "classes"] }),
  });
}

// ── Org Members (for Settings page) ───────────────────────────────────────────

export function useOrgMembers() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "members"],
    queryFn: async () => {
      if (!orgId) return [];
      const q = query(collection(db, "users"), where("orgId", "==", orgId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ uid: d.id, ...d.data() })) as any[];
    },
    enabled: !!orgId,
  });
}
