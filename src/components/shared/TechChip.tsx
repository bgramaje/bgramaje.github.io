import { cn } from "@/lib/utils";
import { slugToLabel } from "@/lib/tech";

export type TechChipTier = "core" | "default" | "muted";

interface TechChipProps {
  slug?: string;
  label?: string;
  tier?: TechChipTier;
  className?: string;
}

export function TechChip({
  slug,
  label,
  tier = "default",
  className,
}: TechChipProps) {
  const text = label ?? slugToLabel(slug ?? "");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-sans font-medium transition-[color,background-color,box-shadow,transform]",
        tier === "core" &&
          "bg-foreground/[0.07] px-2 py-0.5 text-xs text-foreground shadow-[0_1px_2px_oklch(0_0_0/0.06)] dark:shadow-[0_1px_2px_oklch(1_0_0/0.06)]",
        tier === "default" &&
          "bg-muted/60 px-2 py-0.5 text-xs text-foreground shadow-[0_1px_2px_oklch(0_0_0/0.05)] dark:shadow-[0_1px_2px_oklch(1_0_0/0.05)]",
        tier === "muted" && "px-1.5 py-0 text-[11px] text-muted-foreground",
        className
      )}
    >
      {text}
    </span>
  );
}
