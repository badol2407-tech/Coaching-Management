import { useState } from "react";
import {
  CalendarDays,
  Eye,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/management/DataTable";
import { EmptyState } from "@/components/management/EmptyState";
import { FilterBar } from "@/components/management/FilterBar";
import { LoadingSkeleton } from "@/components/management/LoadingSkeleton";
import { Pagination } from "@/components/management/Pagination";
import { SearchBar } from "@/components/management/SearchBar";
import { DirectoryAddDialog } from "@/features/directory/components/DirectoryAddDialog";
import {
  useGuardiansCollection,
  type GuardianRecord,
} from "@/features/directory";

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default function GuardianManagement() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] =
    useState<GuardianRecord | null>(null);
  const { data: guardians = [], isLoading } = useGuardiansCollection({
    search,
  });

  return (
    <div className="app-command-surface mx-auto max-w-[1320px] space-y-6 pb-12">
      <header className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-gradient-to-br from-[#f0edff]/90 via-white/70 to-[#fff5ea]/85 px-5 py-6 shadow-[0_22px_60px_-40px_rgba(73,58,151,.45)] sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#dcd5ff]/45 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-[#ffe6cc]/45 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <span
                className="h-2 w-2 rounded-full bg-[#52a78d] shadow-[0_0_0_4px_rgba(82,167,141,.14)]"
                aria-hidden="true"
              />
              People directory
            </div>
            <h1 className="mt-3 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
              Guardian Management
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Keep family contacts close to the learners they support.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="hidden items-center gap-2 rounded-xl border border-white/80 bg-white/55 px-3 py-2 text-xs text-muted-foreground shadow-sm sm:flex">
              <ShieldCheck
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
              Organization directory
            </div>
            <Button
              type="button"
              className="rounded-xl bg-primary shadow-[0_10px_20px_-12px_rgba(99,82,186,.9)]"
              onClick={() => setAddOpen(true)}
              data-testid="button-add-guardian"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Add Guardian
            </Button>
          </div>
        </div>
      </header>

      <Card className="overflow-hidden border-white/75 bg-white/60 shadow-[0_18px_45px_rgba(45,55,120,.08),inset_0_1px_rgba(255,255,255,.9)] backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b border-primary/10 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ebe7ff] text-primary">
                  <UsersRound className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    Guardians
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage family connections across your organization
                  </p>
                </div>
              </div>
            </div>
            <FilterBar testId="button-filter-guardians">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search guardians..."
                ariaLabel="Search guardians"
                testId="input-search-guardians"
              />
            </FilterBar>
          </div>

          <DataTable
            columns={[
              { label: "Guardian", className: "px-4 sm:px-6" },
              { label: "Contact" },
              { label: "Linked students" },
              { label: "Status" },
              { label: "Last active" },
              { label: "Actions", className: "pr-4 text-right sm:pr-6" },
            ]}
          >
            {isLoading ? (
              <LoadingSkeleton
                rowKeyPrefix="guardian-loading"
                thirdColumnWidth="w-12"
              />
            ) : guardians.length > 0 ? (
              guardians.map((guardian) => (
                <TableRow key={guardian.id} className="border-primary/10">
                  <TableCell className="px-4 sm:px-6">
                    <div className="font-medium text-foreground">
                      {guardian.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {guardian.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {guardian.phone || "—"}
                    </div>
                  </TableCell>
                  <TableCell>{guardian.linkedStudentIds.length}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      {guardian.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {guardian.lastActiveAt
                      ? formatDate(guardian.lastActiveAt)
                      : "Not active yet"}
                  </TableCell>
                  <TableCell className="pr-4 text-right sm:pr-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedGuardian(guardian)}
                      aria-label={`View details for ${guardian.name}`}
                      data-testid={`button-view-guardian-${guardian.id}`}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <EmptyState
                colSpan={6}
                icon={UsersRound}
                title={search ? "No guardians found" : "No guardians yet"}
                description={
                  search
                    ? "Try a different search term or clear the search to see all guardians."
                    : "When guardians are added, their family connections and contact details will appear here."
                }
                badgeLabel="Directory is ready"
                showBadge={!search}
              />
            )}
          </DataTable>
          <Pagination
            isLoading={isLoading}
            loadingText="Loading guardians..."
            summaryText={`Showing ${guardians.length} of ${guardians.length} guardians`}
            ariaLabel="Guardian pagination"
            testIdPrefix="button-guardian-pagination"
          />
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedGuardian)}
        onOpenChange={(open) => {
          if (!open) setSelectedGuardian(null);
        }}
      >
        <DialogContent className="max-w-lg border-white/80 bg-background/95 shadow-[0_24px_80px_rgba(45,55,120,.2)] backdrop-blur-xl">
          {selectedGuardian && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3 pr-8">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ebe7ff] text-lg font-semibold text-primary">
                    {selectedGuardian.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-xl">
                      {selectedGuardian.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      Guardian account details
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    Email
                  </div>
                  <p className="mt-2 break-words text-sm font-medium">
                    {selectedGuardian.email || "Not available"}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    Phone
                  </div>
                  <p className="mt-2 text-sm font-medium">
                    {selectedGuardian.phone || "Not available"}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Status
                  </div>
                  <Badge
                    variant="outline"
                    className="mt-2 border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    {selectedGuardian.status}
                  </Badge>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
                    Linked students
                  </div>
                  <p className="mt-2 text-sm font-medium">
                    {selectedGuardian.linkedStudentIds.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Last active
                  </div>
                  <p className="mt-2 text-sm font-medium">
                    {selectedGuardian.lastActiveAt
                      ? formatDate(selectedGuardian.lastActiveAt)
                      : "Not active yet"}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DirectoryAddDialog
        kind="guardian"
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </div>
  );
}
