import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  testId: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  ariaLabel,
  testId,
}: SearchBarProps) {
  return (
    <div className="relative min-w-0 flex-1 sm:min-w-[250px]">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-11 rounded-xl border-white/80 bg-white/65 pl-9 shadow-sm placeholder:text-muted-foreground/70 focus-visible:ring-primary/30"
        data-testid={testId}
      />
    </div>
  );
}
