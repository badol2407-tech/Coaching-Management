/**
 * Setup page — shown when a Firebase Auth user has no Firestore profile.
 *
 * In the new flow, all accounts (org_admin, teacher, student) are pre-created
 * by an admin. Nobody self-registers or enters an Org ID manually.
 * If someone lands here it means their profile wasn't written correctly — they
 * should contact their admin.
 */
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldAlert, LogOut } from "lucide-react";

export default function Setup() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <GraduationCap className="h-9 w-9 text-primary" />
          </div>
        </div>

        {/* Error card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-amber-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-bold text-white">Account Not Configured</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your account{" "}
              <span className="text-slate-300 font-medium">{user?.email}</span>{" "}
              does not have a profile set up yet.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Please contact your organization admin to set up your account. Your admin needs to add you as a teacher or student from their dashboard.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <p className="text-xs text-slate-600">
          EduTrack · Coaching Management System
        </p>
      </div>
    </div>
  );
}
