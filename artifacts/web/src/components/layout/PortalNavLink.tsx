import type { ComponentType } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type PortalNavLinkProps = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  activeClassName: string;
  inactiveClassName: string;
  indicatorClassName: string;
  testId: string;
};

export function PortalNavLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed = false,
  onClick,
  activeClassName,
  inactiveClassName,
  indicatorClassName,
  testId,
}: PortalNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      data-testid={testId}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex min-h-11 w-full items-center rounded-lg px-3 py-2.5 text-[13px] font-medium",
        "cursor-pointer select-none gap-2.5 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        collapsed ? "md:justify-center md:px-0 md:gap-0" : "justify-start",
        active ? activeClassName : inactiveClassName,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span
        className={cn(
          "min-w-0 truncate whitespace-nowrap overflow-hidden transition-all duration-200",
          collapsed ? "md:max-w-0 md:opacity-0" : "max-w-[160px] opacity-100",
        )}
      >
        {label}
      </span>
      {active && (
        <span
          className={cn(
            "ml-auto h-1.5 w-1.5 shrink-0 rounded-full",
            collapsed ? "md:hidden" : "block",
            indicatorClassName,
          )}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}