/**
 * Force Password Change page.
 * Shown to teachers/students on their first login (when mustChangePassword === true).
 * Prevents skipping — no nav, no back, no escape.
 */
import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  const labels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{labels[score]}</span>
        <span className="flex gap-2">
          {[
            ["8+ chars", password.length >= 8],
            ["Uppercase", /[A-Z]/.test(password)],
            ["Number", /[0-9]/.test(password)],
          ].map(([label, ok]) => (
            <span
              key={label as string}
              className={`flex items-center gap-0.5 ${ok ? "text-green-600" : ""}`}
            >
              {ok ? <CheckCircle2 className="h-3 w-3" /> : null}
              {label as string}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

export default function ForceChangePassword() {
  const { user, userProfile, refreshProfile, logout } = useAuth();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const isStrong =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (!isStrong) {
      toast({
        title: "Password too weak",
        description: "Use at least 8 characters with uppercase, lowercase and a number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Update Firebase Auth password
      await updatePassword(user, newPassword);

      // 2. Mark mustChangePassword = false in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        mustChangePassword: false,
      });

      // 3. Refresh profile so App.tsx removes this gate
      await refreshProfile();

      setDone(true);
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        toast({
          title: "Session expired",
          description: "Please log out and log back in, then change your password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Could not update password. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
        <Card className="w-full max-w-md shadow-2xl text-center">
          <CardContent className="pt-10 pb-8 space-y-5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">Password Updated!</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Your account is now secure. Redirecting you to the dashboard…
              </p>
            </div>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome, {userProfile?.name}!</h1>
          <p className="text-slate-400 text-sm">
            Your account was created by your organization admin.
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>Set Your Password</CardTitle>
            </div>
            <CardDescription>
              For your security, please create a new password before continuing.
              This step cannot be skipped.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <StrengthBar password={newPassword} />
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`pr-10 ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-destructive">Passwords don't match</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4 mr-2" />
                )}
                {loading ? "Updating…" : "Set Password & Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign-out escape */}
        <p className="text-center text-sm text-slate-500">
          Wrong account?{" "}
          <button onClick={logout} className="text-slate-300 hover:text-white underline">
            Sign out
          </button>
        </p>
      </div>
    </div>
  );
}
