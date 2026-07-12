/**
 * Super Admin exclusive hooks — all Firestore queries here read across
 * the entire platform (not scoped to a single org).
 *
 * These hooks do NOT check the caller's role — route-level guards in
 * App.tsx ensure only authenticated super_admin users can reach pages
 * that use these hooks.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection, getDocs, getDoc, updateDoc, deleteDoc,
  doc, addDoc, query, orderBy, limit, serverTimestamp,
  where, Timestamp, writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

function ts(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  return String(val);
}

function mapDoc(d: any) {
  const data = d.data();
  return { id: d.id, ...data, createdAt: ts(data.createdAt) };
}

// ── Organizations ──────────────────────────────────────────────────────────────

export function useListOrganizations() {
  return useQuery({
    queryKey: ["super_admin", "organizations"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "organizations"));
      return snap.docs.map(mapDoc) as any[];
    },
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; adminEmail: string }) => {
      const ref = await addDoc(collection(db, "organizations"), {
        ...data,
        createdAt: serverTimestamp(),
        status: "active",
        plan: "free",
        paymentStatus: "unpaid",
      });
      return { id: ref.id };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super_admin", "organizations"] });
      qc.invalidateQueries({ queryKey: ["super_admin", "stats"] });
    },
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      await updateDoc(doc(db, "organizations", id), { ...data, updatedAt: serverTimestamp() });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super_admin", "organizations"] });
      qc.invalidateQueries({ queryKey: ["super_admin", "stats"] });
    },
  });
}

export function useDeleteOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteDoc(doc(db, "organizations", id));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super_admin", "organizations"] });
      qc.invalidateQueries({ queryKey: ["super_admin", "stats"] });
    },
  });
}

// ── Detailed Stats ─────────────────────────────────────────────────────────────

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  basic: 499,
  pro: 999,
};

export function useSuperAdminDetailedStats() {
  return useQuery({
    queryKey: ["super_admin", "stats"],
    queryFn: async () => {
      const [orgsSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, "organizations")),
        getDocs(collection(db, "users")),
      ]);

      const orgs = orgsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
      const users = usersSnap.docs.map((d) => d.data() as any);

      const activeOrgs = orgs.filter((o) => o.status !== "paused").length;
      const pausedOrgs = orgs.filter((o) => o.status === "paused").length;
      const paidOrgs = orgs.filter((o) => o.paymentStatus === "paid").length;
      const unpaidOrgs = orgs.filter((o) => o.paymentStatus !== "paid").length;

      const planBreakdown = {
        free: orgs.filter((o) => !o.plan || o.plan === "free").length,
        basic: orgs.filter((o) => o.plan === "basic").length,
        pro: orgs.filter((o) => o.plan === "pro").length,
      };

      const mrr = orgs
        .filter((o) => o.paymentStatus === "paid" && o.status !== "paused")
        .reduce((sum, o) => sum + (PLAN_PRICES[o.plan ?? "free"] ?? 0), 0);

      // Total revenue: sum from payment history collection if it exists, else estimate
      let totalRevenue = mrr;
      try {
        const pmtSnap = await getDocs(collection(db, "platform_payments"));
        if (pmtSnap.size > 0) {
          totalRevenue = pmtSnap.docs.reduce((sum, d) => sum + (Number((d.data() as any).amount) || 0), 0);
        }
      } catch {
        // ignore — collection may not exist yet
      }

      return {
        totalOrgs: orgsSnap.size,
        activeOrgs,
        pausedOrgs,
        paidOrgs,
        unpaidOrgs,
        totalOrgAdmins: users.filter((u) => u.role === "org_admin").length,
        totalTeachers: users.filter((u) => u.role === "teacher").length,
        totalStudents: users.filter((u) => u.role === "student").length,
        totalUsers: usersSnap.size,
        mrr,
        totalRevenue,
        planBreakdown,
      };
    },
  });
}

// ── Users ──────────────────────────────────────────────────────────────────────

export function useListAllUsers(search?: string) {
  return useQuery({
    queryKey: ["super_admin", "users", search ?? ""],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "users"));
      let rows = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as any));

      if (search) {
        const s = search.toLowerCase();
        rows = rows.filter(
          (u) =>
            u.email?.toLowerCase().includes(s) ||
            u.name?.toLowerCase().includes(s) ||
            u.uid?.toLowerCase().includes(s) ||
            u.orgId?.toLowerCase().includes(s),
        );
      }

      return rows.sort((a, b) => {
        const ta = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: Record<string, unknown> }) => {
      await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["super_admin", "users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid }: { uid: string }) => {
      await deleteDoc(doc(db, "users", uid));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super_admin", "users"] });
      qc.invalidateQueries({ queryKey: ["super_admin", "stats"] });
    },
  });
}

// ── Payment History ────────────────────────────────────────────────────────────

export function useListPaymentHistory() {
  return useQuery({
    queryKey: ["super_admin", "payments"],
    queryFn: async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "platform_payments"), orderBy("createdAt", "desc")),
        );
        return snap.docs.map(mapDoc) as any[];
      } catch {
        return [] as any[];
      }
    },
  });
}

export function useAddPaymentRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      orgId: string;
      orgName: string;
      amount: number;
      plan: string;
      month: string;
      note?: string;
    }) => {
      await addDoc(collection(db, "platform_payments"), {
        ...data,
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super_admin", "payments"] });
      qc.invalidateQueries({ queryKey: ["super_admin", "stats"] });
    },
  });
}

// ── Activity Logs ──────────────────────────────────────────────────────────────

export function useRecentActivityLogs(limitCount = 50) {
  return useQuery({
    queryKey: ["super_admin", "activity", limitCount],
    queryFn: async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, "super_admin_logs"),
            orderBy("createdAt", "desc"),
            limit(limitCount),
          ),
        );
        return snap.docs.map(mapDoc) as any[];
      } catch {
        return [] as any[];
      }
    },
  });
}

export async function logSuperAdminAction(params: {
  action: string;
  actorEmail: string;
  targetId?: string;
  targetType?: string;
  orgName?: string;
  details?: Record<string, unknown>;
}) {
  try {
    await addDoc(collection(db, "super_admin_logs"), {
      ...params,
      createdAt: serverTimestamp(),
    });
  } catch {
    // non-critical — don't throw
  }
}
