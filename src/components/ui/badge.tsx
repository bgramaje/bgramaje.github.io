import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-terminal-accent focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-terminal-accent text-terminal-bg shadow hover:bg-terminal-accent/90",
        secondary:
          "border-terminal-border bg-terminal-surface text-terminal-text hover:bg-terminal-border",
        destructive:
          "border-transparent bg-terminal-error text-terminal-bg shadow hover:bg-terminal-error/90",
        outline: "border-terminal-border bg-transparent text-terminal-text",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
