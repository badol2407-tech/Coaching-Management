import { useState } from "react";
import { useListOrganizations, useCreateOrganization, useDeleteOrganization } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Copy, Loader2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageOrganizations() {
  const { data: orgs = [], isLoading } = useListOrganizations();
  const createOrg = useCreateOrganization();
  const deleteOrg = useDeleteOrganization();
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({ name: "", adminEmail: "" });

  function handleCreate() {
    if (!form.name.trim() || !form.adminEmail.trim()) {
      toast({ title: "সব field পূরণ করুন", variant: "destructive" });
      return;
    }
    createOrg.mutate(
      { name: form.name.trim(), adminEmail: form.adminEmail.trim() },
      {
        onSuccess: (res) => {
          toast({
            title: "Organization তৈরি হয়েছে!",
            description: `Org Code: ${res.id} — admin-কে এই code দিন।`,
          });
          setSheetOpen(false);
          setForm({ name: "", adminEmail: "" });
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" delete করবেন? এটা undo করা যাবে না।`)) return;
    deleteOrg.mutate({ id }, {
      onSuccess: () => toast({ title: "Organization deleted" }),
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  function copyCode(id: string) {
    navigator.clipboard.writeText(id);
    toast({ title: "Org Code Copied!", description: "Admin/Teacher/Student এই code দিয়ে join করবে।" });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">সব coaching centers manage করুন</p>
        </div>
        <Button onClick={() => setSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> নতুন Organization
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => <Card key={i}><CardContent className="h-32 animate-pulse bg-muted/30" /></Card>)}
        </div>
      ) : orgs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>কোনো organization নেই। উপরের বোতাম দিয়ে তৈরি করুন।</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orgs.map((org: any) => (
            <Card key={org.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{org.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{org.adminEmail}</p>
                  </div>
                  <Badge variant={org.status === "active" ? "default" : "secondary"}>
                    {org.status ?? "active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <p className="text-xs font-mono flex-1 truncate text-muted-foreground">{org.id}</p>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyCode(org.id)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(org.createdAt).toLocaleDateString("bn-BD")}
                </p>
                <div className="flex justify-end">
                  <Button
                    size="sm" variant="destructive"
                    onClick={() => handleDelete(org.id, org.name)}
                    disabled={deleteOrg.isPending}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader><SheetTitle>নতুন Organization তৈরি করুন</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Coaching Center-এর নাম *</Label>
              <Input
                placeholder="যেমন: Brilliant Academy"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Admin Email *</Label>
              <Input
                type="email"
                placeholder="admin@school.com"
                value={form.adminEmail}
                onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                এই email দিয়ে যে register করবে সে org admin হবে।
              </p>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleCreate} disabled={createOrg.isPending}>
              {createOrg.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              তৈরি করুন
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
