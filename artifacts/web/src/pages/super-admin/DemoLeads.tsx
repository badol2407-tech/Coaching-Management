import { useMemo, useState } from "react";
import { ExternalLink, MessageCircle, Phone, RefreshCw, School, UserRound } from "lucide-react";
import { useListDemoLeads, useUpdateDemoLead } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type LeadStatus = "new" | "contacted" | "qualified" | "closed";

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

const statusStyles: Record<LeadStatus, string> = {
  new: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  contacted: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  qualified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  closed: "border-border bg-muted text-muted-foreground",
};

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" });
}

export default function DemoLeads() {
  const { data: leads = [], isLoading, isError, refetch, isFetching } = useListDemoLeads();
  const updateLead = useUpdateDemoLead();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");

  const counts = useMemo(() => ({
    all: leads.length,
    new: leads.filter((lead: any) => (lead.status ?? "new") === "new").length,
    contacted: leads.filter((lead: any) => lead.status === "contacted").length,
    qualified: leads.filter((lead: any) => lead.status === "qualified").length,
    closed: leads.filter((lead: any) => lead.status === "closed").length,
  }), [leads]);

  const filtered = filter === "all"
    ? leads
    : leads.filter((lead: any) => (lead.status ?? "new") === filter);

  async function setStatus(id: string, status: LeadStatus) {
    try {
      await updateLead.mutateAsync({ id, status });
      toast({ title: `Lead marked ${statusLabels[status].toLowerCase()}` });
    } catch {
      toast({ title: "Could not update lead", description: "Try again in a moment.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Demo Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">Follow up with school and coaching owners who requested a demo.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(["all", "new", "contacted", "qualified", "closed"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-xl border p-4 text-left transition-colors hover:bg-muted/50 ${filter === status ? "border-primary ring-2 ring-primary/15" : "border-border"}`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{status === "all" ? "All leads" : statusLabels[status]}</p>
            <p className="mt-1 text-2xl font-bold">{counts[status]}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
            Demo requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading demo leads…</div>
          ) : isError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-destructive">Could not load demo leads.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>Try again</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {filter === "all" ? "No demo requests yet." : `No ${statusLabels[filter].toLowerCase()} leads.`}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((lead: any) => {
                const status = (lead.status ?? "new") as LeadStatus;
                const whatsapp = `https://wa.me/${String(lead.phone).replace(/\D/g, "")}?text=${encodeURIComponent("EduTrack demo সম্পর্কে আপনার সঙ্গে কথা বলতে চাই।")}`;
                return (
                  <div key={lead.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{lead.fullName}</p>
                          <Badge variant="outline" className={statusStyles[status]}>{statusLabels[status]}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</span>
                        </div>
                        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                          <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" aria-hidden="true" />{lead.phone}</span>
                          <span className="flex items-center gap-2"><School className="h-3.5 w-3.5" aria-hidden="true" />{lead.institute}</span>
                          <span className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5" aria-hidden="true" />{lead.studentCount} students</span>
                          <span className="text-xs">Source: {lead.source || "landing"}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <Button asChild size="sm" variant="outline" className="gap-1.5">
                          <a href={`tel:${lead.phone}`}><Phone className="h-3.5 w-3.5" aria-hidden="true" />Call</a>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="gap-1.5">
                          <a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />WhatsApp</a>
                        </Button>
                        <select
                          aria-label={`Update status for ${lead.fullName}`}
                          value={status}
                          onChange={(event) => setStatus(lead.id, event.target.value as LeadStatus)}
                          disabled={updateLead.isPending}
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                        >
                          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <ExternalLink className="hidden h-4 w-4 text-muted-foreground lg:block" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}