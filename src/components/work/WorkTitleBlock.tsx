import type React from "react";
import { cn } from "@/lib/utils";

interface WorkTitleBlockProps {
  children: React.ReactNode;
  className?: string;
}

/** Wraps WorkTitle + WorkTimerange in a flex-col block */
export function WorkTitleBlock({ children, className }: WorkTitleBlockProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {children}
    </div>
  );
}
