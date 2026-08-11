import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdministrativeStaffManagement() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 700);
    return () => window.clearTimeout(loadingTimer);
  }, []);

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
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <div className="relative min-w-0 flex-1 sm:min-w-[250px]">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search staff..."
                  aria-label="Search administrative staff"
                  className="h-11 rounded-xl border-white/80 bg-white/65 pl-9 shadow-sm placeholder:text-muted-foreground/70 focus-visible:ring-primary/30"
                  data-testid="input-search-staff"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-white/80 bg-white/55 px-4 shadow-sm hover:bg-white/85"
                data-testid="button-filter-staff"
              >
                <Filter
                  className="mr-2 h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/10 hover:bg-transparent">
                  <TableHead className="h-12 whitespace-nowrap px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:px-6">
                    Staff member
                  </TableHead>
                  <TableHead className="h-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Contact
                  </TableHead>
                  <TableHead className="h-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Role
                  </TableHead>
                  <TableHead className="h-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="h-12 whitespace-nowrap pr-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:pr-6">
                    Last active
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow
                      key={`staff-loading-${index}`}
                      className="border-primary/5"
                    >
                      <TableCell className="px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 animate-pulse rounded-full bg-primary/10" />
                          <div className="space-y-2">
                            <div className="h-3 w-28 animate-pulse rounded-full bg-primary/10" />
                            <div className="h-2.5 w-20 animate-pulse rounded-full bg-primary/5" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-3 w-32 animate-pulse rounded-full bg-primary/10" />
                      </TableCell>
                      <TableCell>
                        <div className="h-3 w-20 animate-pulse rounded-full bg-primary/10" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-16 animate-pulse rounded-full bg-primary/10" />
                      </TableCell>
                      <TableCell className="pr-4 sm:pr-6">
                        <div className="ml-auto h-3 w-16 animate-pulse rounded-full bg-primary/10" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-[330px] px-6 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-[#ebe7ff] to-[#f8f1ff] text-primary shadow-[0_16px_35px_-18px_rgba(99,82,186,.55)]">
                          <div className="absolute inset-2 rounded-2xl border border-white/80" />
                          <BriefcaseBusiness
                            className="relative h-8 w-8"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                          {search ? "No staff found" : "No staff yet"}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {search
                            ? "Try a different search term or clear the search to see all staff."
                            : "When staff members are added, their roles and contact details will appear here."}
                        </p>
                        {!search && (
                          <Badge
                            variant="outline"
                            className="mt-4 border-primary/15 bg-primary/5 text-primary"
                          >
                            Directory is ready
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t border-primary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin text-primary"
                    aria-hidden="true"
                  />
                  Loading staff...
                </span>
              ) : (
                "Showing 0 of 0 staff"
              )}
            </p>
            <nav
              className="flex items-center gap-1"
              aria-label="Administrative staff pagination"
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled
                className="h-9 w-9 rounded-lg border-white/80 bg-white/50"
                aria-label="Previous page"
                data-testid="button-staff-pagination-previous"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 min-w-9 rounded-lg border-primary/20 bg-primary/10 px-3 text-primary"
                aria-current="page"
                data-testid="button-staff-pagination-current"
              >
                1
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled
                className="h-9 w-9 rounded-lg border-white/80 bg-white/50"
                aria-label="Next page"
                data-testid="button-staff-pagination-next"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </nav>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
