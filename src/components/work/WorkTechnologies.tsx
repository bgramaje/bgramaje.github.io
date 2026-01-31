import type React from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/** Slug to readable label: nodedotjs -> Node.js, react -> React (then uppercase in UI) */
function slugToLabel(slug: string): string {
  const s = slug.trim().toLowerCase().replace(/\s+/g, "");
  const withDots = s.replace(/dot/g, ".");
  return withDots.charAt(0).toUpperCase() + withDots.slice(1);
}

interface WorkTechnologiesProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Renders technology names as Badge chips (same font as blog entry title, uppercase).
 * Usage: <WorkTechnologies>react,nodedotjs,docker,mongodb</WorkTechnologies>
 */
export function WorkTechnologies({
  children,
  className,
}: WorkTechnologiesProps) {
  const techs = useMemo(() => {
    const text =
      typeof children === "string"
        ? children
        : Array.isArray(children)
          ? children.map((c) => (typeof c === "string" ? c : "")).join("")
          : String(children ?? "");
    return text
      .replace(/\n/g, " ")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((slug) => ({ slug, label: slugToLabel(slug) }));
  }, [children]);

  if (techs.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 md:mt-4 w-fit flex flex-wrap justify-between gap-1.5",
        className
      )}
    >
      {techs.map(({ slug, label }) => (
        <Badge
          key={slug}
          variant="secondary"
          className="font-mono font-medium uppercase tracking-wide"
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}
