import * as React from "react";
import { cn } from "@/lib/utils";

export function SegmentedNavGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-black/20",
        className
      )}
      {...props}
    />
  );
}

export function segmentedNavItemClassName(active: boolean) {
  return cn(
    "flex items-center justify-center px-3 py-1.5 text-xs font-medium transition-all duration-200",
    active
      ? "bg-white/20 text-white dark:bg-white/20 dark:text-white"
      : "text-neutral-400 hover:bg-white/5 hover:text-white dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white"
  );
}
