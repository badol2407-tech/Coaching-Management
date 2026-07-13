import { GraduationCap, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">

      {/* ── Top Bar ── */}
      <header
        className="sticky top-0 z-40 border-b border-border/60"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1a0533 50%, #0f172a 100%)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(168,85,247,0.15)",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent pointer-events-none" />

        <div className="flex items-center h-14 px-4 justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-md shadow-purple-500/40">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">EduTrack</p>
              {userProfile?.orgName && (
                <p className="text-purple-300/70 text-[10px] leading-none mt-0.5">{userProfile.orgName}</p>
              )}
            </div>
          </div>

          {/* Student badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(139,92,246,0.08))",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
          >
            <span className="text-xs font-semibold text-purple-300">Student Portal</span>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors"
              style={{ background: userMenuOpen ? "rgba(255,255,255,0.08)" : undefined }}
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {(userProfile?.name || user?.email || "S")[0].toUpperCase()}
              </div>
              <span className="hidden sm:block text-xs text-slate-300 max-w-[80px] truncate">
                {userProfile?.name || user?.displayName}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div
                  className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl py-1 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #0f172a)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">{userProfile?.name || user?.displayName}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    <p className="text-xs text-purple-400 mt-0.5">Student</p>
                  </div>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
