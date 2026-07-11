import { Building2, Users, GraduationCap, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuperAdminStats, useListOrganizations } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = useSuperAdminStats();
  const { data: orgs = [] } = useListOrganizations();

  const statCards = [
    { title: "Total Organizations", value: stats?.totalOrgs ?? 0, icon: Building2, color: "text-blue-500" },
    { title: "Org Admins", value: stats?.totalOrgAdmins ?? 0, icon: UserCheck, color: "text-purple-500" },
    { title: "Teachers", value: stats?.totalTeachers ?? 0, icon: Users, color: "text-green-500" },
    { title: "Students", value: stats?.totalStudents ?? 0, icon: GraduationCap, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">সব organizations-এর overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse bg-muted rounded" />
              ) : (
                <div className="text-3xl font-bold">{c.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সব Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {orgs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              এখনো কোনো organization নেই। Organizations পেজ থেকে তৈরি করুন।
            </div>
          ) : (
            <div className="space-y-3">
              {orgs.map((org: any) => (
                <div key={org.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-sm text-muted-foreground">{org.adminEmail}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">ID: {org.id}</p>
                  </div>
                  <Badge variant={org.status === "active" ? "default" : "secondary"}>
                    {org.status ?? "active"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
