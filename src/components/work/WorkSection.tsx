import type React from "react";
import { cn } from "@/lib/utils";

interface WorkSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/** Grouped block: achievements, stack, etc. */
export function WorkSection({ title, children, className }: WorkSectionProps) {
  return (
    <section className={cn("not-typeset mt-5", className)}>
      {title ? (
        <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
      ) : null}
      <div className="space-y-3">{children}</div>
    </section>
  );
}
