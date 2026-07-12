import type React from "react";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";

interface WorkTimerangeProps {
  children: React.ReactNode;
  className?: string;
}

/** Period of the job — e.g. "Oct 2022 – Present" */
export function WorkTimerange({ children, className }: WorkTimerangeProps) {
  return (
    <time
      className={cn(
        "block text-xs font-medium tabular-nums text-muted-foreground",
        className
      )}
    >
      <Highlighter action="underline" color="var(--accent-timerange)">
        {children}
      </Highlighter>
    </time>
  );
}
