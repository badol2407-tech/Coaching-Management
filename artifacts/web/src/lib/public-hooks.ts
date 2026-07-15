/**
 * Public, unauthenticated read hooks used by the marketing landing page.
 *
 * These only touch Firestore collections that are readable without sign-in
 * per firestore.rules (`testimonials`, `popup_offers`). Never fabricate a
 * fallback here if the read fails or is empty — the caller must render an
 * honest empty state instead of fake/demo data.
 */
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  return useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: async () => {
      // Equality-only filter (no orderBy) so this never needs a manually
      // created Firestore composite index; sort client-side instead.
      const snap = await getDocs(
        query(collection(db, "testimonials"), where("active", "==", true)),
      );
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (PublicTestimonial & {
        createdAt?: { seconds?: number };
      })[];
      return docs.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
    },
    staleTime: 5 * 60 * 1000,
  });
}
