/**
 * Setup page — shown when a Firebase Auth user has no Firestore profile.
 *
 * Organization admins can create their own workspace from the public signup
 * flow. Teachers and students are still created by an organization admin.
 * If someone lands here, their authenticated account has no matching profile.
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
            <h1 className="text-lg font-bold text-white">Profile setup incomplete</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your account{" "}
              <span className="text-slate-300 font-medium">{user?.email}</span>{" "}
              does not have a profile set up yet.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your sign-in worked, but the EduTrack profile could not be loaded. Sign out and try again. If this continues, ask your organization admin to confirm your account was added from the dashboard.
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
