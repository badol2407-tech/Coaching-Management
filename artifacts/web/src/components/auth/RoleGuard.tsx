import { Redirect } from "wouter";
import { useAuth, type UserRole } from "@/contexts/AuthContext";

interface RoleGuardProps {
  allowedRoles: readonly UserRole[];
  children: React.ReactNode;
  fallbackPath?: string;
}

/**
 * Route-level presentation guard. Firestore rules remain the security
 * boundary; this prevents an authenticated user from rendering another
 * role's portal through a copied URL.
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallbackPath = "/",
}: RoleGuardProps) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" role="status">
        Loading…
      </div>
    );
  }

  if (!user || !userProfile || !allowedRoles.includes(userProfile.role)) {
    return <Redirect to={fallbackPath} />;
  }

  return <>{children}</>;
}