import type React from "react";
import { cn } from "@/lib/utils";

interface WorkHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/** Wraps WorkCompany + WorkTitle in a row with flex justify-between */
export function WorkHeader({ children, className }: WorkHeaderProps) {
  return (
    <div className={cn("flex justify-between items-center flex-wrap gap-2 mb-1.5", className)}>
      {children}
    </div>
  );
}
