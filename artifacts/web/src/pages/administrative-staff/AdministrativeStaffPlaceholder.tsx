import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AdministrativeStaffPlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function AdministrativeStaffPlaceholder({
  title,
  description,
  icon: Icon,
}: AdministrativeStaffPlaceholderProps) {
  return (
    <div className="app-command-surface max-w-7xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Administrative workspace
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary">
          Foundation view
        </Badge>
      </header>

      <Card className="overflow-hidden border-border/70 bg-card/70 shadow-[0_20px_60px_rgba(35,31,76,0.08)] backdrop-blur-xl">
        <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_12px_30px_rgba(99,102,241,0.12)]">
            <Icon className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title} workspace is ready
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            This administrative staff module is set up for your organization. Operational tools and
            workflows will be added in a future step.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}