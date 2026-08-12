import { useState } from "react";
import { BriefcaseBusiness, Phone, Plus, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/management/DataTable";
import { EmptyState } from "@/components/management/EmptyState";
import { FilterBar } from "@/components/management/FilterBar";
import { LoadingSkeleton } from "@/components/management/LoadingSkeleton";
import { Pagination } from "@/components/management/Pagination";
import { SearchBar } from "@/components/management/SearchBar";
import { DirectoryAddDialog } from "@/features/directory/components/DirectoryAddDialog";
import { useAdministrativeStaffCollection } from "@/features/directory";

export default function AdministrativeStaffManagement() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const { data: staff = [], isLoading } = useAdministrativeStaffCollection({
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
              Administrative Staff Management
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Keep your organization team aligned, supported, and easy to find.
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
              data-testid="button-add-staff"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Add Staff
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
                  <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    Administrative Staff
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage the people who keep your organization running
                  </p>
                </div>
              </div>
            </div>
            <FilterBar testId="button-filter-staff">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search staff..."
                ariaLabel="Search administrative staff"
                testId="input-search-staff"
              />
            </FilterBar>
          </div>

          <DataTable
            columns={[
              { label: "Staff member", className: "px-4 sm:px-6" },
              { label: "Contact" },
              { label: "Role" },
              { label: "Status" },
              { label: "Last active", className: "pr-4 text-right sm:pr-6" },
            ]}
          >
            {isLoading ? (
              <LoadingSkeleton
                rowKeyPrefix="staff-loading"
                thirdColumnWidth="w-20"
              />
            ) : staff.length > 0 ? (
              staff.map((member) => (
                <TableRow key={member.id} className="border-primary/10">
                  <TableCell className="px-4 sm:px-6">
                    <div className="font-medium text-foreground">
                      {member.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {member.phone || "—"}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {member.role.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right text-xs text-muted-foreground sm:pr-6">
                    {member.lastActiveAt
                      ? new Date(member.lastActiveAt).toLocaleDateString()
                      : "Not active yet"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <EmptyState
                colSpan={5}
                icon={BriefcaseBusiness}
                title={search ? "No staff found" : "No staff yet"}
                description={
                  search
                    ? "Try a different search term or clear the search to see all staff."
                    : "When staff members are added, their roles and contact details will appear here."
                }
                badgeLabel="Directory is ready"
                showBadge={!search}
              />
            )}
          </DataTable>
          <Pagination
            isLoading={isLoading}
            loadingText="Loading staff..."
            summaryText={`Showing ${staff.length} of ${staff.length} staff`}
            ariaLabel="Administrative staff pagination"
            testIdPrefix="button-staff-pagination"
          />
        </CardContent>
      </Card>

      <DirectoryAddDialog
        kind="administrative_staff"
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </div>
  );
}
