import * as React from "react";
import { cn } from "@/lib/utils";

export function SegmentedNavGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-lg border border-border/60 bg-card/80 shadow-md backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

export function segmentedNavItemClassName(active: boolean) {
  return cn(
    "flex min-h-6 items-center justify-center px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    active
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
  );
}
