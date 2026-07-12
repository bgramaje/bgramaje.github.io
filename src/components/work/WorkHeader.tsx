import type React from "react";
import { cn } from "@/lib/utils";

interface WorkHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/** Sticky job header — opaque, full-bleed, no scroll bleed */
export function WorkHeader({ children, className }: WorkHeaderProps) {
  return (
    <header
      className={cn(
        "not-typeset sticky top-0 z-20 -mx-3 mb-3 flex items-start justify-between gap-2",
        "border-b border-border/40 bg-card px-3 py-2",
        "md:-mx-5 md:px-5",
        className
      )}
    >
      {children}
    </header>
  );
}
