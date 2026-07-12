import type React from "react";
import { cn } from "@/lib/utils";

interface WorkSummaryProps {
  children: React.ReactNode;
  className?: string;
}

/** Short role overview shown below the sticky header */
export function WorkSummary({ children, className }: WorkSummaryProps) {
  return (
    <p
      className={cn(
        "not-typeset mb-0 text-[0.9375rem] leading-relaxed text-foreground/85",
        className
      )}
    >
      {children}
    </p>
  );
}
