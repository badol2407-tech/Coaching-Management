import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useOrgMembers } from "@/lib/class-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleLabel: Record<string, string> = {
  org_admin: "Admin",
  teacher: "Teacher",
  student: "Student",
};

const roleColor: Record<string, string> = {
  org_admin: "default",
  teacher: "secondary",
  student: "outline",
};

export default function Settings() {
  const { user, userProfile, refreshProfile } = useAuth();
  const { data: members = [], isLoading: membersLoading } = useOrgMembers();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
  }, [user?.displayName]);

  async function handleSaveProfile() {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() || null });
      await refreshProfile();
      toast({ title: "Profile updated!" });
    } catch {
      toast({ title: "Error saving profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  }

  function copyOrgId() {
    if (!userProfile?.orgId) return;
    navigator.clipboard.writeText(userProfile.orgId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Org Code Copied!", description: "Teachers ও Students এই code দিয়ে join করতে পারবে।" });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Organization ও profile settings</p>
      </div>

      <Tabs defaultValue="organization">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
        </TabsList>

        {/* Organization Tab */}
        <TabsContent value="organization" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Info</CardTitle>
              <CardDescription>আপনার coaching center-এর তথ্য</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Organization Name</Label>
                <Input value={userProfile?.orgName ?? "—"} readOnly className="bg-muted cursor-not-allowed" />
              </div>
              <div className="space-y-1">
                <Label>Admin Email</Label>
                <Input value={user?.email ?? "—"} readOnly className="bg-muted cursor-not-allowed" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization Code</CardTitle>
              <CardDescription>
                Teachers ও Students এই code ব্যবহার করে আপনার organization-এ join করবে। এটি share করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <code className="flex-1 text-sm font-mono break-all select-all">
                  {userProfile?.orgId ?? "—"}
                </code>
                <Button size="sm" variant="outline" onClick={copyOrgId} className="shrink-0 gap-1">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Teacher login করার সময় "Teacher হিসেবে Join করুন" → এই code দিবে।<br />
                Student login করার সময় "Student হিসেবে Join করুন" → এই code দিবে।<br />
                Admin join করতে হলে "Admin হিসেবে Join করুন" → এই code + তার email আপনার admin email হতে হবে।
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>আপনার personal তথ্য update করুন</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Display Name</Label>
                <Input
                  placeholder="আপনার নাম লিখুন"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={user?.email ?? "—"} readOnly className="bg-muted cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Email পরিবর্তন করা যাবে না।</p>
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Input value="Organization Admin" readOnly className="bg-muted cursor-not-allowed" />
              </div>
              <Button onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Members</CardTitle>
              <CardDescription>আপনার organization-এ join করা সবাই</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membersLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
                  ) : members.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        এখনো কোনো member নেই। Org Code share করুন।
                      </TableCell>
                    </TableRow>
                  ) : (
                    (members as any[]).map((m: any) => (
                      <TableRow key={m.uid}>
                        <TableCell className="font-medium">{m.name || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{m.email}</TableCell>
                        <TableCell>
                          <Badge variant={roleColor[m.role] as any}>{roleLabel[m.role] ?? m.role}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
