import { useEffect, useState } from "react";
import { sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {
  Building2,
  Check,
  Copy,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { auth, db } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdministrativeStaffProfileSettings() {
  const { user, userProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(
    userProfile?.name ?? user?.displayName ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDisplayName(userProfile?.name ?? user?.displayName ?? "");
  }, [user?.displayName, userProfile?.name]);

  async function handleSaveProfile() {
    if (!user || !userProfile) return;

    const nextName = displayName.trim();
    if (nextName.length < 2) {
      toast({
        title: "Enter a valid name",
        description: "Your display name must be at least 2 characters.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: nextName,
        updatedAt: serverTimestamp(),
      });
      await updateProfile(user, { displayName: nextName });
      await refreshProfile();
      toast({
        title: "Profile saved",
        description: "Your staff profile has been updated.",
      });
    } catch {
      toast({
        title: "Could not save profile",
        description:
          "Please try again. Your organization access was not changed.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSendPasswordReset() {
    if (!user?.email) return;

    setSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: "Password reset email sent",
        description: `Check ${user.email} for a secure password reset link.`,
      });
    } catch {
      toast({
        title: "Could not send reset email",
        description: "Please wait a moment and try again.",
        variant: "destructive",
      });
    } finally {
      setSendingReset(false);
    }
  }

  async function handleCopyOrgId() {
    if (!userProfile?.orgId) return;
    try {
      await navigator.clipboard.writeText(userProfile.orgId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast({ title: "Organization ID copied" });
    } catch {
      toast({
        title: "Could not copy organization ID",
        description: "Select the ID manually and copy it from the field.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="app-command-surface mx-auto max-w-5xl space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Account workspace
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Profile & Settings
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Keep your staff identity current and manage the security of your
            EduTrack account.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit border-primary/20 bg-primary/5 text-primary"
        >
          Administrative Staff
        </Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)]">
        <Card className="border-border/70 bg-card/80 shadow-[0_20px_60px_rgba(35,31,76,0.08)] backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Personal profile</CardTitle>
                <CardDescription>
                  Use the name your organization recognizes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="staff-display-name">Display name</Label>
              <Input
                id="staff-display-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                className="h-11"
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-email">Email address</Label>
              <Input
                id="staff-email"
                value={user?.email ?? "—"}
                readOnly
                className="h-11 cursor-not-allowed bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Your email is managed by the organization and cannot be edited
                here.
              </p>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={saving || !userProfile}
              className="w-full sm:w-auto"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {saving ? "Saving profile…" : "Save profile"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70 bg-card/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle>Password & security</CardTitle>
                  <CardDescription>
                    Reset your password through a secure email link.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleSendPasswordReset}
                disabled={sendingReset || !user?.email}
                className="w-full"
              >
                {sendingReset ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Mail className="h-4 w-4" aria-hidden="true" />
                )}
                {sendingReset
                  ? "Sending reset link…"
                  : "Send password reset link"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle>Organization access</CardTitle>
                  <CardDescription>
                    Your role and organization scope.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-role">Role</Label>
                <Input
                  id="staff-role"
                  value="Administrative Staff"
                  readOnly
                  className="h-11 bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-organization">Organization</Label>
                <Input
                  id="staff-organization"
                  value={userProfile?.orgName ?? "—"}
                  readOnly
                  className="h-11 bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-org-id">Organization ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="staff-org-id"
                    value={userProfile?.orgId ?? "—"}
                    readOnly
                    className="h-11 min-w-0 bg-muted font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyOrgId}
                    disabled={!userProfile?.orgId}
                    aria-label={
                      copied ? "Organization ID copied" : "Copy organization ID"
                    }
                    title={copied ? "Copied" : "Copy organization ID"}
                  >
                    {copied ? (
                      <Check
                        className="h-4 w-4 text-emerald-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
