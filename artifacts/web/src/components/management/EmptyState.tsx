import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyStateProps {
  colSpan: number;
  icon: LucideIcon;
  title: string;
  description: string;
  badgeLabel: string;
  showBadge?: boolean;
}

export function EmptyState({
  colSpan,
  icon: Icon,
  title,
  description,
  badgeLabel,
  showBadge = true,
}: EmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-[330px] px-6 text-center">
        <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-[#ebe7ff] to-[#f8f1ff] text-primary shadow-[0_16px_35px_-18px_rgba(99,82,186,.55)]">
            <div className="absolute inset-2 rounded-2xl border border-white/80" />
            <Icon
              className="relative h-8 w-8"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          {showBadge && (
            <Badge
              variant="outline"
              className="mt-4 border-primary/15 bg-primary/5 text-primary"
            >
              {badgeLabel}
            </Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
