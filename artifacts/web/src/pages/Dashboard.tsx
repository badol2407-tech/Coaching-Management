import type { ElementType, ReactNode } from "react";
import { useGetDashboardStats, useGetAttendanceSummary, useGetRecentFees } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Users, GraduationCap,
  CalendarCheck, ClipboardList, CheckSquare,
  ArrowRight, Activity, RotateCcw,
  Banknote, AlertTriangle, UserPlus, CreditCard,
  AlertCircle, FileText
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  loading,
  unavailable,
  dataTestId,
}: {
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  icon: ElementType;
  loading?: boolean;
  unavailable?: boolean;
  dataTestId?: string;
}) {
  return (
    <Card data-testid={dataTestId} className="dashboard-metric transition-transform duration-300">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <Icon className="h-4 w-4" aria-hidden="true" />
          <h3 className="text-xs font-medium uppercase tracking-wider">{title}</h3>
        </div>
        <div>
          {loading ? (
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          ) : unavailable ? (
            <p className="text-sm font-medium text-muted-foreground">Unavailable</p>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
              {subtitle && <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useGetDashboardStats();
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useGetAttendanceSummary();
  const { data: recentFees, isLoading: feesLoading, isError: feesError, refetch: refetchFees } = useGetRecentFees();

  const chartData =
    summary?.map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-BD", { month: "short", day: "numeric" }),
      Present: s.present,
      Absent: s.absent,
    })) ?? [];

  const totalFeeCollected = stats?.totalFeeCollected ?? 0;
  const totalExpenses = stats?.totalExpenses ?? 0;
  const netIncome = totalFeeCollected - totalExpenses;
  const pendingFees = stats?.pendingFees ?? 0;
  const hasErrors = statsError || summaryError || feesError;

  const handleRetry = () => {
    if (statsError) refetchStats();
    if (summaryError) refetchSummary();
    if (feesError) refetchFees();
  };

  return (
    <div
      className="app-command-surface max-w-7xl mx-auto space-y-8 pb-12"
      aria-busy={statsLoading || summaryLoading || feesLoading}
    >
      {/* Header & Quick Actions */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Live workspace
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl" id="dashboard-heading">Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm">Today's operational and financial status.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" data-testid="action-add-student">
            <Link href="/students/add">
              <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              Add Student
            </Link>
          </Button>
          <Button asChild variant="outline" data-testid="action-mark-attendance">
            <Link href="/attendance">
              <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              Mark Attendance
            </Link>
          </Button>
          <Button asChild variant="default" data-testid="action-record-fee">
            <Link href="/fees">
              <CreditCard className="mr-2 h-4 w-4 opacity-80" aria-hidden="true" />
              Record Fee
            </Link>
          </Button>
        </div>
      </header>

      {/* Recoverable Error State */}
      {hasErrors && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg flex items-center justify-between" role="alert">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium">Failed to load some dashboard metrics. Information may be incomplete.</p>
          </div>
           <Button
             variant="outline"
             size="sm"
             onClick={handleRetry}
             className="border-destructive/30 hover:bg-destructive/20 text-destructive shrink-0 ml-4"
             data-testid="action-retry-dashboard"
           >
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Retry
          </Button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">

        {/* Left Column: People & Operations */}
        <div className="lg:col-span-2 space-y-6">
          <section aria-labelledby="ops-heading">
            <h2 id="ops-heading" className="sr-only">Operations Summary</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Present Today"
                value={stats?.todayAttendance ?? 0}
                subtitle={`/ ${stats?.totalStudents ?? 0}`}
                icon={CalendarCheck}
                loading={statsLoading}
                unavailable={statsError}
                dataTestId="metric-today-attendance"
              />
              <MetricCard
                title="Total Students"
                value={stats?.totalStudents ?? 0}
                icon={Users}
                loading={statsLoading}
                unavailable={statsError}
                dataTestId="metric-total-students"
              />
              <MetricCard
                title="Total Teachers"
                value={stats?.totalTeachers ?? 0}
                icon={GraduationCap}
                loading={statsLoading}
                unavailable={statsError}
                dataTestId="metric-total-teachers"
              />
              <MetricCard
                title="Total Exams"
                value={stats?.totalExams ?? 0}
                icon={ClipboardList}
                loading={statsLoading}
                unavailable={statsError}
                dataTestId="metric-total-exams"
              />
            </div>
          </section>

          <section aria-labelledby="attendance-chart-heading">
            <Card className="dashboard-panel shadow-none" data-testid="card-attendance-trends">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base" id="attendance-chart-heading">Attendance Trends</CardTitle>
                <p className="text-xs text-muted-foreground">Last 7 Days</p>
              </CardHeader>
              <CardContent>
                {summaryLoading ? (
                  <div className="h-[250px] w-full bg-muted/30 rounded animate-pulse" />
                 ) : summaryError ? (
                   <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground border border-destructive/20 bg-destructive/5 rounded-lg" role="status">
                     <AlertTriangle className="h-8 w-8 mb-2 text-destructive/70" aria-hidden="true" />
                     <p className="text-sm font-medium">Attendance trends are unavailable.</p>
                     <p className="text-xs mt-1">Use Retry above to load this panel again.</p>
                   </div>
                 ) : chartData.length === 0 ? (
                  <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg" role="status">
                    <Activity className="h-8 w-8 mb-2 opacity-20" aria-hidden="true" />
                    <p className="text-sm">No attendance records found for this period.</p>
                  </div>
                ) : (
                  <>
                    <div className="sr-only">
                      <table aria-label="Attendance summary for the last 7 days">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Present</th>
                            <th>Absent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chartData.map((d) => (
                            <tr key={d.date}>
                              <td>{d.date}</td>
                              <td>{d.Present}</td>
                              <td>{d.Absent}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div aria-hidden="true" className="h-[250px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={24} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                           <Tooltip
                            cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-sm)' }}
                          />
                          <Bar dataKey="Present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Column: Financial & Exceptions */}
        <div className="space-y-6">
          <section aria-labelledby="finance-heading">
            <Card className="dashboard-panel shadow-none" data-testid="card-financial-position">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2" id="finance-heading">
                  <Banknote className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  Financial Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div data-testid="financial-metric-net-income">
                  <p className="text-sm text-muted-foreground font-medium">Net Income</p>
                  {statsLoading ? (
                    <div className="h-8 w-24 bg-muted animate-pulse rounded mt-1" />
                  ) : statsError ? (
                    <p className="text-sm font-medium text-muted-foreground">Unavailable</p>
                  ) : (
                    <p className="text-3xl font-bold tracking-tight mt-1 text-foreground" data-testid="text-net-income">
                      ৳{netIncome.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div data-testid="financial-metric-collected">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Collected</p>
                    {statsLoading ? (
                      <div className="h-5 w-16 bg-muted animate-pulse rounded"/>
                    ) : statsError ? (
                      <p className="text-sm font-medium text-muted-foreground">Unavailable</p>
                    ) : (
                      <p className="text-sm font-semibold tabular-nums text-foreground" data-testid="text-total-collected">
                        ৳{totalFeeCollected.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div data-testid="financial-metric-expenses">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Expenses</p>
                    {statsLoading ? (
                      <div className="h-5 w-16 bg-muted animate-pulse rounded"/>
                    ) : statsError ? (
                      <p className="text-sm font-medium text-muted-foreground">Unavailable</p>
                    ) : (
                      <p className="text-sm font-semibold tabular-nums text-foreground" data-testid="text-total-expenses">
                        ৳{totalExpenses.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between" data-testid="financial-metric-pending-fees">
                  <p className="text-sm text-muted-foreground font-medium">Pending Fees</p>
                  {statsLoading ? (
                    <div className="h-5 w-16 bg-muted animate-pulse rounded"/>
                  ) : statsError ? (
                    <p className="text-sm font-medium text-muted-foreground">Unavailable</p>
                  ) : (
                    <p className={`text-sm font-semibold tabular-nums ${pendingFees > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground'}`} data-testid="text-pending-fees">
                      ৳{pendingFees.toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Operational Exception: Pending Fees > 0 */}
          {!statsLoading && pendingFees > 0 && (
            <section aria-labelledby="exceptions-heading">
              <h2 id="exceptions-heading" className="sr-only">Exceptions</h2>
              <Card className="border-amber-200 bg-amber-50/50 shadow-sm dark:bg-amber-950/20 dark:border-amber-900/50" data-testid="card-exception-pending-fees">
                <CardContent className="p-5 flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-400">Action Required</h3>
                    <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                      There are ৳{pendingFees.toLocaleString()} in uncollected fees.
                    </p>
                     <Button
                       asChild
                       variant="outline"
                       size="sm"
                       className="mt-3 bg-white hover:bg-amber-100 dark:bg-transparent dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                       data-testid="action-review-fees"
                     >
                      <Link href="/fees">Review Fees</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <section aria-labelledby="recent-fees-heading">
              <Card className="dashboard-panel shadow-none" data-testid="card-recent-fees">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <CardTitle id="recent-fees-heading" className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  Recent Activity
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs -mr-2 text-muted-foreground hover:text-foreground">
                  <Link href="/fees">View all <ArrowRight className="h-3 w-3 ml-1" aria-hidden="true" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {feesLoading ? (
                  <div className="divide-y">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                ) : feesError ? (
                  <div className="p-8 text-center" role="status">
                    <AlertTriangle className="h-7 w-7 mx-auto mb-2 text-destructive/70" aria-hidden="true" />
                    <p className="text-sm font-medium text-foreground">Recent fee activity is unavailable.</p>
                    <p className="text-xs text-muted-foreground mt-1">Use Retry above to load this panel again.</p>
                  </div>
                ) : (!recentFees || recentFees.length === 0) ? (
                  <div className="p-8 text-center" role="status">
                    <p className="text-sm text-muted-foreground">No recent fee collections found.</p>
                    <Button asChild variant="link" size="sm" className="mt-2 text-primary" data-testid="action-record-first-fee">
                      <Link href="/fees">Record a fee</Link>
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y" aria-label="List of recent fee activity">
                    {(recentFees ?? []).slice(0, 5).map((fee: any) => (
                      <li key={fee.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors" data-testid={`row-recent-fee-${fee.id}`}>
                        <div>
                          <p className="text-sm font-medium text-foreground">{fee.studentName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{fee.month}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <p className="text-sm font-semibold tabular-nums text-foreground">
                            ৳{Number(fee.amount).toLocaleString()}
                          </p>
                          <Badge
                            variant={fee.status === "paid" ? "default" : fee.status === "partial" ? "outline" : "secondary"}
                            className="text-[10px] leading-none px-1.5 py-0.5 font-medium shadow-none h-auto"
                          >
                            {fee.status}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
