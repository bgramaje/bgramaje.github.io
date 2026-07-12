import type React from "react";
import { cn } from "@/lib/utils";

interface WorkTitleProps {
  children: React.ReactNode;
  className?: string;
}

/** Role/title of the job — e.g. "Software Engineer" */
export function WorkTitle({ children, className }: WorkTitleProps) {
  return (
    <h1
      className={cn(
        "m-0 block font-mono text-lg font-bold leading-tight tracking-tight text-foreground md:text-xl",
        className
      )}
    >
      {children}
    </h1>
  );
}
