import { useMemo, useState } from "react";
import { Check, CheckCircle2, ClipboardCheck, Eye, Loader2, RefreshCw, Search, UserRound, X, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useDecideAdmission, useStaffAdmissionRequests, type AdmissionRequest, type AdmissionStatus } from "@/lib/administrative-staff-hooks";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function valueOrDash(value?: string | null) {
  return value?.trim() || "Not provided";
}

function statusBadge(status: AdmissionStatus) {
  const styles = {
    pending: "border-sky-500/25 bg-sky-500/10 text-sky-600",
    approved: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600",
    rejected: "border-red-500/25 bg-red-500/10 text-red-600",
  }[status];
  return <Badge variant="outline" className={styles}>{status[0].toUpperCase() + status.slice(1)}</Badge>;
}

function RequestDetails({ request, open, onOpenChange, onDecision, processing }: { request: AdmissionRequest | null; open: boolean; onOpenChange: (open: boolean) => void; onDecision: (decision: "approved" | "rejected") => void; processing: boolean }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {request && (
          <>
            <SheetHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserRound className="h-6 w-6" /></div>
              <SheetTitle className="text-2xl">{valueOrDash(request.name)}</SheetTitle>
              <SheetDescription>Admission request received {formatDate(request.createdAt)}</SheetDescription>
            </SheetHeader>
            <div className="mt-7 space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 px-4 py-3"><span className="text-sm text-muted-foreground">Request status</span>{statusBadge(request.status)}</div>
              <section>
                <h3 className="mb-3 text-sm font-semibold">Applicant information</h3>
                <div className="rounded-xl border border-border/70 bg-card/60 px-4">
                  <Detail label="Email" value={valueOrDash(request.email)} /><Detail label="Phone" value={valueOrDash(request.phone)} /><Detail label="Address" value={valueOrDash(request.address)} />
                </div>
              </section>
              <section>
                <h3 className="mb-3 text-sm font-semibold">Placement</h3>
                <div className="rounded-xl border border-border/70 bg-card/60 px-4">
                  <Detail label="Class" value={valueOrDash(request.className)} /><Detail label="Section" value={valueOrDash(request.section)} /><Detail label="Batch" value={valueOrDash(request.batch)} />
                </div>
              </section>
              <section>
                <h3 className="mb-3 text-sm font-semibold">Guardian</h3>
                <div className="rounded-xl border border-border/70 bg-card/60 px-4"><Detail label="Name" value={valueOrDash(request.guardianName)} /><Detail label="Phone" value={valueOrDash(request.guardianPhone)} /></div>
              </section>
              {request.status === "pending" && (
                <div className="grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-2">
                  <Button variant="outline" className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700" onClick={() => onDecision("rejected")} disabled={processing}><X className="h-4 w-4" />Reject admission</Button>
                  <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => onDecision("approved")} disabled={processing}>{processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Approve admission</Button>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[100px_1fr] gap-3 border-b border-border/60 py-3 last:border-0"><span className="text-xs text-muted-foreground">{label}</span><span className="break-words text-sm font-medium">{value}</span></div>;
}

export default function AdmissionManagement() {
  const { toast } = useToast();
  const requestsQuery = useStaffAdmissionRequests();
  const decideAdmission = useDecideAdmission();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | AdmissionStatus>("all");
  const [selectedRequest, setSelectedRequest] = useState<AdmissionRequest | null>(null);
  const requests = requestsQuery.data ?? [];
  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesStatus = status === "all" || request.status === status;
      const matchesSearch = !term || [request.name, request.email, request.phone, request.className, request.batch].some((value) => value?.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [requests, search, status]);
  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const approvedCount = requests.filter((request) => request.status === "approved").length;
  const rejectedCount = requests.filter((request) => request.status === "rejected").length;

  async function handleDecision(decision: "approved" | "rejected") {
    if (!selectedRequest) return;
    try {
      await decideAdmission.mutateAsync({ request: selectedRequest, decision });
      toast({ title: decision === "approved" ? "Admission approved" : "Admission rejected", description: decision === "approved" ? `${selectedRequest.name} was added to Student Records.` : `${selectedRequest.name}'s request was marked as rejected.` });
      setSelectedRequest(null);
    } catch (error) {
      toast({ title: "Could not update admission", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    }
  }

  return (
    <div className="app-command-surface mx-auto max-w-7xl space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary"><span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />Administrative workspace</div>
          <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Admission Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review new admission requests and keep enrollment decisions moving.</p>
        </div>
        <Button variant="outline" onClick={() => requestsQuery.refetch()} disabled={requestsQuery.isFetching} className="w-fit gap-2"><RefreshCw className={`h-4 w-4 ${requestsQuery.isFetching ? "animate-spin" : ""}`} />Refresh</Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3"><SummaryCard label="Pending review" value={pendingCount} icon={ClipboardCheck} tone="sky" /><SummaryCard label="Approved" value={approvedCount} icon={CheckCircle2} tone="emerald" /><SummaryCard label="Rejected" value={rejectedCount} icon={XCircle} tone="red" /></div>

      <Card className="overflow-hidden border-border/70 bg-card/70 shadow-[0_20px_60px_rgba(35,31,76,0.08)] backdrop-blur-xl">
        <CardHeader className="gap-4 border-b border-border/60 pb-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><CardTitle className="text-lg">Admission requests</CardTitle><div className="flex flex-col gap-2 sm:flex-row"><div className="relative sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applicants..." className="pl-9" aria-label="Search admission requests" /></div><Select value={status} onValueChange={(value: "all" | AdmissionStatus) => setStatus(value)}><SelectTrigger className="w-full sm:w-36" aria-label="Filter admission requests by status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All requests</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div></div></CardHeader>
        <CardContent className="p-0">
          {requestsQuery.isLoading ? <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading admission requests...</div> : requestsQuery.isError ? <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center"><p className="text-sm text-destructive">Could not load admission requests.</p><Button variant="outline" onClick={() => requestsQuery.refetch()}>Try again</Button></div> : filteredRequests.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center gap-2 px-6 text-center"><ClipboardCheck className="h-8 w-8 text-muted-foreground/50" /><p className="font-medium">No admission requests found</p><p className="text-sm text-muted-foreground">{search || status !== "all" ? "Try changing your search or filter." : "New requests will appear here."}</p></div> : <div className="overflow-x-auto"><Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead>Applicant</TableHead><TableHead>Requested placement</TableHead><TableHead>Contact</TableHead><TableHead>Received</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{filteredRequests.map((request) => <TableRow key={request.id}><TableCell className="min-w-52"><div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">{valueOrDash(request.name).slice(0, 1).toUpperCase()}</div><div className="min-w-0"><p className="truncate font-medium">{valueOrDash(request.name)}</p><p className="truncate text-xs text-muted-foreground">{valueOrDash(request.guardianName)}</p></div></div></TableCell><TableCell><p>{valueOrDash(request.className)}</p><p className="text-xs text-muted-foreground">{request.batch || request.section || "No batch or section"}</p></TableCell><TableCell><p>{valueOrDash(request.phone)}</p><p className="max-w-48 truncate text-xs text-muted-foreground">{valueOrDash(request.email)}</p></TableCell><TableCell className="whitespace-nowrap text-sm">{formatDate(request.createdAt)}</TableCell><TableCell>{statusBadge(request.status)}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" className="gap-2" onClick={() => setSelectedRequest(request)}><Eye className="h-4 w-4" />Review</Button></TableCell></TableRow>)}</TableBody></Table></div>}
        </CardContent>
      </Card>
      <RequestDetails request={selectedRequest} open={Boolean(selectedRequest)} onOpenChange={(open) => { if (!open) setSelectedRequest(null); }} onDecision={handleDecision} processing={decideAdmission.isPending} />
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof ClipboardCheck; tone: "sky" | "emerald" | "red" }) {
  const toneClass = { sky: "bg-sky-500/10 text-sky-600", emerald: "bg-emerald-500/10 text-emerald-600", red: "bg-red-500/10 text-red-600" }[tone];
  return <Card className="border-border/70 bg-card/70"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p></div><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}><Icon className="h-5 w-5" /></div></CardContent></Card>;
}