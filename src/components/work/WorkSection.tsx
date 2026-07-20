import type React from "react";
import { cn } from "@/lib/utils";

interface WorkSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Cap the body and scroll so sections below (e.g. Stack) stay in view */
  scrollable?: boolean;
}

/** Grouped block: achievements, stack, etc. */
export function WorkSection({
  title,
  children,
  className,
  scrollable = false,
}: WorkSectionProps) {
  return (
    <section className={cn("not-typeset mt-5", className)}>
      {title ? (
        <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
      ) : null}
      <div
        className={cn(
          "flex flex-col gap-3",
          scrollable &&
            "max-h-[min(40vh,18rem)] overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]",
        )}
      >
        {children}
      </div>
    </section>
  );
}
