import type { ReactNode } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  children: ReactNode;
  testId: string;
}

export function FilterBar({ children, testId }: FilterBarProps) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
      {children}
      <Button
        type="button"
        variant="outline"
        className="h-11 rounded-xl border-white/80 bg-white/55 px-4 shadow-sm hover:bg-white/85"
        data-testid={testId}
      >
        <Filter className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
        Filter
      </Button>
    </div>
  );
}
