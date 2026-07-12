import type React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkCompanyProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

/** Company name chip — compact, top-right in header */
export function WorkCompany({ children, href, className }: WorkCompanyProps) {
  const baseClass =
    "inline-flex shrink-0 items-center gap-1 rounded-md border border-border/60 bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground transition-[color,background-color,border-color,transform] duration-200";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          baseClass,
          "hover:border-primary/40 hover:bg-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.96]",
          className
        )}
        aria-label={`Visit ${typeof children === "string" ? children : "company"} website`}
      >
        {children}
        <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-50" aria-hidden />
      </a>
    );
  }

  return (
    <span className={cn(baseClass, "text-muted-foreground", className)}>
      {children}
    </span>
  );
}
