/**
 * Public, unauthenticated read hooks used by the marketing landing page.
 *
 * These only touch Firestore collections that are readable without sign-in
 * per firestore.rules (`testimonials`, `popup_offers`). Never fabricate a
 * fallback here if the read fails or is empty — the caller must render an
 * honest empty state instead of fake/demo data.
 */
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  normalizeLandingLayout,
  type LandingPageLayout,
} from "@/lib/landing-layout";

export interface PublicTestimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating: number;
  avatar?: string;
}

/** Active, admin-approved testimonials only — same collection the Super Admin manages. */
export function usePublicTestimonials() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<PublicTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "testimonials"), where("active", "==", true)),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (PublicTestimonial & {
          createdAt?: { seconds?: number };
        })[];
        const next = docs.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setData(next);
        queryClient.setQueryData(["public", "testimonials"], next);
        setIsLoading(false);
      },
      () => {
        setData([]);
        queryClient.setQueryData(["public", "testimonials"], []);
        setIsLoading(false);
      },
    );
    return unsubscribe;
  }, [queryClient]);

  return useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: async () => data,
    initialData: [],
    staleTime: Infinity,
    enabled: !isLoading,
  });
}

export function usePublicLandingLayout() {
  const [data, setData] = useState<LandingPageLayout | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "landing_page_layouts", "public"),
      (snap) => setData(snap.exists() ? normalizeLandingLayout(snap.data()) : null),
      () => setData(null),
    );
    return unsubscribe;
  }, []);

  return data;
}
