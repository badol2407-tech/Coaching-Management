import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  isLoading: boolean;
  loadingText: string;
  summaryText: string;
  ariaLabel: string;
  testIdPrefix: string;
}

export function Pagination({
  isLoading,
  loadingText,
  summaryText,
  ariaLabel,
  testIdPrefix,
}: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-primary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-muted-foreground">
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2
              className="h-3.5 w-3.5 animate-spin text-primary"
              aria-hidden="true"
            />
            {loadingText}
          </span>
        ) : (
          summaryText
        )}
      </p>
      <nav className="flex items-center gap-1" aria-label={ariaLabel}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled
          className="h-9 w-9 rounded-lg border-white/80 bg-white/50"
          aria-label="Previous page"
          data-testid={`${testIdPrefix}-previous`}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 min-w-9 rounded-lg border-primary/20 bg-primary/10 px-3 text-primary"
          aria-current="page"
          data-testid={`${testIdPrefix}-current`}
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
          data-testid={`${testIdPrefix}-next`}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}
