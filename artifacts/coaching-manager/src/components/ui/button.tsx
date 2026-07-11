import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium " +
  "transition-all duration-150 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Premium indigo gradient — high contrast, glow, hover lift
        default:
          "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold " +
          "border border-indigo-400/30 btn-primary-glow " +
          "hover:from-indigo-400 hover:to-indigo-500 hover:-translate-y-px " +
          "active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive/20 " +
          "shadow-sm hover:bg-destructive/90 hover:-translate-y-px active:translate-y-0",
        // Clean outlined — crisp border, subtle bg, hover lift
        outline:
          "border border-slate-200 dark:border-white/[0.12] " +
          "bg-white dark:bg-white/[0.04] text-foreground " +
          "btn-outline-lift " +
          "hover:bg-slate-50 dark:hover:bg-white/[0.08] " +
          "hover:border-slate-300 dark:hover:border-white/[0.18] " +
          "hover:-translate-y-px active:translate-y-0",
        secondary:
          "border bg-secondary text-secondary-foreground border-secondary-border " +
          "hover:bg-secondary/80 hover:-translate-y-px active:translate-y-0",
        // Ghost — clean nav item, no border, soft hover
        ghost:
          "border border-transparent text-foreground " +
          "hover:bg-slate-100 dark:hover:bg-white/[0.07] " +
          "active:bg-slate-200 dark:active:bg-white/[0.12]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm rounded-xl",
        sm:      "h-8 px-3 text-xs rounded-lg",
        lg:      "h-11 px-6 text-[0.95rem] rounded-xl",
        icon:    "h-9 w-9 rounded-xl",
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
