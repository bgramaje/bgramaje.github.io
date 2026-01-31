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
        "text-white font-bold font-mono text-lg md:text-xl leading-tight mb-0.5 mt-0 tracking-tight",
        className
      )}
    >
      {children}
    </h1>
  );
}
