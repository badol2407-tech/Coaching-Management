import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary CTA — layered gradient, inner highlight, colored ambient glow, hover-lift.
        default:
          "bg-gradient-to-b from-primary to-primary-border text-primary-foreground border border-primary-border/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.24),0_8px_24px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.24),0_2px_4px_rgba(0,0,0,0.28),0_14px_32px_-8px_hsl(var(--primary)/0.75)] hover:brightness-[1.04] hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.28)]",
        destructive:
          "bg-gradient-to-b from-destructive to-destructive-border text-destructive-foreground border border-destructive-border/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_1px_2px_rgba(0,0,0,0.24),0_8px_22px_-8px_hsl(var(--destructive)/0.55)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_4px_rgba(0,0,0,0.28),0_14px_28px_-8px_hsl(var(--destructive)/0.7)] hover:-translate-y-0.5 active:translate-y-0",
        // Glass / outlined secondary — soft translucent surface, crisp on hover.
        outline:
          "border [border-color:var(--button-outline)] bg-background/60 backdrop-blur-md text-foreground shadow-sm hover:bg-accent/50 hover:border-foreground/15 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary-border shadow-sm hover-elevate active-elevate-2 hover:-translate-y-0.5 active:translate-y-0",
        ghost: "border border-transparent hover-elevate active-elevate-2",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-10 px-5 py-2",
        sm: "min-h-9 rounded-md px-3.5 text-xs",
        lg: "min-h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
