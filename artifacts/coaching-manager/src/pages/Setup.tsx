import { useState } from "react";
import { doc, setDoc, addDoc, collection, serverTimestamp, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Building2, Users, UserCheck, Loader2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Mode = "choose" | "create_org" | "join_teacher" | "join_student" | "join_admin";

export default function Setup() {
  const { user, logout, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("choose");
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateOrg() {
    if (!orgName.trim() || !user) return;
    setLoading(true);
    try {
      const orgRef = await addDoc(collection(db, "organizations"), {
        name: orgName.trim(),
        adminEmail: user.email,
        createdAt: serverTimestamp(),
        status: "active",
      });
      await setDoc(doc(db, "users", user.uid), {
        role: "org_admin",
        orgId: orgRef.id,
        name: user.displayName || user.email,
        email: user.email,
      });
      await refreshProfile();
    } catch (err: any) {
      console.error("Create org error:", err);
      const msg = err?.code === "permission-denied"
        ? "Firebase Security Rules allow করা নেই। Firebase Console → Firestore → Rules-এ allow করুন।"
        : err?.message || "Organization তৈরি করা যায়নি।";
      toast({ title: "Error", description: msg, variant: "destructive" });
      setLoading(false);
    }
  }

  async function handleJoin(role: "teacher" | "student" | "org_admin") {
    if (!orgId.trim() || !user) return;
    setLoading(true);
    try {
      const orgSnap = await getDoc(doc(db, "organizations", orgId.trim()));
      if (!orgSnap.exists()) {
        toast({ title: "ভুল Org Code", description: "এই ID দিয়ে কোনো organization পাওয়া যায়নি।", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (role === "org_admin") {
        const orgData = orgSnap.data() as any;
        if (orgData.adminEmail !== user.email) {
          toast({ title: "অনুমতি নেই", description: `এই organization-এর admin email মিলছে না।`, variant: "destructive" });
          setLoading(false);
          return;
        }
      }

      // Step 1: write user profile with orgId first so security rules grant access
      const profileData: Record<string, unknown> = {
        role,
        orgId: orgId.trim(),
        name: user.displayName || user.email,
        email: user.email,
      };
      await setDoc(doc(db, "users", user.uid), profileData);

      // Step 2: now that user has orgId, look up their student record
      if (role === "student") {
        try {
          const studSnap = await getDocs(
            query(collection(db, "organizations", orgId.trim(), "students"), where("email", "==", user.email))
          );
          if (!studSnap.empty) {
            await setDoc(doc(db, "users", user.uid), { studentId: studSnap.docs[0].id }, { merge: true });
          }
        } catch {
          // studentId lookup failed — not critical, portal still works
        }
      }

      await refreshProfile();
    } catch (err: any) {
      console.error("Join error:", err);
      const msg = err?.code === "permission-denied"
        ? "Firebase Security Rules allow করা নেই। Firebase Console → Firestore → Rules-এ allow করুন।"
        : err?.message || "Join করা যায়নি।";
      toast({ title: "Error", description: msg, variant: "destructive" });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">EduTrack-এ স্বাগতম!</h1>
          <p className="text-slate-400 text-sm">{user?.email}</p>
        </div>

        {mode === "choose" && (
          <Card>
            <CardHeader>
              <CardTitle>আপনি কে?</CardTitle>
              <CardDescription>আপনার role বেছে নিন</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <button
                onClick={() => setMode("create_org")}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">নতুন Organization তৈরি করুন</p>
                  <p className="text-sm text-muted-foreground">Coaching center admin হিসেবে register করুন</p>
                </div>
              </button>

              <button
                onClick={() => setMode("join_admin")}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">Organization Admin হিসেবে Join করুন</p>
                  <p className="text-sm text-muted-foreground">Super Admin আপনার email দিয়ে org তৈরি করেছেন</p>
                </div>
              </button>

              <button
                onClick={() => setMode("join_teacher")}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Teacher হিসেবে Join করুন</p>
                  <p className="text-sm text-muted-foreground">Organization Code দিয়ে যোগ দিন</p>
                </div>
              </button>

              <button
                onClick={() => setMode("join_student")}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold">Student হিসেবে Join করুন</p>
                  <p className="text-sm text-muted-foreground">Organization Code দিয়ে যোগ দিন</p>
                </div>
              </button>

              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" /> অন্য account দিয়ে login করুন
              </Button>
            </CardContent>
          </Card>
        )}

        {mode === "create_org" && (
          <Card>
            <CardHeader>
              <CardTitle>নতুন Organization তৈরি করুন</CardTitle>
              <CardDescription>আপনি এই coaching center-এর admin হবেন</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Coaching Center-এর নাম *</Label>
                <Input
                  placeholder="যেমন: Brilliant Academy"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMode("choose")} className="flex-1">পিছে</Button>
                <Button onClick={handleCreateOrg} disabled={loading || !orgName.trim()} className="flex-1">
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  তৈরি করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(mode === "join_teacher" || mode === "join_student" || mode === "join_admin") && (
          <Card>
            <CardHeader>
              <CardTitle>
                {mode === "join_teacher" ? "Teacher হিসেবে Join করুন" : mode === "join_student" ? "Student হিসেবে Join করুন" : "Admin হিসেবে Join করুন"}
              </CardTitle>
              <CardDescription>
                {mode === "join_admin"
                  ? "Super Admin আপনার email দিয়ে organization তৈরি করেছেন। Organization Code দিন।"
                  : "আপনার admin-এর কাছ থেকে Organization Code নিন।"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Organization Code *</Label>
                <Input
                  placeholder="যেমন: abc123def456"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Admin-এর dashboard থেকে এই code পাওয়া যাবে।</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setMode("choose"); setOrgId(""); }} className="flex-1">পিছে</Button>
                <Button
                  onClick={() => handleJoin(mode === "join_teacher" ? "teacher" : mode === "join_student" ? "student" : "org_admin")}
                  disabled={loading || !orgId.trim()}
                  className="flex-1"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Join করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
