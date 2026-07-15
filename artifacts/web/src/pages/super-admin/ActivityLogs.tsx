import { useState } from "react";
import { useRecentActivityLogs } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, Search, Shield } from "lucide-react";

function getActionColor(action: string): string {
  if (action.includes("Deleted")) return "text-red-600";
  if (action.includes("Paused")) return "text-amber-600";
  if (action.includes("Resumed")) return "text-green-600";
  if (action.includes("Created")) return "text-blue-600";
  if (action.includes("Disabled")) return "text-orange-600";
  if (action.includes("Enabled")) return "text-green-600";
  if (action.includes("Paid") || action.includes("payment")) return "text-emerald-600";
  if (action.includes("Reset")) return "text-purple-600";
  return "text-foreground";
}

export default function ActivityLogs() {
  const { data: logs = [], isLoading } = useRecentActivityLogs(100);
  const [search, setSearch] = useState("");

  const filtered = (logs as any[]).filter((log: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      log.action?.toLowerCase().includes(s) ||
      log.actorEmail?.toLowerCase().includes(s) ||
      log.orgName?.toLowerCase().includes(s) ||
      log.targetId?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6" /> Activity Logs
        </h1>
        <p className="text-muted-foreground">All Super Admin actions across the platform</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search actions, emails, org names…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">{filtered.length} of {(logs as any[]).length} log entries</div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Super Admin Action Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 animate-pulse bg-muted/30 rounded-lg" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>{search ? "No logs match your search." : "No activity logged yet. Actions taken in the Super Admin panel will appear here."}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors group">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${getActionColor(log.action ?? "")}`}>{log.action}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-xs text-muted-foreground">{log.actorEmail}</p>
                      {log.orgName && (
                        <Badge variant="outline" className="text-xs h-4">{log.orgName}</Badge>
                      )}
                      {log.targetType && (
                        <Badge variant="secondary" className="text-xs h-4 capitalize">{log.targetType}</Badge>
                      )}
                    </div>
                    {log.targetId && (
                      <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">ID: {log.targetId}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 text-right">
                    <p>{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "—"}</p>
                    <p>{log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
