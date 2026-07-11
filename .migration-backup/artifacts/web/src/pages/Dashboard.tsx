import { useGetDashboardStats, useGetAttendanceSummary, useGetRecentFees } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Wallet, AlertCircle, Receipt, CalendarCheck, ClipboardList, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: summary } = useGetAttendanceSummary();
  const { data: recentFees } = useGetRecentFees();

  const chartData =
    summary?.map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-BD", { month: "short", day: "numeric" }),
      Present: s.present,
      Absent: s.absent,
    })) ?? [];

  if (statsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 h-24 animate-pulse bg-muted/50" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon={Users} color="bg-blue-600" />
        <StatCard title="Total Teachers" value={stats?.totalTeachers ?? 0} icon={GraduationCap} color="bg-indigo-600" />
        <StatCard title="Fee Collected" value={`৳${(stats?.totalFeeCollected ?? 0).toLocaleString()}`} icon={Wallet} color="bg-green-600" />
        <StatCard title="Pending Fees" value={`৳${(stats?.pendingFees ?? 0).toLocaleString()}`} icon={AlertCircle} color="bg-amber-500" />
        <StatCard title="Total Expenses" value={`৳${(stats?.totalExpenses ?? 0).toLocaleString()}`} icon={Receipt} color="bg-red-500" />
        <StatCard title="Today Present" value={stats?.todayAttendance ?? 0} icon={CalendarCheck} color="bg-teal-600" />
        <StatCard title="Total Exams" value={stats?.totalExams ?? 0} icon={ClipboardList} color="bg-purple-600" />
        <StatCard title="Net Income" value={`৳${((stats?.totalFeeCollected ?? 0) - (stats?.totalExpenses ?? 0)).toLocaleString()}`} icon={TrendingUp} color="bg-cyan-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Attendance (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">No attendance data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="Present" fill="hsl(230 100% 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Absent" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Fee Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {(recentFees ?? []).slice(0, 6).map((fee: any) => (
                <div key={fee.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{fee.studentName}</p>
                    <p className="text-xs text-muted-foreground">{fee.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">৳{fee.amount.toLocaleString()}</p>
                    <Badge variant={fee.status === "paid" ? "default" : "secondary"} className="text-xs">
                      {fee.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!recentFees || recentFees.length === 0) && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">No fee records yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
