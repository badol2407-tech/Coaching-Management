import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export type GuardianChild = {
  id: string;
  name: string;
  className?: string | null;
  section?: string | null;
  batch?: string | null;
  photoUrl?: string | null;
  rollNumber?: string | null;
  status?: string | null;
  [key: string]: unknown;
};

type GuardianContextValue = {
  children: GuardianChild[];
  selectedChildId: string | null;
  selectedChild: GuardianChild | null;
  setSelectedChildId: (id: string) => void;
  loading: boolean;
};

const GuardianContext = createContext<GuardianContextValue | null>(null);

function getLinkedStudentIds(profile: ReturnType<typeof useAuth>["userProfile"]) {
  if (!profile) return [];
  const ids = [
    ...(profile.linkedStudentIds ?? []),
    ...(profile.studentIds ?? []),
    ...(profile.childrenIds ?? []),
    ...(profile.studentId ? [profile.studentId] : []),
  ];
  return [...new Set(ids.filter((id): id is string => typeof id === "string" && id.length > 0))];
}

export function GuardianProvider({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();
  const linkedIds = useMemo(() => getLinkedStudentIds(userProfile), [
    userProfile?.linkedStudentIds,
    userProfile?.studentIds,
    userProfile?.childrenIds,
    userProfile?.studentId,
  ]);
  const [records, setRecords] = useState<GuardianChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChildId, setSelectedChildIdState] = useState<string | null>(null);

  const storageKey = userProfile?.uid ? `edutrack_guardian_child:${userProfile.uid}` : null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setRecords([]);
    setSelectedChildIdState(null);

    if (!userProfile?.orgId || linkedIds.length === 0) {
      setLoading(false);
      return;
    }

    void Promise.all(
      linkedIds.map(async (studentId) => {
        const snapshot = await getDoc(
          doc(db, "organizations", userProfile.orgId!, "students", studentId),
        );
        return snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as GuardianChild)
          : null;
      }),
    )
      .then((nextRecords) => {
        if (cancelled) return;
        const next = nextRecords.filter((record): record is GuardianChild => record !== null);
        setRecords(next);
        let saved: string | null = null;
        if (storageKey) {
          try {
            saved = localStorage.getItem(storageKey);
          } catch {
            saved = null;
          }
        }
        const nextSelected = saved && next.some((record) => record.id === saved)
          ? saved
          : next[0]?.id ?? null;
        setSelectedChildIdState(nextSelected);
      })
      .catch(() => {
        if (!cancelled) setRecords([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [linkedIds, storageKey, userProfile?.orgId]);

  function setSelectedChildId(id: string) {
    if (!records.some((record) => record.id === id)) return;
    setSelectedChildIdState(id);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, id);
      } catch {
        // Local persistence is an enhancement; Firestore remains authoritative.
      }
    }
  }

  const selectedChild = records.find((record) => record.id === selectedChildId) ?? null;

  return (
    <GuardianContext.Provider
      value={{ children: records, selectedChildId, selectedChild, setSelectedChildId, loading }}
    >
      {children}
    </GuardianContext.Provider>
  );
}

export function useGuardianContext() {
  const value = useContext(GuardianContext);
  if (!value) throw new Error("useGuardianContext must be used inside GuardianProvider");
  return value;
}