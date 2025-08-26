import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-soft",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary text-primary-foreground hover:bg-primary/80 hover:border-primary/50",
        secondary:
          "border-secondary/30 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:border-secondary/50",
        destructive:
          "border-destructive/30 bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:border-destructive/50",
        outline: "text-foreground border-border hover:border-primary/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
