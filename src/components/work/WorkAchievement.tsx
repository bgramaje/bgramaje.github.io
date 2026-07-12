import type React from "react";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";

type HighlightAction = "highlight" | "underline" | "box";

interface WorkAchievementProps {
  title: string;
  children: React.ReactNode;
  accent?: string;
  action?: HighlightAction;
  className?: string;
}

/** Single achievement — title gets CSS accent (scroll-stable) */
export function WorkAchievement({
  title,
  children,
  accent = "#737373",
  action = "underline",
  className,
}: WorkAchievementProps) {
  return (
    <article className={cn("not-typeset border-l-2 border-border/50 pl-3", className)}>
      <h3 className="mb-1 font-sans text-[0.9375rem] font-medium leading-snug text-foreground">
        <Highlighter action={action} color={accent}>
          {title}
        </Highlighter>
      </h3>
      <p className="mb-0 text-[0.875rem] leading-relaxed text-foreground/75">
        {children}
      </p>
    </article>
  );
}
