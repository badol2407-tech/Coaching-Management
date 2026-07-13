/**
 * ImpersonationBanner — shown at the top of any page while a Super Admin
 * is viewing an organisation portal as a specific role.
 * Always visible, cannot be dismissed, and exits cleanly on button click.
 */

import { useImpersonation } from "@/contexts/ImpersonationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogOut } from "lucide-react";

export function ImpersonationBanner() {
  const { impersonation, exitImpersonation } = useImpersonation();
  const { user } = useAuth();

  if (!impersonation) return null;

  const roleLabel =
    impersonation.role === "org_admin"
      ? "Org Admin"
      : impersonation.role === "teacher"
      ? "Teacher"
      : "Student";

  async function handleExit() {
    await exitImpersonation(user?.email ?? "");
  }

  return (
    <div className="sticky top-0 z-[9999] w-full bg-amber-500 text-white px-4 py-2 flex items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2 min-w-0">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span className="text-sm font-semibold truncate">
          Viewing as {roleLabel} —{" "}
          <span className="font-bold">{impersonation.orgName}</span>
          <span className="font-normal ml-1 opacity-90">
            ({impersonation.targetEmail})
          </span>
        </span>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleExit}
        className="shrink-0 bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white gap-1.5 h-7 text-xs"
      >
        <LogOut className="h-3 w-3" />
        Exit &amp; Return to Super Admin
      </Button>
    </div>
  );
}
