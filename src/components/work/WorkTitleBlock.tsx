import type React from "react";
import { cn } from "@/lib/utils";

interface WorkTitleBlockProps {
  children: React.ReactNode;
  className?: string;
}

/** Role on top, period underneath */
export function WorkTitleBlock({ children, className }: WorkTitleBlockProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", className)}>
      {children}
    </div>
  );
}
