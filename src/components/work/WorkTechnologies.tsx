import { motion } from "motion/react";
import { TechChip } from "@/components/shared/TechChip";
import { cn } from "@/lib/utils";
import { parseSlugList, STACK_GROUP_LABELS } from "@/lib/tech";

const chipMotion = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, duration: 0.3, bounce: 0 },
};

interface WorkTechnologiesProps {
  className?: string;
  [group: string]: string | undefined;
}

/**
 * Grouped technology chips. Each prop is a group slug list, e.g.
 * platform="fiware,meteor" data="mongodb,influxdb"
 */
export function WorkTechnologies(props: WorkTechnologiesProps) {
  const { className, ...groupProps } = props;

  const groupEntries = Object.entries(groupProps).filter(
    ([key, value]) => key !== "className" && typeof value === "string" && value.trim()
  );

  if (groupEntries.length === 0) return null;

  let chipIndex = 0;

  return (
    <div
      className={cn(
        "mt-4 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-5",
        className
      )}
    >
      {groupEntries.map(([groupKey, value]) => {
        const slugs = parseSlugList(value!);
        if (slugs.length === 0) return null;

        const label =
          STACK_GROUP_LABELS[groupKey] ??
          groupKey.charAt(0).toUpperCase() + groupKey.slice(1);

        return (
          <div
            key={groupKey}
            className="flex min-w-0 flex-col gap-1.5 sm:grid sm:grid-cols-[4.75rem_minmax(0,1fr)] sm:items-center sm:gap-x-2.5 sm:gap-y-0"
          >
            <span className="shrink-0 font-mono text-[10px] font-medium uppercase leading-none tracking-widest text-muted-foreground">
              {label}
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {slugs.map((slug) => {
                const i = chipIndex++;
                return (
                  <motion.span
                    key={`${groupKey}-${slug}`}
                    {...chipMotion}
                    transition={{ ...chipMotion.transition, delay: i * 0.08 }}
                  >
                    <TechChip slug={slug} tier="default" />
                  </motion.span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
