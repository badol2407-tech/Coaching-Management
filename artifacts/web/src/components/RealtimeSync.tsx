import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  type DocumentData,
  type DocumentReference,
  type Query,
} from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

type SyncState = "connecting" | "live" | "offline";

const ORG_COLLECTIONS_BY_ROLE = {
  org_admin: [
    "students",
    "teachers",
    "classes",
    "attendance",
    "fees",
    "exams",
    "results",
    "routine",
    "homework",
    "notices",
    "expenses",
    "admission_requests",
    "teacher_requests",
    "guardian_conversations",
    "leave_requests",
    "notifications",
  ],
  teacher: [
    "students",
    "teachers",
    "classes",
    "attendance",
    "fees",
    "exams",
    "results",
    "routine",
    "homework",
    "notices",
    "guardian_conversations",
    "leave_requests",
    "notifications",
  ],
  student: [
    "attendance",
    "fees",
    "exams",
    "results",
    "routine",
    "homework",
    "notices",
  ],
  // Guardian-specific collections use child/ownership-constrained listeners
  // in hooks.ts. An unfiltered org listener would correctly be rejected by
  // Firestore rules, so do not create one here.
  guardian: [],
} as const;

const PLATFORM_COLLECTIONS = [
  "organizations",
  "users",
  "platform_payments",
  "super_admin_logs",
  "platform_settings",
  "coupon_codes",
  "testimonials",
  "demo_leads",
  "popup_offers",
] as const;

function invalidateOrgCollection(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  collectionName: string,
) {
  void queryClient.invalidateQueries({ queryKey: [orgId, collectionName] });
  void queryClient.invalidateQueries({ queryKey: [orgId, "dashboard"] });

  if (collectionName === "students") {
    void queryClient.invalidateQueries({ queryKey: [orgId, "my_student_record"] });
  }
  if (collectionName === "attendance") {
    void queryClient.invalidateQueries({ queryKey: [orgId, "my_attendance"] });
  }
  if (collectionName === "fees") {
    void queryClient.invalidateQueries({ queryKey: [orgId, "my_fees"] });
  }
  if (collectionName === "results") {
    void queryClient.invalidateQueries({ queryKey: [orgId, "my_results"] });
  }
}

function invalidatePlatformCollection(
  queryClient: ReturnType<typeof useQueryClient>,
  collectionName: string,
) {
  const keyByCollection: Record<string, readonly unknown[]> = {
    organizations: ["super_admin", "organizations"],
    users: ["super_admin", "users"],
    platform_payments: ["super_admin", "payments"],
    super_admin_logs: ["super_admin", "activity"],
    platform_settings: ["super_admin", "platform_settings"],
    coupon_codes: ["super_admin", "coupons"],
    testimonials: ["super_admin", "testimonials"],
    demo_leads: ["super_admin", "demo_leads"],
    popup_offers: ["super_admin", "popup_offers"],
  };

  const key = keyByCollection[collectionName];
  if (key) void queryClient.invalidateQueries({ queryKey: key });

  if (collectionName === "organizations" || collectionName === "users" || collectionName === "platform_payments") {
    void queryClient.invalidateQueries({ queryKey: ["super_admin", "stats"] });
  }
  if (collectionName === "testimonials") {
    void queryClient.invalidateQueries({ queryKey: ["public", "testimonials"] });
  }
}

function RealtimeStatus({ state }: { state: SyncState }) {
  const copy = {
    connecting: "Connecting",
    live: "Live",
    offline: "Offline",
  }[state];
  const dot = {
    connecting: "bg-amber-400 animate-pulse",
    live: "bg-emerald-400",
    offline: "bg-rose-400",
  }[state];

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] hidden items-center gap-2 rounded-full border border-border/70 bg-background/90 px-3 py-2 text-[11px] font-medium text-muted-foreground shadow-lg backdrop-blur-md sm:flex"
      role="status"
      aria-label={`Realtime synchronization ${copy.toLowerCase()}`}
      title="Portal data synchronization status"
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
      <span>Sync {copy}</span>
    </div>
  );
}

/**
 * Keeps every active portal's TanStack Query cache aligned with Firestore.
 *
 * Firestore is the shared source of truth: org-scoped portals subscribe to the
 * collections their role is allowed to read, while Super Admin subscribes to
 * the platform collections. A snapshot invalidates every related list,
 * dashboard aggregate, and student-specific view so open sessions update
 * without a manual refresh.
 */
export function RealtimeSync() {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [state, setState] = useState<SyncState>("connecting");

  const orgCollections = useMemo(() => {
    if (!userProfile?.orgId || userProfile.role === "super_admin") return [];
    return [...ORG_COLLECTIONS_BY_ROLE[userProfile.role]];
  }, [userProfile?.orgId, userProfile?.role]);

  useEffect(() => {
    if (!userProfile) {
      setState("connecting");
      return;
    }

    const unsubscribers: Array<() => void> = [];
    let activeListeners = 0;
    let failedListeners = 0;
    setState("connecting");

    const handleReady = (fromCache: boolean) => {
      if (fromCache && activeListeners === 0) {
        setState("connecting");
        return;
      }
      setState(failedListeners > activeListeners ? "offline" : "live");
    };

    const listenToCollection = (
      collectionRef: Query<DocumentData> | DocumentReference<DocumentData>,
      onChange: () => void,
    ) => {
      const unsubscribe = onSnapshot(
        collectionRef as any,
        { includeMetadataChanges: true },
        (snapshot: any) => {
          activeListeners += 1;
          onChange();
          handleReady(snapshot.metadata.fromCache);
        },
        () => {
          failedListeners += 1;
          setState(failedListeners >= Math.max(activeListeners, 1) ? "offline" : "live");
        },
      );
      unsubscribers.push(unsubscribe);
    };

    if (userProfile.role === "super_admin") {
      for (const collectionName of PLATFORM_COLLECTIONS) {
        listenToCollection(collection(db, collectionName), () =>
          invalidatePlatformCollection(queryClient, collectionName),
        );
      }
    } else if (userProfile.orgId) {
      for (const collectionName of orgCollections) {
        listenToCollection(collection(db, "organizations", userProfile.orgId, collectionName), () =>
          invalidateOrgCollection(queryClient, userProfile.orgId!, collectionName),
        );
      }

      listenToCollection(
        doc(db, "organizations", userProfile.orgId),
        () => {
          void queryClient.invalidateQueries({ queryKey: [userProfile.orgId, "organization"] });
        },
      );
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [orgCollections, queryClient, userProfile]);

  return <RealtimeStatus state={state} />;
}