import type React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkCompanyProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

/** Company name as a chip — clickable to open company link if href is provided */
export function WorkCompany({ children, href, className }: WorkCompanyProps) {
  const baseClass =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs md:text-sm font-medium " +
    "border border-terminal-border bg-terminal-bg/80 text-terminal-text " +
    "transition-colors duration-150";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          baseClass,
          "hover:bg-terminal-border/40 hover:border-terminal-cyan/50 hover:text-terminal-cyan cursor-pointer",
          className
        )}
        aria-label={`Visit ${typeof children === "string" ? children : "company"} website`}
      >
        {children}
        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" aria-hidden />
      </a>
    );
  }

  return (
    <span className={cn(baseClass, "text-terminal-muted", className)}>
      {children}
    </span>
  );
}
