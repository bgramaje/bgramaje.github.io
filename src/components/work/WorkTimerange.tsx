import type React from "react";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";

interface WorkTimerangeProps {
  children: React.ReactNode;
  className?: string;
}

/** Period of the job — e.g. "2022 - Present" */
export function WorkTimerange({ children, className }: WorkTimerangeProps) {
  return (
    <p className={cn("mb-3 md:mb-4", className)}>
      <Highlighter action="underline" color="#eab308">
        <span className="text-white text-xs md:text-sm font-medium">
          {children}
        </span>
      </Highlighter>
    </p>
  );
}
