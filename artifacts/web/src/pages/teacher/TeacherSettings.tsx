import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TeacherSettings() {
  const { user, userProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
  }, [user?.displayName]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() || null });
      await refreshProfile();
      toast({ title: "Profile updated!" });
    } catch {
      toast({ title: "Error saving profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground">Profile ও account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>আপনার personal তথ্য update করুন</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="আপনার নাম লিখুন"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? "—"} readOnly className="h-11 bg-muted cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value="Teacher" readOnly className="h-11 bg-muted cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" value={userProfile?.orgName ?? "—"} readOnly className="h-11 bg-muted cursor-not-allowed" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="h-11 w-full sm:w-auto">
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save করুন
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
